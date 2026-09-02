# Viral Copilot : spécification de conception technique

**Date :** 2026-09-02  
**Statut :** design validé, en attente de revue du document  
**Nom de travail :** Viral Copilot  
**Première utilisation :** outil d’agence interne  
**Évolution visée :** SaaS self-service multi-tenant

## 1. Résumé exécutif

Viral Copilot détecte les signaux créatifs émergents dans une niche, explique pourquoi ils fonctionnent et génère des scripts, hooks, storyboards et briefs originaux prêts à valider.

La première version couvre :

- TikTok organique
- publicités Meta
- une utilisation interne
- la préparation de contenus, sans publication automatique
- une validation humaine avant tout livrable final

Le système utilise une architecture hybride :

- le code collecte, normalise, dédoublonne et score les données
- des fonctions LLM spécialisées interprètent les signaux et produisent les livrables
- MCP sert de couche d’intégration aux fournisseurs externes
- PostgreSQL reste la source de vérité
- un moteur de workflow durable contrôle l’ordre, les reprises, les quotas et les coûts

Le produit ne promet pas la viralité. Il réduit le temps entre l’apparition d’un signal marché et la création d’une adaptation originale prête à tester.

## 2. Problème produit

Les outils actuels donnent généralement l’un des résultats suivants :

- une bibliothèque d’annonces sans interprétation
- des tendances globales peu adaptées à une niche
- des métriques brutes difficiles à comparer
- des textes générés sans preuve de demande
- des contenus copiés trop littéralement
- un volume de recommandations impossible à exploiter

Viral Copilot doit relier quatre opérations dans un même flux traçable :

1. observer des contenus et publicités réels
2. mesurer leur caractère inhabituel dans un cohort comparable
3. expliquer les mécaniques créatives avec des preuves
4. transformer ces mécaniques en créations originales adaptées à une marque

## 3. Utilisateur initial et proposition de valeur

### 3.1 Utilisateur initial

L’utilisateur initial est l’opérateur interne de l’agence. Il configure une niche, lance ou planifie un radar, valide les opportunités et corrige les créations.

### 3.2 Utilisateur futur

Le futur utilisateur SaaS est une marque, un créateur, une agence ou un consultant marketing qui souhaite surveiller une niche sans construire sa propre infrastructure de données et d’IA.

### 3.3 Proposition de valeur

> À partir de données TikTok et Meta actuelles, Viral Copilot identifie les mécaniques créatives qui émergent dans votre niche, montre les preuves et génère un pack de contenu original prêt à produire.

### 3.4 Promesses exclues

Le produit ne doit pas promettre :

- un résultat viral garanti
- la rentabilité d’une publicité concurrente
- un ROAS ou un CPA concurrent sans données privées
- une couverture suffisante dans toutes les niches
- une publication autonome dans la première version
- la réutilisation des textes, médias ou identités de concurrents

## 4. Périmètre

### 4.1 Inclus dans la vague 1

- création d’un profil de niche
- collecte TikTok organique via un fournisseur MCP
- collecte Meta Ads via un fournisseur MCP et une source de vérification autorisée
- enregistrement de snapshots métriques
- normalisation vers un schéma commun
- dédoublonnage
- enrichissement textuel et visuel autorisé
- scoring TikTok et Meta séparé
- regroupement en familles créatives
- cartes d’opportunité sourcées
- génération de hooks, scripts, storyboards et briefs
- critique automatique
- validation humaine
- suivi des runs, erreurs, coûts et sources

### 4.2 Hors périmètre de la vague 1

- publication sur les réseaux
- achat média
- génération d’images ou de vidéos
- Instagram, YouTube, X et LinkedIn
- facturation
- onboarding self-service
- fine-tuning
- application mobile
- collaboration d’équipe avancée
- recommandations autonomes de budget publicitaire

## 5. Principes de conception

1. **Preuve avant interprétation.** Toute affirmation analytique référence des éléments de preuve persistés.
2. **Code avant LLM pour les métriques.** Le LLM ne calcule pas le score de signal.
3. **Sorties structurées.** Chaque fonction LLM retourne un JSON validé.
4. **Rejeu intégral.** Un résultat doit pouvoir être reproduit avec les données, prompts et modèles enregistrés.
5. **Dégradation explicite.** Une source manquante produit un statut partiel, jamais une conclusion fabriquée.
6. **Originalité contrôlée.** Le système transfère une mécanique, pas une expression créative protégée.
7. **Fournisseurs remplaçables.** Le domaine métier ne dépend pas du schéma d’un fournisseur.
8. **Humain dans la boucle.** Aucun pack créatif n’est final sans validation humaine dans la V1.
9. **Coût observable.** Chaque run, étape, source et appel LLM possède une consommation enregistrée.
10. **Signal insuffisant est une réponse valide.** Le produit refuse de fabriquer une tendance.

## 6. Architecture générale

