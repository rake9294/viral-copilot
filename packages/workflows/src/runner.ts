// =============================================================================
// Viral Copilot — Workflow Runner
// =============================================================================
// Moteur d'exécution qui orchestre chaque étape du workflow, gère les
// transitions d'état, le budget et la reprise sur erreur.
// =============================================================================

import { v4 as uuid } from 'uuid';
import type {
  RunContext,
  RunStatus,
  RunEvent,
  RunBudget,
  StepResult,
  StepMetrics,
  WorkflowStep,
} from './types.js';
import { transitionRun, DEFAULT_BUDGET } from './types.js';
import { checkCoverage, type CoverageThresholds } from './coverage.js';

// ─── Logger ─────────────────────────────────────────────────────────────────

function log(level: 'info' | 'warn' | 'error' | 'debug', ctx: RunContext, msg: string, meta?: Record<string, unknown>): void {
  const entry = {
    timestamp: new Date().toISOString(),
    level,
    runId: ctx.runId,
    step: ctx.currentStep,
    status: ctx.status,
    message: msg,
    ...meta,
  };
  // En production, envoyer vers un système de logging structuré
  console[level === 'error' ? 'error' : level === 'warn' ? 'warn' : 'log'](
    JSON.stringify(entry),
  );
}

// ─── Budget tracker ──────────────────────────────────────────────────────────

export function isBudgetExceeded(budget: RunBudget, spent: StepMetrics): boolean {
  return (
    spent.costUsd >= budget.maxCostLlm ||
    spent.apiCalls >= budget.maxApiCalls ||
    spent.llmTokens >= budget.maxTokens
  );
}

// ─── Step execution ──────────────────────────────────────────────────────────

export type StepHandler = (
  ctx: RunContext,
  signal: AbortSignal,
) => Promise<Partial<StepResult>>;

export interface StepDefinition {
  step: WorkflowStep;
  handler: StepHandler;
  /** Temps maximum alloué à cette étape (ms) */
  timeoutMs: number;
  /** Si true, une erreur → statut partial plutôt que failed */
  optional: boolean;
}

const DEFAULT_STEP_TIMEOUT_MS = 5 * 60 * 1000; // 5 min

/**
 * Exécute une étape avec timeout, logging et mise à jour du contexte.
 */
export async function executeStep(
  ctx: RunContext,
  def: StepDefinition,
  signal: AbortSignal,
): Promise<StepResult> {
  const startedAt = new Date();
  log('info', ctx, `Démarrage de l'étape ${def.step}`);

  try {
    const partial = await executeWithTimeout(def.handler, def, ctx, signal);
    const finishedAt = new Date();
    const durationMs = finishedAt.getTime() - startedAt.getTime();

    const result: StepResult = {
      step: def.step,
      status: partial.status ?? 'success',
      startedAt,
      finishedAt,
      durationMs,
      error: partial.error,
      metrics: partial.metrics,
      sourceCount: partial.sourceCount,
      itemCount: partial.itemCount,
    };

    // Accumuler les métriques de budget
    if (result.metrics) {
      ctx.budgetSpent.llmCalls += result.metrics.llmCalls;
      ctx.budgetSpent.llmTokens += result.metrics.llmTokens;
      ctx.budgetSpent.apiCalls += result.metrics.apiCalls;
      ctx.budgetSpent.costUsd += result.metrics.costUsd;
    }

    ctx.steps.push(result);
    log('info', ctx, `Étape ${def.step} terminée [${result.status}]`, {
      durationMs,
      metrics: result.metrics,
    });

    return result;
  } catch (err) {
    const finishedAt = new Date();
    const durationMs = finishedAt.getTime() - startedAt.getTime();
    const message = err instanceof Error ? err.message : String(err);

    log('error', ctx, `Étape ${def.step} en erreur`, { error: message });

    if (def.optional) {
      const result: StepResult = {
        step: def.step,
        status: 'partial',
        startedAt,
        finishedAt,
        durationMs,
        error: message,
      };
      ctx.steps.push(result);
      return result;
    }

    throw err; // L'étape est critique → propagation
  }
}

async function executeWithTimeout(
  handler: StepHandler,
  def: StepDefinition,
  ctx: RunContext,
  signal: AbortSignal,
): Promise<Partial<StepResult>> {
  const timeout = def.timeoutMs || DEFAULT_STEP_TIMEOUT_MS;

  const result = await Promise.race([
    handler(ctx, signal),
    new Promise<never>((_, reject) => {
      setTimeout(() => reject(new Error(`Timeout atteint: ${def.step} > ${timeout}ms`)), timeout);
    }),
  ]);

  return result;
}

// ─── Orchestrator ────────────────────────────────────────────────────────────

export interface WorkflowPlan {
  steps: StepDefinition[];
  thresholds?: Partial<CoverageThresholds>;
}

export interface OrchestrationResult {
  ctx: RunContext;
  finalStatus: RunStatus;
  error?: Error;
}

/**
 * Lance l'exécution complète du workflow selon un plan donné.
 */
