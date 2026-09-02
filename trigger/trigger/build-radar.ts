// =============================================================================
// Viral Copilot — Trigger.dev Task : Assemblage du Radar
// =============================================================================
// Vérifie la couverture minimale, analyse les signaux, produit le rapport
// final (Radar Report) avec les meilleures opportunités.
// =============================================================================

import { task } from '@trigger.dev/sdk/v3';
import { mainQueue } from './client.js';
import type {
  CoverageReport,
  CreativeFamily,
  ScoreResult,
  Opportunity,
  RadarReport,
  StepMetrics,
} from '@viral-copilot/workflows';
import { checkCoverage, DEFAULT_THRESHOLDS } from '@viral-copilot/workflows';

export interface BuildRadarPayload {
  runId: string;
  workspaceId: string;
  nicheId: string;
  nicheSlug: string;
  families: CreativeFamily[];
  scores: ScoreResult[];
  itemsBySource: Record<string, number>;
  totalItems: number;
  uniqueItems: number;
  cost: StepMetrics;
  periodStart: string;
  periodEnd: string;
}

export interface BuildRadarOutput {
  runId: string;
  workspaceId: string;
  nicheId: string;
  nicheSlug: string;
  coverage: CoverageReport;
  report: RadarReport | null;
  opportunityCount: number;
  status: 'complete' | 'partial' | 'insufficient_signal';
}

export const buildRadar = task({
  id: 'build-radar',
  description: 'Assemble le rapport radar avec les meilleures opportunités',
  queue: mainQueue,
  maxDuration: 300,
  run: async (payload: BuildRadarPayload) => {
    const {
      runId, workspaceId, nicheId,
      families, scores, itemsBySource, totalItems, uniqueItems,
      cost, periodStart, periodEnd,
    } = payload;

    console.log(`[build-radar] Assemblage du radar pour le run ${runId}`);

    // ── 1. Vérification de couverture ──────────────────────────────────────
    const coverage: CoverageReport = checkCoverage({
      itemsCollected: itemsBySource,
      itemsUnique: uniqueItems,
      itemsTotal: totalItems,
      thresholds: DEFAULT_THRESHOLDS,
    });

    console.log(`[build-radar] Couverture: ${coverage.coveragePct}% (${coverage.itemsUnique}/${coverage.minItemsRequired})`);

    if (!coverage.sufficient) {
      console.warn(`[build-radar] Couverture insuffisante: ${coverage.reason}`);
      return {
        runId,
        workspaceId,
        nicheId,
        nicheSlug: payload.nicheSlug,
        coverage,
        report: null,
        opportunityCount: 0,
        status: 'insufficient_signal' as const,
      };
    }

    // ── 2. Analyse des signaux / génération d'opportunités ────────────────
    // FR-030 : chaque affirmation a un evidence_id
    // FR-031 : why_now, confidence band, saturation, action window
    // FR-032 : diversifier par angle et format, pas de doublons

    const opportunities: Opportunity[] = families.map((family, i) => ({
      id: `opp-${runId}-${i + 1}`,
      familyId: family.id,
      name: family.name,
      summary: `Opportunité basée sur la famille "${family.name}" (${family.memberCount} observations)`,
      score: family.averageScore,
      confidence: scores
        .filter(s => family.members.includes(s.itemId))
        .reduce((sum, s) => sum + s.confidence, 0) / Math.max(family.memberCount, 1),
      whyItWorks: 'Analyse en cours — mécaniques extraites par le Signal Analyst',
      whyNow: `Fenêtre d'action: ${periodStart} → ${periodEnd}`,
      sources: [...new Set(
        scores.filter(s => family.members.includes(s.itemId)).map(s => s.source),
      )],
      evidenceIds: family.members,
      saturation: family.memberCount > 15 ? 'high' : family.memberCount > 5 ? 'medium' : 'low',
      actionWindow: `${family.memberCount} contenus observés sur la période`,
    }));

    // ── 3. Assemblage du rapport ───────────────────────────────────────────
    const report: RadarReport = {
      id: `radar-${runId}`,
      runId,
      nicheId,
      period: {
        start: new Date(periodStart),
        end: new Date(periodEnd),
      },
      sources: Object.keys(itemsBySource),
      coverage,
      status: 'complete',
      opportunities: opportunities.slice(0, 10),
      costs: cost,
      warnings: [],
      assembledAt: new Date(),
    };

    if (families.length === 0) {
      report.warnings.push('Aucune famille créative identifiée');
    }

    console.log(
      `[build-radar] Terminé : ${report.opportunities.length} opportunités, ${families.length} familles`,
    );

    return {
      runId,
      workspaceId,
      nicheId,
      nicheSlug: payload.nicheSlug,
      coverage,
      report,
      opportunityCount: report.opportunities.length,
      status: 'complete' as const,
    };
  },
});