```text
┌──────────────────────────────────────────────────────────────────┐
│ Interface Next.js                                                │
│ Niches | Radar | Opportunités | Studio | Runs | Évaluations      │
└───────────────────────────────┬──────────────────────────────────┘
                                │
┌───────────────────────────────▼──────────────────────────────────┐
│ API applicative TypeScript                                      │
│ Auth interne | Domaine | Validation | Autorisation | Audit       │
└───────────────┬───────────────────────────────┬──────────────────┘
                │                               │
┌───────────────▼──────────────┐  ┌─────────────▼──────────────────┐
│ Moteur de workflow durable   │  │ PostgreSQL + pgvector          │
│ Planification, reprise, coût │  │ État, preuves, mémoire, traces │
└───────────────┬──────────────┘  └────────────────────────────────┘
                │
┌───────────────▼──────────────────────────────────────────────────┐
│ Pipeline métier                                                  │
│ Collecte → Normalisation → Scoring → Clusters → Agents → Critique│
└───────────────┬───────────────────────────────┬──────────────────┘
                │                               │
┌───────────────▼──────────────┐  ┌─────────────▼──────────────────┐
│ Adaptateurs MCP             │  │ Passerelle LLM                 │
│ TrendTrack, Meta, futurs    │  │ Routage, fallback, budgets     │
└─────────────────────────────┘  └────────────────────────────────┘
```

## 7. Stack technique

### 7.1 Choix principal

- monorepo pnpm avec Turborepo
- TypeScript strict
- Next.js pour l’interface et les routes applicatives
- PostgreSQL managé
- pgvector pour les embeddings
- Trigger.dev pour les workflows durables et planifiés
- SDK MCP TypeScript avec transport Streamable HTTP
- Zod pour les entrées, sorties et contrats d’agents
- Vercel AI SDK ou passerelle TypeScript interne pour les fournisseurs LLM
- Langfuse pour les traces LLM et les évaluations
- Sentry pour les erreurs applicatives
- stockage objet compatible S3 pour les objets dont la conservation est autorisée
- Playwright pour les tests bout en bout
- Vitest pour les tests unitaires et d’intégration

### 7.2 Composants volontairement reportés

- Redis : ajouté seulement si les besoins de cache ou de limitation dépassent PostgreSQL et Trigger.dev
- Python : ajouté seulement pour un traitement média ou scientifique non viable en TypeScript
- Temporal : ajouté seulement si Trigger.dev ne satisfait plus les besoins de portabilité ou de volume
- Kubernetes : exclu avant une contrainte d’exploitation réelle
- Kafka : exclu avant un volume d’événements qui le justifie
- fine-tuning : exclu avant la constitution d’un corpus propriétaire suffisant

## 8. Organisation du monorepo

```text
viral-copilot/
├── apps/
│   └── web/
│       ├── app/
│       ├── components/
│       ├── server/
│       └── tests/
├── packages/
│   ├── domain/
│   ├── database/
│   ├── scoring/
│   ├── connectors/
│   ├── mcp-client/
│   ├── llm-gateway/
│   ├── agent-contracts/
│   ├── workflows/
│   ├── observability/
│   └── test-fixtures/
├── trigger/
│   ├── collect-source.ts
│   ├── enrich-item.ts
│   ├── score-cohort.ts
│   ├── cluster-patterns.ts
│   └── build-radar.ts
├── docs/
├── scripts/
└── package.json
```

Chaque package possède une responsabilité unique et n’importe que les contrats publics des autres packages.

## 9. Décisions d’architecture

| ID | Décision | Choix | Raison |
|---|---|---|---|
| ADR-001 | Forme du système | Workflow hybride | Fiabilité supérieure à un essaim d’agents autonomes |
| ADR-002 | Langage principal | TypeScript | Un seul langage pour le produit, MCP, workflow et interface |
| ADR-003 | État durable | PostgreSQL | Source de vérité relationnelle, audit et future isolation client |
| ADR-004 | Similarité | pgvector | Regroupement et anti-copie sans base vectorielle séparée |
| ADR-005 | Orchestration | Trigger.dev | Tâches longues, planification et reprise avec faible charge opérationnelle |
| ADR-006 | Connecteurs | Adaptateurs internes autour de MCP | Remplacer un fournisseur sans modifier le domaine |
| ADR-007 | Scoring | Déterministe et spécifique à chaque source | Éviter les scores inventés et les comparaisons trompeuses |
| ADR-008 | Agents | Fonctions stateless à sorties Zod | Testabilité, coûts contrôlés et rejeu |
| ADR-009 | Mémoire | Données structurées dans PostgreSQL | Pas de mémoire implicite ou opaque dans les conversations LLM |
| ADR-010 | Apprentissage initial | Règles et retrieval | Le fine-tuning serait prématuré et difficile à corriger |
| ADR-011 | Publication | Validation humaine hors publication | Réduire les risques de marque et de plateforme |
| ADR-012 | Données média | Conservation minimale selon les droits | Réduire les risques juridiques et les coûts de stockage |
| ADR-013 | Monétisation | Reportée à la vague SaaS | Valider la qualité du moteur avant l’infrastructure commerciale |
| ADR-014 | Multi-niche | Profil et cohortes configurables | Conserver un seul pipeline métier |

