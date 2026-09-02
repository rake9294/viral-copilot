// Local type definitions (independent of Drizzle schema for component freedom)
export interface ScanRun {
  id: string;
  radarId: string;
  status: string;
  source: string;
  startedAt: Date;
  completedAt: Date | null;
  duration: number | null;
  costCredits: number | null;
  modelUsed: string | null;
  errorMessage: string | null;
  createdAt: Date;
}

export interface Opportunity {
  id: string;
  runId: string;
  title: string;
  description: string;
  score: number;
  confidence: number;
  source: string;
  status: string;
  observedMetrics: Record<string, number>;
  cohortComparison: {
    baseline: string;
    uplift: number;
    sampleSize: number;
  };
  evidence: Array<{
    id: string;
    type: string;
    content: string;
    url?: string;
  }>;
  creativeCluster: string[];
  signalExplanation: string;
  transferableElements: string[];
  doNotCopy: string[];
  createdAt: Date;
}

export interface CreativeDraft {
  id: string;
  opportunityId: string;
  version: number;
  status: string;
  hooks: {
    visual: string;
    verbal: string;
    onScreenText: string;
  };
  scripts: {
    short: string;
    demonstrative: string;
  };
  storyboard: Array<{
    shot: number;
    duration: number;
    description: string;
    visual: string;
    audio: string;
    text?: string;
  }>;
  productionBrief: {
    duration: number;
    format: string;
    aspectRatio: string;
    visualStyle: string;
    audioDirection: string;
    references: string[];
    requirements: string[];
  };
  similarityReport: {
    existingContent: string[];
    similarityScore: number;
    concerns: string[];
  };
  criticReport: {
    verdict: string;
    score: number;
    feedback: string;
    improvements: string[];
  };
  createdAt: Date;
}

// === Mock Scan Runs ===
export const mockRuns: ScanRun[] = [
  {
    id: "run-001",
    radarId: "radar-001",
    status: "completed",
    source: "tiktok",
    startedAt: new Date("2026-09-02T10:00:00Z"),
    completedAt: new Date("2026-09-02T10:02:30Z"),
    duration: 150,
    costCredits: 4.2,
    modelUsed: "gpt-4o-2026-08-15",
    errorMessage: null,
    createdAt: new Date("2026-09-02T10:00:00Z"),
  },
  {
    id: "run-002",
    radarId: "radar-001",
    status: "partial",
    source: "meta",
    startedAt: new Date("2026-09-01T14:30:00Z"),
    completedAt: new Date("2026-09-01T14:31:45Z"),
    duration: 105,
    costCredits: 2.8,
    modelUsed: "gpt-4o-mini",
    errorMessage: null,
    createdAt: new Date("2026-09-01T14:30:00Z"),
  },
  {
    id: "run-003",
    radarId: "radar-002",
    status: "insufficient_signal",
    source: "tiktok",
    startedAt: new Date("2026-08-31T09:15:00Z"),
    completedAt: new Date("2026-08-31T09:16:20Z"),
    duration: 80,
    costCredits: 1.5,
    modelUsed: "gpt-4o-mini",
    errorMessage: "Signal trop faible pour le marché FR — < 50 posts pertinents",
    createdAt: new Date("2026-08-31T09:15:00Z"),
  },
  {
    id: "run-004",
    radarId: "radar-001",
    status: "failed",
    source: "meta",
    startedAt: new Date("2026-08-30T16:00:00Z"),
    completedAt: null,
    duration: null,
    costCredits: 0.5,
    modelUsed: "gpt-4o-2026-08-15",
    errorMessage: "Rate limit Meta API dépassé — quota journalier épuisé",
    createdAt: new Date("2026-08-30T16:00:00Z"),
  },
  {
    id: "run-005",
    radarId: "radar-003",
    status: "running",
    source: "meta",
    startedAt: new Date("2026-09-02T11:00:00Z"),
    completedAt: null,
    duration: null,
    costCredits: null,
    modelUsed: "gpt-4o-2026-08-15",
    errorMessage: null,
    createdAt: new Date("2026-09-02T11:00:00Z"),
  },
];

export const runMap: Record<string, ScanRun> = {};
for (const r of mockRuns) {
  runMap[r.id] = r;
}

