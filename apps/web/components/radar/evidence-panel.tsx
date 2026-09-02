"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

interface EvidenceItem {
  id: string;
  type: string;
  content: string;
  url?: string;
}

interface EvidencePanelProps {
  evidence: EvidenceItem[];
  signalExplanation?: string;
}

export function EvidencePanel({ evidence, signalExplanation }: EvidencePanelProps) {
  const typeLabels: Record<string, string> = {
    post: "Post observé",
    trend: "Tendance",
    comment: "Analyse commentaires",
    metric: "Métrique agrégée",
  };

  const typeVariants: Record<string, "info" | "success" | "warning" | "neutral"> = {
    post: "info",
    trend: "success",
    comment: "warning",
    metric: "neutral",
  };

  return (
    <Card className="evidence-panel bg-surface p-6">
      <h4 className="font-display font-semibold text-heading-sm text-foreground mb-4">
        Preuves consultables
      </h4>

      {signalExplanation && (
        <>
          <div className="text-body-sm text-muted mb-4 p-3 bg-surface-elevated rounded-md">
            <span className="font-semibold text-foreground">Explication du signal :</span>{" "}
            {signalExplanation}
          </div>
          <Separator className="my-3" />
        </>
      )}

      <ul className="space-y-3">
        {evidence.map((item) => (
          <li key={item.id} className="flex items-start gap-3">
            <Badge variant={typeVariants[item.type] ?? "neutral"}>
              {typeLabels[item.type] ?? item.type}
            </Badge>
            <div className="flex-1 min-w-0">
              <p className="text-body-sm text-muted">{item.content}</p>
              {item.url && (
                <a
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-data-sm text-cobalt hover:underline mt-0.5 inline-block"
                >
                  Voir la source →
                </a>
              )}
            </div>
            <span className="text-data-sm text-subtle flex-shrink-0">
              {item.id}
            </span>
          </li>
        ))}
      </ul>
    </Card>
  );
}