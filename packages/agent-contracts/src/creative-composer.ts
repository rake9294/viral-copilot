import { z } from "zod";

// ---------------------------------------------------------------------------
// Creative Composer — prend une stratégie et génère hooks, scripts, storyboard
// ---------------------------------------------------------------------------

/**
 * Type de hook.
 */
export const ComposerHookTypeSchema = z.enum([
  "curiosity_gap",
  "problem_agitation",
  "outcome_tease",
  "story_opener",
  "debate_hot_take",
  "stat_shock",
  "myth_buster",
  "identity_anchor",
]);

export type ComposerHookType = z.infer<typeof ComposerHookTypeSchema>;

/**
 * Hook complet généré par le Creative Composer.
 */
export const ComposerHookSchema = z.object({
  type: ComposerHookTypeSchema,
  text: z.string().min(1, "Le texte du hook est requis"),
  onScreenText: z
    .string()
    .optional()
    .describe("Texte superposé à l'écran (si applicable)"),
  visualDescription: z
    .string()
    .optional()
    .describe("Description de ce qui se passe visuellement pendant le hook"),
  expectedRetention: z.number().min(0).max(1).optional(),
  alternativeVersions: z
    .array(z.string())
    .optional()
    .describe("Variantes alternatives du hook"),
});

export type ComposerHook = z.infer<typeof ComposerHookSchema>;

/**
 * Plan du storyboard (une scène).
 */
export const ComposerStoryboardFrameSchema = z.object({
  scene: z.number().int().min(1, "Le numéro de scène doit être >= 1"),
  timing: z
    .string()
    .min(1, "Le timing est requis")
    .describe("Ex: '0:00 - 0:03'"),
  duration: z.number().optional().describe("Durée en secondes"),
  visual: z.string().min(1, "La description visuelle est requise"),
  audio: z
    .string()
    .optional()
    .describe("Description de l'audio / voix-off / musique"),
  textOverlay: z
    .string()
    .optional()
    .describe("Texte affiché à l'écran pendant cette scène"),
  camera: z
    .string()
    .optional()
    .describe("Mouvement de caméra, ex: 'zoom progressif', 'coupe franche'"),
  transition: z
    .string()
    .optional()
    .describe("Transition vers la scène suivante"),
});

export type ComposerStoryboardFrame = z.infer<
  typeof ComposerStoryboardFrameSchema
>;

/**
 * Script complet d'une vidéo.
 */
export const ComposerScriptSchema = z.object({
  format: z.enum(["short", "demonstrative"]),
  estimatedDuration: z
    .string()
    .min(1, "La durée estimée est requise")
    .describe("Ex: '15 secondes', '45 secondes'"),
  hook: z.string().min(1, "Le hook du script est requis"),
  body: z.string().min(1, "Le corps du script est requis"),
  cta: z.string().min(1, "L'appel à l'action est requis"),
  voiceOver: z
    .string()
    .optional()
    .describe("Texte de la voix-off complet"),
  captions: z
    .string()
    .optional()
    .describe("Sous-titres / textes à l'écran"),
});

export type ComposerScript = z.infer<typeof ComposerScriptSchema>;

/**
 * Méta-données de la production.
 */
export const ComposerProductionMetadataSchema = z.object({
  recommendedMusicGenre: z.string().optional(),
  editingStyle: z
    .string()
    .optional()
    .describe("Style de montage, ex: 'cut rapide', 'transition fluide'"),
  thumbnailDescription: z.string().optional(),
  hashtags: z.array(z.string()).optional(),
  mentions: z.array(z.string()).optional(),
  seoKeywords: z.array(z.string()).optional(),
});

export type ComposerProductionMetadata = z.infer<
  typeof ComposerProductionMetadataSchema
>;

// ---------------------------------------------------------------------------
// Production créative complète
// ---------------------------------------------------------------------------

/**
 * Production créative complète générée par le Creative Composer.
 */
export const ComposerCreativeOutputSchema = z.object({
  hooks: z
    .array(ComposerHookSchema)
    .min(1, "Au moins un hook est requis")
    .max(5, "Maximum 5 hooks"),
  scripts: z
    .array(ComposerScriptSchema)
    .min(1, "Au moins un script est requis"),
  storyboard: z
    .array(ComposerStoryboardFrameSchema)
    .min(1, "Au moins une scène de storyboard est requise"),
  metadata: ComposerProductionMetadataSchema.optional(),
  platformSpecifics: z
    .object({
      tiktok: z
        .string()
        .optional()
        .describe("Ajustements spécifiques TikTok"),
      meta: z
        .string()
        .optional()
        .describe("Ajustements spécifiques Meta (Reels/Stories/Feed)"),
    })
    .optional(),
  notes: z.string().optional(),
});

