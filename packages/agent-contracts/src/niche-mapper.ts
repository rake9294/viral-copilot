import { z } from "zod";

/**
 * A single persona in a niche.
 */
export const PersonaSchema = z.object({
  name: z.string().min(1, "Persona name is required"),
  pains: z.array(z.string()).min(1, "At least one pain point is required"),
  desiredOutcomes: z.array(z.string()).min(1, "At least one desired outcome is required"),
  vocabulary: z.array(z.string()).min(1, "At least one vocabulary term is required"),
});

export type Persona = z.infer<typeof PersonaSchema>;

/**
 * Full output of the Niche Mapper agent.
 */
export const NicheMapSchema = z.object({
  canonicalName: z.string().min(1, "Canonical name is required"),
  personas: z.array(PersonaSchema).min(1, "At least one persona is required"),
  seedQueries: z.array(z.string()).min(1, "At least one seed query is required"),
  adjacentQueries: z.array(z.string()).default([]),
  competitorNames: z.array(z.string()).default([]),
  accountHandles: z.array(z.string()).default([]),
  exclusions: z.array(z.string()).default([]),
  complianceRules: z.array(z.string()).default([]),
});

export type NicheMap = z.infer<typeof NicheMapSchema>;

/**
 * System prompt for the Niche Mapper LLM agent.
 */
export const NICHE_MAPPER_SYSTEM_PROMPT = `You are the Niche Mapper agent. Your job is to take a brief description of a market niche and produce a structured map.

The map includes:
- A canonical name for the niche
- Personas: who is in this niche, what they struggle with, what they want, and the vocabulary they use
- Seed queries: search terms to find primary content in this niche
- Adjacent queries: related terms to find adjacent content
- Competitors: known competitor brands or products
- Account handles: social media accounts to monitor
- Exclusions: topics, terms, and accounts to exclude
- Compliance rules: regulatory or brand safety rules

Always output valid JSON. Be thorough and specific. Each persona must have at least one pain, one desired outcome, and one vocabulary term.`;

/**
 * Build the user prompt for the Niche Mapper from a brief.
 */
export function buildNicheMapperPrompt(brief: NicheMapperInput): string {
  const parts: string[] = [`Generate a niche map for the following market:`, ``];
  parts.push(`Market name: ${brief.marketName}`);
  if (brief.subNiche) parts.push(`Sub-niche: ${brief.subNiche}`);
  parts.push(`Country: ${brief.country}`);
  parts.push(`Language: ${brief.language}`);
  if (brief.personas) parts.push(`Personas: ${brief.personas}`);
  if (brief.pains) parts.push(`Pain points: ${brief.pains}`);
  if (brief.desiredOutcomes) parts.push(`Desired outcomes: ${brief.desiredOutcomes}`);
  if (brief.offers) parts.push(`Offers / products: ${brief.offers}`);
  if (brief.competitors) parts.push(`Known competitors: ${brief.competitors}`);
  if (brief.brandTone) parts.push(`Brand tone: ${brief.brandTone}`);
  if (brief.complianceNotes) parts.push(`Compliance notes: ${brief.complianceNotes}`);
  parts.push(``);
  parts.push(`Output a complete JSON object matching the NicheMapSchema.`);
  return parts.join("\n");
}

/**
 * Input for the Niche Mapper.
 */
export interface NicheMapperInput {
  marketName: string;
  subNiche?: string;
  country: string;
  language: string;
  personas?: string;
  pains?: string;
  desiredOutcomes?: string;
  offers?: string;
  competitors?: string;
  brandTone?: string;
  complianceNotes?: string;
}

/**
 * Coverage thresholds for a niche.
 */
export interface CoverageThresholds {
  tiktok: {
    minContents: number;
    minAuthors: number;
    windowDays: number;
  };
  metaAds: {
    minAds: number;
    minAdvertisers: number;
    windowDays: number;
  };
  trend: {
    minIndependentSources: number;
  };
  cohort: {
    minElements: number;
  };
}

/**
 * Default coverage thresholds.
 */
export const DEFAULT_COVERAGE_THRESHOLDS: CoverageThresholds = {
  tiktok: {
    minContents: 50,
    minAuthors: 10,
    windowDays: 30,
  },
  metaAds: {
    minAds: 20,
    minAdvertisers: 5,
    windowDays: 90,
  },
  trend: {
    minIndependentSources: 3,
  },
  cohort: {
    minElements: 30,
  },
};

/**
 * Coverage status for a single source.
 */
export interface SourceCoverage {
  source: "tiktok" | "meta_ads" | "trend" | "cohort";
  actualCount: number;
  threshold: number;
  met: boolean;
  detail?: string;
}

/**
 * Overall coverage assessment.
 */
export interface CoverageAssessment {
  sources: SourceCoverage[];
  status: "sufficient" | "insufficient_coverage" | "partial";
  summary: string;
}

/**
 * Assess coverage based on actual data.
 */
export function assessCoverage(
  actual: {
    tiktokContents: number;
    tiktokAuthors: number;
    metaAds: number;
    metaAdvertisers: number;
    trendSources: number;
    cohortElements: number;
  },
  thresholds: CoverageThresholds = DEFAULT_COVERAGE_THRESHOLDS,
): CoverageAssessment {
  const sources: SourceCoverage[] = [
    {
      source: "tiktok",
      actualCount: actual.tiktokContents,
      threshold: thresholds.tiktok.minContents,
      met: actual.tiktokContents >= thresholds.tiktok.minContents,
      detail: `TikTok: ${actual.tiktokContents}/${thresholds.tiktok.minContents} contenus, ${actual.tiktokAuthors}/${thresholds.tiktok.minAuthors} auteurs, ${thresholds.tiktok.windowDays} jours`,
    },
    {
      source: "meta_ads",
      actualCount: actual.metaAds,
      threshold: thresholds.metaAds.minAds,
      met: actual.metaAds >= thresholds.metaAds.minAds,
      detail: `Meta Ads: ${actual.metaAds}/${thresholds.metaAds.minAds} annonces, ${actual.metaAdvertisers}/${thresholds.metaAds.minAdvertisers} annonceurs, ${thresholds.metaAds.windowDays} jours`,
    },
    {
      source: "trend",
      actualCount: actual.trendSources,
      threshold: thresholds.trend.minIndependentSources,
      met: actual.trendSources >= thresholds.trend.minIndependentSources,
      detail: `Tendance: ${actual.trendSources}/${thresholds.trend.minIndependentSources} sources indépendantes`,
    },
    {
      source: "cohort",
      actualCount: actual.cohortElements,
      threshold: thresholds.cohort.minElements,
      met: actual.cohortElements >= thresholds.cohort.minElements,
      detail: `Cohorte: ${actual.cohortElements}/${thresholds.cohort.minElements} éléments`,
    },
  ];

  const allMet = sources.every((s) => s.met);
  const anyMet = sources.some((s) => s.met);

  const status = allMet ? "sufficient" : anyMet ? "partial" : "insufficient_coverage";

  return {
    sources,
    status,
    summary: status === "sufficient"
      ? "Couverture suffisante pour lancer le radar."
      : status === "partial"
        ? "Couverture partielle. Certains canaux n'ont pas assez de données."
        : "Couverture insuffisante. Aucun canal n'atteint les seuils requis.",
  };
}