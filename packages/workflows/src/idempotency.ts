// =============================================================================
// Viral Copilot — Idempotency
// =============================================================================
// Gestion des clés d'idempotence pour garantir qu'une même opération ne soit
// pas exécutée plusieurs fois avec les mêmes entrées.
// =============================================================================

import { createHash } from 'node:crypto';
import type { IdempotencyKey } from './types.js';

/**
 * Construit une clé d'idempotence normalisée.
 */
export function buildIdempotencyKey(params: IdempotencyKey): string {
  const raw = [
    params.workspaceId,
    params.nicheId,
    params.source,
    params.operation,
    params.queryHash,
    params.timeWindow,
  ].join('|');

  return createHash('sha256').update(raw).digest('hex');
}

/**
 * Format d'enregistrement en base.
 */
export interface IdempotencyRecord {
  key: string;
  status: 'pending' | 'running' | 'done' | 'failed';
  resultHash?: string;
  cachedResult?: unknown;
  createdAt: Date;
  updatedAt: Date;
  expiresAt: Date;
}

/**
 * Durée de vie par défaut d'un cache idempotent (48h).
 */
export const IDEMPOTENCY_TTL_MS = 48 * 60 * 60 * 1000;

/**
 * Calcule une date d'expiration.
 */
export function expirationDate(ttlMs: number = IDEMPOTENCY_TTL_MS): Date {
  return new Date(Date.now() + ttlMs);
}

/**
 * Hash le contenu d'un résultat pour détecter les changements.
 */
export function hashResult(data: unknown): string {
  const serialized = JSON.stringify(data);
  return createHash('sha256').update(serialized).digest('hex');
}

/**
 * Construit le queryHash à partir d'une requête normalisée (objets triés).
 */
export function buildQueryHash(query: Record<string, unknown>): string {
  const sorted = Object.keys(query)
    .sort()
    .reduce<Record<string, unknown>>((acc, k) => {
      acc[k] = query[k];
      return acc;
    }, {});

  return createHash('sha256')
    .update(JSON.stringify(sorted))
    .digest('hex');
}

// ─── Time window helpers ─────────────────────────────────────────────────────

/**
 * Génère une fenêtre temporelle au format ISO pour l'idempotence.
 * Exemple : "2026-09-02T00:00:00.000Z/2026-09-03T00:00:00.000Z"
 */
export function buildTimeWindow(start: Date, end: Date): string {
  return `${start.toISOString()}/${end.toISOString()}`;
}

/**
 * Fenêtre quotidienne pour un run.
 */
export function dailyWindow(date: Date = new Date()): string {
  const start = new Date(date);
  start.setUTCHours(0, 0, 0, 0);
  const end = new Date(start);
  end.setUTCDate(end.getUTCDate() + 1);
  return buildTimeWindow(start, end);
}