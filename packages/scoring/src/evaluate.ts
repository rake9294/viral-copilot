import type { NicheContext } from "./types.js";

// ── Coverage evaluation ──────────────────────────────────────────────────────

export interface SourceCoverage {
  source: "tiktok" | "meta_ads" | "trend" | "cohort";
  actualCount: number;
  threshold: number;
  met: boolean;
  detail?: string;
}

export interface CoverageAssessment {
  sources: SourceCoverage[];
  status: "sufficient" | "insufficient_coverage" | "partial";
  summary: string;
}

export interface ScoringCoverageThresholds {
  /** Minimum items to produce reliable TikTok scores. */
  tiktokMinItems: number;
  /** Minimum unique authors for meaningful audience-growth signal. */
  tiktokMinAuthors: number;
  /** Minimum ads to produce reliable Meta Ads scores. */
  metaAdsMinItems: number;
  /** Minimum unique advertisers for competitive-scarcity signal. */
  metaAdsMinAdvertisers: number;
  /** Minimum items in the cohort for normalisation to be stable. */
  cohortMinItems: number;
}

export const DEFAULT_SCORING_THRESHOLDS: ScoringCoverageThresholds = {
  tiktokMinItems: 20,
  tiktokMinAuthors: 5,
  metaAdsMinItems: 10,
  metaAdsMinAdvertisers: 3,
  cohortMinItems: 5,
};

/**
 * Evaluate whether the collected data is sufficient to produce
 * meaningful scores for a given niche.
 *
 * @param itemsBySource  Items grouped by source type.
 * @param nicheContext   Niche context (used for trend sources).
 * @param thresholds     Override thresholds (optional).
 */
export function evaluateScoringCoverage(
  itemsBySource: {
    tiktok?: { items: number; authors: number };
    metaAds?: { items: number; advertisers: number };
  },
  nicheContext: NicheContext,
  thresholds: ScoringCoverageThresholds = DEFAULT_SCORING_THRESHOLDS,
): CoverageAssessment {
  const sources: SourceCoverage[] = [];

  // TikTok
  if (itemsBySource.tiktok) {
    const { items, authors } = itemsBySource.tiktok;
    const met =
      items >= thresholds.tiktokMinItems && authors >= thresholds.tiktokMinAuthors;
    sources.push({
      source: "tiktok",
      actualCount: items,
      threshold: thresholds.tiktokMinItems,
      met,
      detail: `TikTok: ${items}/${thresholds.tiktokMinItems} contenus, ${authors}/${thresholds.tiktokMinAuthors} auteurs`,
    });
  }

  // Meta Ads
  if (itemsBySource.metaAds) {
    const { items, advertisers } = itemsBySource.metaAds;
    const met =
      items >= thresholds.metaAdsMinItems &&
      advertisers >= thresholds.metaAdsMinAdvertisers;
    sources.push({
      source: "meta_ads",
      actualCount: items,
      threshold: thresholds.metaAdsMinItems,
      met,
      detail: `Meta Ads: ${items}/${thresholds.metaAdsMinItems} annonces, ${advertisers}/${thresholds.metaAdsMinAdvertisers} annonceurs`,
    });
  }

  // Cohort (just scored items — applies to any source)
  const cohortCount =
    itemsBySource.tiktok?.items ?? itemsBySource.metaAds?.items ?? 0;
  const cohortMet = cohortCount >= thresholds.cohortMinItems;
  sources.push({
    source: "cohort",
    actualCount: cohortCount,
    threshold: thresholds.cohortMinItems,
    met: cohortMet,
    detail: `Cohorte: ${cohortCount}/${thresholds.cohortMinItems} éléments`,
  });

  // Overall assessment
  const allMet = sources.length > 0 && sources.every((s) => s.met);
  const anyMet = sources.some((s) => s.met);

  const status: CoverageAssessment["status"] = allMet
    ? "sufficient"
    : anyMet
      ? "partial"
      : "insufficient_coverage";

  const summary =
    status === "sufficient"
      ? "Couverture suffisante pour produire des scores fiables."
      : status === "partial"
        ? "Couverture partielle. Certaines dimensions manquent de données pour un scoring fiable."
        : "Couverture insuffisante. Pas assez de données pour produire des scores significatifs.";

  return { sources, status, summary };
}