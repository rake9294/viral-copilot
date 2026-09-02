"use client";

import { Card } from "@/components/ui/card";

interface RunCostProps {
  totalCost: number;
  runCount: number;
  avgCost: number;
  model?: string;
}

export function RunCost({ totalCost, runCount, avgCost, model }: RunCostProps) {
  return (
    <Card className="bg-surface p-5 rounded-lg">
      <h4 className="font-display font-semibold text-heading-sm text-foreground mb-4">
        Coûts
      </h4>
      <div className="space-y-3">
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-surface-elevated rounded-md p-3">
            <span className="text-label-sm text-subtle">Total</span>
            <p className="font-display text-metric-md text-foreground">
              {totalCost.toFixed(1)}
              <span className="text-label-sm text-subtle ml-1">crédits</span>
            </p>
          </div>
          <div className="bg-surface-elevated rounded-md p-3">
            <span className="text-label-sm text-subtle">Moyen</span>
            <p className="font-display text-metric-md text-foreground">
              {avgCost.toFixed(1)}
              <span className="text-label-sm text-subtle ml-1">crédits</span>
            </p>
          </div>
          <div className="bg-surface-elevated rounded-md p-3">
            <span className="text-label-sm text-subtle">Runs</span>
            <p className="font-display text-metric-md text-foreground">
              {runCount}
            </p>
          </div>
        </div>
        {model && (
          <div className="text-data-sm text-subtle">
            Modèle principal : <span className="text-muted">{model}</span>
          </div>
        )}
      </div>
    </Card>
  );
}