export { scoreTikTokItems } from "./tiktok.js";
export { scoreMetaAds } from "./meta.js";
export {
  evaluateScoringCoverage,
  DEFAULT_SCORING_THRESHOLDS,
} from "./evaluate.js";
export type { ScoringCoverageThresholds } from "./evaluate.js";
export type { SourceCoverage, CoverageAssessment } from "./evaluate.js";
export type {
  ScoreResult,
  ScoreBand,
  ConfidenceLevel,
  NicheContext,
  DimensionConfig,
  ScoringConfig,
  AdvertiserInfo,
} from "./types.js";
export { toBand, deriveConfidence } from "./types.js";