"use client";

import { Card } from "@/components/ui/card";

interface MetricTileProps {
  label: string;
  value: string | number;
  unit?: string;
  provenance?: string;
  trend?: "up" | "down" | "neutral";
}

export function MetricTile({
  label,
  value,
  unit,
  provenance,
  trend,
}: MetricTileProps) {
  return (
    <Card className="metric-tile bg-surface-elevated p-5 rounded-lg flex flex-col gap-1">
      <span className="text-label-sm text-subtle">{label}</span>
      <div className="flex items-baseline gap-1">
        <span className="font-display text-metric-md text-foreground">
          {typeof value === "number" ? value.toLocaleString() : value}
        </span>
        {unit && <span className="text-label-sm text-subtle">{unit}</span>}
        {trend && (
          <span
            className={`text-label-sm ml-1 ${
              trend === "up"
                ? "text-success"
                : trend === "down"
                  ? "text-danger"
                  : "text-subtle"
            }`}
          >
            {trend === "up" ? "↑" : trend === "down" ? "↓" : "→"}
          </span>
        )}
      </div>
      {provenance && (
        <span className="text-data-sm text-subtle">{provenance}</span>
      )}
    </Card>
  );
}