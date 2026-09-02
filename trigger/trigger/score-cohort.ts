// =============================================================================
// Viral Copilot — Trigger.dev Task : Scoring des Cohorts
// =============================================================================
// Calcule les scores TikTok (organique) et Meta (publicité) pour chaque item
// collecté, en comparant chaque item à sa cohorte de pairs.
// =============================================================================

import { task } from '@trigger.dev/sdk/v3';
import { scoringQueue } from './client.js';
import type { ScoreResult } from '@viral-copilot/workflows';

export interface ScoreCohortPayload {
  runId: string;
  workspaceId: string;
  nicheId: string;
  source: 'tiktok' | 'meta';
  itemIds: string[];
}

export interface ScoreCohortOutput {
  runId: string;
  source: 'tiktok' | 'meta';
  scores: ScoreResult[];
  totalScored: number;
  status: 'success';
}

export const scoreCohort = task({
  id: 'score-cohort',
  description: 'Calcule les scores TikTok ou Meta pour les items d’un run',
  queue: scoringQueue,
  maxDuration: 180,
  retry: {
    maxAttempts: 3,
    minTimeoutInMs: 2_000,
    maxTimeoutInMs: 20_000,
    factor: 2,
  },
  run: async (payload: ScoreCohortPayload) => {
    const { runId, source, itemIds } = payload;

    console.log(`[score-cohort] Scoring ${source} : ${itemIds.length} items`);

    // FR-021 : Score TikTok
    //   - surperformance, vélocité, qualité d'engagement, persistance
    //   - réplication inter-comptes, adéquation niche
    //   - comparaison par cohort (pays, langue, taille, âge, format, niche)
    //   - chaque dimension → percentile
    //   - poids initiaux égaux
    //
    // FR-022 : Score Meta Ads
    //   - longévité, momentum, variantes créatives
    //   - étendue géographique, récurrence de l'angle
    //   - cohérence annonce / landing page (si autorisée)

    // TODO: Implémenter via le package scoring
    const scores: ScoreResult[] = itemIds.map((itemId) => ({
      itemId,
      source,
      score: 0,
      confidence: 0,
      dimensions: {
        outperformance: 50,
        velocity: 50,
        engagement: 50,
        persistence: 50,
      },
      cohortSize: itemIds.length,
      scoredAt: new Date(),
    }));

    const scored = scores.filter(s => s.score > 0).length;
    console.log(`[score-cohort] ${source} terminé : ${scored}/${scores.length} scorés`);

    return {
      runId,
      source,
      scores,
      totalScored: scored,
      status: 'success' as const,
    };
  },
});