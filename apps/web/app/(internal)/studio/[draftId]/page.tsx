"use client";

import { notFound } from "next/navigation";
import { use } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { HookDisplay } from "@/components/studio/hook-display";
import { ScriptEditor } from "@/components/studio/script-editor";
import { Storyboard } from "@/components/studio/storyboard";
import { ProductionBrief } from "@/components/studio/production-brief";
import { SimilarityReport } from "@/components/studio/similarity-report";
import { CriticReport } from "@/components/studio/critic-report";
import { draftMap, oppMap } from "@/lib/fixtures";

const statusLabels: Record<string, string> = {
  draft: "Brouillon",
  reviewing: "En révision",
  approved: "Approuvé",
  rejected: "Rejeté",
};

const statusVariants: Record<string, "neutral" | "warning" | "success" | "danger"> = {
  draft: "neutral",
  reviewing: "warning",
  approved: "success",
  rejected: "danger",
};

export default function StudioPage({
  params,
}: {
  params: Promise<{ draftId: string }>;
}) {
  const { draftId } = use(params);
  const draft = draftMap[draftId];

  if (!draft) {
    notFound();
  }

  const opportunity = oppMap[draft.opportunityId];

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
            <span className="text-body-sm text-subtle">Studio créatif</span>
          </div>
          <h2 className="font-display font-semibold text-heading-md text-foreground mt-1">
            Pack v{draft.version}
            {opportunity && (
              <span className="text-heading-sm text-subtle ml-2">
                — {opportunity.title}
              </span>
            )}
          </h2>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant={statusVariants[draft.status]}>
            {statusLabels[draft.status]}
          </Badge>
          <Button variant="primary">
            Approuver
          </Button>
          <Button variant="ghost">
            Modifier
          </Button>
          <Button variant="danger">
            Rejeter
          </Button>
        </div>
      </div>

      {/* Meta */}
      <div className="flex items-center gap-4 text-body-sm text-subtle bg-surface-elevated rounded-md p-3 flex-wrap">
        <span className="font-mono">{draft.id}</span>
        <Separator orientation="vertical" className="h-4" />
        <span>Version {draft.version}</span>
        <Separator orientation="vertical" className="h-4" />
        <span>
          Créé le{" "}
          {draft.createdAt.toLocaleDateString("fr-FR", {
            day: "numeric",
            month: "short",
            hour: "2-digit",
            minute: "2-digit",
          })}
        </span>
        {opportunity && (
          <>
            <Separator orientation="vertical" className="h-4" />
            <Link
              href={`/opportunities/${opportunity.id}`}
              className="text-cobalt hover:underline"
            >
              Voir l'opportunité →
            </Link>
          </>
        )}
      </div>

      {/* 12-column grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Main: 6 cols */}
        <div className="lg:col-span-8 space-y-5">
          {/* 3 Hooks */}
          <HookDisplay hooks={draft.hooks} />

          {/* 2 Scripts */}
          <ScriptEditor scripts={draft.scripts} />

          {/* Storyboard */}
          <Storyboard storyboard={draft.storyboard} />

          {/* Production brief */}
          <ProductionBrief brief={draft.productionBrief} />
        </div>

        {/* Sidebar: 4 cols */}
        <div className="lg:col-span-4 space-y-4">
          {/* Similarity report */}
          <SimilarityReport report={draft.similarityReport} />

          {/* Critic report */}
          <CriticReport report={draft.criticReport as any} />

          {/* Version history */}
          <div className="bg-surface rounded-lg p-5 border border-border/30">
            <h4 className="font-display font-semibold text-heading-sm text-foreground mb-3">
              Historique des versions
            </h4>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-body-sm">
                <span className="font-medium text-foreground">v{draft.version}</span>
                <span className="text-subtle">
                  {draft.createdAt.toLocaleDateString("fr-FR", {
                    day: "numeric",
                    month: "short",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
              <div className="flex items-center justify-between text-body-sm text-subtle">
                <span>v{draft.version - 1}</span>
                <span>Hier</span>
              </div>
              <div className="flex items-center justify-between text-body-sm text-subtle">
                <span>v{draft.version - 2}</span>
                <span>Avant-hier</span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2">
            <Button variant="secondary" className="flex-1">
              Dupliquer
            </Button>
            <Button variant="ghost" className="flex-1">
              Exporter
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}