"use client";

import { notFound } from "next/navigation";
import { use } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { EvidencePanel } from "@/components/radar/evidence-panel";
import { MetricTile } from "@/components/radar/metric-tile";
import { CohortCompare } from "@/components/radar/cohort-compare";
import { oppMap } from "@/lib/fixtures";

const sourceLabels: Record<string, string> = {
  tiktok: "TikTok",
  meta: "Meta",
};

const statusLabels: Record<string, string> = {
  pending_review: "En attente",
  accepted: "Acceptée",
  modified: "Modifiée",
  rejected: "Rejetée",
};

const statusVariants: Record<string, "success" | "warning" | "danger" | "primary"> = {
  pending_review: "primary",
  accepted: "success",
  modified: "warning",
  rejected: "danger",
};

export default function OpportunityPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const opp = oppMap[id];

  if (!opp) {
    notFound();
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Link
              href="/radar"
              className="text-body-sm text-cobalt hover:underline"
            >
              ← Radar
            </Link>
            <span className="text-subtle">/</span>
            <span className="text-body-sm text-subtle">Opportunité</span>
          </div>
          <h2 className="font-display font-semibold text-heading-md text-foreground mt-1">
            {opp.title}
          </h2>
        </div>
        <div className="flex items-center gap-2">
          <Badge
            variant={opp.source === "tiktok" ? "tiktok" : "meta"}
          >
            {sourceLabels[opp.source]}
          </Badge>
          <Badge variant={statusVariants[opp.status]}>
            {statusLabels[opp.status]}
          </Badge>
        </div>
      </div>

      {/* 12-column grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Main content: 7 cols */}
        <div className="lg:col-span-7 space-y-5">
          {/* Description & Signal */}
          <div className="bg-surface rounded-lg p-5 border border-border/30">
            <h3 className="font-display font-semibold text-heading-sm text-foreground mb-2">
              Pourquoi ça marche, pourquoi maintenant
            </h3>
            <p className="text-body-sm text-muted leading-relaxed">
              {opp.signalExplanation}
            </p>
          </div>

          {/* Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <MetricTile
              label="Vues moy."
              value={opp.observedMetrics?.['avgViews'] ?? 0}
              provenance="30 jours"
            />
            <MetricTile
              label="Engagement"
              value={opp.observedMetrics?.["engagementRate"] ?? 0}
              unit="%"
              trend="up"
            />
            <MetricTile
              label="Sauvegarde"
              value={opp.observedMetrics?.["saveRate"] ?? 0}
              unit="%"
              trend="up"
            />
            <MetricTile
              label="Partage"
              value={opp.observedMetrics?.["shareRate"] ?? 0}
              unit="%"
            />
          </div>

          {/* Cohort */}
          <CohortCompare
            baseline={opp.cohortComparison.baseline}
            uplift={opp.cohortComparison.uplift}
            sampleSize={opp.cohortComparison.sampleSize}
          />

          {/* Creative cluster */}
          <div className="bg-surface rounded-lg p-5 border border-border/30">
            <h3 className="font-display font-semibold text-heading-sm text-foreground mb-3">
              Cluster créatif
            </h3>
            <div className="flex flex-wrap gap-2">
              {opp.creativeCluster.map((item: string, i: number) => (
                <Badge key={i} variant="primary">
                  {item}
                </Badge>
              ))}
            </div>
          </div>

          {/* Transferable / Do not copy */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-surface rounded-lg p-5 border border-border/30">
              <h3 className="font-display font-semibold text-heading-sm text-foreground mb-3">
                Éléments transférables
              </h3>
              <ul className="space-y-2">
                {opp.transferableElements.map((el: string, i: number) => (
                  <li
                    key={i}
                    className="text-body-sm text-muted pl-3 relative before:absolute before:left-0 before:top-1.5 before:w-1.5 before:h-1.5 before:rounded-full before:bg-success"
                  >
                    {el}
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-surface rounded-lg p-5 border border-border/30">
              <h3 className="font-display font-semibold text-heading-sm text-foreground mb-3">
                À ne pas copier
              </h3>
              <ul className="space-y-2">
                {opp.doNotCopy.map((el: string, i: number) => (
                  <li
                    key={i}
                    className="text-body-sm text-muted pl-3 relative before:absolute before:left-0 before:top-1.5 before:w-1.5 before:h-1.5 before:rounded-full before:bg-danger"
                  >
                    {el}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Evidence sidebar: 5 cols */}
        <div className="lg:col-span-5 space-y-4">
          {/* Score */}
          <div className="bg-surface-violet rounded-lg p-5 border border-border/30">
            <span className="text-label-sm text-primary uppercase tracking-wider">
              Score
            </span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="font-display text-heading-lg text-foreground">
                {opp.score}
              </span>
              <span className="text-label-md text-subtle">/100</span>
            </div>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-body-sm text-muted">
                Confiance {opp.confidence}%
              </span>
              <div className="flex-1 h-1.5 rounded-full bg-background overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-signal-hot"
                  style={{ width: `${opp.confidence}%` }}
                />
              </div>
            </div>
          </div>

          {/* Evidence */}
          <EvidencePanel
            evidence={opp.evidence}
            signalExplanation={opp.signalExplanation}
          />

          {/* Actions */}
          <div className="flex flex-col gap-2">
            <Link href={`/studio/new?opportunity=${opp.id}`}>
              <Button variant="primary" className="w-full">
                Créer le pack
              </Button>
            </Link>
            <div className="flex gap-2">
              <Button variant="secondary" className="flex-1">
                Accepter
              </Button>
              <Button variant="ghost" className="flex-1">
                Modifier
              </Button>
              <Button variant="danger" className="flex-1">
                Rejeter
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}