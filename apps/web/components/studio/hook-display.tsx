"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface Hooks {
  visual: string;
  verbal: string;
  onScreenText: string;
}

interface HookDisplayProps {
  hooks: Hooks;
}

export function HookDisplay({ hooks }: HookDisplayProps) {
  const hookTypes = [
    { key: "visual" as const, label: "Hook visuel", icon: "👁" },
    { key: "verbal" as const, label: "Hook verbal", icon: "🎤" },
    { key: "onScreenText" as const, label: "Texte écran", icon: "📝" },
  ];

  return (
    <Card className="bg-surface p-5 rounded-lg">
      <h4 className="font-display font-semibold text-heading-sm text-foreground mb-4">
        3 Hooks
      </h4>
      <div className="space-y-3">
        {hookTypes.map(({ key, label, icon }) => (
          <div
            key={key}
            className="bg-surface-elevated rounded-md p-4 border border-border/30"
          >
            <div className="flex items-center gap-2 mb-2">
              <span className="text-lg">{icon}</span>
              <Badge variant="neutral">{label}</Badge>
            </div>
            <p className="text-body-sm text-muted">{hooks[key]}</p>
          </div>
        ))}
      </div>
    </Card>
  );
}