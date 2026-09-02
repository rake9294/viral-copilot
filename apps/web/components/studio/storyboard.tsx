"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface StoryboardItem {
  shot: number;
  duration: number;
  description: string;
  visual: string;
  audio: string;
  text?: string;
}

interface StoryboardProps {
  storyboard: StoryboardItem[];
}

export function Storyboard({ storyboard }: StoryboardProps) {
  return (
    <Card className="bg-surface p-5 rounded-lg">
      <h4 className="font-display font-semibold text-heading-sm text-foreground mb-4">
        Storyboard — {storyboard.length} plans
      </h4>
      <div className="space-y-3">
        {storyboard.map((shot) => (
          <div
            key={shot.shot}
            className="flex gap-4 bg-surface-elevated rounded-md p-4 border border-border/30"
          >
            <div className="flex-shrink-0 w-12 h-12 rounded-md bg-background flex items-center justify-center text-heading-sm font-display text-primary">
              {shot.shot}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <Badge variant="neutral">{shot.duration}s</Badge>
                {shot.text && <Badge variant="primary">Texte</Badge>}
              </div>
              <p className="text-body-sm text-foreground font-medium">
                {shot.description}
              </p>
              <div className="grid grid-cols-2 gap-3 mt-2 text-data-sm">
                <div>
                  <span className="text-subtle">Visuel :</span>{" "}
                  <span className="text-muted">{shot.visual}</span>
                </div>
                <div>
                  <span className="text-subtle">Audio :</span>{" "}
                  <span className="text-muted">{shot.audio}</span>
                </div>
              </div>
              {shot.text && (
                <div className="mt-1 text-data-sm text-cobalt">
                  Texte : {shot.text}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}