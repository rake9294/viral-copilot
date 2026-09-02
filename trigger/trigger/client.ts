// =============================================================================
// Viral Copilot — Trigger.dev Client & Queue Config
// =============================================================================
// Configuration partagée pour les tasks Trigger.dev v3.
// =============================================================================

import { queue } from '@trigger.dev/sdk/v3';

/**
 * Queue principale pour les runs Viral Copilot.
 * Limite la concurrence à 1 run par workspace à la fois.
 */
export const mainQueue = queue({
  name: 'viral-copilot-main',
});

/**
 * Queue de collecte pour les appels API externes.
 * Concurrence limitée pour respecter les rate limits.
 */
export const collectQueue = queue({
  name: 'viral-copilot-collect',
  concurrencyLimit: 2,
});

/**
 * Queue de scoring pour les traitements LLM.
 */
export const scoringQueue = queue({
  name: 'viral-copilot-scoring',
  concurrencyLimit: 3,
});