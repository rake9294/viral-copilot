"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface SimilarityReport {
  existingContent: string[];
  similarityScore: number;
  concerns: string[];
}

export function SimilarityReport({ report }: { report: SimilarityReport }) {
  return (
    <Card className="bg-surface p-5 rounded-lg border border-warning/20">
      <div className="flex items-center justify-between mb-4">
        <h4 className="font-display font-semibold text-heading-sm text-foreground">
          Rapport anti-copie
        </h4>
        <Badge
          variant={
            report.similarityScore < 30
              ? "success"
              : report.similarityScore < 50
                ? "warning"
                : "danger"
          }
        >
          {report.similarityScore}% similarité
        </Badge>
      </div>

      <div className="space-y-3">
        <div>
          <span className="text-label-sm text-subtle">
            Contenu existant similaire
          </span>
          <ul className="mt-1 space-y-1">
            {report.existingContent.map((content, i) => (
              <li
                key={i}
                className="text-body-sm text-muted pl-3 relative before:absolute before:left-0 before:top-1.5 before:w-1.5 before:h-1.5 before:rounded-full before:bg-cobalt"
              >
                {content}
              </li>
            ))}
          </ul>
        </div>

        <div>
          <span className="text-label-sm text-subtle">Points de vigilance</span>
          <ul className="mt-1 space-y-1">
            {report.concerns.map((concern, i) => (
              <li
                key={i}
                className="text-body-sm text-warning pl-3 relative before:absolute before:left-0 before:top-1.5 before:w-1.5 before:h-1.5 before:rounded-full before:bg-warning"
              >
                {concern}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Card>
  );
}