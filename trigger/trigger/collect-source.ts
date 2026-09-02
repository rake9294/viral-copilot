// =============================================================================
// Viral Copilot — Trigger.dev Task : Collecte Sources
// =============================================================================
// Déclenché au début d'un run. Lance la collecte parallèle TikTok + Meta,
// vérifie les quotas et disponibilité des sources.
// =============================================================================

import { task } from '@trigger.dev/sdk/v3';
import { collectQueue } from './client.js';
import type { RunContext, StepMetrics } from '@viral-copilot/workflows';
import {
  orchestrate,
  standardWorkflowPlan,
  type StepDefinition,
} from '@viral-copilot/workflows';

/**
 * Payload du task collect-source.
 */
export interface CollectSourcePayload {
  runId: string;
  workspaceId: string;
  nicheId: string;
  nicheSlug: string;
}

/**
 * Résultat du task collect-source.
 */
export interface CollectSourceOutput {
  runId: string;
  status: string;
  steps: Array<{
    step: string;
    status: string;
    metrics?: StepMetrics;
  }>;
  budgetSpent: { llmCalls: number; llmTokens: number; apiCalls: number; costUsd: number };
  completedAt?: Date;
}

/**
 * Étape de vérification des quotas.
 * Appelle les APIs pour vérifier les limites avant collecte.
 */
const checkQuotasHandler: StepDefinition['handler'] = async (ctx, signal) => {
  console.log(`[check_quotas] Vérification des quotas pour workspace ${ctx.workspaceId}`);

  // TODO: Implémenter la vraie vérification via le package connectors
  // - Vérifier quota TikTok API
  // - Vérifier quota Meta Ads API
  // - Vérifier budget LLM disponible

  return {
    status: 'success' as const,
    metrics: { llmCalls: 0, llmTokens: 0, apiCalls: 2, costUsd: 0 },
  };
};

/**
 * Étape de collecte TikTok.
 */
const collectTikTokHandler: StepDefinition['handler'] = async (ctx, signal) => {
  console.log(`[collect_tiktok] Collecte TikTok pour niche ${ctx.nicheId}`);

  // TODO: Implémenter la vraie collecte via le package connectors
  // - Paginer les résultats
  // - Gérer les rate limits
  // - Retourner le nombre d'items collectés

  return {
    status: 'success' as const,
    sourceCount: 0,
    itemCount: 0,
    metrics: { llmCalls: 0, llmTokens: 0, apiCalls: 10, costUsd: 0 },
  };
};

/**
 * Étape de collecte Meta Ads.
 */
const collectMetaHandler: StepDefinition['handler'] = async (ctx, signal) => {
  console.log(`[collect_meta] Collecte Meta Ads pour niche ${ctx.nicheId}`);

  // TODO: Implémenter la vraie collecte via le package connectors

  return {
    status: 'success' as const,
    sourceCount: 0,
    itemCount: 0,
    metrics: { llmCalls: 0, llmTokens: 0, apiCalls: 10, costUsd: 0 },
  };
};

// ─── Task Trigger.dev v3 ────────────────────────────────────────────────────

export const collectSource = task({
  id: 'collect-source',
  description: 'Vérifie les quotas et collecte les données TikTok + Meta pour un run',
  queue: collectQueue,
  maxDuration: 600, // 10 minutes max
  retry: {
    maxAttempts: 2,
    minTimeoutInMs: 5_000,
    maxTimeoutInMs: 30_000,
    factor: 2,
    randomize: true,
  },
  run: async (payload: CollectSourcePayload, { ctx }) => {
    const runContext: RunContext = {
      runId: payload.runId,
      workspaceId: payload.workspaceId,
      nicheId: payload.nicheId,
      nicheSlug: payload.nicheSlug,
      status: 'queued',
      steps: [],
      currentStep: 'check_quotas',
      budget: { maxCostLlm: 5, maxApiCalls: 500, maxTokens: 500_000, timeoutMinutes: 30 },
      budgetSpent: { llmCalls: 0, llmTokens: 0, apiCalls: 0, costUsd: 0 },
      coverage: null,
      startedAt: new Date(),
      updatedAt: new Date(),
    };

    console.log(`[collect-source] Démarrage pour run ${payload.runId}`);

    // Injecter les handlers réels dans le plan standard
    const plan = standardWorkflowPlan({
      stepTimeouts: {
        check_quotas: 30_000,
        collect_tiktok: 300_000,
        collect_meta: 300_000,
      },
    });
    plan.steps[0] = { step: 'check_quotas', handler: checkQuotasHandler, timeoutMs: 30_000, optional: false };
    plan.steps[1] = { step: 'collect_tiktok', handler: collectTikTokHandler, timeoutMs: 300_000, optional: true };
    plan.steps[2] = { step: 'collect_meta', handler: collectMetaHandler, timeoutMs: 300_000, optional: true };

    const abort = new AbortController();
    const result = await orchestrate(plan, runContext, abort.signal);

    return {
      runId: result.ctx.runId,
      status: result.finalStatus,
      steps: result.ctx.steps.map(s => ({
        step: s.step,
        status: s.status,
        metrics: s.metrics,
      })),
      budgetSpent: result.ctx.budgetSpent,
      completedAt: result.ctx.completedAt,
    } satisfies CollectSourceOutput;
  },
});