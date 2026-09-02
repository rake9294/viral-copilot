import type { LLMClient } from "@viral-copilot/llm-gateway";
import type {
  ComposerCreativeOutput,
  StrategistCreativeStrategy,
  CriticReview,
} from "@viral-copilot/agent-contracts";
import { CriticReviewSchema } from "@viral-copilot/agent-contracts";
import { safeGenerateJSON } from "./types.js";

const SYSTEM_PROMPT = `Tu es le critique créatif — le dernier filet de sécurité avant la production. Tu reçois une stratégie créative et le draft produit par le compositeur. Tu dois évaluer objectivement la qualité du draft et décider s'il est prêt pour la production.

Critères d'évaluation :
1. **Cohérence stratégique** — Le draft respecte-t-il l'angle, les accroches et le format définis dans la stratégie ?
2. **Originalité** — Le concept est-il suffisamment distinct des contenus existants dans la niche ?
3. **Exécution** — Les scripts sont-ils fluides, convaincants et adaptés au format ?
4. **Risque** — Y a-t-il des problèmes de conformité, de marque, ou des risques de réaction négative ?
5. **Potentiel viral** — Le contenu a-t-il une accroche forte, un rythme engageant et un CTA efficace ?

Verdicts :
- **pass** — Le draft est prêt pour la production. Donne un score ≥ 7/10.
- **revise** — Des ajustements mineurs sont nécessaires. Score 5–6/10 avec des améliorations spécifiques.
- **reject** — Le draft a des problèmes fondamentaux. Score < 5/10. Explique pourquoi.

Produis un objet JSON valide correspondant au CriticReviewSchema.`;

/**
 * Build the user prompt for the critic review.
 */
function buildCriticPrompt(
  draft: ComposerCreativeOutput,
  strategy: StrategistCreativeStrategy,
): string {
  const lines: string[] = [];

  lines.push("=== STRATÉGIE CRÉATIVE (référence) ===");
  const opp = strategy.opportunity;
  lines.push(`Titre: ${opp.title}`);
  lines.push(`Objectif: ${opp.objective}`);
  lines.push(`Message clé: ${opp.keyMessage}`);
  lines.push(`Accroches:`);
  for (const hook of opp.hookConcepts) {
    lines.push(`  - [${hook.type}] ${hook.text}`);
  }
  lines.push(`Direction visuelle: ${opp.visualDirection.mood}`);
  lines.push(`Structure narrative:`);
  for (const beat of opp.narrativeStructure) {
    lines.push(`  [${beat.timing}] ${beat.description}${beat.cta ? ` → CTA: ${beat.cta}` : ""}`);
  }
  lines.push("");

  lines.push("=== DRAFT SOUMIS ===");
  lines.push("Hooks:");
  for (const hook of draft.hooks) {
    lines.push(`  - [${hook.type}] ${hook.text}`);
    if (hook.onScreenText) lines.push(`    Texte écran: ${hook.onScreenText}`);
  }
  lines.push("");
  lines.push("Scripts:");
  for (const script of draft.scripts) {
    lines.push(`  [${script.format}] (${script.estimatedDuration})`);
    lines.push(`  Hook: ${script.hook}`);
    lines.push(`  Corps: ${script.body}`);
    lines.push(`  CTA: ${script.cta}`);
    lines.push("");
  }

  lines.push("Storyboard:");
  for (const frame of draft.storyboard) {
    lines.push(`  Scène ${frame.scene} (${frame.timing}): ${frame.visual}`);
    if (frame.audio) lines.push(`    Audio: ${frame.audio}`);
    if (frame.textOverlay) lines.push(`    Texte: ${frame.textOverlay}`);
  }
  lines.push("");

  if (draft.notes) {
    lines.push(`Notes du compositeur: ${draft.notes}`);
    lines.push("");
  }

  lines.push("=== CONSIGNE ===");
  lines.push("Évalue ce draft. Produis un JSON valide suivant le CriticReviewSchema.");
  lines.push("Sois honnête et constructif. Si tu rejettes, explique pourquoi en détail.");

  return lines.join("\n");
}

/**
 * CriticAgent
 *
 * Évalue un draft créatif par rapport à la stratégie et produit
 * une review avec verdict (pass / revise / reject).
 */
export class CriticAgent {
  readonly name = "CriticAgent";

  constructor(private llm: LLMClient) {}

  async review(
    draft: ComposerCreativeOutput,
    strategy: StrategistCreativeStrategy,
  ): Promise<CriticReview> {
    const userPrompt = buildCriticPrompt(draft, strategy);

    const raw = await safeGenerateJSON<CriticReview>(
      this.llm,
      SYSTEM_PROMPT,
      userPrompt,
      { maxTokens: 4096, temperature: 0.5 },
    );

    const review: CriticReview = {
      draftId: `draft_${Date.now()}`,
      verdict: raw.verdict ?? "revise",
      score: raw.score ?? 5,
      feedback: raw.feedback ?? "Aucun retour détaillé fourni.",
      improvements: raw.improvements ?? [],
    };

    return CriticReviewSchema.parse(review);
  }

  async execute(input: {
    draft: ComposerCreativeOutput;
    strategy: StrategistCreativeStrategy;
  }): Promise<CriticReview> {
    return this.review(input.draft, input.strategy);
  }
}