## 10. Couche de connecteurs

### 10.1 Contrat interne

```ts
interface ContentSourceAdapter {
  source: "tiktok_organic" | "meta_ads";
  checkAvailability(): Promise<SourceAvailability>;
  checkQuota(): Promise<QuotaState>;
  search(request: SearchRequest): Promise<SearchPage>;
  getItem(request: GetItemRequest): Promise<RawSourceItem>;
  getAdvertiser?(request: GetAdvertiserRequest): Promise<RawAdvertiser>;
}
```

### 10.2 Règles

- Aucun package métier ne manipule une réponse MCP brute.
- Chaque appel fournisseur possède un timeout et une politique de reprise.
- Les outils MCP autorisés sont déclarés dans une allowlist.
- Les outils de la V1 sont exclusivement en lecture seule.
- Les erreurs fournisseur sont traduites vers des codes internes stables.
- Les curseurs de pagination sont persistés.
- Les quotas sont vérifiés avant les recherches volumineuses.
- Les coûts estimés et réels sont enregistrés lorsque la source les expose.

### 10.3 Fournisseur initial

TrendTrack est le candidat initial pour TikTok organique et Meta Ads. Son utilisation commerciale reste conditionnée à la validation écrite de :

- l’usage en produit commercial
- la conservation des métriques
- la conservation ou non des médias et transcriptions
- l’affichage de données dérivées aux clients
- les limites de redistribution
- les quotas et la tarification
- la politique de résiliation et d’export

L’absence de validation bloque la vague 1 commerciale, mais ne bloque pas une preuve technique interne conforme aux conditions applicables.

## 11. Profil de niche

### 11.1 Entrée

Un profil de niche contient :

- nom du marché
- sous-niche
- pays
- langue
- personas
- problèmes
- résultats recherchés
- offres et catégories de produits
- concurrents
- comptes de référence
- mots et sujets interdits
- règles de conformité
- identité et ton de marque

### 11.2 Sortie du Niche Mapper

```ts
const NicheMapSchema = z.object({
  canonicalName: z.string(),
  personas: z.array(z.object({
    name: z.string(),
    pains: z.array(z.string()),
    desiredOutcomes: z.array(z.string()),
    vocabulary: z.array(z.string())
  })),
  seedQueries: z.array(z.string()),
  adjacentQueries: z.array(z.string()),
  competitorNames: z.array(z.string()),
  accountHandles: z.array(z.string()),
  exclusions: z.array(z.string()),
  complianceRules: z.array(z.string())
});
```

Le résultat est validé humainement avant la première collecte d’une niche.

### 11.3 Garde de couverture initiale

Les seuils initiaux sont configurables et versionnés. Ils servent de point de départ à la vague 0 :

- TikTok : au moins 50 contenus uniques issus d’au moins 10 auteurs sur les 30 derniers jours
- Meta Ads : au moins 20 annonces actives issues d’au moins 5 annonceurs sur les 90 derniers jours
- tendance candidate : au moins 3 auteurs ou annonceurs indépendants dans une même famille créative
- vélocité TikTok : au moins 2 snapshots métriques espacés dans le temps
- cohort de comparaison : au moins 30 éléments comparables

Si aucun canal ne passe sa garde de couverture, le run retourne `insufficient_signal`. Si un seul canal la passe, le run peut continuer en statut `partial`.

Ces seuils ne sont pas présentés comme des vérités statistiques universelles. La vague 0 les calibre sur un corpus annoté, puis toute modification crée une nouvelle version de politique de couverture.

## 12. Pipeline de données

### 12.1 Étapes

1. création ou mise à jour du profil de niche
2. génération et validation des requêtes
3. vérification des quotas et de la disponibilité des sources
4. collecte paginée
5. persistance des objets bruts autorisés
6. normalisation
7. dédoublonnage
8. création de snapshots métriques
9. enrichissement autorisé
10. calcul des dimensions de score
11. création des cohortes
12. regroupement en familles créatives
13. sélection des signaux candidats
14. analyse LLM avec preuves
15. création des opportunités
16. génération des packs créatifs
17. critique automatique
18. validation humaine
19. collecte du feedback
20. saisie ultérieure des résultats terrain

### 12.2 Idempotence

Chaque tâche possède une clé d’idempotence stable :

```text
workspace_id + niche_id + source + operation + query_hash + time_window + cursor
```

Une tâche rejouée retourne son résultat existant si les entrées et la version du traitement sont identiques.

### 12.3 États d’un run

- `queued`
- `running`
- `partial`
- `awaiting_review`
- `completed`
- `failed`
- `cancelled`

Un run `partial` peut produire un radar si les données restantes passent le seuil de couverture. Le rapport affiche les sources ou requêtes manquantes.

## 13. Modèle de données

### 13.1 Tables principales

#### `workspaces`

- `id`
- `name`
- `mode` : internal ou customer
- `created_at`
- `deleted_at`

#### `users`

