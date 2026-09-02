import type { LLMClient } from "@viral-copilot/llm-gateway";
import type {
  SignalAnalystReport,
} from "@viral-copilot/agent-contracts";
import {
  SignalAnalystReportSchema,
  SIGNAL_ANALYST_SYSTEM_PROMPT,
  buildSignalAnalystPrompt,
} from "@viral-copilot/agent-contracts";
import type { RawSourceItem } from "@viral-copilot/connectors";
import { safeGenerateJSON, type NicheProfile, type ScoreResult } from "./types.js";

/**
 * Build the enriched user prompt for signal analysis.
 */
function buildEnrichedAnalystPrompt(
  niche: NicheProfile,
  items: RawSourceItem[],
  scores: ScoreResult[],
): string {
  const posts = items.map((item) => ({
    id: item.externalId,
    content: item.text ?? "",
    engagement: {
      likes: item.metrics?.likes ?? 0,
      shares: item.metrics?.shares ?? 0,
      comments: item.metrics?.comments ?? 0,
    },
    author: item.author ?? "unknown",
    publishedAt: item.publishedAt ?? new Date().toISOString(),
    url: item.url,
  }));

  const input = {
    niche: niche.name,
    source: "both" as const,
    rawData: { posts },
    competitors: niche.nicheMap.competitorNames,
    timeWindow: "30 derniers jours",
  };

  const basePrompt = buildSignalAnalystPrompt(input);

  const scoreMap = new Map<string, ScoreResult>();
  for (const s of scores) scoreMap.set(s.externalId, s);

  const enriched: string[] = [basePrompt, "", "=== SCORES ASSOCIÉS ==="];
  for (const item of items) {
    const sc = scoreMap.get(item.externalId);
    if (sc) {
      enriched.push(
        `${item.externalId}: composite=${sc.compositeScore} confiance=${sc.confidenceBand} dimensions=${JSON.stringify(sc.dimensions)}`,
      );
    }
  }

  if (scores.length > 0) {
    const avg = scores.reduce((a, b) => a + b.compositeScore, 0) / scores.length;
    const sorted = scores.map((s) => s.compositeScore).sort((a, b) => a - b);
    const p90 = sorted[Math.floor(sorted.length * 0.9)];
    const p95 = sorted[Math.floor(sorted.length * 0.95)];
    enriched.push("");
    enriched.push("=== STATISTIQUES ===");
    enriched.push(`Score moyen: ${avg.toFixed(1)}`);
    enriched.push(`P90: ${p90 ?? "N/A"} | P95: ${p95 ?? "N/A"}`);
    enriched.push(`Total items: ${items.length}`);
  }

  return enriched.join("\n");
}

/**
 * SignalAnalystAgent
 *
 * Analyse les items bruts enrichis de leurs scores et produit
 * un rapport de signaux identifiant les opportunités de contenu.
 */
export class SignalAnalystAgent {
  readonly name = "SignalAnalystAgent";

  constructor(private llm: LLMClient) {}

  async analyze(
    niche: NicheProfile,
    items: RawSourceItem[],
    scores: ScoreResult[],
  ): Promise<SignalAnalystReport> {
    const userPrompt = buildEnrichedAnalystPrompt(niche, items, scores);

    const raw = await safeGenerateJSON<SignalAnalystReport>(
      this.llm,
      SIGNAL_ANALYST_SYSTEM_PROMPT,
      userPrompt,
      { maxTokens: 8192 },
    );

    const report: SignalAnalystReport = {
      signals: raw.signals ?? [],
      metrics: raw.metrics ?? {
        totalPostsAnalyzed: items.length,
        totalEngagement: items.reduce((s, i) => s + (i.metrics?.views ?? 0), 0),
        avgEngagementRate: 0,
        timeWindow: "30 derniers jours",
      },
    };

    return SignalAnalystReportSchema.parse(report);
  }

  async execute(input: {
    niche: NicheProfile;
    items: RawSourceItem[];
    scores: ScoreResult[];
  }): Promise<SignalAnalystReport> {
    return this.analyze(input.niche, input.items, input.scores);
  }
}