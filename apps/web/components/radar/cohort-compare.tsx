"use client";

import { Card } from "@/components/ui/card";

interface CohortCompareProps {
  baseline: string;
  uplift: number;
  sampleSize: number;
}

export function CohortCompare({
  baseline,
  uplift,
  sampleSize,
}: CohortCompareProps) {
  return (
    <Card className="bg-surface p-5 rounded-lg">
      <h4 className="font-display font-semibold text-heading-sm text-foreground mb-3">
        Cohorte de comparaison
      </h4>
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-body-sm text-muted">Baseline</span>
          <span className="text-body-sm text-foreground">{baseline}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-body-sm text-muted">Uplift</span>
          <span className="font-display text-metric-md text-success">
            +{uplift}%
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-body-sm text-muted">Taille échantillon</span>
          <span className="text-body-sm text-foreground">
            {sampleSize} posts
          </span>
        </div>
        <div className="mt-2 bg-surface-elevated rounded-md p-3">
          <div className="flex items-end gap-1 h-12">
            <div className="flex-1 bg-subtle/30 rounded-t-sm h-8 relative">
              <span className="absolute -top-4 left-1 text-data-sm text-subtle">
                Baseline
              </span>
            </div>
            <div
              className="flex-1 bg-gradient-signal-hot rounded-t-sm relative"
              style={{ height: `${Math.min(8 + (uplift / 400) * 100, 100)}%` }}
            >
              <span className="absolute -top-4 left-1 text-data-sm text-success">
                +{uplift}%
              </span>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}