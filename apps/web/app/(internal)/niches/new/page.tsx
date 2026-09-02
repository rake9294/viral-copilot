"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  COUNTRY_OPTIONS,
  LANGUAGE_OPTIONS,
  EMPTY_NICHE_FORM,
  type NicheFormData,
} from "@/components/niche/niche-form";
import { CoveragePanel } from "@/components/niche/coverage-panel";
import {
  NICHE_MAPPER_SYSTEM_PROMPT,
  buildNicheMapperPrompt,
  assessCoverage,
  type NicheMap,
  type CoverageAssessment,
} from "@viral-copilot/agent-contracts";

type FormStatus = "idle" | "generating" | "success" | "error";

export default function NewNichePage() {
  const router = useRouter();
  const [form, setForm] = useState<NicheFormData>(EMPTY_NICHE_FORM);
  const [status, setStatus] = useState<FormStatus>("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [nicheMap, setNicheMap] = useState<NicheMap | null>(null);
  const [coverage, setCoverage] = useState<CoverageAssessment | null>(null);
  const [showCoverage, setShowCoverage] = useState(false);

  const handleChange = useCallback(
    (field: keyof NicheFormData, value: string) => {
      setForm((prev) => ({ ...prev, [field]: value }));
    },
    [],
  );

  const handleGenerateMap = useCallback(async () => {
    if (!form.marketName || !form.country || !form.language) {
      setErrorMessage("Le nom du marché, le pays et la langue sont requis.");
      return;
    }

    setStatus("generating");
    setErrorMessage(null);

    try {
      // Call Niche Mapper via the API route
      const response = await fetch("/api/niche-mapper", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          marketName: form.marketName,
          subNiche: form.subNiche,
          country: form.country,
          language: form.language,
          personas: form.personas,
          pains: form.pains,
          desiredOutcomes: form.desiredOutcomes,
          offers: form.offers,
          competitors: form.competitors,
          brandTone: form.brandTone,
          complianceNotes: form.complianceNotes,
        }),
      });

      if (!response.ok) {
        const err = await response.text().catch(() => "Erreur serveur");
        throw new Error(err);
      }

      const map: NicheMap = await response.json();
      setNicheMap(map);

      // Simulate coverage data for demo purposes
      const simulatedCoverage = assessCoverage({
        tiktokContents: 45,
        tiktokAuthors: 8,
        metaAds: 15,
        metaAdvertisers: 3,
        trendSources: 2,
        cohortElements: 25,
      });
      setCoverage(simulatedCoverage);
      setShowCoverage(true);
      setStatus("success");
    } catch (err) {
      setStatus("error");
      setErrorMessage(
        err instanceof Error ? err.message : "Erreur lors de la génération",
      );
    }
  }, [form]);

  return (
    <div className="max-w-3xl">
      <div className="mb-8">
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
        <h1 className="font-heading-lg">Nouvelle niche</h1>
        <p
          className="mt-1 text-sm"
          style={{ color: "var(--color-subtle)" }}
        >
          Définissez votre marché pour générer une carte de niche
        </p>
      </div>

      {/* Basic info */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="font-heading-sm">Informations générales</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-2">
            <div className="flex flex-col gap-2">
              <Label htmlFor="marketName">Nom du marché *</Label>
              <Input
                id="marketName"
                placeholder="Ex: Compléments alimentaires"
                value={form.marketName}
                onChange={(e) => handleChange("marketName", e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="subNiche">Sous-niche</Label>
              <Input
                id="subNiche"
                placeholder="Ex: Bien-être féminin"
                value={form.subNiche}
                onChange={(e) => handleChange("subNiche", e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="country">Pays *</Label>
              <Select
                value={form.country}
                onValueChange={(v) => handleChange("country", v)}
              >
                <SelectTrigger id="country">
                  <SelectValue placeholder="Sélectionner" />
                </SelectTrigger>
                <SelectContent>
                  {COUNTRY_OPTIONS.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="language">Langue *</Label>
              <Select
                value={form.language}
                onValueChange={(v) => handleChange("language", v)}
              >
                <SelectTrigger id="language">
                  <SelectValue placeholder="Sélectionner" />
                </SelectTrigger>
                <SelectContent>
                  {LANGUAGE_OPTIONS.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Market details */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="font-heading-sm">Détails du marché</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="personas">Personas</Label>
              <Input
                id="personas"
                placeholder="Ex: Femmes 25-45 ans, sportives occasionnelles"
                value={form.personas}
                onChange={(e) => handleChange("personas", e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="pains">Problèmes / Douleurs</Label>
              <Input
                id="pains"
                placeholder="Ex: Fatigue chronique, manque d'énergie"
                value={form.pains}
                onChange={(e) => handleChange("pains", e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="desiredOutcomes">Résultats attendus</Label>
              <Input
                id="desiredOutcomes"
                placeholder="Ex: Meilleur sommeil, plus d'énergie au réveil"
                value={form.desiredOutcomes}
                onChange={(e) => handleChange("desiredOutcomes", e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="offers">Offres / Catégories</Label>
              <Input
                id="offers"
                placeholder="Ex: Compléments magnésium, gummies sommeil"
                value={form.offers}
                onChange={(e) => handleChange("offers", e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="competitors">Concurrents connus</Label>
              <Input
                id="competitors"
                placeholder="Ex: Nutri&Co, Juvamine, VitaminWell"
                value={form.competitors}
                onChange={(e) => handleChange("competitors", e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="brandTone">Ton de marque</Label>
              <Input
                id="brandTone"
                placeholder="Ex: Expert, bienveillant, accessible"
                value={form.brandTone}
                onChange={(e) => handleChange("brandTone", e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="complianceNotes">Règles de conformité</Label>
              <Input
                id="complianceNotes"
                placeholder="Ex: Pas de promesses médicales, mentions DGCCRF"
                value={form.complianceNotes}
                onChange={(e) => handleChange("complianceNotes", e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex items-center gap-4">
        <Button
          variant="primary"
          size="lg"
          onClick={handleGenerateMap}
          disabled={status === "generating"}
        >
          {status === "generating"
            ? "Génération en cours..."
            : "Générer la carte de niche"}
        </Button>
        <Link href="/niches">
          <Button variant="ghost" size="lg">
            Annuler
          </Button>
        </Link>
      </div>

      {errorMessage && (
        <div
          className="mt-4 rounded-[var(--radius-md)] px-4 py-3 text-sm"
          style={{
            backgroundColor: "rgba(249, 112, 102, 0.15)",
            color: "var(--color-danger)",
          }}
        >
          {errorMessage}
        </div>
      )}

      {/* Coverage Dialog */}
      <Dialog open={showCoverage} onOpenChange={setShowCoverage}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Carte générée</DialogTitle>
            <DialogDescription>
              Le Niche Mapper a analysé votre marché. Vérifiez la couverture
              avant de continuer.
            </DialogDescription>
          </DialogHeader>

          {nicheMap && (
            <div className="mb-4 flex flex-wrap gap-2">
              <Badge variant="primary">{nicheMap.canonicalName}</Badge>
              <Badge variant="neutral">
                {nicheMap.personas.length} personas
              </Badge>
              <Badge variant="neutral">
                {nicheMap.seedQueries.length} requêtes
              </Badge>
              <Badge variant="neutral">
                {nicheMap.competitorNames.length} concurrents
              </Badge>
              <Badge variant="neutral">
                {nicheMap.exclusions.length} exclusions
              </Badge>
            </div>
          )}

          {coverage && (
            <CoveragePanel
              sources={coverage.sources}
              status={coverage.status}
              summary={coverage.summary}
            />
          )}

          <div className="mt-6 flex items-center justify-end gap-3">
            <Button variant="ghost" onClick={() => setShowCoverage(false)}>
              Modifier
            </Button>
            {nicheMap && (
              <Link href={`/niches/1/map`}>
                <Button variant="primary">Voir la carte complète</Button>
              </Link>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}