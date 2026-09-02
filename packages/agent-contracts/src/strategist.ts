import { z } from "zod";

// ---------------------------------------------------------------------------
// Strategist — prend un signal et produit une fiche d'opportunité créative
// ---------------------------------------------------------------------------

/**
 * Concept d'accroche proposé par le Strategist.
 */
export const StrategistHookConceptSchema = z.object({
  type: z.enum(["curiosity", "problem", "outcome", "story", "debate"]),
  text: z.string().min(1, "Le texte de l'accroche est requis"),
  rationale: z.string().min(1, "La justification de l'accroche est requise"),
  expectedCtr: z.number().min(0).max(1).optional(),
});

export type StrategistHookConcept = z.infer<
  typeof StrategistHookConceptSchema
>;

/**
 * Recommandation de format créatif.
 */
export const StrategistFormatRecommendationSchema = z.object({
  platform: z.enum(["tiktok", "meta_reels", "meta_stories", "meta_feed"]),
  formatType: z
    .string()
    .min(1, "Le type de format est requis")
    .describe(
      "Ex: 'tutoriel rapide', 'sketch humoristique', 'témoignage', 'avant/après', 'comparaison'",
    ),
  duration: z
    .string()
    .optional()
    .describe("Durée recommandée, ex: '15-30 secondes'"),
  rationale: z.string().min(1, "La justification du format est requise"),
});

export type StrategistFormatRecommendation = z.infer<
  typeof StrategistFormatRecommendationSchema
>;

/**
 * Direction visuelle pour la créative.
 */
export const StrategistVisualDirectionSchema = z.object({
  mood: z
    .string()
    .min(1, "L'ambiance visuelle est requise")
    .describe("Ex: 'énergique', 'minimaliste', 'authentique', 'cinématique'"),
  colorPalette: z.array(z.string()).optional(),
  visualCues: z
    .array(z.string())
    .min(1, "Au moins un indice visuel est requis"),
  referenceStyle: z
    .string()
    .optional()
    .describe("Style de référence, ex: 'UGC style iPhone', 'animations 2D'"),
});

export type StrategistVisualDirection = z.infer<
  typeof StrategistVisualDirectionSchema
>;

/**
 * Élément de la structure narrative.
 */
export const StrategistNarrativeBeatSchema = z.object({
  timing: z
    .string()
    .min(1, "Le timing est requis")
    .describe("Ex: '0-3s', '3-10s', '10-20s'"),
  description: z.string().min(1, "La description du beat est requise"),
  hookType: z.string().optional(),
  cta: z.string().optional(),
});

export type StrategistNarrativeBeat = z.infer<
  typeof StrategistNarrativeBeatSchema
>;

/**
 * Opportunité de contenu complète produite par le Strategist.
 */
export const StrategistOpportunitySchema = z.object({
  signalId: z.string().min(1, "L'identifiant du signal source est requis"),
  title: z.string().min(1, "Le titre de l'opportunité est requis"),
  objective: z
    .string()
    .min(1, "L'objectif marketing est requis")
    .describe(
      "Ex: 'générer des leads', 'notoriété', 'engagement communautaire', 'vente directe'",
    ),
  targetPersona: z.string().optional(),
  hookConcepts: z
    .array(StrategistHookConceptSchema)
    .min(1, "Au moins un concept d'accroche est requis"),
  visualDirection: StrategistVisualDirectionSchema,
  narrativeStructure: z
    .array(StrategistNarrativeBeatSchema)
    .min(1, "Au moins un beat narratif est requis"),
  formatRecommendations: z
    .array(StrategistFormatRecommendationSchema)
    .min(1, "Au moins une recommandation de format est requise"),
  keyMessage: z
    .string()
    .min(1, "Le message clé est requis")
    .describe("Le message principal à faire passer en une phrase"),
  emotionalTriggers: z.array(z.string()).optional(),
  riskFactors: z.array(z.string()).optional(),
});

export type StrategistOpportunity = z.infer<
  typeof StrategistOpportunitySchema
>;

/**
 * Recommandations de timing.
 */
export const StrategistTimingSchema = z.object({
  bestDay: z.string().optional(),
  bestTime: z.string().optional(),
  publishWindow: z.string().optional(),
  frequency: z.string().optional(),
});

export type StrategistTiming = z.infer<typeof StrategistTimingSchema>;

// ---------------------------------------------------------------------------
// Stratégie créative complète
// ---------------------------------------------------------------------------

/**
 * Stratégie créative complète produite par le Strategist.
 */
export const StrategistCreativeStrategySchema = z.object({
  opportunity: StrategistOpportunitySchema,
  timing: StrategistTimingSchema.optional(),
  budgetSuggestion: z
    .string()
    .optional()
    .describe("Suggestion de budget, ex: '50-100€/jour en test pendant 5 jours'"),
  kpis: z.array(z.string()).optional(),
  testingApproach: z
    .string()
    .optional()
    .describe("Approche de test recommandée, ex: 'A/B test sur 3 hooks avec 20€/jour'"),
  notes: z.string().optional(),
});

export type StrategistCreativeStrategy = z.infer<
  typeof StrategistCreativeStrategySchema
>;

// ---------------------------------------------------------------------------
// Input pour le Strategist
// ---------------------------------------------------------------------------

/**
 * Entrée du Strategist — un signal validé du Signal Analyst.
 */
export interface StrategistInput {
  signal: {
    id: string;
    title: string;
    summary: string;
    confidence: number;
    saturation: "low" | "medium" | "high";
    actionWindow: "immediate" | "short_term" | "long_term";
    source: "tiktok" | "meta" | "both";
    transferableMechanics?: string[];
    doNotCopy?: string[];
  };
  niche: string;
  brand?: {
    name: string;
    tone: string;
    products?: string[];
    audience?: string;
    constraints?: string[];
  };
  objective?: string;
}