// === Mock Opportunities ===
export const mockOpportunities: Opportunity[] = [
  {
    id: "opp-001",
    runId: "run-001",
    title: "Routine capillaire minimaliste — format doudou",
    description:
      "Format doudou/low-effort qui décortique une routine capillaire en 3 étapes. Le compte @hairybelle passe de 12K à 180K en 6 semaines avec ce format.",
    score: 88,
    confidence: 75,
    source: "tiktok",
    status: "pending_review",
    observedMetrics: {
      avgViews: 245000,
      engagementRate: 8.2,
      saveRate: 14.5,
      shareRate: 3.1,
      followerGrowth: 168000,
    },
    cohortComparison: {
      baseline: "Routines capillaires long format (2-3 min)",
      uplift: 340,
      sampleSize: 47,
    },
    evidence: [
      {
        id: "ev-001",
        type: "post",
        content:
          "@hairybelle — 'ma morning routine en 30 secondes' — 890K vues, 12.4% ER",
        url: "https://tiktok.com/@hairybelle/video/123",
      },
      {
        id: "ev-002",
        type: "trend",
        content:
          "#minimalhaircare +420% de croissance volume de recherche en 30 jours",
      },
      {
        id: "ev-003",
        type: "comment",
        content:
          "Top commentaires: 'Enfin une routine simple', 'J'ai testé et ça marche', 'Pourquoi j'ai pas fait ça plus tôt'",
      },
    ],
    creativeCluster: [
      "Routine minimaliste (3 produits max)",
      "Format doudou ASMR",
      "Voix off chuchotée + bruits de produits",
    ],
    signalExplanation:
      "Le marché capillaire FR est saturé de formats longs. Le gap identifié : un format sous-60 secondes avec une promesse de simplicité. Le compte hairy belle a trouvé la friction (trop d'étapes → abandon) et l'a inversée. L'engagement rate de 8.2% sur ce format est 3x la moyenne du segment.",
    transferableElements: [
      "Structure 3 étapes maximum",
      "Musique douce / ASMR ambiant",
      "Titre en 'ma routine en X secondes'",
      "Gros plan produits en opening",
    ],
    doNotCopy: [
      "La voix spécifique de l'ASMR hairy belle",
      "Son agencement de produits exact",
      "Sa charte colorimétrique pastel",
    ],
    createdAt: new Date("2026-09-02T10:02:30Z"),
  },
  {
    id: "opp-002",
    runId: "run-002",
    title: "Produits ciblés cheveux crépus — review honnête",
    description:
      "Format review sans filtre de produits capillaires pour cheveux crépus / texturés. Gap dans le marché FR : les reviews existantes sont soit trop promotionnelles, soit trop négatives.",
    score: 62,
    confidence: 45,
    source: "meta",
    status: "pending_review",
    observedMetrics: {
      avgViews: 82000,
      engagementRate: 5.1,
      saveRate: 8.2,
      shareRate: 1.8,
      followerGrowth: 21000,
    },
    cohortComparison: {
      baseline: "Reviews capillaires standards FR",
      uplift: 85,
      sampleSize: 23,
    },
    evidence: [
      {
        id: "ev-004",
        type: "post",
        content:
          "Honnête review produit X — 43 commentaires, 92% positifs, 0 sponsored",
      },
      {
        id: "ev-005",
        type: "trend",
        content:
          "#naturalhair +180% en FR en 60 jours, mais peu de contenu FR natif",
      },
    ],
    creativeCluster: [
      "Review non-sponsorisée",
      "Format 'je vous dis tout'",
      "Comparaison avant/après 30 jours",
    ],
    signalExplanation:
      "Signal partiel : les données Meta montrent un intérêt croissant mais l'échantillon FR est encore petit (23 posts). La confiance est limitée par la saisonnalité (rentrée = pic naturel). À surveiller dans 2 semaines.",
    transferableElements: [
      "Ton honnête / sans filtre",
      "Avant-après temporel (30 jours)",
      "Liste d'ingrédients à l'écran",
    ],
    doNotCopy: [
      "La marque spécifique reviewée",
      "Le physique / type de cheveu du créateur original",
    ],
    createdAt: new Date("2026-09-01T14:31:45Z"),
  },
  {
    id: "opp-003",
    runId: "run-001",
    title: "Coiffures rapides pour le travail — format tuto 15s",
    description:
      "Tutoriel ultra-court (15s) de coiffures simples pour aller au bureau. Explosion sur TikTok US, arrivée progressive en FR.",
    score: 75,
    confidence: 62,
    source: "tiktok",
    status: "accepted",
    observedMetrics: {
      avgViews: 156000,
      engagementRate: 6.8,
      saveRate: 22.4,
      shareRate: 4.5,
      followerGrowth: 45000,
    },
    cohortComparison: {
      baseline: "Tutos coiffure long format FR",
      uplift: 210,
      sampleSize: 38,
    },
    evidence: [
      {
        id: "ev-006",
        type: "post",
        content:
          "@hairfast — '3 coiffures en 15s' — 1.2M vues, 22% save rate",
      },
      {
        id: "ev-007",
        type: "trend",
        content:
          "#quickhairstyle +560% en FR — trend émergent sur les 30 derniers jours",
      },
    ],
    creativeCluster: [
      "Tuto 15 secondes max",
      "Split screen (résultat / action)",
      "Musique upbeat + chrono visuel",
    ],
    signalExplanation:
      "Trend US confirmé en FR avec acceleration. Le save rate de 22.4% indique un fort intent de replay. Le format 15s est sous-exploité en FR.",
    transferableElements: [
      "Format 15s chronométré",
      "Split screen démonstratif",
      "Titre '3 coiffures en 15s'",
      "Call to save implicite",
    ],
    doNotCopy: [
      "Les coiffures spécifiques du créateur",
      "Sa texture de cheveux / type",
      "L'esthétique très US du compte source",
    ],
    createdAt: new Date("2026-09-02T10:02:30Z"),
  },
];

