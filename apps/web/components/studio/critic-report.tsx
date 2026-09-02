"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

type CriticVerdict = "pass" | "revise" | "reject";

interface CriticReportData {
  verdict: CriticVerdict;
  score: number;
  feedback: string;
  improvements: string[];
}

interface CriticReportProps {
  report: CriticReportData;
}

const verdictConfig: Record<
  CriticVerdict,
  { label: string; variant: "success" | "warning" | "danger" }
> = {
  pass: { label: "Approuvé", variant: "success" },
  revise: { label: "À réviser", variant: "warning" },
  reject: { label: "Rejeté", variant: "danger" },
};

export function CriticReport({ report }: CriticReportProps) {
  const config = verdictConfig[report.verdict];
  return (
    <Card className="bg-surface p-5 rounded-lg">
      <div className="flex items-center justify-between mb-4">
        <h4 className="font-display font-semibold text-heading-sm text-foreground">
          Rapport du Critic
        </h4>
        <Badge variant={config.variant as "success" | "warning" | "danger" | "info" | "neutral" | null | undefined}>{config.label}</Badge>
      </div>

      <div className="flex items-center gap-2 mb-3">
        <span className="font-display text-metric-md text-foreground">
          {report.score}
          <span className="text-label-sm text-subtle ml-1">/100</span>
        </span>
      </div>

      <p className="text-body-sm text-muted mb-3">{report.feedback}</p>

      {report.improvements.length > 0 && (
        <div>
          <span className="text-label-sm text-subtle">Améliorations</span>
          <ul className="mt-1 space-y-1">
            {report.improvements.map((item, i) => (
              <li
                key={i}
                className="text-body-sm text-muted pl-3 relative before:absolute before:left-0 before:top-1.5 before:w-1.5 before:h-1.5 before:rounded-full before:bg-primary"
              >
                {item}
              </li>
            ))}
          </ul>
        </div>
      )}
    </Card>
  );
}