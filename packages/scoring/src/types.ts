// ── Score bands ───────────────────────────────────────────────────────────────

export type ScoreBand = "red" | "orange" | "green" | "top";

/**
 * Map a normalised score [0–100] to a band.
 */
export function toBand(score: number): ScoreBand {
  if (score <= 30) return "red";
  if (score <= 60) return "orange";
  if (score <= 80) return "green";
  return "top";
}

// ── Confidence levels ────────────────────────────────────────────────────────

export type ConfidenceLevel = "low" | "medium" | "high";

/**
 * Derive a confidence level based on how many dimensions had actual data
 * (non‑null / non‑undefined) vs. fallback defaults.
 */
export function deriveConfidence(
  dimensions: Record<string, number>,
  dataPresent: Record<string, boolean>,
): ConfidenceLevel {
  const dimCount = Object.keys(dimensions).length;
  if (dimCount === 0) return "low";
  const presentCount = Object.values(dataPresent).filter(Boolean).length;
  const ratio = presentCount / dimCount;
  if (ratio >= 0.8) return "high";
  if (ratio >= 0.5) return "medium";
  return "low";
}

// ── Score result ─────────────────────────────────────────────────────────────

export interface ScoreResult {
  /** The external ID of the source item. */
  itemId: string;
  /** Weighted composite score, normalised to [0, 100]. */
  compositeScore: number;
  /** Colour band derived from compositeScore. */
  band: ScoreBand;
  /** Individual dimension scores (each 0–100). */
  dimensions: Record<string, number>;
  /** Data‑availability confidence. */
  confidence: ConfidenceLevel;
  /** ISO-8601 timestamp of when the score was calculated. */
  calculatedAt: string;
}

// ── Niche context ────────────────────────────────────────────────────────────

export interface NicheContext {
  /** Keywords defining the target niche. */
  keywords: string[];
  /** Two‑letter ISO country code (e.g. "US", "FR"). */
  country: string;
}

// ── Scoring dimension config ─────────────────────────────────────────────────

export interface DimensionConfig {
  name: string;
  weight: number;
}

// ── Scoring engine config ────────────────────────────────────────────────────

export interface ScoringConfig {
  dimensions: DimensionConfig[];
}

// ── Advertiser info (populated from the batch for cross‑item context) ────────

export interface AdvertiserInfo {
  externalId: string;
  name?: string;
  adCount: number;
  /** Average score across the advertiser's ads in this batch. */
  avgScore?: number;
}