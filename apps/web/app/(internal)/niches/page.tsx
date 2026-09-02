import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

/**
 * Static data for demo purposes. In production this comes from the database.
 */
const MOCK_NICHES = [
  {
    id: "1",
    marketName: "Compléments alimentaires naturels",
    subNiche: "Bien-être féminin",
    country: "FR",
    language: "fr",
    coverageStatus: "ready" as const,
    version: 3,
    updatedAt: "2026-09-02",
  },
  {
    id: "2",
    marketName: "Fitness à domicile",
    subNiche: "HIIT 30min",
    country: "FR",
    language: "fr",
    coverageStatus: "mapped" as const,
    version: 2,
    updatedAt: "2026-08-28",
  },
  {
    id: "3",
    marketName: "Skincare bio",
    subNiche: "Anti-âge",
    country: "FR",
    language: "fr",
    coverageStatus: "draft" as const,
    version: 1,
    updatedAt: "2026-08-25",
  },
];

const STATUS_LABELS: Record<string, { label: string; variant: "neutral" | "primary" | "success" | "warning" | "danger" }> = {
  draft: { label: "Brouillon", variant: "neutral" },
  mapped: { label: "Carte générée", variant: "primary" },
  validated: { label: "Validée", variant: "success" },
  ready: { label: "Prête", variant: "success" },
  insufficient_coverage: { label: "Couverture insuffisante", variant: "warning" },
};

export default function NichesPage() {
  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="font-heading-lg">Niches</h1>
          <p
            className="mt-1 text-sm"
            style={{ color: "var(--color-subtle)" }}
          >
            Gérez vos profils de niche et lancez des radars
          </p>
        </div>
        <Link href="/niches/new">
          <Button variant="primary" size="lg">
            Nouvelle niche
          </Button>
        </Link>
      </div>

      {MOCK_NICHES.length === 0 ? (
        <div
          className="flex flex-col items-center justify-center rounded-[var(--radius-xl)] p-8"
          style={{ backgroundColor: "var(--color-surface)", minHeight: "320px" }}
        >
          <p
            className="mb-4 text-base"
            style={{ color: "var(--color-muted)" }}
          >
            Aucune niche pour le moment
          </p>
          <Link href="/niches/new">
            <Button variant="primary">Créer votre première niche</Button>
          </Link>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {MOCK_NICHES.map((niche) => {
            const statusInfo = STATUS_LABELS[niche.coverageStatus] ?? STATUS_LABELS["draft"]!;
            return (
              <Link key={niche.id} href={`/niches/${niche.id}`}>
                <Card className="transition-colors hover:bg-[var(--color-surface-violet)]">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <CardTitle className="font-heading-sm text-base">
                        {niche.marketName}
                      </CardTitle>
                      <Badge variant={statusInfo.variant}>
                        {statusInfo.label}
                      </Badge>
                    </div>
                    {niche.subNiche && (
                      <CardDescription>{niche.subNiche}</CardDescription>
                    )}
                  </CardHeader>
                  <CardContent>
                    <div
                      className="flex items-center gap-4 text-xs"
                      style={{
                        color: "var(--color-subtle)",
                        fontFamily: "var(--font-data-sm)",
                      }}
                    >
                      <span>
                        {niche.country}/{niche.language}
                      </span>
                      <span>v{niche.version}</span>
                      <span>{niche.updatedAt}</span>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}