import type { LLMClient } from "@viral-copilot/llm-gateway";
import type { AgentRole } from "./types.js";
import { SignalAnalystAgent } from "./signal-analyst.js";
import { StrategistAgent } from "./strategist.js";
import { CreativeComposerAgent } from "./creative-composer.js";
import { CriticAgent } from "./critic.js";

// ── Agent exports ────────────────────────────────────────────────────────────

export { SignalAnalystAgent } from "./signal-analyst.js";
export { StrategistAgent } from "./strategist.js";
export { CreativeComposerAgent } from "./creative-composer.js";
export { CriticAgent } from "./critic.js";

// ── Type exports ─────────────────────────────────────────────────────────────

export type { AgentRole } from "./types.js";
export type { Agent, AgentOptions, NicheProfile, ScoreResult } from "./types.js";

// ── Factory ──────────────────────────────────────────────────────────────────

/**
 * Create an agent instance by role.
 *
 * @param role  The agent role to instantiate.
 * @param llm   An LLMClient instance (from @viral-copilot/llm-gateway).
 * @returns     The agent instance.
 */
export function createAgent(
  role: AgentRole,
  llm: LLMClient,
): SignalAnalystAgent | StrategistAgent | CreativeComposerAgent | CriticAgent {
  switch (role) {
    case "signal-analyst":
      return new SignalAnalystAgent(llm);
    case "strategist":
      return new StrategistAgent(llm);
    case "creative-composer":
      return new CreativeComposerAgent(llm);
    case "critic":
      return new CriticAgent(llm);
    default: {
      const _exhaustive: never = role;
      throw new Error(`Unknown agent role: ${String(_exhaustive)}`);
    }
  }
}