export type ComposerCreativeOutput = z.infer<
  typeof ComposerCreativeOutputSchema
>;

// ---------------------------------------------------------------------------
// Input pour le Creative Composer
// ---------------------------------------------------------------------------

/**
 * Entrée du Creative Composer — une stratégie validée du Strategist.
 */
export interface ComposerInput {
  strategy: {
    opportunity: {
      title: string;
      objective: string;
      targetPersona?: string;
      hookConcepts: Array<{
        type: string;
        text: string;
        rationale: string;
      }>;
      visualDirection: {
        mood: string;
        colorPalette?: string[];
        visualCues: string[];
        referenceStyle?: string;
      };
      narrativeStructure: Array<{
        timing: string;
        description: string;
        hookType?: string;
        cta?: string;
      }>;
      keyMessage: string;
      emotionalTriggers?: string[];
    };
    timing?: {
      bestDay?: string;
      bestTime?: string;
    };
    kpis?: string[];
    testingApproach?: string;
    notes?: string;
  };
  niche: string;
  brand?: {
    name: string;
    tone: string;
    products?: string[];
  };
  outputPreferences?: {
    hooksCount?: number;
    scriptFormats?: Array<"short" | "demonstrative">;
    includeStoryboard?: boolean;
  };
}

// ---------------------------------------------------------------------------
// Prompts
// ---------------------------------------------------------------------------

/**
 * System prompt pour l'agent Creative Composer.
 */
export const CREATIVE_COMPOSER_SYSTEM_PROMPT = `Tu es le Creative Composer de Viral Copilot. Tu transformes une stratégie créative validée en hooks percutants, scripts prêts à tourner, et storyboard plan-par-plan.

Ta mission :
1. Générer 3 hooks distincts de types variés (curiosity_gap, problem_agitation, outcome_tease, story_opener, debate_hot_take, stat_shock, myth_buster, identity_anchor)
2. Produire 2 scripts complets : un format court (15-25s) et un format démonstratif (30-60s)
3. Décomposer le storytelling en storyboard frame par frame
4. Suggérer des métadonnées de production (musique, montage, miniature, hashtags)

Règles pour les hooks :
- Chaque hook doit être percutant et stoppant le scroll
- Inclure le texte, une description visuelle, et un texte overlay si pertinent
- Proposer des variantes alternatives pour chaque hook
- Le type identity_anchor est puissant pour les niches communautaires

Règles pour les scripts :
- Format court : hook immédiat (< 2s), message central, CTA rapide
- Format démonstratif : hook, contexte, démonstration, résultat, CTA
- Chaque script doit avoir un CTA clair et actionnable
- La voix-off et les sous-titres doivent être rédigés textuellement

Règles pour le storyboard :
- Décomposer plan par plan avec timing précis
- Décrire le visuel, l'audio, le texte overlay, la caméra
- Proposer une transition entre chaque scène
- Minimum 5 frames pour un format court, 8+ pour un format démonstratif

Règles générales :
- Le contenu doit être prêt à produire — pas de "à adapter"
- Les hashtags et mots-clés SEO doivent être spécifiques à la niche
- Si la stratégie mentionne des déclencheurs émotionnels, chaque frame doit en exploiter au moins un
- Ne pas dépasser 5 hooks

Réponds exclusivement en JSON, selon le schéma suivant :
{
  "hooks": [
    {
      "type": "curiosity_gap",
      "text": "Le vrai coût de [X] que personne ne calcule",
      "onScreenText": "Le vrai coût 👆",
      "visualDescription": "Personne qui calcule sur un coin de table, arrêt sur une calculatrice",
      "expectedRetention": 0.65,
      "alternativeVersions": [
        "Tu sais combien coûte vraiment [X] ?",
        "Personne ne te parle du coût caché de [X]"
      ]
    }
  ],
  "scripts": [
    {
      "format": "short",
      "estimatedDuration": "15 secondes",
      "hook": "Le vrai coût de X que personne ne calcule",
      "body": "La plupart des gens pensent que X coûte Y. En réalité... [corps du message]. Et c'est là que ça devient intéressant.",
      "cta": "Clique sur le lien en bio pour calculer le tien",
      "voiceOver": "Texte complet de la voix-off...",
      "captions": "Sous-titres à afficher..."
    }
  ],
  "storyboard": [
    {
      "scene": 1,
      "timing": "0:00 - 0:03",
      "duration": 3,
      "visual": "Description de l'image",
      "audio": "Musique montante, bruit de clavier",
      "textOverlay": "Texte à l'écran",
      "camera": "Zoom avant lent",
      "transition": "Cut sec"
    }
  ],
  "metadata": {
    "recommendedMusicGenre": "Lo-fi beats / minimaliste",
    "editingStyle": "Cut rapide avec transitions liquides",
    "thumbnailDescription": "Visage expressif + texte choc sur fond contrasté",
    "hashtags": ["#niche", "#tendance", "#astuce"],
    "mentions": ["@compte_influenceur"],
    "seoKeywords": ["mot clé 1", "mot clé 2"]
  },
  "platformSpecifics": {
    "tiktok": "Version plus brut, moins produite",
    "meta": "Ajouter un carousel d'images avant la vidéo"
  },
  "notes": "Notes du compositeur"
}

Ne produis aucun texte hors JSON.`;

