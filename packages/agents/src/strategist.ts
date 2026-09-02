import type { LLMClient } from "@viral-copilot/llm-gateway";
import type {
  SignalAnalystSignal,
  StrategistCreativeStrategy,
} from "@viral-copilot/agent-contracts";
import {
  StrategistCreativeStrategySchema,
  STRATEGIST_SYSTEM_PROMPT,
  buildStrategistPrompt,
} from "@viral-copilot/agent-contracts";
import { safeGenerateJSON, type NicheProfile } from "./types.js";

/**
 * Build the user prompt for the strategist from domain objects.
 */
function buildEnrichedStrategistPrompt(
  signal: SignalAnalystSignal,
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
 */
export class StrategistAgent {
  readonly name = "StrategistAgent";

  constructor(private llm: LLMClient) {}

  async strategize(
    signal: SignalAnalystSignal,
    niche: NicheProfile,
  ): Promise<StrategistCreativeStrategy> {
    const userPrompt = buildEnrichedStrategistPrompt(signal, niche);

    const raw = await safeGenerateJSON<StrategistCreativeStrategy>(
      this.llm,
      STRATEGIST_SYSTEM_PROMPT,
      userPrompt,
      { maxTokens: 4096, temperature: 0.8 },
    );

    const strategy: StrategistCreativeStrategy = {
      opportunity: raw.opportunity,
      timing: raw.timing,
      budgetSuggestion: raw.budgetSuggestion,
      kpis: raw.kpis,
      testingApproach: raw.testingApproach,
      notes: raw.notes,
    };

    return StrategistCreativeStrategySchema.parse(strategy);
  }

  async execute(input: {
    signal: SignalAnalystSignal;
    niche: NicheProfile;
  }): Promise<StrategistCreativeStrategy> {
    return this.strategize(input.signal, input.niche);
  }
}