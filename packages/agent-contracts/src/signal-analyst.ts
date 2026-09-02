import { z } from "zod";

// ---------------------------------------------------------------------------
// Signal Analyst — analyse les données brutes des sources (TikTok, Meta)
// ---------------------------------------------------------------------------

/**
 * Élément de preuve attaché à un signal.
 */
export const SignalAnalystEvidenceSchema = z.object({
  type: z.string().min(1, "Le type de preuve est requis"),
  excerpt: z.string().min(1, "L'extrait de preuve est requis"),
  sourceUrl: z.string().url("L'URL source doit être valide").optional(),
  metricValue: z.number().optional().describe("Valeur métrique associée"),
});

export type SignalAnalystEvidence = z.infer<typeof SignalAnalystEvidenceSchema>;

/**
 * Entrée de signal individuelle.
 */
export const SignalAnalystSignalSchema = z.object({
  id: z.string().min(1, "L'identifiant du signal est requis"),
  title: z.string().min(1, "Le titre du signal est requis"),
  summary: z.string().min(1, "Le résumé du signal est requis"),
  whyNow: z
    .string()
    .optional()
    .describe("Pourquoi ce signal est pertinent maintenant"),
  confidence: z.number().min(0).max(1),
  saturation: z.enum(["low", "medium", "high"]),
  actionWindow: z.enum(["immediate", "short_term", "long_term"]),
  source: z.enum(["tiktok", "meta", "both"]),
  evidence: z
    .array(SignalAnalystEvidenceSchema)
    .min(1, "Au moins un élément de preuve est requis"),
  transferableMechanics: z
    .array(z.string())
    .optional()
    .describe("Mécaniques transférables à d'autres niches"),
  doNotCopy: z
    .array(z.string())
    .optional()
    .describe("Éléments à ne pas copier (protégés, sur-utilisés)"),
});

export type SignalAnalystSignal = z.infer<typeof SignalAnalystSignalSchema>;

/**
 * Métriques globales du rapport de signaux.
 */
export const SignalAnalystMetricsSchema = z.object({
  totalPostsAnalyzed: z.number().int().min(0),
  totalEngagement: z.number().int().min(0),
  avgEngagementRate: z.number().min(0),
  timeWindow: z
    .string()
    .min(1, "La fenêtre temporelle est requise")
    .describe("Période analysée, ex: '7 derniers jours'"),
});

export type SignalAnalystMetrics = z.infer<typeof SignalAnalystMetricsSchema>;

/**
 * Rapport complet produit par le Signal Analyst.
 */
export const SignalAnalystReportSchema = z.object({
  signals: z
    .array(SignalAnalystSignalSchema)
    .min(1, "Au moins un signal doit être identifié"),
  metrics: SignalAnalystMetricsSchema,
});

export type SignalAnalystReport = z.infer<typeof SignalAnalystReportSchema>;

// ---------------------------------------------------------------------------
// Input pour le Signal Analyst
// ---------------------------------------------------------------------------

/**
 * Données brutes à faire analyser par le Signal Analyst.
 */
export interface SignalAnalystInput {
  niche: string;
  source: "tiktok" | "meta" | "both";
  rawData: {
    posts?: Array<{
      id: string;
      content: string;
      engagement: { likes: number; shares: number; comments: number };
      author: string;
      publishedAt: string;
      url?: string;
    }>;
    ads?: Array<{
      id: string;
      headline: string;
      body: string;
      cta: string;
      impressions: number;
      clicks: number;
      spend?: number;
      advertiser: string;
      url?: string;
    }>;
  };
  competitors?: string[];
  timeWindow?: string;
}

// ---------------------------------------------------------------------------
// Prompts
// ---------------------------------------------------------------------------

/**
 * System prompt pour l'agent Signal Analyst.
 */