export const oppMap: Record<string, Opportunity> = {};
for (const o of mockOpportunities) {
  oppMap[o.id] = o;
}

// === Mock Creative Drafts ===
export const mockDrafts: CreativeDraft[] = [
  {
    id: "draft-001",
    opportunityId: "opp-001",
    version: 3,
    status: "reviewing",
    hooks: {
      visual:
        "Ouverture en gros plan produit (flacon doré) sur fond noir. Main qui taps doucement le produit. Transition fondu vers miroir embué.",
      verbal:
        "Voix off chuchotée, rythme lent : 'La routine qui a changé mes cheveux — 3 produits, 30 secondes, zéro prise de tête.'",
      onScreenText:
        "Titre: 'MA ROUTINE EN 30S' en blanc serif. Ingrédients clés listés en bas à gauche en IBM Plex Mono. Callout 'Produit non spons' en haut à droite.",
    },
    scripts: {
      short:
        "[00:00-00:05] Opening — produit en main sur fond noir, bruit de pompe. Texte: '3 produits. 30s.'\n[00:05-00:15] Application rapide en miroir — chaque étape = 3s montée en vitesse x2\n[00:15-00:20] Résultat — cheveux brillants, sourire caméra. Texte: 'Testé 30 jours.'\n[00:20-00:25] Call to action — 'Ta routine minimaliste ? Dis moi en com.' Son: fondu musique douce.",
      demonstrative:
        "[00:00-00:08] Split screen: produit vs cheveux avant. Voix off: 'Avant: 12 produits, 8 minutes.'\n[00:08-00:20] Démonstration pas-à-pas en temps réel — chaque étape avec timer overlay\n[00:20-00:35] Résultat en lumière naturelle, rotation lente. Texte: 'Jour 30 — test clinique maison'\n[00:35-00:45] Comparaison avant/après côte-à-côte. Call to action: 'Épingle ce post, tu me remercieras.'",
    },
    storyboard: [
      {
        shot: 1,
        duration: 3,
        description: "Gros plan produit sur fond noir, éclairage latéral chaud",
        visual: "Dark studio, key light from right, product in focus",
        audio: "Silence puis bruit de pompe produit (ASMR)",
        text: "3 produits. 30s.",
      },
      {
        shot: 2,
        duration: 5,
        description:
          "Main appliquant produit cheveux devant miroir, vitesse x1.5",
        visual: "Medium shot mirror reflection, warm bathroom lighting",
        audio: "Musique douce ambient commence, volume bas",
        text: undefined,
      },
      {
        shot: 3,
        duration: 4,
        description: "Résultat final, cheveux brillants, lumière naturelle",
        visual: "Natural light window shot, model looking at camera",
        audio: "Voix off: 'Ça a changé mes cheveux'",
        text: "Jour 30",
      },
      {
        shot: 4,
        duration: 3,
        description:
          "Call to action — plan poitrine, sourire, texte incrusté",
        visual: "Medium shot, soft smile, direct eye contact",
        audio: "Musique swell, fondu fin",
        text: "Ta routine minimaliste ? Dis moi en com.",
      },
    ],
    productionBrief: {
      duration: 30,
      format: "Short-form vertical",
      aspectRatio: "9:16",
      visualStyle:
        "Dark minimal — fonds noirs, éclairage chaud directionnel, tons dorés/ambrés",
      audioDirection:
        "Voix off chuchotée (ton ASMR), musique ambient downtempo, bruits de produits en opening",
      references: [
        "@hairybelle format doudou original",
        "Référence éclairage produit Dyson Airwrap ads",
      ],
      requirements: [
        "Caméra smartphone ou mirrorless (24fps recommandé)",
        "Éclairage latéral chaud (Lume Cube ou équivalent)",
        "Fond noir (rouleau ou tissu velours)",
        "Micro-cravate pour voix off chuchotée",
      ],
    },
    similarityReport: {
      existingContent: [
        "@hairybelle — routine 30s (890K vues)",
        "@skinminimal — format doudou skincare adapté",
      ],
      similarityScore: 28,
      concerns: [
        "Le format doudou est déjà utilisé par hairybelle — notre twist doit être clairement identifiable",
        "Risque de similarité avec le trend ASMR skincare déjà existant",
      ],
    },
    criticReport: {
      verdict: "revise",
      score: 72,
      feedback:
        "La structure est solide mais le hook visuel manque de distinction. La voix off chuchotée est bien, mais le script 'short' est trop dense — 4 étapes en 25s laisse peu de respiration. Proposition : fusionner shots 2 et 3, ajouter un beat visuel entre application et résultat.",
      improvements: [
        "Réduire le nombre de shots de 4 à 3",
        "Ajouter un wipe transition entre application et résultat",
        "Rallonger le shot résultat à 6s vs 4s",
        "Ajouter un témoignage textuel superposé au résultat",
      ],
    },
    createdAt: new Date("2026-09-02T11:30:00Z"),
  },
  {
    id: "draft-002",
    opportunityId: "opp-003",
    version: 1,
    status: "draft",
    hooks: {
      visual:
        "Split screen vertical — gauche : cheveux attachés, droite : cheveux détachés. Transition éclair vers résultat final.",
      verbal:
        "Voix off dynamique : 'Tu as 15 secondes ? Moi aussi. Voici 3 coiffures qui prennent moins de temps que de choisir ta playlist.'",
      onScreenText:
        "Chrono en bas à droite (15, 14, 13…). Nom de chaque coiffure en haut en label. Callout ticking horloge à la fin.",
    },
    scripts: {
      short:
        "[00:00-00:03] Opening chrono — split screen cheveux avant/après\n[00:03-00:08] Coiffure 1 — 5s montrée en accéléré\n[00:08-00:13] Coiffure 2 — 5s, transition par rotation caméra\n[00:13-00:15] Résultat final + CTA 'Sauvegarde pour demain matin'",
      demonstrative:
        "[Scénario démo complet — 60s]\n[00:00-00:10] Mise en contexte : matin pressé, montre qui tourne\n[00:10-00:30] Coiffure 1 pas-à-pas avec voix off explicative\n[00:30-00:45] Coiffure 2 avec variante pour cheveux plus longs\n[00:45-00:60] Résultat + testimonial overlay",
    },
    storyboard: [
      {
        shot: 1,
        duration: 3,
        description:
          "Chrono part de 15, split screen cheveux attachés/détachés",
        visual: "Vertical split, bright studio lighting",
        audio: "Tic-tac horloge accéléré",
        text: "15:00",
      },
      {
        shot: 2,
        duration: 5,
        description:
          "Coiffure 1 en time-lapse, hands only POV avec overlay",
        visual: "Hands POV, fast motion x4",
        audio: "Voix off commence, upbeat instrumental",
        text: "Coiffure 1: Le chignon rapide",
      },
      {
        shot: 3,
        duration: 5,
        description:
          "Coiffure 2, transition par rotation caméra autour du sujet",
        visual: "360 rotation around model, medium shot",
        audio: "Musique monte en intensité",
        text: "Coiffure 2: La queue haute structurée",
      },
      {
        shot: 4,
        duration: 2,
        description: "Résultat final, sourire, CTA texte",
        visual: "Close-up model smiling, direct address",
        audio: "Musique stop brusque, silence",
        text: "Sauvegarde pour demain matin",
      },
    ],
    productionBrief: {
      duration: 15,
      format: "Short-form vertical",
      aspectRatio: "9:16",
      visualStyle:
        "Bright studio — fond clair, éclairage uniforme, tons neutres avec accent couleur sur accessoires cheveux",
      audioDirection:
        "Voix off dynamique et rythmée, upbeat instrumental (copyright-free), sound effect horloge en opening",
      references: [
        "@hairfast format 15s original",
        "Trend #quickhairstyle TikTok",
      ],
      requirements: [
        "Smartphone stabilisé ou trépied",
        "Deux coiffures variées (attache simple + semi-structurée)",
        "Accessoires cheveux visibles (élastiques, pinces)",
        "Minuteur visible pour effet chrono",
      ],
    },
    similarityReport: {
      existingContent: [
        "@hairfast — 3 quick hairstyles (1.2M vues)",
        "@beautyquick — format 15s similaire",
      ],
      similarityScore: 35,
      concerns: [
        "Le format chrono 15s est déjà largement utilisé",
        "Notre angle 'bureau' vs 'daily' est la seule vraie différenciation",
        "Risque de être noyé dans le contenu existant",
      ],
    },
    criticReport: {
      verdict: "pass",
      score: 81,
      feedback:
        "Excellent rythme et proposition claire. Le split screen opening accroche immédiatement. La musique upbeat et le chrono créent une urgence parfaite pour le format. Petit ajustement : le CTA final est faible comparé au reste — remplacer 'Sauvegarde' par 'Épingle pour ton morning routine'.",
      improvements: [
        "Renforcer le CTA final avec un verbe d'action plus fort",
        "Ajouter un sous-titre pour accessibilité (beaucoup regardent sans son)",
        "Considérer un 3e plan coiffure pour plus de valeur perçue",
      ],
    },
    createdAt: new Date("2026-09-02T11:45:00Z"),
  },
];

