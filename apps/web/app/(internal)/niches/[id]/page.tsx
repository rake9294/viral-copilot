import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { CoveragePanel } from "@/components/niche/coverage-panel";
import {
  assessCoverage,
  type NicheMap,
} from "@viral-copilot/agent-contracts";

/**
 * Mock niche data for demo purposes.
 */
const MOCK_NICHE = {
  id: "1",
  marketName: "Compléments alimentaires naturels",
  subNiche: "Bien-être féminin",
  country: "FR",
  language: "fr",
  coverageStatus: "ready" as const,
  version: 3,
  mapValidated: true,
  nicheMap: {
    canonicalName: "Compléments alimentaires naturels pour le bien-être féminin",
    personas: [
      {
        name: "Femme active 30-45 ans",
        pains: ["Fatigue chronique", "Stress quotidien", "Troubles du sommeil"],
        desiredOutcomes: ["Plus d'énergie au quotidien", "Meilleur sommeil"],
        vocabulary: ["magnésium", "ashwagandha", "adaptogène", "bio disponible"],
      },
    ],
    seedQueries: [
      "complément alimentaire magnésium",
      "bien-être féminin naturel",
      "anti-fatigue naturel",
    ],
    adjacentQueries: [
      "alimentation équilibrée femme active",
      "gestion stress naturel",
    ],
    competitorNames: ["Nutri&Co", "Juvamine", "VitaminWell"],
    accountHandles: ["@nutriandco", "@juvamine_officiel"],
    exclusions: ["promesses médicales non fondées", "produits chimiques de synthèse"],
    complianceRules: [
      "Pas d'allégations thérapeutiques",
      "Mentions DGCCRF requises",
      "Avertir sur les interactions médicamenteuses",
    ],
  } as NicheMap,
  pains: ["Fatigue chronique", "Manque d'énergie", "Stress"],
  desiredOutcomes: ["Plus d'énergie", "Meilleur sommeil"],
  offers: ["Compléments magnésium", "Gummies sommeil"],
  competitors: ["Nutri&Co", "Juvamine"],
  accountHandles: ["@nutriandco"],
  exclusions: ["Produits chimiques"],
  complianceRules: ["DGCCRF"],
  brandTone: "Expert, bienveillant",
};

const STATUS_LABELS: Record<
  string,
  { label: string; variant: "neutral" | "primary" | "success" | "warning" | "danger" }
> = {
  draft: { label: "Brouillon", variant: "neutral" },
  mapped: { label: "Carte générée", variant: "primary" },
  validated: { label: "Validée", variant: "success" },
  ready: { label: "Prête", variant: "success" },
  insufficient_coverage: { label: "Couverture insuffisante", variant: "warning" },
};

export default function NicheDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const niche = MOCK_NICHE;
  const statusInfo = STATUS_LABELS[niche.coverageStatus] ?? STATUS_LABELS["draft"]!;

  // Compute demo coverage
  const coverage = assessCoverage({
    tiktokContents: 52,
    tiktokAuthors: 11,
    metaAds: 22,
    metaAdvertisers: 6,
    trendSources: 4,
    cohortElements: 35,
  });

  return (
    <div className="max-w-4xl">
      <div className="mb-6">
        <div className="mb-2">
          <Link
            href="/niches"
            className="text-sm"
            style={{
              color: "var(--color-cobalt)",
              fontFamily: "var(--font-body-sm)",
            }}
          >
            ← Retour aux niches
          </Link>
        </div>
        <div className="flex items-center gap-4">
          <h1 className="font-heading-lg">{niche.marketName}</h1>
          <Badge variant={statusInfo.variant}>{statusInfo.label}</Badge>
          {niche.subNiche && (
            <span
              className="text-sm"
              style={{ color: "var(--color-subtle)" }}
            >
              {niche.subNiche}
            </span>
          )}
        </div>
        <div
          className="mt-2 flex items-center gap-4 text-xs"
          style={{
            color: "var(--color-subtle)",
            fontFamily: "var(--font-data-sm)",
          }}
        >
          <span>
            {niche.country}/{niche.language}
          </span>
          <span>v{niche.version}</span>
          <span>{niche.brandTone}</span>
        </div>
      </div>

      <div className="mb-6 grid gap-4 md:grid-cols-2">
        {/* Profile detail */}
        <Card>
          <CardHeader>
            <CardTitle className="font-heading-sm">Profil</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-4 text-sm">
              <DetailRow label="Personas" value={niche.pains.join(", ")} />
              <DetailRow label="Douleurs" value={niche.pains.join(", ")} />
              <DetailRow
                label="Résultats attendus"
                value={niche.desiredOutcomes.join(", ")}
              />
              <DetailRow label="Offres" value={niche.offers.join(", ")} />
              <DetailRow label="Concurrents" value={niche.competitors.join(", ")} />
              <DetailRow label="Comptes" value={niche.accountHandles.join(", ")} />
              <DetailRow label="Exclusions" value={niche.exclusions.join(", ")} />
              <DetailRow
                label="Règles conformité"
                value={niche.complianceRules.join(", ")}
              />
              <DetailRow label="Ton de marque" value={niche.brandTone} />
            </div>
          </CardContent>
        </Card>

        {/* Coverage */}
        <CoveragePanel
          sources={coverage.sources}
          status={coverage.status}
          summary={coverage.summary}
        />
      </div>

      {/* Niche map preview */}
      {niche.nicheMap && (
        <Card>
          <CardHeader>
            <CardTitle className="font-heading-sm">Carte de niche</CardTitle>
            <CardDescription>
              Générée par le Niche Mapper le 02/09/2026
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-4">
              <div className="flex flex-wrap gap-2">
                <Badge variant="primary">{niche.nicheMap.canonicalName}</Badge>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <h4 className="mb-2 text-sm font-medium text-[var(--color-muted)]">
                    Requêtes principales
                  </h4>
                  <ul className="flex flex-col gap-1 text-sm text-[var(--color-foreground)]">
                    {niche.nicheMap.seedQueries.map((q, i) => (
                      <li
                        key={i}
                        className="rounded-[var(--radius-sm)] bg-[var(--color-surface-elevated)] px-3 py-2"
                        style={{ fontFamily: "var(--font-data-sm)" }}
                      >
                        {q}
                      </li>
                    ))}
                  </ul>
                </div>
                {niche.nicheMap.adjacentQueries.length > 0 && (
                  <div>
                    <h4 className="mb-2 text-sm font-medium text-[var(--color-muted)]">
                      Requêtes adjacentes
                    </h4>
                    <ul className="flex flex-col gap-1 text-sm">
                      {niche.nicheMap.adjacentQueries.map((q, i) => (
                        <li
                          key={i}
                          className="rounded-[var(--radius-sm)] bg-[var(--color-surface-elevated)] px-3 py-2"
                          style={{ fontFamily: "var(--font-data-sm)" }}
                        >
                          {q}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
              <div className="flex items-center justify-end">
                <Link href={`/niches/${niche.id}/map`}>
                  <Button variant="secondary">Voir la carte complète</Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function DetailRow({ label, value }: { label: string; value: string | null }) {
  if (!value) return null;
  return (
    <div>
      <span
        className="text-xs font-medium"
        style={{ color: "var(--color-subtle)" }}
      >
        {label}
      </span>
      <p className="mt-0.5 text-sm">{value}</p>
    </div>
  );
}