export const SIGNAL_ANALYST_SYSTEM_PROMPT = `Tu es le Signal Analyst de Viral Copilot. Tu analyses les données brutes des sources sociales (TikTok, Meta Ads) pour identifier des signaux de tendances exploitables.

Ta mission :
1. Analyser les posts et publicités bruts fournis dans l'entrée
2. Repérer les patterns émergents : formats, angles, accroches, mécaniques virales
3. Évaluer la saturation de chaque signal (low / medium / high)
4. Déterminer la fenêtre d'action (immediate / short_term / long_term)
5. Attribuer un score de confiance (0–1) basé sur la quantité et la qualité des preuves
6. Identifier les mécaniques transférables et les éléments à ne pas copier

Règles :
- Sois précis et basé uniquement sur les données fournies
- Un signal doit avoir au moins un élément de preuve
- La saturation "high" signifie que le format est déjà omniprésent — l'opportunité est faible
- La confiance reflète la robustesse des preuves, pas ton intuition
- Distingue toujours ce qui est transférable (concept) de ce qui ne l'est pas (exécution spécifique)
- Les signaux "immediate" sont urgents (< 48h pour agir)
- Les signaux "short_term" sont exploitables dans la semaine
- Les signaux "long_term" sont des tendances structurelles

Réponds exclusivement en JSON, selon le schéma suivant :
{
  "signals": [
    {
      "id": "sig_001",
      "title": "Titre court du signal",
      "summary": "Résumé détaillé du pattern observé",
      "whyNow": "Pourquoi ce signal est pertinent maintenant",
      "confidence": 0.85,
      "saturation": "low",
      "actionWindow": "short_term",
      "source": "tiktok",
      "evidence": [
        {
          "type": "post",
          "excerpt": "Extrait représentatif du contenu",
          "sourceUrl": "https://...",
          "metricValue": 150000
        }
      ],
      "transferableMechanics": ["Format question-réponse", "Tension narrative en 3 secondes"],
      "doNotCopy": ["Marque déposée X", "Mascotte spécifique Y"]
    }
  ],
  "metrics": {
    "totalPostsAnalyzed": 150,
    "totalEngagement": 2450000,
    "avgEngagementRate": 0.048,
    "timeWindow": "7 derniers jours"
  }
}

Ne produis aucun texte hors JSON.`;

/**
 * Construit le prompt utilisateur pour le Signal Analyst.
 */
export function buildSignalAnalystPrompt(input: SignalAnalystInput): string {
  const parts: string[] = [
    `Analyse les données suivantes pour la niche "${input.niche}" (source : ${input.source}).`,
    ``,
  ];

  if (input.rawData.posts && input.rawData.posts.length > 0) {
    parts.push(`--- Posts (${input.rawData.posts.length}) ---`);
    for (const post of input.rawData.posts) {
      parts.push(
        `ID: ${post.id} | Auteur: ${post.author} | Date: ${post.publishedAt}`,
      );
      parts.push(`Contenu: ${post.content}`);
      parts.push(
        `Engagement: \u2705${post.engagement.likes} \U0001f504${post.engagement.shares} \U0001f4ac${post.engagement.comments}`,
      );
      if (post.url) parts.push(`URL: ${post.url}`);
      parts.push(``);
    }
  }

  if (input.rawData.ads && input.rawData.ads.length > 0) {
    parts.push(`--- Publicit\u00e9s (${input.rawData.ads.length}) ---`);
    for (const ad of input.rawData.ads) {
      parts.push(`ID: ${ad.id} | Annonceur: ${ad.advertiser}`);
      parts.push(`Headline: ${ad.headline}`);
      parts.push(`Body: ${ad.body}`);
      parts.push(`CTA: ${ad.cta}`);
      parts.push(`Impressions: ${ad.impressions} | Clicks: ${ad.clicks}`);
      if (ad.spend !== undefined) parts.push(`D\u00e9penses: ${ad.spend}`);
      if (ad.url) parts.push(`URL: ${ad.url}`);
      parts.push(``);
    }
  }

  if (input.competitors && input.competitors.length > 0) {
    parts.push(`Concurrents suivis : ${input.competitors.join(", ")}`);
    parts.push(``);
  }

  if (input.timeWindow) {
    parts.push(`Fen\u00eatre temporelle : ${input.timeWindow}`);
    parts.push(``);
  }

  parts.push(
    `Produis un rapport JSON complet avec les signaux identifi\u00e9s et les m\u00e9triques agr\u00e9g\u00e9es.`,
  );

  return parts.join("\n");
}