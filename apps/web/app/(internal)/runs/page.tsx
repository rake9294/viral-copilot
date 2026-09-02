"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { RunTimeline } from "@/components/runs/run-timeline";
import { RunCost } from "@/components/runs/run-cost";
import { mockRuns } from "@/lib/fixtures";

const statusLabels: Record<string, string> = {
  completed: "Terminé",
  partial: "Partiel",
  insufficient_signal: "Signal insuffisant",
  running: "En cours",
  failed: "Échec",
  queued: "En attente",
};

export default function RunsPage() {
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
  const filtered = selectedStatus
    ? mockRuns.filter((r) => r.status === selectedStatus)
    : mockRuns;

  const totalCost =
    mockRuns.reduce((sum, r) => sum + (r.costCredits ?? 0), 0);
  const avgCost =
    mockRuns.filter((r) => r.costCredits !== null).length > 0
      ? totalCost /
        mockRuns.filter((r) => r.costCredits !== null).length
      : 0;
  const modelsUsed = [
    ...new Set(mockRuns.map((r) => r.modelUsed).filter(Boolean)),
  ] as string[];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <p className="text-label-sm text-subtle uppercase tracking-wider">
            Historique
          </p>
          <h2 className="font-display font-semibold text-heading-lg text-foreground mt-1">
            Runs
          </h2>
        </div>
        <Button variant="ghost">Tout rejouer</Button>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
        <RunCost
          totalCost={totalCost}
          runCount={mockRuns.length}
          avgCost={avgCost}
          model={modelsUsed[0]}
        />
        <div className="bg-surface rounded-lg p-4">
          <span className="text-label-sm text-subtle">Réussite</span>
          <p className="font-display text-metric-md text-success mt-1">
            {Math.round(
              (mockRuns.filter((r) => r.status === "completed").length /
                mockRuns.length) *
                100
            )}
            <span className="text-label-sm text-subtle ml-1">%</span>
          </p>
        </div>
        <div className="bg-surface rounded-lg p-4">
          <span className="text-label-sm text-subtle">Modèles utilisés</span>
          <div className="mt-1 space-y-0.5">
            {modelsUsed.map((m) => (
              <p key={m} className="text-body-sm text-muted font-mono">
                {m}
              </p>
            ))}
          </div>
        </div>
        <div className="bg-surface rounded-lg p-4">
          <span className="text-label-sm text-subtle">Erreurs</span>
          <p className="font-display text-metric-md text-danger mt-1">
            {mockRuns.filter((r) => r.status === "failed").length}
          </p>
        </div>
      </div>

      {/* Status filter */}
      <div className="flex items-center gap-2 flex-wrap">
        <Button
          variant={selectedStatus === null ? "secondary" : "ghost"}
          size="sm"
          onClick={() => setSelectedStatus(null)}
        >
          Tous
        </Button>
        {Object.entries(statusLabels).map(([key, label]) => (
          <Button
            key={key}
            variant={selectedStatus === key ? "secondary" : "ghost"}
            size="sm"
            onClick={() => setSelectedStatus(key)}
          >
            {label}
          </Button>
        ))}
      </div>

      {/* Timeline */}
      <div>
        <h3 className="font-display font-semibold text-heading-sm text-foreground mb-4">
          Timeline ({filtered.length} runs)
        </h3>
        {filtered.length > 0 ? (
          <RunTimeline runs={filtered} />
        ) : (
          <div className="bg-surface rounded-xl p-8 text-center text-body-md text-subtle">
            Aucun run avec ce statut
          </div>
        )}
      </div>
    </div>
  );
}