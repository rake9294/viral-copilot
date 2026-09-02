// =============================================================================
// Viral Copilot — Coverage Checker
// =============================================================================
// Vérifie que la collecte a atteint les seuils minimaux pour un run.
// =============================================================================

import type { CoverageReport } from './types.js';

/**
 * Seuils de couverture par défaut.
 */
export interface CoverageThresholds {
  /** Nombre total d'items uniques requis */
  minTotalItems: number;
  /** Au moins une source doit avoir contribué */
  minSourcesWithData: number;
  /** Ratio items utiles / items bruts minimum */
  minUsefulRatio: number;
}

export const DEFAULT_THRESHOLDS: CoverageThresholds = {
  minTotalItems: 10,
  minSourcesWithData: 1,
  minUsefulRatio: 0.5,
};

/**
 * Vérifie la couverture d'un run.
 */
export function checkCoverage(params: {
  itemsCollected: Record<string, number>;
  itemsUnique: number;
  itemsTotal: number;
  thresholds?: Partial<CoverageThresholds>;
}): CoverageReport {
  const thresholds = { ...DEFAULT_THRESHOLDS, ...params.thresholds };

  const itemsCollected = params.itemsTotal;
  const itemsUnique = params.itemsUnique;
  const coveragePct = itemsCollected > 0
    ? Math.round((itemsUnique / Math.max(thresholds.minTotalItems, itemsCollected)) * 100)
    : 0;

  const sufficient = itemsUnique >= thresholds.minTotalItems
    && Object.keys(params.itemsCollected).length >= thresholds.minSourcesWithData
    && (itemsCollected > 0 ? itemsUnique / itemsCollected >= thresholds.minUsefulRatio : false);

  const reasons: string[] = [];
  if (itemsUnique < thresholds.minTotalItems) {
    reasons.push(
      `Items insuffisants: ${itemsUnique} / ${thresholds.minTotalItems} requis`,
    );
  }
  if (Object.keys(params.itemsCollected).length < thresholds.minSourcesWithData) {
    reasons.push(
      `Pas assez de sources actives: ${Object.keys(params.itemsCollected).length} / ${thresholds.minSourcesWithData}`,
    );
  }
  if (itemsCollected > 0 && itemsUnique / itemsCollected < thresholds.minUsefulRatio) {
    reasons.push(`Ratio utile trop bas: ${itemsUnique}/${itemsCollected}`);
  }

  return {
    minItemsRequired: thresholds.minTotalItems,
    itemsCollected,
    itemsUnique,
    coveragePct,
    sufficient,
    bySource: params.itemsCollected,
    reason: reasons.length > 0 ? reasons.join('; ') : undefined,
  };
}

/**
 * Calcule le nombre d'items minimum requis étant donné la diversité des sources.
 * Plus il y a de sources, plus le seuil monte.
 */
export function dynamicMinItems(activeSources: number): number {
  // base 10 items, +5 par source additionnelle
  return Math.max(10, 10 + (activeSources - 1) * 5);
}