"use client";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import type { SourceCoverage } from "@viral-copilot/agent-contracts";

interface CoveragePanelProps {
  sources: SourceCoverage[];
  status: "sufficient" | "insufficient_coverage" | "partial";
  summary: string;
}

export function CoveragePanel({
  sources,
  status,
  summary,
}: CoveragePanelProps) {
  const statusBadge = {
    sufficient: { variant: "success" as const, label: "Suffisante" },
    partial: { variant: "warning" as const, label: "Partielle" },
    insufficient_coverage: { variant: "danger" as const, label: "Insuffisante" },
  }[status];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-3">
          Couverture
          <Badge variant={statusBadge.variant}>{statusBadge.label}</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p
          className="mb-4 text-sm"
          style={{ color: "var(--color-subtle)" }}
        >
          {summary}
        </p>
        <div className="flex flex-col gap-3">
          {sources.map((source) => (
            <CoverageRow key={source.source} source={source} />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function CoverageRow({ source }: { source: SourceCoverage }) {
  const labels: Record<string, string> = {
    tiktok: "TikTok",
    meta_ads: "Meta Ads",
    trend: "Tendance",
    cohort: "Cohorte",
  };

  const sourceBadge: Record<string, "tiktok" | "meta" | "neutral" | "primary"> = {
    tiktok: "tiktok",
    meta_ads: "meta",
    trend: "neutral",
    cohort: "primary",
  };

  return (
    <div
      className="flex items-center justify-between rounded-[var(--radius-md)] px-4 py-3"
      style={{
        backgroundColor: "var(--color-surface-elevated)",
      }}
    >
      <div className="flex items-center gap-3">
        <Badge variant={sourceBadge[source.source] ?? "neutral"}>
          {labels[source.source] ?? source.source}
        </Badge>
        <span className="text-sm" style={{ fontFamily: "var(--font-data-sm)" }}>
          {source.actualCount} / {source.threshold}
        </span>
      </div>
      {source.met ? (
        <span
          className="text-sm font-medium"
          style={{ color: "var(--color-success)" }}
        >
          ✓ OK
        </span>
      ) : (
        <span
          className="text-sm font-medium"
          style={{ color: "var(--color-danger)" }}
        >
          ✗ Insuffisant
        </span>
      )}
    </div>
  );
}