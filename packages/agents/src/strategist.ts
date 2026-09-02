import type { LLMClient } from "@viral-copilot/llm-gateway";
import type {
  Signal,
  CreativeStrategy,
} from "@viral-copilot/agent-contracts";
import {
  CreativeStrategySchema,
  STRATEGIST_SYSTEM_PROMPT,
  buildStrategistPrompt,
} from "@viral-copilot/agent-contracts";
import { safeGenerateJSON, type NicheProfile } from "./types.js";

/**
 * Build the user prompt for the strategist from domain objects.
 */
function buildEnrichedStrategistPrompt(
  signal: Signal,
  niche: NicheProfile,
): string {
  const input = {
    signal: {
      id: signal.id,
      title: signal.title,
      summary: signal.summary,
      confidence: signal.confidence,
      saturation: signal.saturation,
      actionWindow: signal.actionWindow,
      source: signal.source as "tiktok" | "meta" | "both",
      transferableMechanics: signal.transferableMechanics,
      doNotCopy: signal.doNotCopy,
    },
    niche: niche.name,
    brand: {
      name: niche.name,
      tone: "moderne et authentique",
      audience: niche.nicheMap.personas.map((p) => p.name).join(", "),
      constraints: niche.nicheMap.complianceRules,
    },
    objective: "engagement communautaire",
  };

  return buildStrategistPrompt(input);
}

/**
 * StrategistAgent
 *
 * Transforme un signal d'opportunité en stratégie créative actionnable.
 * Utilise les schémas et prompts existants de @viral-copilot/agent-contracts.
 */
export class StrategistAgent {
  readonly name = "StrategistAgent";

  constructor(private llm: LLMClient) {}

  async strategize(
    signal: Signal,
    niche: NicheProfile,
  ): Promise<CreativeStrategy> {
    const userPrompt = buildEnrichedStrategistPrompt(signal, niche);

    const raw = await safeGenerateJSON<CreativeStrategy>(
      this.llm,
      STRATEGIST_SYSTEM_PROMPT,
      userPrompt,
      { maxTokens: 4096, temperature: 0.8 },
    );

    const strategy: CreativeStrategy = {
      opportunity: raw.opportunity,
      timing: raw.timing,
      budgetSuggestion: raw.budgetSuggestion,
      kpis: raw.kpis,
      testingApproach: raw.testingApproach,
      notes: raw.notes,
    };

    return CreativeStrategySchema.parse(strategy);
  }

  async execute(input: {
    signal: Signal;
    niche: NicheProfile;
  }): Promise<CreativeStrategy> {
    return this.strategize(input.signal, input.niche);
  }
}