/**
 * Construit le prompt utilisateur pour le Creative Composer.
 */
export function buildCreativeComposerPrompt(input: ComposerInput): string {
  const parts: string[] = [
    `Génère les hooks, scripts et storyboard pour la niche "${input.niche}" à partir de la stratégie suivante.`,
    ``,
    `--- Opportunité stratégique ---`,
    `Titre: ${input.strategy.opportunity.title}`,
    `Objectif: ${input.strategy.opportunity.objective}`,
  ];

  if (input.strategy.opportunity.targetPersona) {
    parts.push(`Persona cible: ${input.strategy.opportunity.targetPersona}`);
  }

  parts.push(`Message clé: ${input.strategy.opportunity.keyMessage}`);
  parts.push(``);
  parts.push(`--- Concepts d'accroche ---`);
  for (const hook of input.strategy.opportunity.hookConcepts) {
    parts.push(`- [${hook.type}] ${hook.text}`);
    parts.push(`  Justification: ${hook.rationale}`);
  }

  parts.push(``);
  parts.push(`--- Direction visuelle ---`);
  parts.push(`Ambiance: ${input.strategy.opportunity.visualDirection.mood}`);
  if (input.strategy.opportunity.visualDirection.colorPalette) {
    parts.push(
      `Palette: ${input.strategy.opportunity.visualDirection.colorPalette.join(", ")}`,
    );
  }
  parts.push(
    `Indices visuels: ${input.strategy.opportunity.visualDirection.visualCues.join(", ")}`,
  );
  if (input.strategy.opportunity.visualDirection.referenceStyle) {
    parts.push(
      `Style de référence: ${input.strategy.opportunity.visualDirection.referenceStyle}`,
    );
  }

  parts.push(``);
  parts.push(`--- Structure narrative ---`);
  for (const beat of input.strategy.opportunity.narrativeStructure) {
    parts.push(`  [${beat.timing}] ${beat.description}`);
    if (beat.hookType) parts.push(`    Hook: ${beat.hookType}`);
    if (beat.cta) parts.push(`    CTA: ${beat.cta}`);
  }

  if (
    input.strategy.opportunity.emotionalTriggers &&
    input.strategy.opportunity.emotionalTriggers.length > 0
  ) {
    parts.push(
      `\nDéclencheurs émotionnels: ${input.strategy.opportunity.emotionalTriggers.join(", ")}`,
    );
  }

  parts.push(``);

  if (input.brand) {
    parts.push(`--- Marque ---`);
    parts.push(`Nom: ${input.brand.name}`);
    parts.push(`Tonalité: ${input.brand.tone}`);
    if (input.brand.products && input.brand.products.length > 0) {
      parts.push(`Produits: ${input.brand.products.join(", ")}`);
    }
    parts.push(``);
  }

  if (input.outputPreferences) {
    parts.push(`--- Préférences de sortie ---`);
    if (input.outputPreferences.hooksCount) {
      parts.push(
        `Nombre de hooks souhaité: ${input.outputPreferences.hooksCount}`,
      );
    }
    if (input.outputPreferences.scriptFormats) {
      parts.push(
        `Formats de script: ${input.outputPreferences.scriptFormats.join(", ")}`,
      );
    }
    if (input.outputPreferences.includeStoryboard === false) {
      parts.push(`Ne pas inclure de storyboard`);
    }
    parts.push(``);
  }

  if (input.strategy.notes) {
    parts.push(`Notes du Strategist: ${input.strategy.notes}`);
    parts.push(``);
  }

  parts.push(
    `Produis la création complète en JSON selon le schéma fourni.`,
  );

  return parts.join("\n");
}