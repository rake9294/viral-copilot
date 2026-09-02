"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { OpportunityCard } from "@/components/radar/opportunity-card";
import { MetricTile } from "@/components/radar/metric-tile";
import { mockRadars, mockOpportunities, mockRuns } from "@/lib/fixtures";

const sourceLabels: Record<string, string> = {
  tiktok: "TikTok",
  meta: "Meta",
};

const statusLabels: Record<string, string> = {
  completed: "Complet",
  partial: "Partiel",
  insufficient_signal: "Signal insuffisant",
  running: "En cours",
  failed: "Échec",
};

const statusVariants: Record<string, "success" | "warning" | "danger" | "info"> = {
  completed: "success",
  partial: "warning",
  insufficient_signal: "danger",
  running: "info",
  failed: "danger",
};

export default function RadarPage() {
  const [selectedSource, setSelectedSource] = useState<string | null>(null);
  const activeRadar = mockRadars[0];
  const filtered = selectedSource
    ? mockOpportunities.filter((o) => o.source === selectedSource)
    : mockOpportunities;

  return (
    <div className="animate-radar-reveal space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <p className="text-label-sm text-subtle uppercase tracking-wider">Radar</p>
          <h2 className="font-display font-semibold text-heading-lg text-foreground mt-1">
            Dernier scan
          </h2>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="success">Système prêt</Badge>
          <Button variant="primary">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="mr-2">
              <polygon points="5 3 19 12 5 21 5 3" />
            </svg>
            Lancer le radar
          </Button>
        </div>
      </div>

      {/* Active radar status */}
      {activeRadar && (
        <div className="bg-surface rounded-lg p-5 border border-border/30 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-surface-glow pointer-events-none" />
          <div className="flex items-center justify-between relative z-10">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-success animate-pulse" />
              <div>
                <p className="text-title-md text-foreground font-semibold">
                  {activeRadar.name}
                </p>
                <p className="text-body-sm text-subtle">
                  {activeRadar.source === "tiktok" ? "TikTok" : "Meta"} · {activeRadar.frequency} · Dernier run il y a 2h
                </p>
              </div>
            </div>
            <Badge variant="success">
              {statusLabels[activeRadar.status]}
            </Badge>
          </div>
          {/* Signal sweep line */}
          {activeRadar.status === "running" && (
            <div className="h-[2px] bg-gradient-signal-spectrum mt-4 animate-signal-sweep" />
          )}
        </div>
      )}

      {/* Source filter */}
      <div className="flex items-center gap-2 flex-wrap">
        <Button
          variant={selectedSource === null ? "secondary" : "ghost"}
          size="sm"
          onClick={() => setSelectedSource(null)}
        >
          Tous
        </Button>
        <Button
          variant={selectedSource === "tiktok" ? "secondary" : "ghost"}
          size="sm"
          onClick={() => setSelectedSource("tiktok")}
        >
          <span className="w-2 h-2 rounded-full bg-tiktok mr-2" />
          TikTok
        </Button>
        <Button
          variant={selectedSource === "meta" ? "secondary" : "ghost"}
          size="sm"
          onClick={() => setSelectedSource("meta")}
        >
          <span className="w-2 h-2 rounded-full bg-meta mr-2" />
          Meta
        </Button>
      </div>

      {/* Metrics grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <MetricTile
          label="Signaux analysés"
          value={84}
          provenance="3 runs"
          trend="up"
        />
        <MetricTile
          label="Opportunités"
          value={3}
          provenance="Dont 1 acceptée"
        />
        <MetricTile
          label="Score moyen"
          value={75}
          unit="/100"
          provenance="Sur 3 opportunités"
          trend="up"
        />
      </div>

      {/* Latest run info */}
      {mockRuns[0] && (
        <div className="flex items-center gap-4 text-body-sm text-subtle bg-surface-elevated rounded-md p-3">
          <span className="font-mono">run-001</span>
          <Separator orientation="vertical" className="h-4" />
          <span>Modèle: gpt-4o-2026-08-15</span>
          <Separator orientation="vertical" className="h-4" />
          <span>{mockRuns[0].duration}s</span>
          <Separator orientation="vertical" className="h-4" />
          <span>{mockRuns[0].costCredits} crédits</span>
          <Separator orientation="vertical" className="h-4" />
          <span className="text-success">Status: {statusLabels[mockRuns[0].status]}</span>
        </div>
      )}

      {/* Opportunities */}
      <div>
        <h3 className="font-display font-semibold text-heading-sm text-foreground mb-4">
          Opportunités ({filtered.length})
        </h3>
        {filtered.length > 0 ? (
          <div className="space-y-3">
            {filtered.map((opp) => (
              <OpportunityCard key={opp.id} opportunity={opp} />
            ))}
          </div>
        ) : (
          <div className="bg-surface rounded-xl p-8 text-center text-body-md text-subtle">
            Aucune opportunité pour cette source
          </div>
        )}
      </div>
    </div>
  );
}