- `id`
- `email`
- `name`
- `created_at`

#### `workspace_members`

- `workspace_id`
- `user_id`
- `role`

#### `niche_profiles`

- `id`
- `workspace_id`
- `name`
- `country_code`
- `language_code`
- `status`
- `input_json`
- `niche_map_json`
- `version`
- `created_at`
- `updated_at`

#### `source_connections`

- `id`
- `workspace_id`
- `provider`
- `source_type`
- `credential_reference`
- `status`
- `rights_policy_json`
- `last_checked_at`

#### `source_queries`

- `id`
- `niche_profile_id`
- `source_type`
- `query_text`
- `filters_json`
- `query_hash`
- `status`
- `last_run_at`

#### `source_items`

- `id`
- `workspace_id`
- `source_type`
- `external_id`
- `canonical_url`
- `author_external_id`
- `advertiser_external_id`
- `published_at`
- `first_seen_at`
- `last_seen_at`
- `raw_payload_reference`
- `content_fingerprint`
- `rights_class`
- `deleted_at`

Contrainte unique : `source_type + external_id`.

#### `metric_snapshots`

- `id`
- `source_item_id`
- `captured_at`
- `views`
- `likes`
- `comments`
- `shares`
- `saves`
- `followers`
- `reach_estimate`
- `days_running`
- `active_status`
- `countries_json`
- `metric_provenance_json`

#### `content_features`

- `id`
- `source_item_id`
- `extractor_version`
- `hook_text`
- `hook_type`
- `format`
- `angle`
- `emotion`
- `proof_type`
- `cta_type`
- `visual_style_json`
- `structure_json`
- `transcript_reference`
- `embedding`
- `created_at`

#### `score_snapshots`

- `id`
- `source_item_id`
- `niche_profile_id`
- `scoring_version`
- `cohort_definition_json`
- `dimensions_json`
- `composite_band`
- `confidence_band`
- `calculated_at`

#### `pattern_clusters`

- `id`
- `niche_profile_id`
- `cluster_version`
- `label`
- `centroid_embedding`
- `first_seen_at`
- `last_seen_at`
- `member_count`
- `independent_author_count`
- `status`

#### `pattern_members`

- `pattern_cluster_id`
- `source_item_id`
- `similarity`

#### `evidence_refs`

- `id`
- `source_item_id`
- `metric_snapshot_id`
- `content_feature_id`
- `evidence_type`
- `excerpt`
- `source_url`
- `captured_at`

#### `opportunities`

- `id`
- `workspace_id`
- `niche_profile_id`
- `pattern_cluster_id`
- `title`
- `summary`
- `why_now`
- `transferable_mechanics_json`
- `do_not_copy_json`
- `saturation_band`
- `action_window_band`
- `confidence_band`
- `status`
- `created_at`

#### `opportunity_evidence`

- `opportunity_id`
- `evidence_ref_id`
- `claim_key`

#### `creative_drafts`

- `id`
- `opportunity_id`
- `brand_memory_version`
- `generator_version`
- `hooks_json`
- `scripts_json`
- `storyboard_json`
- `production_brief_json`
- `risk_notes_json`
- `similarity_report_json`
- `status`
- `created_at`

#### `workflow_runs`

- `id`
- `workspace_id`
- `niche_profile_id`
- `workflow_version`
- `status`
- `input_hash`
- `started_at`
- `finished_at`
- `cost_json`
- `coverage_json`
- `error_summary_json`

#### `agent_steps`

- `id`
- `workflow_run_id`
- `agent_name`
- `agent_version`
- `model_provider`
- `model_name`
- `prompt_version`
- `input_reference`
- `output_reference`
- `status`
- `latency_ms`
- `token_usage_json`
- `cost_amount`
- `error_json`

#### `human_feedback`

- `id`
- `workspace_id`
- `entity_type`
- `entity_id`
- `decision`
- `reason_code`
- `comment`
- `edited_payload_json`
- `created_by`
- `created_at`

#### `brand_rules`

- `id`
- `workspace_id`
- `niche_profile_id`
- `rule_type`
- `rule_text`
- `source_feedback_id`
- `status`
- `version`
- `created_at`

#### `published_outcomes`

- `id`
- `creative_draft_id`
- `platform`
- `external_post_id`
- `published_at`
- `metrics_json`
- `business_outcomes_json`
- `captured_at`

## 14. Normalisation et provenance

Chaque métrique possède une provenance :

- `observed` : donnée directement exposée par la plateforme ou le fournisseur
- `estimated` : estimation du fournisseur
- `derived` : calcul interne à partir de snapshots
- `missing` : donnée absente

Le système ne mélange pas silencieusement une estimation et une observation. La provenance influence le niveau de confiance.

Les champs impossibles à comparer entre TikTok et Meta restent spécifiques à leur source. Le schéma commun facilite l’ingestion, pas une comparaison artificielle.

## 15. Scoring TikTok

### 15.1 Dimensions

Le score organique comprend :

- surperformance
- vélocité
- qualité d’engagement
- persistance
- réplication inter-comptes
- adéquation avec la niche

