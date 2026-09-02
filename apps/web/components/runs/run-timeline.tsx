"use client";

import type { ScanRun } from "@/lib/fixtures";
import { Badge } from "@/components/ui/badge";

interface RunTimelineProps {
  runs: ScanRun[];
}

const statusConfig: Record<
  string,
  { label: string; variant: "success" | "warning" | "danger" | "info" | "neutral" }
> = {
  completed: { label: "Terminé", variant: "success" },
  partial: { label: "Partiel", variant: "warning" },
  insufficient_signal: { label: "Signal insuffisant", variant: "danger" },
  running: { label: "En cours", variant: "info" },
  failed: { label: "Échec", variant: "danger" },
  queued: { label: "En attente", variant: "neutral" },
};

export function RunTimeline({ runs }: RunTimelineProps) {
  return (
    <div className="space-y-3">
      {runs.map((run) => {
        const config = statusConfig[run.status] ?? {
          label: run.status,
          variant: "neutral" as const,
        };
        return (
          <div
            key={run.id}
            className="flex items-start gap-4 bg-surface rounded-lg p-4 border border-border/30"
          >
            <div
              className={`flex-shrink-0 w-3 h-3 rounded-full mt-1.5 ${
                run.status === "running"
                  ? "bg-info animate-pulse"
                  : run.status === "completed"
                    ? "bg-success"
                    : run.status === "failed" || run.status === "insufficient_signal"
                      ? "bg-danger"
                      : run.status === "partial"
                        ? "bg-warning"
                        : "bg-subtle"
              }`}
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <Badge variant={config.variant}>{config.label}</Badge>
                <span className="text-data-sm text-subtle font-mono shrink-0">
                  {run.id}
                </span>
              </div>
              <div className="flex items-center gap-4 mt-2 text-data-sm text-subtle">
                <span>
                  {run.startedAt.toLocaleDateString("fr-FR", {
                    day: "numeric",
                    month: "short",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
                {run.duration && <span>{run.duration}s</span>}
                {run.costCredits !== null && (
                  <span>{run.costCredits.toFixed(1)} crédits</span>
                )}
              </div>
              {run.errorMessage && (
                <p className="text-body-sm text-danger mt-2">
                  {run.errorMessage}
                </p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}