import type { RawSourceItem } from "@viral-copilot/connectors/types";
import type { NicheContext, ScoreResult, AdvertiserInfo } from "./types.js";
import { toBand, deriveConfidence } from "./types.js";

// ── Dimension config ─────────────────────────────────────────────────────────

const DIMENSIONS = [
  { name: "reach_efficiency", weight: 0.30 },
  { name: "ad_creative_quality", weight: 0.25 },
  { name: "competitive_scarcity", weight: 0.20 },
  { name: "freshness", weight: 0.15 },
  { name: "advertiser_authority", weight: 0.10 },
] as const;

// ── Helpers ──────────────────────────────────────────────────────────────────

/** Hours elapsed since publication, clamped to ≥ 1. */
function hoursSince(publishedAt?: string): number {
  if (!publishedAt) return 1;
  return Math.max(1, (Date.now() - new Date(publishedAt).getTime()) / 3_600_000);
}

/** Min‑max normalise a value to [0, 100] within an array. */
function normalise(values: number[]): number[] {
  const min = Math.min(...values);
  const max = Math.max(...values);
  if (max === min) return values.map(() => 50);
  return values.map((v) => ((v - min) / (max - min)) * 100);
}

/** Count keyword hits in a text. */
function keywordMatchCount(text: string | undefined, keywords: string[]): number {
  if (!text || keywords.length === 0) return 0;
  const lower = text.toLowerCase();
  return keywords.filter((k) => lower.includes(k.toLowerCase())).length;
}

// ── Cross-item context builder ───────────────────────────────────────────────

interface BatchContext {
  /** Map author → ad count for competitive scarcity scoring. */
  authorAdCount: Map<string, number>;
  /** Map author → AdvertiserInfo for authority scoring. */
  authorInfo: Map<string, AdvertiserInfo>;
}

function buildBatchContext(items: RawSourceItem[]): BatchContext {
  const authorAdCount = new Map<string, number>();
  const authorInfo = new Map<string, AdvertiserInfo>();

  for (const item of items) {
    const author = item.author ?? item.externalId;
    authorAdCount.set(author, (authorAdCount.get(author) ?? 0) + 1);

    if (!authorInfo.has(author)) {
      authorInfo.set(author, {
        externalId: author,
        name: item.author ?? undefined,
        adCount: 0,
      });
    }
  }

  // Finalise counts
  for (const [author, count] of authorAdCount) {
    const info = authorInfo.get(author);
    if (info) info.adCount = count;
  }

  return { authorAdCount, authorInfo };
}

// ── Dimension scorers ────────────────────────────────────────────────────────

interface DimensionResult {
  score: number;
  dataPresent: boolean;
}

/**
 * 1) Reach efficiency (poids 0.30)
 *    reachDelta7d ÷ hours-running → how fast the ad accumulated reach.
 *    Falls back to a views‑based proxy when reach is absent.
 */
function scoreReachEfficiency(item: RawSourceItem): DimensionResult {
  const reach = item.metrics?.reachDelta7d;
  const views = item.metrics?.views;

  if (reach !== undefined && reach !== null) {
    const hrs = hoursSince(item.publishedAt);
    const efficiency = reach / hrs;
    // Scale: 0.1 reach/hour → ~50, 1+/hour → 100
    const scaled = Math.min(100, efficiency * 100);
    return { score: scaled, dataPresent: true };
  }

  if (views !== undefined && views !== null) {
    // Fallback: use views as a reach proxy
    const hrs = hoursSince(item.publishedAt);
    const efficiency = views / hrs;
    const scaled = Math.min(100, efficiency * 10);
    return { score: scaled, dataPresent: true };
  }

  return { score: 35, dataPresent: false };
}

/**
 * 2) Ad creative quality (poids 0.25)
 *    Scores based on media type (video > carousel > image), text hooks,
 *    and presence of multiple media attachments.
 */
function scoreAdCreativeQuality(item: RawSourceItem): DimensionResult {
  const type = item.type?.toLowerCase() ?? "";
  const mediaCount = item.media?.length ?? 0;
  const text = item.text ?? "";

  let score = 40;

  // Base by format
  // "ad" type is the default for Meta Ads from the adapter — check media types instead
  const hasVideo = item.media?.some((m) => m.type === "video") ?? false;
  const hasCarousel = item.media?.some((m) => m.type === "carousel") ?? false;
  const hasImage = item.media?.some((m) => m.type === "image") ?? false;

  if (hasVideo) score = 75;
  else if (hasCarousel) score = 65;
  else if (hasImage) score = 50;

  // Bonus for rich formats (multiple media items)
  if (mediaCount > 1) score += 15;
  if (mediaCount > 3) score += 5;

  // Bonus for textual hooks (question marks, emojis, hooks)
  if (text.length > 20) score += 5;
  if (text.includes("?")) score += 5;
  if (text.includes("!")) score += 3;
  if (/[✨🔥💥🚀🎯]/.test(text)) score += 2;

  // Penalty for no media at all
  if (mediaCount === 0 && !hasImage && !hasVideo) {
    return { score: 30, dataPresent: false };
  }

  return { score: Math.min(100, score), dataPresent: true };
}