L’adéquation avec la niche est calculée par similarité entre les embeddings du contenu et du profil de niche, puis transformée en percentile dans le cohort. Le LLM peut expliquer cette dimension, mais ne peut pas la modifier.

### 15.2 Cohortes

Un contenu est comparé à un cohort défini par :

- pays
- langue
- catégorie de taille du compte
- âge du contenu
- format
- niche ou niche adjacente

La comparaison utilise des percentiles robustes. Les valeurs extrêmes ne doivent pas écraser le classement.

### 15.3 Composition

Chaque dimension disponible reçoit le même poids initial. Le composite correspond à la moyenne des percentiles disponibles. Le produit affiche une bande de signal :

- faible
- modéré
- fort
- exceptionnel

Le produit affiche séparément une bande de confiance :

- faible : métriques incomplètes ou un seul snapshot
- moyenne : métriques suffisantes mais baseline limitée
- élevée : plusieurs snapshots et cohort comparable suffisant

Les poids pourront évoluer uniquement après une évaluation sur des résultats terrain.

## 16. Scoring Meta Ads

### 16.1 Dimensions

Le signal commercial comprend :

- longévité active
- momentum récent lorsqu’il existe
- nombre de variantes de la famille créative
- étendue géographique
- récurrence de l’angle
- cohérence entre annonce et landing page, lorsque l’analyse est autorisée

### 16.2 Limites explicites

Le score ne prouve pas :

- le spend réel
- le CPA
- le ROAS
- le taux de conversion
- la marge

Le vocabulaire utilisateur est limité à :

- signal faible
- signal à surveiller
- signal commercial fort
- signal commercial très fort

La confiance dépend de la provenance et de la complétude des métriques.

## 17. Regroupement en familles créatives

Les contenus sont regroupés par :

- similarité d’embedding
- angle
- hook type
- structure
- format
- preuve
- CTA

L’algorithme initial utilise une similarité cosinus minimale de `0.84`, complétée par des contraintes catégorielles sur le format et l’angle. Ce seuil est calibré pendant la vague 0 sur un corpus annoté manuellement et reste versionné.

Un cluster devient candidat à une tendance lorsque :

- plusieurs auteurs ou annonceurs indépendants sont représentés
- le cluster montre une croissance récente
- la couverture des données est suffisante
- les contenus ne proviennent pas principalement de reposts ou duplications

## 18. Contrats des agents

### 18.1 Règles communes

Tous les agents :

- sont stateless
- reçoivent un contexte limité
- n’accèdent pas directement aux outils MCP
- utilisent une sortie Zod
- citent des `evidence_id`
- enregistrent modèle, prompt, coût et latence
- traitent les contenus sources comme des données non fiables
- ne peuvent pas modifier les scores

### 18.2 Niche Mapper

**Entrée :** brief de niche et marque.  
**Sortie :** ontologie, requêtes, exclusions et règles de conformité.  
**Validation humaine :** obligatoire à la création.

### 18.3 Signal Analyst

**Entrée :** cluster, scores, snapshots, features et preuves.  
**Sortie :** explication structurée du signal.

```ts
const SignalAnalysisSchema = z.object({
  patternName: z.string(),
  summary: z.string(),
  whyItWorks: z.array(z.object({
    claim: z.string(),
    evidenceIds: z.array(z.string()).min(1)
  })),
  whyNow: z.array(z.object({
    claim: z.string(),
    evidenceIds: z.array(z.string()).min(1)
  })),
  transferableMechanics: z.array(z.string()),
  nonTransferableElements: z.array(z.string()),
  risks: z.array(z.string())
});
```

### 18.4 Strategist

**Entrée :** analyse du signal, profil de niche et mémoire de marque.  
**Sortie :** opportunité adaptée avec justification et fenêtre d’action.

### 18.5 Creative Composer

**Entrée :** opportunité validée, règles de marque et contraintes de plateforme.  
**Sortie :** trois hooks, deux scripts, un storyboard et un brief de production.

### 18.6 Critic

Le Critic vérifie :

- présence des preuves
- cohérence avec les données
- originalité
- conformité aux règles de la niche
- promesses non prouvées
- adéquation avec la marque
- faisabilité du storyboard

Il retourne `pass`, `revise` ou `reject` avec des raisons structurées.

### 18.7 Report Curator

Le Curator sélectionne un nombre limité d’opportunités selon :

- force du signal
- confiance
- fraîcheur
- transférabilité
- diversité des formats et angles
- absence de duplication dans le rapport

Il ne peut pas sélectionner une opportunité rejetée par le Critic.

## 19. Passerelle LLM

### 19.1 Routage

- extraction et classification : modèle rapide et économique
- analyse et stratégie : modèle à raisonnement plus fort
- composition créative : modèle performant en rédaction
- critique : modèle distinct lorsque le budget le permet

### 19.2 Fallback

Pour chaque tâche :

