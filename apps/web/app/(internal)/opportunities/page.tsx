"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { OpportunityCard } from "@/components/radar/opportunity-card";
import { MetricTile } from "@/components/radar/metric-tile";
import { mockOpportunities, mockRuns } from "@/lib/fixtures";

export default function OpportunitiesPage() {
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);

  const statusFilters = [
    { key: null, label: "Toutes" },
    { key: "pending_review", label: "En attente" },
    { key: "accepted", label: "Acceptées" },
    { key: "modified", label: "Modifiées" },
    { key: "rejected", label: "Rejetées" },
  ];

  const filtered = selectedStatus
    ? mockOpportunities.filter((o) => o.status === selectedStatus)
    : mockOpportunities;

  return (
    <div className="space-y-6">
      <div>
        <p className="text-label-sm text-subtle uppercase tracking-wider">Gestion</p>
        <h2 className="font-display font-semibold text-heading-lg text-foreground mt-1">
          Opportunités
        </h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <MetricTile
          label="Total"
          value={mockOpportunities.length}
          provenance="Découvertes"
        />
        <MetricTile
          label="Acceptées"
          value={mockOpportunities.filter((o) => o.status === "accepted").length}
          trend="up"
        />
        <MetricTile
          label="En attente"
          value={mockOpportunities.filter((o) => o.status === "pending_review").length}
        />
      </div>

      <div className="flex items-center gap-2 flex-wrap">
        {statusFilters.map((f) => (
          <Button
            key={f.key ?? "all"}
            variant={selectedStatus === f.key ? "secondary" : "ghost"}
            size="sm"
            onClick={() => setSelectedStatus(f.key)}
          >
            {f.label}
          </Button>
        ))}
      </div>

      <div className="space-y-3">
        {filtered.length > 0 ? (
          filtered.map((opp) => (
            <OpportunityCard key={opp.id} opportunity={opp} />
          ))
        ) : (
          <div className="bg-surface rounded-xl p-8 text-center text-body-md text-subtle">
            Aucune opportunité avec ce filtre
          </div>
        )}
      </div>
    </div>
  );
}