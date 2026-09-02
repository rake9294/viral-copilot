// =============================================================================
// Viral Copilot — Workflow Types
// =============================================================================
// États, événements, transitions et structures partagées de l'orchestration.
// =============================================================================

// ─── Run ────────────────────────────────────────────────────────────────────

/**
 * Statuts possibles d'un run de workflow.
 */
export type RunStatus =
  | 'queued'
  | 'running'
  | 'partial'
  | 'awaiting_review'
  | 'completed'
  | 'failed'
  | 'cancelled'
  | 'insufficient_signal';

/**
 * Événements de transition autorisés entre statuts.
 */
export type RunEvent =
  | 'START'
  | 'STEP_COMPLETE'
  | 'STEP_FAILED'
  | 'ALL_SOURCES_COLLECTED'
  | 'PARTIAL_COVERAGE'
  | 'COVERAGE_OK'
  | 'COVERAGE_INSUFFICIENT'
  | 'SCORING_DONE'
  | 'CLUSTERING_DONE'
  | 'REPORT_ASSEMBLED'
  | 'CANCEL'
  | 'RETRY';

/**
 * Table de transitions : depuis un statut, quels événements sont valides.
 */
export const RUN_TRANSITIONS: Record<RunStatus, Partial<Record<RunEvent, RunStatus>>> = {
  queued:                { START: 'running', CANCEL: 'cancelled' },
  running:               { STEP_COMPLETE: 'running', STEP_FAILED: 'partial', CANCEL: 'cancelled' },
  partial:               { ALL_SOURCES_COLLECTED: 'running', RETRY: 'running', CANCEL: 'cancelled' },
  awaiting_review:       { SCORING_DONE: 'running', COVERAGE_INSUFFICIENT: 'insufficient_signal', CANCEL: 'cancelled' },
  completed:             {},
  failed:                { RETRY: 'running' },
  cancelled:             {},
  insufficient_signal:   { RETRY: 'running' },
};

/**
 * Valide une transition d'état.
 */
export function transitionRun(current: RunStatus, event: RunEvent): RunStatus {
  const next = RUN_TRANSITIONS[current]?.[event];
  if (!next) {
    throw new Error(`Transition invalide : ${current} -> ${event}`);
  }
  return next;
}

// ─── Steps ───────────────────────────────────────────────────────────────────

/**
 * Identifiants des étapes du workflow.
 */
export type WorkflowStep =
  | 'check_quotas'
  | 'collect_tiktok'
  | 'collect_meta'
  | 'normalize_dedup'
  | 'save_snapshots'
  | 'score_tiktok'
  | 'score_meta'
  | 'cluster_families'
  | 'check_coverage'
  | 'analyze_signals'
  | 'build_report';

/**
 * Résultat d'une étape.
 */
export interface StepResult {
  step: WorkflowStep;
  status: 'success' | 'partial' | 'skipped' | 'failed';
  startedAt: Date;
  finishedAt: Date;
  durationMs: number;
  error?: string;
  metrics?: StepMetrics;
  sourceCount?: number;
  itemCount?: number;
}

export interface StepMetrics {
  llmCalls: number;
  llmTokens: number;
  apiCalls: number;
  costUsd: number;
}

// ─── Budget ──────────────────────────────────────────────────────────────────

export interface RunBudget {
  maxCostLlm: number;
  maxApiCalls: number;
  maxTokens: number;
  timeoutMinutes: number;
}

export const DEFAULT_BUDGET: RunBudget = {
  maxCostLlm: 5.00,
  maxApiCalls: 500,
  maxTokens: 500_000,
  timeoutMinutes: 30,
};

// ─── Run Context ─────────────────────────────────────────────────────────────

/**
 * Contexte complet d'un run, passé entre les jobs Trigger.dev.
 */
export interface RunContext {
  runId: string;
  workspaceId: string;
  nicheId: string;
  nicheSlug: string;

  status: RunStatus;
  steps: StepResult[];
  currentStep: WorkflowStep;

  budget: RunBudget;
  budgetSpent: StepMetrics;
  coverage: CoverageReport | null;

  startedAt: Date;
  updatedAt: Date;
  completedAt?: Date;
}

// ─── Coverage ────────────────────────────────────────────────────────────────

export interface CoverageReport {
  /** Nombre minimal d'items requis pour produire un rapport significatif */
  minItemsRequired: number;
  /** Items collectés toutes sources confondues */
  itemsCollected: number;
  /** Items uniques après dédoublonnage */
  itemsUnique: number;
  /** Pourcentage de couverture (itemsUnique / minItemsRequired) */
  coveragePct: number;
  /** La couverture est-elle suffisante ? */
  sufficient: boolean;
  /** Items par source */
  bySource: Record<string, number>;
  /** Raison si coverage insuffisante */
  reason?: string;
}

// ─── Idempotency ─────────────────────────────────────────────────────────────

export interface IdempotencyKey {
  workspaceId: string;
  nicheId: string;
  source: string;
  operation: string;
  queryHash: string;
  timeWindow: string; // ISO date or window label like '2026-09-02/2026-09-03'
}

// ─── Source Items ────────────────────────────────────────────────────────────

/**
 * Item collecté depuis une source (TikTok ou Meta).
 */
export interface RawSourceItem {
  source: 'tiktok' | 'meta';
  externalId: string;
  title?: string;
  description?: string;
  url?: string;
  thumbnailUrl?: string;
  metrics: Record<string, number>;
  publishedAt: Date;
  metadata: Record<string, unknown>;
}

/**
 * Item normalisé et dédoublonné.
 */
export interface NormalizedItem {
  id: string;
  source: 'tiktok' | 'meta';
  externalId: string;
  title: string;
  description: string;
  url: string;
  thumbnailUrl?: string;
  metrics: Record<string, number>;
  publishedAt: Date;
  normalizedAt: Date;
  fingerprint: string; // Hash pour dédoublonnage
  metadata: Record<string, unknown>;
}

// ─── Scoring ─────────────────────────────────────────────────────────────────

export interface ScoreResult {
  itemId: string;
  source: 'tiktok' | 'meta';
  score: number;
  confidence: number;
  dimensions: Record<string, number>; // nom de dimension → percentile
  cohortSize: number;
  scoredAt: Date;
}

// ─── Families / Clustering ───────────────────────────────────────────────────

export interface CreativeFamily {
  id: string;
  name: string;
  members: string[]; // itemIds
  dominantAngle: string;
  commonPatterns: string[];
  period: {
    start: Date;
    end: Date;
  };
  averageScore: number;
  memberCount: number;
}

// ─── Opportunity ─────────────────────────────────────────────────────────────

export interface Opportunity {
  id: string;
  familyId: string;
  name: string;
  summary: string;
  score: number;
  confidence: number;
  whyItWorks: string;
  whyNow: string;
  sources: string[];
  evidenceIds: string[];
  saturation: 'low' | 'medium' | 'high';
  actionWindow: string; // description lisible
}

// ─── Radar Report ────────────────────────────────────────────────────────────

export interface RadarReport {
  id: string;
  runId: string;
  nicheId: string;
  period: {
    start: Date;
    end: Date;
  };
  sources: string[];
  coverage: CoverageReport;
  status: 'complete' | 'partial';
  opportunities: Opportunity[];
  costs: StepMetrics;
  warnings: string[];
  assembledAt: Date;
}