1. appel du modèle principal
2. validation Zod
3. une tentative de réparation structurée si le JSON est invalide
4. appel du modèle secondaire si échec technique
5. arrêt de l’étape si le second modèle échoue

Une sortie sémantiquement faible n’est pas automatiquement masquée par un fallback. Elle doit être détectée par les évaluations ou le Critic.

### 19.3 Budgets

Chaque run possède :

- un plafond de coût LLM
- un plafond d’appels
- un plafond de tokens
- un timeout global
- un plafond par agent

Une étape qui dépasserait le budget est omise avec une raison enregistrée.

## 20. Livrables

### 20.1 Carte d’opportunité

- titre du pattern
- résumé
- source principale
- signal et confiance
- pourquoi cela fonctionne
- pourquoi maintenant
- preuves consultables
- transférabilité
- éléments à ne pas copier
- saturation
- fenêtre d’action
- risques

### 20.2 Pack créatif

- trois hooks
- hook visuel
- hook verbal
- texte écran
- deux scripts
- storyboard plan par plan
- durée indicative de chaque plan
- cadrage
- action
- voix ou dialogue
- texte écran
- transitions
- CTA
- assets nécessaires
- variantes à tester
- claims à valider
- règles de conformité

### 20.3 Statuts

- draft
- needs_revision
- approved
- rejected
- archived
- published

## 21. Originalité et droits

### 21.1 Contrôle anti-copie

Chaque draft est comparé aux sources utilisées :

- chevauchement lexical
- similarité sémantique
- reprise de séquences structurelles inhabituelles
- noms, chiffres et claims propres au concurrent
- références visuelles spécifiques

Un draft trop proche est révisé ou rejeté. Le rapport indique les mécaniques transférées et les éléments exclus.

### 21.2 Conservation

Avant validation des droits du fournisseur, la politique par défaut est :

- conserver les identifiants, URLs et métriques autorisés
- traiter les médias de manière transitoire
- supprimer les médias temporaires sous 24 heures
- ne pas afficher les médias dans le SaaS si la redistribution n’est pas autorisée
- conserver uniquement les features et preuves minimales autorisées

Les politiques de conservation sont configurées par source dans `rights_policy_json`.

## 22. Sécurité

### 22.1 Isolation

- toutes les tables métier portent un `workspace_id` direct ou transitif
- Row-Level Security activée avant la vague SaaS
- aucun retrieval de mémoire inter-workspace
- tests de fuite inter-tenant obligatoires

### 22.2 Secrets

- secrets stockés dans un gestionnaire côté serveur
- aucune clé dans la base en clair
- références de secrets dans `source_connections`
- rotation documentée
- environnements de développement, test et production séparés

### 22.3 Injection

- les descriptions, transcriptions, commentaires et pages externes sont marqués comme contenu non fiable
- aucune instruction trouvée dans une source ne modifie le workflow
- les agents n’ont pas d’accès libre aux outils
- les URLs sortantes sont validées
- les réponses fournisseurs sont limitées en taille

### 22.4 Journalisation

Les événements sensibles sont audités :

- connexion ou modification d’une source
- lecture ou suppression de données
- changement de droits
- validation ou rejet d’un livrable
- export
- changement de règle de marque

## 23. Résilience

### 23.1 Reprises

- reprise exponentielle sur erreurs transitoires
- aucune reprise automatique sur erreur d’autorisation
- circuit breaker par fournisseur
- file d’échecs inspectable
- possibilité de rejouer une étape

### 23.2 Dégradation

Si TikTok échoue mais Meta réussit, le radar Meta peut être généré avec statut partiel. Si la couverture restante est insuffisante, aucun radar n’est produit.

### 23.3 Changements de schéma fournisseur

Chaque adaptateur est testé contre des fixtures contractuelles. Une réponse inconnue est mise en quarantaine et déclenche une alerte plutôt que d’être interprétée silencieusement.

## 24. Observabilité

### 24.1 Mesures techniques

- taux de succès des runs
- taux de runs partiels
- latence par étape
- erreurs par source
- appels et coûts par fournisseur
- tokens et coûts par agent
- taux de JSON invalide
- taux de fallback
- volume ingéré
- taux de dédoublonnage

### 24.2 Mesures de qualité

- taux d’opportunités approuvées
- taux de drafts approuvés sans modification
- volume moyen de modifications
- raisons de rejet
- taux d’affirmations avec preuve valide
- taux de similarité excessive
- performance des créations publiées
- amélioration par rapport à la baseline de la marque

### 24.3 Mesures commerciales futures

- coût par radar
- coût par opportunité approuvée
- coût par pack créatif approuvé
- marge brute par plan
- activation
- rétention
- usage par workspace

## 25. Interface

### 25.1 Pages de la V1 interne

#### Niches

- liste des niches
- création et édition
- validation de la carte de niche
- couverture et statut des sources

#### Radar

- lancement manuel
- dernier rapport
- filtres TikTok ou Meta
- signal, confiance et fraîcheur
- état partiel ou complet

#### Opportunité

- preuves
- métriques
- cluster
- explication
- actions : accepter, modifier, rejeter

