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
import {
  assessCoverage,
  type NicheMap,
} from "@viral-copilot/agent-contracts";
import { CoveragePanel } from "@/components/niche/coverage-panel";

const MOCK_MAP: NicheMap = {
  canonicalName: "Compléments alimentaires naturels pour le bien-être féminin",
  personas: [
    {
      name: "Femme active 30-45 ans",
      pains: ["Fatigue chronique", "Stress quotidien", "Troubles du sommeil"],
      desiredOutcomes: [
        "Plus d'énergie au quotidien",
        "Meilleur sommeil réparateur",
        "Équilibre hormonal naturel",
      ],
      vocabulary: [
        "magnésium marin",
        "ashwagandha",
        "adaptogène",
        "forme bio-disponible",
        "micronutrition",
      ],
    },
    {
      name: "Jeune maman 25-35 ans",
      pains: [
        "Épuisement postnatal",
        "Chute de cheveux",
        "Manque de temps pour cuisiner équilibré",
      ],
      desiredOutcomes: [
        "Retrouver de l'énergie",
        "Compléments sûrs pour l'allaitement",
        "Solution pratique",
      ],
      vocabulary: ["post-partum", "allaitement", "fer", "vitamine D", "oméga-3"],
    },
  ],
  seedQueries: [
    "complément alimentaire magnésium fatigue",
    "bien-être féminin naturel stress",
    "meilleur complément sommeil femme",
  ],
  adjacentQueries: [
    "alimentation équilibrée femme active",
    "gestion stress naturel sans médicament",
    "méditation pleine conscience fatigue",
  ],
  competitorNames: ["Nutri&Co", "Juvamine", "VitaminWell", "NaturaForce"],
  accountHandles: [
    "@nutriandco",
    "@juvamine_officiel",
    "@sofietalbot.nutrition",
    "@dietetiquefacile",
  ],
  exclusions: [
    "produits chimiques de synthèse",
    "compléments non testés",
    "allégations thérapeutiques non fondées",
    "promesses de résultats extrêmes",
  ],
  complianceRules: [
    "Pas d'allégations thérapeutiques directes",
    "Mentions DGCCRF obligatoires",
    "Avertir sur les interactions médicamenteuses",
    "Âge minimum recommandé clair",
    "Ne pas cibler les personnes en traitement médical lourd",
  ],
};

const coverage = assessCoverage({
  tiktokContents: 52,
  tiktokAuthors: 11,
  metaAds: 22,
  metaAdvertisers: 6,
  trendSources: 4,
  cohortElements: 35,
});

export default function NicheMapPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const map = MOCK_MAP;

  return (
    <div className="max-w-5xl">
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
        <div className="flex items-center gap-3">
          <h1 className="font-heading-lg">Carte de niche</h1>
          <Badge variant="primary">{map.canonicalName}</Badge>
        </div>
      </div>

      {/* Coverage */}
      <div className="mb-8">
        <CoveragePanel
          sources={coverage.sources}
          status={coverage.status}
          summary={coverage.summary}
        />
      </div>

      {/* Personas */}
      <section className="mb-8">
        <h2 className="mb-4 font-heading-sm">Personas</h2>
        <div className="grid gap-4 md:grid-cols-2">
          {map.personas.map((persona, i) => (
            <Card key={i}>
              <CardHeader>
                <CardTitle className="font-title-md text-base">
                  {persona.name}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col gap-4">
                  <div>
                    <h4
                      className="mb-1 text-xs font-medium uppercase tracking-wider"
                      style={{ color: "var(--color-danger)" }}
                    >
                      Douleurs
                    </h4>
                    <ul className="flex flex-col gap-1">
                      {persona.pains.map((pain, j) => (
                        <li
                          key={j}
                          className="rounded-[var(--radius-sm)] bg-[var(--color-surface-elevated)] px-3 py-1.5 text-sm"
                        >
                          {pain}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4
                      className="mb-1 text-xs font-medium uppercase tracking-wider"
                      style={{ color: "var(--color-success)" }}
                    >
                      Résultats attendus
                    </h4>
                    <ul className="flex flex-col gap-1">
                      {persona.desiredOutcomes.map((outcome, j) => (
                        <li
                          key={j}
                          className="rounded-[var(--radius-sm)] bg-[var(--color-surface-elevated)] px-3 py-1.5 text-sm"
                        >
                          {outcome}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4
                      className="mb-1 text-xs font-medium uppercase tracking-wider"
                      style={{ color: "var(--color-cobalt)" }}
                    >
                      Vocabulaire
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {persona.vocabulary.map((word, j) => (
                        <Badge key={j} variant="info">
                          {word}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Queries */}
      <div className="mb-8 grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="font-heading-sm">
              Requêtes principales
            </CardTitle>
            <CardDescription>
              Termes de recherche pour découvrir le contenu primaire
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="flex flex-col gap-2">
              {map.seedQueries.map((q, i) => (
                <li
                  key={i}
                  className="rounded-[var(--radius-md)] bg-[var(--color-surface-elevated)] px-4 py-2.5 text-sm"
                  style={{ fontFamily: "var(--font-data-sm)" }}
                >
                  {q}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="font-heading-sm">
              Requêtes adjacentes
            </CardTitle>
            <CardDescription>
              Termes pour découvrir le contenu connexe
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="flex flex-col gap-2">
              {map.adjacentQueries.map((q, i) => (
                <li
                  key={i}
                  className="rounded-[var(--radius-md)] bg-[var(--color-surface-elevated)] px-4 py-2.5 text-sm"
                  style={{ fontFamily: "var(--font-data-sm)" }}
                >
                  {q}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>

      {/* Competitors & Accounts */}
      <div className="mb-8 grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="font-heading-sm">Concurrents</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {map.competitorNames.map((name, i) => (
                <Badge key={i} variant="warning">
                  {name}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="font-heading-sm">Comptes à surveiller</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {map.accountHandles.map((handle, i) => (
                <Badge key={i} variant="tiktok">
                  {handle}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Exclusions & Compliance */}
      <div className="mb-8 grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="font-heading-sm">Exclusions</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="flex flex-col gap-2">
              {map.exclusions.map((ex, i) => (
                <li
                  key={i}
                  className="flex items-center gap-2 rounded-[var(--radius-sm)] px-3 py-2 text-sm"
                  style={{
                    backgroundColor: "rgba(249, 112, 102, 0.1)",
                    color: "var(--color-danger)",
                  }}
                >
                  <span className="text-xs">✗</span>
                  {ex}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="font-heading-sm">
              Règles de conformité
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="flex flex-col gap-2">
              {map.complianceRules.map((rule, i) => (
                <li
                  key={i}
                  className="flex items-center gap-2 rounded-[var(--radius-sm)] px-3 py-2 text-sm"
                  style={{
                    backgroundColor: "rgba(245, 185, 66, 0.1)",
                    color: "var(--color-warning)",
                  }}
                >
                  <span className="text-xs">⚠</span>
                  {rule}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-4">
        <Link href={`/niches/1`}>
          <Button variant="primary">Valider et retourner à la niche</Button>
        </Link>
        <Button variant="secondary">Régénérer la carte</Button>
      </div>
    </div>
  );
}