/**
 * 3) Competitive scarcity (poids 0.20)
 *    Fewer unique advertisers per keyword → less competition → higher score.
 *    Computed across the entire batch.
 */
function scoreCompetitiveScarcity(
  item: RawSourceItem,
  _ctx: NicheContext,
  batchCtx: BatchContext,
): DimensionResult {
  const author = item.author;
  if (!author) {
    return { score: 50, dataPresent: false };
  }

  const count = batchCtx.authorAdCount.get(author) ?? 0;
  // More ads from same advertiser = heavier competition on those keywords
  // Lower density = scarcer = better opportunity
  const density = Math.min(20, count); // cap at 20
  const score = Math.max(10, 100 - density * 4.5);
  return { score, dataPresent: true };
}

/**
 * 4) Freshness (poids 0.15)
 *    Exponential decay — recent campaigns score higher.
 */
function scoreFreshness(item: RawSourceItem): DimensionResult {
  const hrs = hoursSince(item.publishedAt);
  const score = Math.round(100 * Math.exp(-0.003 * hrs));
  return {
    score: Math.max(0, Math.min(100, score)),
    dataPresent: item.publishedAt !== undefined,
  };
}

/**
 * 5) Advertiser authority (poids 0.10)
 *    Established advertisers (more ads, named, with URLs) score higher.
 */
function scoreAdvertiserAuthority(
  item: RawSourceItem,
  batchCtx: BatchContext,
): DimensionResult {
  const author = item.author;
  if (!author) {
    return { score: 40, dataPresent: false };
  }

  const info = batchCtx.authorInfo.get(author);
  if (!info) return { score: 45, dataPresent: true };

  let score = 50;

  // More ads = more established
  if (info.adCount >= 5) score += 20;
  else if (info.adCount >= 3) score += 10;
  else if (info.adCount >= 2) score += 5;

  // Named advertiser is a credibility signal
  if (info.name && info.name.length > 0) score += 15;

  // URL presence
  if (item.url) score += 10;

  return { score: Math.min(100, score), dataPresent: true };
}

// ── Main scoring function ────────────────────────────────────────────────────

/**
 * Score a batch of Meta Ads items.
 *
 * Every ad is evaluated on 5 dimensions. The composite is a weighted sum
 * normalised to [0, 100]. Cross‑item context (advertiser density, authority)
 * is computed from the batch automatically.
 *
 * @param items         Raw source items from a Meta Ads connector.
 * @param nicheContext   Keywords and country defining the target niche.
 * @returns              ScoreResult[] — one per item, same order as input.
 */
export function scoreMetaAds(
  items: RawSourceItem[],
  nicheContext: NicheContext,
): ScoreResult[] {
  if (items.length === 0) return [];

  const now = new Date().toISOString();

  // ── Build cross-item context ────────────────────────────────────────────
  const batchCtx = buildBatchContext(items);

  // ── Compute dimension scores ───────────────────────────────────────────
  const rawScores = items.map((item) => ({
    reachEfficiency: scoreReachEfficiency(item),
    adCreativeQuality: scoreAdCreativeQuality(item),
    competitiveScarcity: scoreCompetitiveScarcity(item, nicheContext, batchCtx),
    freshness: scoreFreshness(item),
    advertiserAuthority: scoreAdvertiserAuthority(item, batchCtx),
  }));

  // Normalise reach efficiency across the cohort
  const reachRaw = rawScores.map((r) => r.reachEfficiency.score);
  const reachNorm = normalise(reachRaw);

  return items.map((item, i) => {
    const r = rawScores[i]!;
    const dims: Record<string, number> = {
      reach_efficiency: Math.round(reachNorm[i]!),
      ad_creative_quality: Math.round(r.adCreativeQuality.score),
      competitive_scarcity: Math.round(r.competitiveScarcity.score),
      freshness: Math.round(r.freshness.score),
      advertiser_authority: Math.round(r.advertiserAuthority.score),
    };

    const composite = DIMENSIONS.reduce(
      (sum, d) => sum + dims[d.name]! * d.weight,
      0,
    );
    const clampedComposite = Math.round(Math.max(0, Math.min(100, composite)));

    const dataPresent: Record<string, boolean> = {
      reach_efficiency: r.reachEfficiency.dataPresent,
      ad_creative_quality: r.adCreativeQuality.dataPresent,
      competitive_scarcity: r.competitiveScarcity.dataPresent,
      freshness: r.freshness.dataPresent,
      advertiser_authority: r.advertiserAuthority.dataPresent,
    };

    return {
      itemId: item.externalId,
      compositeScore: clampedComposite,
      band: toBand(clampedComposite),
      dimensions: dims,
      confidence: deriveConfidence(dims, dataPresent),
      calculatedAt: now,
    };
  });
}