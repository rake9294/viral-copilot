"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface ProductionBrief {
  duration: number;
  format: string;
  aspectRatio: string;
  visualStyle: string;
  audioDirection: string;
  references: string[];
  requirements: string[];
}

interface ProductionBriefProps {
  brief: ProductionBrief;
}

export function ProductionBrief({ brief }: ProductionBriefProps) {
  return (
    <Card className="bg-surface p-5 rounded-lg">
      <h4 className="font-display font-semibold text-heading-sm text-foreground mb-4">
        Brief de production
      </h4>

      <div className="grid grid-cols-3 gap-3 mb-4">
        <div className="bg-surface-elevated rounded-md p-3">
          <span className="text-label-sm text-subtle">Durée</span>
          <p className="font-display text-title-md text-foreground">
            {brief.duration}s
          </p>
        </div>
        <div className="bg-surface-elevated rounded-md p-3">
          <span className="text-label-sm text-subtle">Format</span>
          <p className="font-display text-title-md text-foreground">
            {brief.format}
          </p>
        </div>
        <div className="bg-surface-elevated rounded-md p-3">
          <span className="text-label-sm text-subtle">Ratio</span>
          <p className="font-display text-title-md text-foreground">
            {brief.aspectRatio}
          </p>
        </div>
      </div>

      <div className="space-y-3">
        <div>
          <span className="text-label-sm text-subtle">Style visuel</span>
          <p className="text-body-sm text-muted mt-1">{brief.visualStyle}</p>
        </div>
        <div>
          <span className="text-label-sm text-subtle">Direction audio</span>
          <p className="text-body-sm text-muted mt-1">{brief.audioDirection}</p>
        </div>
        <div>
          <span className="text-label-sm text-subtle">Références</span>
          <div className="flex flex-wrap gap-2 mt-1">
            {brief.references.map((ref, i) => (
              <Badge key={i} variant="neutral">
                {ref}
              </Badge>
            ))}
          </div>
        </div>
        <div>
          <span className="text-label-sm text-subtle">
            Équipement requis
          </span>
          <ul className="mt-1 space-y-1">
            {brief.requirements.map((req, i) => (
              <li key={i} className="text-body-sm text-muted pl-3 relative">
                <span className="absolute left-0 top-1.5 w-1.5 h-1.5 rounded-full bg-primary" />
                {req}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Card>
  );
}