import type { LLMClient } from "@viral-copilot/llm-gateway";
import type {
  StrategistCreativeStrategy,
  ComposerCreativeOutput,
  SimilarityReport,
} from "@viral-copilot/agent-contracts";
import {
  ComposerCreativeOutputSchema,
  CREATIVE_COMPOSER_SYSTEM_PROMPT,
  buildCreativeComposerPrompt,
} from "@viral-copilot/agent-contracts";
import { safeGenerateJSON } from "./types.js";

/**
 * Build the user prompt for the creative composer from domain objects.
 */
function buildEnrichedComposerPrompt(
  strategy: StrategistCreativeStrategy,
  similarityContext?: SimilarityReport,
): string {
  const input = {
    strategy: {
      opportunity: strategy.opportunity,
      timing: strategy.timing,
      kpis: strategy.kpis,
      testingApproach: strategy.testingApproach,
      notes: strategy.notes,
    },
    niche: strategy.opportunity.title,
  };

  const prompt = buildCreativeComposerPrompt(input);

  if (!similarityContext) return prompt;

  const extra: string[] = [
    "",
    "=== CONTEXTE DE SIMILARITÉ ===",
    `Vérifié: ${similarityContext.checked}`,
    `Niveau de risque: ${similarityContext.riskLevel ?? "non évalué"}`,
  ];
  if (similarityContext.existingItems) {
    for (const item of similarityContext.existingItems) {
      extra.push(
        `  - Similarité ${(item.similarity * 100).toFixed(0)}%: ${item.overlapReason}${item.url ? ` (${item.url})` : ""}`,
      );
    }
  }
  if (similarityContext.summary) {
    extra.push(`Résumé: ${similarityContext.summary}`);
  }
  extra.push("");
  extra.push("ADAPTE le contenu pour éviter les similitudes excessives.");

  return prompt + "\n" + extra.join("\n");
}

/**
 * CreativeComposerAgent
 *
 * Génère le matériel créatif complet (hooks, scripts, storyboard, brief)
 * à partir d'une stratégie créative validée par le stratège.
 */
export class CreativeComposerAgent {
  readonly name = "CreativeComposerAgent";

  constructor(private llm: LLMClient) {}

  async compose(
    strategy: StrategistCreativeStrategy,
    similarityContext?: SimilarityReport,
  ): Promise<ComposerCreativeOutput> {
    const userPrompt = buildEnrichedComposerPrompt(strategy, similarityContext);

    const raw = await safeGenerateJSON<ComposerCreativeOutput>(
      this.llm,
      CREATIVE_COMPOSER_SYSTEM_PROMPT,
      userPrompt,
      { maxTokens: 8192, temperature: 0.85 },
    );

    const output: ComposerCreativeOutput = {
      hooks: raw.hooks,
      scripts: raw.scripts,
      storyboard: raw.storyboard,
      metadata: raw.metadata,
      platformSpecifics: raw.platformSpecifics,
      notes: raw.notes,
    };

    return ComposerCreativeOutputSchema.parse(output);
  }

  async execute(input: {
    strategy: StrategistCreativeStrategy;
    similarityContext?: SimilarityReport;
  }): Promise<ComposerCreativeOutput> {
    return this.compose(input.strategy, input.similarityContext);
  }
}