export const draftMap: Record<string, CreativeDraft> = {};
for (const d of mockDrafts) {
  draftMap[d.id] = d;
}

// === Mock Radars ===
export const mockRadars = [
  {
    id: "radar-001",
    name: "Soins capillaires — marché FR",
    source: "tiktok" as const,
    keywords: ["routine capillaire", "soins cheveux", "haircare france"],
    frequency: "daily" as const,
    status: "completed" as const,
    lastRunAt: new Date("2026-09-02T10:02:30Z"),
    createdAt: new Date("2026-08-15T08:00:00Z"),
    updatedAt: new Date("2026-09-02T10:02:30Z"),
  },
  {
    id: "radar-002",
    name: "Coiffures express — professionnel",
    source: "meta" as const,
    keywords: ["quick hairstyle", "coiffure rapide", "bureau"],
    frequency: "weekly" as const,
    status: "insufficient_signal" as const,
    lastRunAt: new Date("2026-08-31T09:16:20Z"),
    createdAt: new Date("2026-08-10T10:00:00Z"),
    updatedAt: new Date("2026-08-31T09:16:20Z"),
  },
  {
    id: "radar-003",
    name: "Soins cheveux crépus — FR",
    source: "meta" as const,
    keywords: ["cheveux crépus", "natural hair france", "soins texturés"],
    frequency: "daily" as const,
    status: "running" as const,
    lastRunAt: new Date("2026-09-02T11:00:00Z"),
    createdAt: new Date("2026-09-01T10:00:00Z"),
    updatedAt: new Date("2026-09-02T11:00:00Z"),
  },
];