// Niche Mapper exports
export {
  PersonaSchema,
  NicheMapSchema,
  NICHE_MAPPER_SYSTEM_PROMPT,
  buildNicheMapperPrompt,
  DEFAULT_COVERAGE_THRESHOLDS,
  assessCoverage,
} from "./niche-mapper.js";
export type {
  Persona,
  NicheMap,
  NicheMapperInput,
  CoverageThresholds,
  SourceCoverage,
  CoverageAssessment,
} from "./niche-mapper.js";

// Agent communication Zod schemas (for Radar, Studio, etc.)
import { z } from "zod";

export const RadarRequestSchema = z.object({
  source: z.enum(["tiktok", "meta"]),
  keywords: z.array(z.string()).min(1),
  maxResults: z.number().optional().default(20),
});

export type RadarRequest = z.infer<typeof RadarRequestSchema>;

export const RadarResultSchema = z.object({
  runId: z.string(),
  status: z.enum(["completed", "partial", "insufficient_signal"]),
  opportunities: z.array(
    z.object({
      title: z.string(),
      description: z.string(),
      score: z.number(),
      confidence: z.number(),
      source: z.enum(["tiktok", "meta"]),
      evidence: z.array(
        z.object({
          type: z.string(),
          content: z.string(),
          url: z.string().optional(),
        }),
      ),
    }),
  ),
  metrics: z.object({
    totalPostsAnalyzed: z.number(),
    totalEngagement: z.number(),
    avgEngagementRate: z.number(),
  }),
  error: z.string().optional(),
});

export type RadarResult = z.infer<typeof RadarResultSchema>;

export const CreativeBriefSchema = z.object({
  opportunityId: z.string(),
  hooks: z.object({
    visual: z.string(),
    verbal: z.string(),
    onScreenText: z.string(),
  }),
  scripts: z.object({
    short: z.string(),
    demonstrative: z.string(),
  }),
});

export type CreativeBrief = z.infer<typeof CreativeBriefSchema>;

export const CriticReviewSchema = z.object({
  draftId: z.string(),
  verdict: z.enum(["pass", "revise", "reject"]),
  score: z.number(),
  feedback: z.string(),
  improvements: z.array(z.string()),
});

export type CriticReview = z.infer<typeof CriticReviewSchema>;

// ===================== Agent-level schemas =====================

// ---- Signal Analyst agent ----
export {
  SignalAnalystEvidenceSchema,
  SignalAnalystSignalSchema,
  SignalAnalystMetricsSchema,
  SignalAnalystReportSchema,
  SIGNAL_ANALYST_SYSTEM_PROMPT,
  buildSignalAnalystPrompt,
} from "./signal-analyst.js";
export type {
  SignalAnalystEvidence,
  SignalAnalystSignal,
  SignalAnalystMetrics,
  SignalAnalystReport,
  SignalAnalystInput,
} from "./signal-analyst.js";

// ---- Strategist agent ----
export {
  StrategistHookConceptSchema,
  StrategistFormatRecommendationSchema,
  StrategistVisualDirectionSchema,
  StrategistNarrativeBeatSchema,
  StrategistOpportunitySchema,
  StrategistTimingSchema,
  StrategistCreativeStrategySchema,
  STRATEGIST_SYSTEM_PROMPT,
  buildStrategistPrompt,
} from "./strategist.js";
export type {
  StrategistHookConcept,
  StrategistFormatRecommendation,
  StrategistVisualDirection,
  StrategistNarrativeBeat,
  StrategistOpportunity,
  StrategistTiming,
  StrategistCreativeStrategy,
  StrategistInput,
} from "./strategist.js";

// ---- Creative Composer agent ----
export {
  ComposerHookTypeSchema,
  ComposerHookSchema,
  ComposerStoryboardFrameSchema,
  ComposerScriptSchema,
  ComposerProductionMetadataSchema,
  ComposerCreativeOutputSchema,
  CREATIVE_COMPOSER_SYSTEM_PROMPT,
  buildCreativeComposerPrompt,
} from "./creative-composer.js";
export type {
  ComposerHookType,
  ComposerHook,
  ComposerStoryboardFrame,
  ComposerScript,
  ComposerProductionMetadata,
  ComposerCreativeOutput,
  ComposerInput,
} from "./creative-composer.js";