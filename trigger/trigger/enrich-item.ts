// =============================================================================
// Viral Copilot — Trigger.dev Task : Enrichissement
// =============================================================================
// Normalise, déduplique et enregistre les snapshots métriques après collecte.
// =============================================================================

import { task } from '@trigger.dev/sdk/v3';
import { mainQueue } from './client.js';

export interface EnrichItemPayload {
  runId: string;
  workspaceId: string;
  nicheId: string;
  items: Array<{
    source: 'tiktok' | 'meta';
    externalId: string;
    title?: string;
    description?: string;
    url?: string;
    metrics: Record<string, number>;
    publishedAt: string;
  }>;
}

export interface EnrichItemOutput {
  runId: string;
  workspaceId: string;
  normalizedCount: number;
  duplicatesRemoved: number;
  snapshotsCreated: number;
  status: 'success';
}

export const enrichItem = task({
  id: 'enrich-item',
  description: 'Normalise, déduplique et enregistre les snapshots métriques',
  queue: mainQueue,
  maxDuration: 120,
  run: async (payload: EnrichItemPayload) => {
    const { items, runId } = payload;

    console.log(`[enrich-item] Enrichissement de ${items.length} items pour le run ${runId}`);

    // TODO: Implémenter via le package database
    // 1. Normaliser les métriques (percentiles, ratios)
    // 2. Dédoublonner par fingerprint
    // 3. Enregistrer les snapshots métriques
    // 4. Retourner les items normalisés

    const normalizedCount = items.length;
    const duplicatesRemoved = 0;
    const snapshotsCreated = items.length;

    console.log(`[enrich-item] Normalisé: ${normalizedCount}, doublons: ${duplicatesRemoved}, snapshots: ${snapshotsCreated}`);

    return {
      runId,
      workspaceId: payload.workspaceId,
      normalizedCount,
      duplicatesRemoved,
      snapshotsCreated,
      status: 'success' as const,
    };
  },
});