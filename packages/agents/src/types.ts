import type { LLMClient } from "@viral-copilot/llm-gateway";
import type { NicheMap } from "@viral-copilot/agent-contracts";

/**
 * Union of all agent roles supported by the factory.
 */
export type AgentRole = "signal-analyst" | "strategist" | "creative-composer" | "critic";

/**
 * Generic agent interface.
 */
export interface Agent<Input, Output> {
  readonly name: string;
  execute(input: Input): Promise<Output>;
}

/**
 * Options passed to every agent execute call for observability.
 */
export interface AgentOptions {
  /** Optional correlation ID for tracing. */
  traceId?: string;
  /** Override model for this single call. */
  modelOverride?: string;
  /** Temperature override. */
  temperature?: number;
}

// ── Domain types not (yet) in agent-contracts ────────────────────────────────

/**
 * Domain model representing a niche profile — used across agents.
 */
export interface NicheProfile {
  id: string;
  name: string;
  countryCode: string;
  languageCode: string;
  status: string;
  nicheMap: NicheMap;
  version: number;
}

/**
 * Scoring result for a single source item within a niche.
 */
export interface ScoreResult {
  externalId: string;
  nicheProfileId: string;
  compositeScore: number;
  confidenceBand: "low" | "medium" | "high";
  dimensions: Record<string, number>;
  calculatedAt: string;
}

// ── Helpers ──────────────────────────────────────────────────────────────────

/**
 * Simple helper to produce a unique operation id.
 */
export function generateRunId(): string {
  return `run_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
}

/**
 * Helper that ensures an LLM call returns the expected shape.
 */
export async function safeGenerateJSON<T>(
  llm: LLMClient,
  systemPrompt: string,
  userPrompt: string,
  options?: { maxTokens?: number; temperature?: number },
): Promise<T> {
  return llm.generateJSON<T>(systemPrompt, userPrompt, {
    maxTokens: options?.maxTokens ?? 4096,
    temperature: options?.temperature ?? 0.7,
  });
}