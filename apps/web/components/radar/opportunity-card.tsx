"use client";

import type { Opportunity } from "@/lib/fixtures";
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const Opp = undefined as any;
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

const sourceLabels: Record<string, string> = {
  tiktok: "TikTok",
  meta: "Meta",
};

const statusLabels: Record<string, string> = {
  pending_review: "Pending",
  accepted: "Accepted",
  modified: "Modified",
  rejected: "Rejected",
};

interface OpportunityCardProps {
  opportunity: Opportunity;
}

export function OpportunityCard({ opportunity }: OpportunityCardProps) {
  return (
    <Link href={`/opportunities/${opportunity.id}`}>
      <Card className="card-opportunity border border-border/40 hover:bg-surface-violet transition-all duration-150 hover:-translate-y-0.5 cursor-pointer p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <h3 className="font-display font-semibold text-heading-sm text-foreground truncate">
              {opportunity.title}
            </h3>
            <p className="text-body-sm text-subtle mt-1 line-clamp-2">
              {opportunity.description}
            </p>
          </div>
          <div className="flex-shrink-0 text-right">
            <div className="font-display text-metric-md text-primary">
              {opportunity.score}
              <span className="text-label-sm text-subtle ml-1">/100</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 mt-3 flex-wrap">
          <Badge
            variant={opportunity.source === "tiktok" ? "tiktok" : "meta"}
          >
            {sourceLabels[opportunity.source]}
          </Badge>
          <Badge
            variant={
              opportunity.status === "accepted"
                ? "success"
                : opportunity.status === "rejected"
                  ? "danger"
                  : opportunity.status === "modified"
                    ? "warning"
                    : "primary"
            }
          >
            {statusLabels[opportunity.status]}
          </Badge>
          <span className="text-data-sm text-subtle">
            Confiance {opportunity.confidence}%
          </span>
        </div>

        <div className="flex items-center gap-4 mt-3 text-data-sm text-subtle">
          <span>📈 {opportunity.observedMetrics?.["avgViews"]?.toLocaleString() ?? "N/A"} vues</span>
          <span>💬 {opportunity.observedMetrics?.["engagementRate"] ?? "N/A"}% ER</span>
          <span>📌 {opportunity.observedMetrics?.["saveRate"] ?? "N/A"}% save</span>
        </div>
      </Card>
    </Link>
  );
}