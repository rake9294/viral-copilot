import type { RawSourceItem } from "@viral-copilot/connectors/types";
import type { NicheContext, ScoreResult } from "./types.js";
import { toBand, deriveConfidence } from "./types.js";

// ── Dimension config ─────────────────────────────────────────────────────────

const DIMENSIONS = [
  { name: "engagement_velocity", weight: 0.30 },
  { name: "audience_growth", weight: 0.20 },
  { name: "content_format_fit", weight: 0.15 },
  { name: "niche_relevance", weight: 0.20 },
  { name: "freshness", weight: 0.15 },
] as const;

// ── Helpers ──────────────────────────────────────────────────────────────────

/** Hours elapsed since publication (or first seen), clamped to ≥ 1. */
function hoursSince(publishedAt?: string, firstSeenAt?: string): number {
  const ts = publishedAt ?? firstSeenAt;
  if (!ts) return 1;
  const elapsed = Date.now() - new Date(ts).getTime();
  return Math.max(1, elapsed / 3_600_000);
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

// ── Dimension scorers ────────────────────────────────────────────────────────

interface DimensionResult {
  score: number;
  dataPresent: boolean;
}

/**
 * 1) Engagement velocity (poids 0.30)
 *    views ÷ hours-since-published → high ratio = viral momentum.
 */
function scoreEngagementVelocity(
  item: RawSourceItem,
  _ctx: NicheContext,
  _cohort: number[],
): DimensionResult {
  const views = item.metrics?.views;
  if (views === undefined || views === null) {
    return { score: 40, dataPresent: false };
  }
  const hrs = hoursSince(item.publishedAt);
  const velocity = views / hrs;
  // Compare within the cohort via normalisation later
  return { score: velocity, dataPresent: true };
}

/**
 * 2) Audience growth (poids 0.20)
 *    Proxy: engagement depth = (likes + comments) / views.
 *    Higher depth suggests a loyal/engaged audience → growth signal.
 */
function scoreAudienceGrowth(item: RawSourceItem): DimensionResult {
  const views = item.metrics?.views;
  const likes = item.metrics?.likes;
  const comments = item.metrics?.comments;
  if (!views || views === 0) {
    return { score: 40, dataPresent: false };
  }
  const depth = ((likes ?? 0) + (comments ?? 0)) / views;
  // depth is typically 0.01–0.15; scale to 0–100
  const scaled = Math.min(100, depth * 1000);
  return { score: scaled, dataPresent: likes !== undefined || comments !== undefined };
}

/**
 * 3) Content format fit (poids 0.15)
 *    Score based on item type. Video generally outperforms on TikTok;
 *    presence of multiple media items also helps.
 */
function scoreContentFormatFit(item: RawSourceItem): DimensionResult {
  const type = item.type?.toLowerCase() ?? "";
  const mediaCount = item.media?.length ?? 0;

  let base = 50;
  if (type === "video") base = 75;
  else if (type === "image") base = 50;

  // Bonus for multiple media attachments (carousel-style)
  if (mediaCount > 1) base += 10;

  // Penalty if we have no type info at all
  if (!item.type && mediaCount === 0) {
    return { score: 40, dataPresent: false };
  }

  return { score: Math.min(100, base), dataPresent: true };
}

/**
 * 4) Niche relevance (poids 0.20)
 *    Semantic keyword matching on the item's text content.
 */
function scoreNicheRelevance(item: RawSourceItem, ctx: NicheContext): DimensionResult {
  if (ctx.keywords.length === 0) {
    return { score: 50, dataPresent: false };
  }
  const matches = keywordMatchCount(item.text, ctx.keywords);
  const ratio = matches / ctx.keywords.length;
  const score = Math.min(100, ratio * 100 + 20); // floor at 20
  return { score, dataPresent: matches > 0 };
}

/**
 * 5) Freshness (poids 0.15)
 *    Exponential decay based on hours since publication.
 *    Items < 24h get 100, decaying to ~10 at 30 days.
 */
function scoreFreshness(item: RawSourceItem): DimensionResult {
  const hrs = hoursSince(item.publishedAt);
  // Decay: score = 100 * e^(-0.005 * hrs)
  // 24h → 88,  7d → 43, 30d → 3
  const score = Math.round(100 * Math.exp(-0.005 * hrs));
  return {
    score: Math.max(0, Math.min(100, score)),
    dataPresent: item.publishedAt !== undefined,
  };
}

// ── Main scoring function ────────────────────────────────────────────────────

/**
 * Score a batch of TikTok organic content items.
 *
 * Each item is evaluated on 5 dimensions and the composite is a weighted
 * sum normalised to [0, 100]. Dimensions whose data is missing gracefully
 * fall back to neutral estimates and lower the overall confidence.
 *
 * @param items         Raw source items from a TikTok connector.
 * @param nicheContext   Keywords and country defining the target niche.
 * @returns              ScoreResult[] — one per item, same order as input.
 */
export function scoreTikTokItems(
  items: RawSourceItem[],
  nicheContext: NicheContext,
): ScoreResult[] {
  if (items.length === 0) return [];

  const now = new Date().toISOString();

  // Phase 1: compute raw dimension scores (some need cross-item normalisation)
  const rawScores = items.map((item) => ({
    engagementVelocity: scoreEngagementVelocity(item, nicheContext, []),
    audienceGrowth: scoreAudienceGrowth(item),
    contentFormatFit: scoreContentFormatFit(item),
    nicheRelevance: scoreNicheRelevance(item, nicheContext),
    freshness: scoreFreshness(item),
  }));

  // Phase 2: normalise engagement velocity across the cohort
  const velocityRaw = rawScores.map((r) => r.engagementVelocity.score);
  const velocityNorm = normalise(velocityRaw);

  // Phase 3: assemble ScoreResult[]
  return items.map((item, i) => {
    const r = rawScores[i]!;
    const dims: Record<string, number> = {
      engagement_velocity: Math.round(velocityNorm[i]!),
      audience_growth: Math.round(r.audienceGrowth.score),
      content_format_fit: Math.round(r.contentFormatFit.score),
      niche_relevance: Math.round(r.nicheRelevance.score),
      freshness: Math.round(r.freshness.score),
    };

    const composite = DIMENSIONS.reduce(
      (sum, d) => sum + dims[d.name]! * d.weight,
      0,
    );
    const clampedComposite = Math.round(Math.max(0, Math.min(100, composite)));

    const dataPresent: Record<string, boolean> = {
      engagement_velocity: r.engagementVelocity.dataPresent,
      audience_growth: r.audienceGrowth.dataPresent,
      content_format_fit: r.contentFormatFit.dataPresent,
      niche_relevance: r.nicheRelevance.dataPresent,
      freshness: r.freshness.dataPresent,
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