#### Studio créatif

- hooks
- scripts
- storyboard
- brief
- contrôles de conformité et originalité
- historique des versions

#### Runs

- étapes
- erreurs
- coûts
- modèles
- sources
- rejeu

#### Évaluations

- corpus doré
- comparaison des versions de prompts
- comparaison des modèles
- résultats de sécurité

### 25.2 Pages ajoutées en vague SaaS

- inscription et connexion
- onboarding
- facturation
- quotas
- membres
- connexions OAuth
- administration opérateur

## 26. API applicative

Routes internes initiales :

```text
POST   /api/niches
GET    /api/niches
GET    /api/niches/:id
PATCH  /api/niches/:id
POST   /api/niches/:id/map
POST   /api/niches/:id/runs
GET    /api/runs/:id
POST   /api/runs/:id/retry
GET    /api/radars/:id
GET    /api/opportunities/:id
POST   /api/opportunities/:id/decision
POST   /api/opportunities/:id/drafts
GET    /api/drafts/:id
POST   /api/drafts/:id/decision
POST   /api/drafts/:id/outcomes
GET    /api/sources/status
GET    /api/usage
```

Les mutations utilisent des clés d’idempotence et retournent des erreurs structurées.

## 27. Boucle d’apprentissage

### 27.1 Feedback explicite

Chaque acceptation, modification ou rejet capture :

- décision
- raison standardisée
- commentaire libre
- version avant modification
- version après modification
- utilisateur
- date

### 27.2 Mémoire de marque

Les corrections répétées sont proposées comme règles de marque. Elles ne deviennent actives qu’après validation humaine.

Exemples :

- éviter une expression
- privilégier les hooks démonstratifs
- ne pas citer certains concurrents
- utiliser un niveau de langage donné
- exclure une promesse sensible

### 27.3 Résultats terrain

Dans la V1 interne, l’utilisateur saisit manuellement l’URL publiée et les résultats. La connexion OAuth est ajoutée en vague SaaS.

Sans données terrain, le système peut apprendre les préférences éditoriales, mais ne doit pas prétendre apprendre ce qui convertit.

## 28. Évaluations

### 28.1 Corpus doré

Le corpus contient des cas annotés pour :

- niche avec signal fort
- niche avec signal faible
- faux positif causé par un grand compte
- contenu sponsorisé présenté comme organique
- repost massif
- publicité longue mais non déclinée
- données contradictoires
- source incomplète
- contenu contenant une injection
- adaptation trop proche de la source
- claim sensible
- niche sans couverture suffisante

### 28.2 Critères automatiques

- validité du JSON
- présence et validité des evidence IDs
- absence de claims sans preuve
- respect des exclusions
- similarité sous le seuil accepté
- diversité des hooks
- complétude du storyboard
- respect du budget

### 28.3 Revue humaine

Une grille humaine note :

- utilité
- clarté
- transférabilité
- originalité
- cohérence de marque
- faisabilité de production
- crédibilité des explications

## 29. Stratégie de tests

### 29.1 Tests unitaires

- normalisation
- dédoublonnage
- calcul des snapshots
- cohortes
- percentiles
- composition des bandes
- couverture
- politiques de conservation
- budgets

### 29.2 Tests de contrat

- réponse TrendTrack nominale
- pagination
- quota épuisé
- champ absent
- type incorrect
- changement de schéma
- erreur d’autorisation
- timeout

### 29.3 Tests d’intégration

- pipeline complet avec fixtures
- run partiel
- rejeu idempotent
- fallback modèle
- validation Zod en échec
- rejet du Critic
- mise à jour de la mémoire de marque

### 29.4 Tests de sécurité

- injection dans transcription
- injection dans texte publicitaire
- URL malveillante
- fuite inter-workspace
- accès à un secret
- appel à un outil MCP non autorisé
- export de données supprimées

### 29.5 Tests bout en bout

Scénario principal :

1. créer une niche
2. valider sa carte
3. lancer un radar
4. consulter les preuves
5. accepter une opportunité
6. générer un pack
7. modifier un hook
8. approuver le pack
9. vérifier la mémoire de marque
10. rejouer le run sans doublon

## 30. Vagues de construction

### 30.1 Vague 0 : preuve technique et droits

#### Livrables

- validation des conditions commerciales du fournisseur
- client MCP minimal
- adaptateurs TikTok et Meta
- schéma normalisé
- persistance des snapshots
- mesure des quotas, coûts et latences
- corpus réel initial
- politique de conservation par source

#### Critère de sortie

Une collecte réelle TikTok et Meta est rejouable, normalisée et exploitable conformément aux droits validés.

### 30.2 Vague 1 : radar interne

#### Livrables

- interface interne
- profil de niche
- Niche Mapper
- collecte manuelle et quotidienne
- scoring
- clusters
- Signal Analyst
- Strategist
- Creative Composer
- Critic
- cartes d’opportunité
- packs créatifs
- validation humaine
- traces et coûts

#### Critère de sortie

