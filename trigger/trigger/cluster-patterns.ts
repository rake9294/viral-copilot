// =============================================================================
// Viral Copilot — Trigger.dev Task : Clustering des Patterns
// =============================================================================
// Regroupe les contenus scorés en familles créatives par proximité
// sémantique et structurelle (embedding, angle, hook, format, CTA).
// =============================================================================

import { task } from '@trigger.dev/sdk/v3';
import { mainQueue } from './client.js';
import type { CreativeFamily, ScoreResult } from '@viral-copilot/workflows';

export interface ClusterPatternsPayload {
  runId: string;
  workspaceId: string;
  nicheId: string;
  scores: ScoreResult[];
  embeddings?: Record<string, number[]>;
}

export interface ClusterPatternsOutput {
  runId: string;
  familyCount: number;
  families: CreativeFamily[];
  threshold: number;
  status: 'success';
}

export const clusterPatterns = task({
  id: 'cluster-patterns',
  description: 'Regroupe les contenus en familles créatives par similarité',
  queue: mainQueue,
  maxDuration: 180,
  run: async (payload: ClusterPatternsPayload) => {
    const { runId, scores } = payload;

    console.log(`[cluster-patterns] Clustering de ${scores.length} items scorés`);

    // FR-023 : Familles créatives
    // - Seuil de similarité cosinus par défaut : 0.84
    // - Seuil versionné
    // - Chaque cluster conserve ses membres et sa période d'activité
    const SIMILARITY_THRESHOLD = 0.84;

    // TODO: Implémenter via le package scoring
    // 1. Calculer les embeddings si non fournis
    // 2. Clustering hiérarchique / DBSCAN
    // 3. Extraire l'angle dominant de chaque cluster

    const families: CreativeFamily[] = [];

    if (scores.length > 0) {
      const avgScore = scores.reduce((sum, s) => sum + s.score, 0) / scores.length;

      families.push({
        id: `family-${runId}-001`,
        name: 'Cluster principal',
        members: scores.map(s => s.itemId),
        dominantAngle: 'À déterminer par extraction d’angle',
        commonPatterns: [],
        period: {
          start: new Date(),
          end: new Date(),
        },
        averageScore: avgScore,
        memberCount: scores.length,
      });
    }

    console.log(`[cluster-patterns] ${families.length} familles créatives formées`);

    return {
      runId,
      familyCount: families.length,
      families,
      threshold: SIMILARITY_THRESHOLD,
      status: 'success' as const,
    };
  },
});