export async function orchestrate(
  plan: WorkflowPlan,
  initialCtx: Partial<RunContext>,
  signal: AbortSignal,
): Promise<OrchestrationResult> {
  const ctx: RunContext = {
    runId: initialCtx.runId ?? uuid(),
    workspaceId: initialCtx.workspaceId ?? '',
    nicheId: initialCtx.nicheId ?? '',
    nicheSlug: initialCtx.nicheSlug ?? '',
    status: 'queued',
    steps: [],
    currentStep: 'check_quotas',
    budget: { ...DEFAULT_BUDGET, ...initialCtx.budget },
    budgetSpent: initialCtx.budgetSpent ?? { llmCalls: 0, llmTokens: 0, apiCalls: 0, costUsd: 0 },
    coverage: initialCtx.coverage ?? null,
    startedAt: new Date(),
    updatedAt: new Date(),
  };

  log('info', ctx, 'Démarrage de l\'orchestration');

  try {
    ctx.status = transitionRun(ctx.status, 'START');
    let coverageCheckHappened = false;

    for (const def of plan.steps) {
      if (signal.aborted) {
        ctx.status = transitionRun(ctx.status, 'CANCEL');
        log('warn', ctx, 'Run annulé par signal');
        break;
      }

      // Vérifier le budget avant chaque étape
      if (isBudgetExceeded(ctx.budget, ctx.budgetSpent)) {
        log('warn', ctx, 'Budget épuisé avant l\'étape ' + def.step, {
          spent: ctx.budgetSpent,
          budget: ctx.budget,
        });
        ctx.status = 'partial';
        break;
      }

      ctx.currentStep = def.step;
      ctx.status = transitionRun(ctx.status, 'STEP_COMPLETE');

      const stepResult = await executeStep(ctx, def, signal);

      // Si étape critique échoue → stop
      if (stepResult.status === 'failed' && !def.optional) {
        ctx.status = transitionRun(ctx.status, 'STEP_FAILED');
        log('error', ctx, `Étape critique ${def.step} échouée, arrêt du run`);
        break;
      }

      // Si étape optionnelle échoue → continue en partial
      if (stepResult.status === 'failed' && def.optional) {
        ctx.status = 'partial';
      }

      // Coverage check après clustering
      if (def.step === 'check_coverage') {
        coverageCheckHappened = true;
        if (ctx.coverage && !ctx.coverage.sufficient) {
          ctx.status = transitionRun(ctx.status, 'COVERAGE_INSUFFICIENT');
          log('warn', ctx, 'Couverture insuffisante', { coverage: ctx.coverage });
          break;
        }
        ctx.status = transitionRun(ctx.status, 'COVERAGE_OK');
      }
    }

    // Statut final
    if (!signal.aborted && ctx.status === 'running') {
      if (coverageCheckHappened || plan.steps.some(s => s.step === 'build_report')) {
        ctx.status = transitionRun(ctx.status, 'REPORT_ASSEMBLED');
        ctx.status = 'awaiting_review';
      } else if (ctx.steps.some(s => s.status === 'partial')) {
        ctx.status = 'partial';
      } else {
        ctx.status = 'completed';
      }
    }

    ctx.completedAt = new Date();
    ctx.updatedAt = new Date();

    log('info', ctx, 'Orchestration terminée', {
      finalStatus: ctx.status,
      totalSteps: ctx.steps.length,
      totalCost: ctx.budgetSpent.costUsd,
    });

    return { ctx, finalStatus: ctx.status };
  } catch (err) {
    ctx.completedAt = new Date();
    ctx.updatedAt = new Date();

    if (err instanceof Error && err.message?.includes('Transition invalide')) {
      ctx.status = 'failed';
    } else {
      ctx.status = 'failed';
    }

    const error = err instanceof Error ? err : new Error(String(err));
    log('error', ctx, 'Échec de l\'orchestration', { error: error.message });

    return { ctx, finalStatus: 'failed', error };
  }
}

/**
 * Construit le plan de workflow standard pour Viral Copilot.
 */
export function standardWorkflowPlan(
  overrides?: Partial<{
    thresholds: Partial<CoverageThresholds>;
    stepTimeouts: Partial<Record<WorkflowStep, number>>;
  }>,
): WorkflowPlan {
  const t = (step: WorkflowStep, def: number) => overrides?.stepTimeouts?.[step] ?? def;

  return {
    steps: [
      { step: 'check_quotas',        handler: noopHandler, timeoutMs: t('check_quotas', 30_000),    optional: false },
      { step: 'collect_tiktok',      handler: noopHandler, timeoutMs: t('collect_tiktok', 300_000),  optional: true },
      { step: 'collect_meta',        handler: noopHandler, timeoutMs: t('collect_meta', 300_000),    optional: true },
      { step: 'normalize_dedup',     handler: noopHandler, timeoutMs: t('normalize_dedup', 60_000),  optional: false },
      { step: 'save_snapshots',      handler: noopHandler, timeoutMs: t('save_snapshots', 60_000),   optional: false },
      { step: 'score_tiktok',        handler: noopHandler, timeoutMs: t('score_tiktok', 120_000),   optional: true },
      { step: 'score_meta',          handler: noopHandler, timeoutMs: t('score_meta', 120_000),     optional: true },
      { step: 'cluster_families',    handler: noopHandler, timeoutMs: t('cluster_families', 120_000), optional: false },
      { step: 'check_coverage',      handler: noopHandler, timeoutMs: t('check_coverage', 15_000),   optional: false },
      { step: 'analyze_signals',     handler: noopHandler, timeoutMs: t('analyze_signals', 180_000), optional: false },
      { step: 'build_report',        handler: noopHandler, timeoutMs: t('build_report', 120_000),    optional: false },
    ],
    thresholds: overrides?.thresholds,
  };
}

/**
 * Handler par défaut (à remplacer par les vrais handlers des packages connectors/scoring).
 * Chaque job Trigger.dev injectera son propre handler.
 */
async function noopHandler(ctx: RunContext, signal: AbortSignal): Promise<Partial<StepResult>> {
  return {
    status: 'success',
    metrics: { llmCalls: 0, llmTokens: 0, apiCalls: 0, costUsd: 0 },
  };
}