Un rapport quotidien complet est produit à partir de données réelles. Chaque affirmation analytique possède une preuve consultable.

### 30.3 Vague 2 : qualité mesurée

#### Livrables

- plusieurs niches
- feedback structuré
- mémoire de marque
- saisie des résultats publiés
- corpus doré
- évaluations automatiques
- comparaison des modèles
- suivi de qualité

#### Critère de sortie

Le workflow produit une qualité stable sur plusieurs niches sans réécriture de ses composants.

### 30.4 Vague 3 : SaaS self-service

#### Livrables

- authentification
- RLS
- onboarding
- planification
- quotas et crédits
- Stripe
- administration
- membres
- exports
- suppression de compte
- OAuth pour les performances sociales

#### Critère de sortie

Des clients pilotes créent leur niche et obtiennent un radar exploitable sans intervention opérateur.

### 30.5 Vague 4 : extension

- Instagram
- YouTube Shorts
- X
- génération d’images
- génération de vidéos
- publication avec approbation
- API et marque blanche

Chaque canal reçoit son propre adaptateur, scoring et corpus d’évaluation.

## 31. Risques et mitigations

| Risque | Gravité | Mitigation |
|---|---|---|
| Droits insuffisants pour revendre les données | Critique | Validation écrite avant commercialisation, conservation minimale, fournisseur alternatif |
| Dépendance à TrendTrack | Élevée | Adaptateurs internes, export des données, source de secours |
| Couverture insuffisante d’une niche | Élevée | Score de couverture et réponse explicite signal insuffisant |
| Coût LLM ou source trop élevé | Élevée | Budgets, routage par tâche, cache, filtrage avant LLM |
| Hallucinations analytiques | Élevée | Evidence IDs obligatoires, Critic, évaluations |
| Copie trop proche | Élevée | Contrôle lexical et sémantique, révision, interdiction des médias concurrents |
| Promesses trompeuses | Élevée | Terminologie contrôlée, règles de conformité, validation humaine |
| Changement de schéma MCP | Moyenne | Tests de contrat, quarantaine et alertes |
| Fuite inter-tenant | Critique | RLS, tests d’isolation, audit, secrets séparés |
| Apprentissage sur goûts au lieu de résultats | Moyenne | Séparer feedback éditorial et performance terrain |
| Trop de recommandations | Moyenne | Curator, diversité et plafond par rapport |
| Scoring biaisé par les grands comptes | Élevée | Cohortes par taille, âge, pays et format |

## 32. Critères de réussite de la V1 interne

La V1 est réussie si :

- les données TikTok et Meta sont réelles et traçables
- le même run peut être rejoué sans doublon
- toutes les affirmations analytiques possèdent une preuve
- le système sait refuser une niche insuffisamment couverte
- les opportunités sont jugées actionnables par l’opérateur
- les packs demandent moins de correction au fil du feedback
- le coût d’un radar est mesuré et attribuable
- aucun contenu concurrent n’est reproduit de manière substantielle
- un changement de modèle ne nécessite pas de modifier le domaine métier
- un changement de fournisseur ne nécessite pas de réécrire le pipeline

## 33. Conditions avant passage au SaaS

Le passage au SaaS est autorisé lorsque :

- les droits de commercialisation des données sont confirmés
- plusieurs niches ont été testées
- le taux d’approbation des opportunités est stable
- le coût par radar est connu
- les principaux motifs de rejet sont compris
- le produit dispose d’un corpus d’évaluation
- la suppression des données est vérifiable
- l’isolation multi-tenant est testée
- la promesse commerciale reflète les limites réelles du système

## 34. Choix tranchés

| Sujet | Choix retenu | Choix écarté |
|---|---|---|
| Produit initial | Copilote d’intelligence créative | Usine de publication autonome |
| Canaux initiaux | TikTok organique et Meta Ads | Couverture de tous les réseaux |
| Sortie initiale | Scripts, hooks, storyboards, briefs | Génération vidéo complète |
| Mode de lancement | Agence interne | SaaS self-service immédiat |
| Architecture | Workflow hybride | Super-agent ou essaim autonome |
| Scoring | Code déterministe | Note inventée par LLM |
| Agents | Fonctions stateless | Agents avec mémoire implicite |
| Mémoire | PostgreSQL structuré | Historique de chat comme état |
| Apprentissage | Feedback et retrieval | Fine-tuning précoce |
| Publication | Hors V1 | Publication sans validation |
| Langage | TypeScript | Stack TypeScript et Python dès le départ |
| Orchestration | Trigger.dev | Temporal ou Kafka au lancement |

## 35. Conclusion

La première tranche verticale doit prouver une seule chose : à partir de vraies données TikTok et Meta, le système peut détecter un signal, l’expliquer avec des preuves et produire une adaptation originale utile.

L’authentification, la facturation, les nouveaux canaux et la génération média viennent après cette preuve. Cette séquence protège le projet contre deux échecs fréquents : construire un SaaS complet avant de valider la qualité du moteur, ou masquer un pipeline fragile derrière une démonstration de multi-agents.