// ---------------------------------------------------------------------------
// Prompts
// ---------------------------------------------------------------------------

/**
 * System prompt pour l'agent Strategist.
 */
export const STRATEGIST_SYSTEM_PROMPT = `Tu es le Strategist de Viral Copilot. Tu transformes un signal de tendance validé en une stratégie créative complète et actionnable.

Ta mission :
1. Analyser le signal fourni (titre, résumé, confiance, saturation, fenêtre d'action)
2. Concevoir 3 concepts d'accroche distincts (curiosity, problem, outcome, story, debate)
3. Définir une direction visuelle claire (ambiance, palette, indices visuels)
4. Structurer la narration en beats temporels
5. Recommander les formats adaptés à chaque plateforme
6. Proposer des KPIs et une approche de test

Règles :
- Chaque accroche doit avoir une justification stratégique — pas de "ça marche bien"
- La direction visuelle doit être distinctive, pas générique
- Les beats narratifs doivent couvrir l'intégralité de la durée estimée
- Les recommandations de format doivent être spécifiques à la plateforme
- Si le signal a une fenêtre "immediate", priorise la vitesse d'exécution
- Si la saturation est "high", propose une twist ou un angle différent
- Tiens compte des contraintes de la marque si fournies
- Les risques doivent être honnêtes : identifie ce qui pourrait ne pas marcher

Réponds exclusivement en JSON, selon le schéma suivant :
{
  "opportunity": {
    "signalId": "sig_001",
    "title": "Titre accrocheur de l'opportunité",
    "objective": "notoriété",
    "targetPersona": "Propriétaire de petite entreprise, 30-45 ans",
    "hookConcepts": [
      {
        "type": "curiosity",
        "text": "Pourquoi personne ne te dit ÇA ?",
        "rationale": "Le mystère génère du clic et du temps de visionnage",
        "expectedCtr": 0.12
      }
    ],
    "visualDirection": {
      "mood": "authentique",
      "colorPalette": ["#FF6B35", "#004E64", "#FFFFFF"],
      "visualCues": ["Écran partagé", "Texte dynamique en haut"],
      "referenceStyle": "UGC style TikTok brut"
    },
    "narrativeStructure": [
      {
        "timing": "0-3s",
        "description": "Accroche choc question rhétorique",
        "hookType": "curiosity",
        "cta": "Regarde jusqu'au bout"
      },
      {
        "timing": "3-10s",
        "description": "Démonstration du problème / contexte",
        "hookType": "problem"
      },
      {
        "timing": "10-20s",
        "description": "Révélation de la solution / twist",
        "cta": "Clique sur le lien en bio"
      }
    ],
    "formatRecommendations": [
      {
        "platform": "tiktok",
        "formatType": "tutoriel rapide",
        "duration": "15-20 secondes",
        "rationale": "Format court qui maximise la rétention"
      }
    ],
    "keyMessage": "Message principal à faire passer",
    "emotionalTriggers": ["curiosité", "FOMO"],
    "riskFactors": ["Format déjà popularisé sur le feed"]
  },
  "timing": {
    "bestDay": "Mardi",
    "bestTime": "18h-20h",
    "publishWindow": "Cette semaine",
    "frequency": "2 fois par semaine"
  },
  "budgetSuggestion": "30-50€/jour en test pendant 3 jours",
  "kpis": ["Taux de rétention > 40% à 5s", "CTR > 1.5%", "Partages > 50"],
  "testingApproach": "A/B test sur les 3 hooks proposés avec 30€/jour pendant 3 jours. Garder le meilleur performer et scaler.",
  "notes": "Notes additionnelles éventuelles"
}

Ne produis aucun texte hors JSON.`;

/**
 * Construit le prompt utilisateur pour le Strategist.
 */
export function buildStrategistPrompt(input: StrategistInput): string {
  const parts: string[] = [
    `Génère une stratégie créative pour la niche "${input.niche}" à partir du signal suivant.`,
    ``,
    `--- Signal ---`,
    `ID: ${input.signal.id}`,
    `Titre: ${input.signal.title}`,
    `Résumé: ${input.signal.summary}`,
    `Confiance: ${input.signal.confidence}`,
    `Saturation: ${input.signal.saturation}`,
    `Fenêtre d'action: ${input.signal.actionWindow}`,
    `Source: ${input.signal.source}`,
  ];

  if (
    input.signal.transferableMechanics &&
    input.signal.transferableMechanics.length > 0
  ) {
    parts.push(
      `Mécaniques transférables : ${input.signal.transferableMechanics.join(", ")}`,
    );
  }

  if (input.signal.doNotCopy && input.signal.doNotCopy.length > 0) {
    parts.push(`À ne pas copier : ${input.signal.doNotCopy.join(", ")}`);
  }

  parts.push(``);

  if (input.brand) {
    parts.push(`--- Marque ---`);
    parts.push(`Nom: ${input.brand.name}`);
    parts.push(`Tonalité: ${input.brand.tone}`);
    if (input.brand.products && input.brand.products.length > 0) {
      parts.push(`Produits: ${input.brand.products.join(", ")}`);
    }
    if (input.brand.audience) {
      parts.push(`Audience cible: ${input.brand.audience}`);
    }
    if (input.brand.constraints && input.brand.constraints.length > 0) {
      parts.push(`Contraintes: ${input.brand.constraints.join(", ")}`);
    }
    parts.push(``);
  }

  if (input.objective) {
    parts.push(`Objectif spécifique: ${input.objective}`);
    parts.push(``);
  }

  parts.push(
    `Produis une stratégie créative complète en JSON selon le schéma fourni.`,
  );

  return parts.join("\n");
}