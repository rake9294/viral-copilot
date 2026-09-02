# PRD Viral Copilot V1

**Version :** 1.0  
**Date :** 2 septembre 2026  
**Statut :** à valider  
**Propriétaire produit :** Raphaël Kech  
**Nom de travail :** Viral Copilot  
**Mode de lancement :** outil d’agence interne  
**Évolution visée :** SaaS self-service multi-tenant

## 1. Résumé

Viral Copilot analyse les contenus TikTok organiques et les publicités Meta d’une niche. Il repère les signaux créatifs qui surperforment, explique pourquoi ils fonctionnent et prépare des contenus originaux à tester.

Le livrable principal est un radar composé d’opportunités sourcées. Chaque opportunité contient les preuves, la mécanique observée, son niveau de confiance et un pack créatif : hooks, scripts, storyboard et brief de production.

La première version est un outil interne. L’utilisateur choisit une niche, valide les requêtes de veille, lance le radar et approuve les contenus proposés. Le système ne publie rien sur les réseaux.

Le produit ne promet pas la viralité et ne prétend pas connaître la rentabilité d’une publicité concurrente. Il raccourcit le délai entre un signal de marché et une création exploitable.

## 2. Problème

Les bibliothèques publicitaires et outils de tendances montrent beaucoup de contenus, mais répondent mal à quatre questions :

1. Ce contenu fonctionne-t-il réellement mieux que la moyenne de son créateur ?
2. Le signal est-il récent ou déjà saturé ?
3. Quelle mécanique peut être transférée à une autre marque sans copier ?
4. Quel contenu concret faut-il produire maintenant ?

Les limites actuelles sont récurrentes :

- les métriques brutes favorisent les grands comptes
- les tendances sont trop générales
- les outils séparent veille organique et veille publicitaire
- les bibliothèques donnent peu d’explications
- les générateurs de contenu travaillent sans preuve de demande
- les adaptations sont souvent trop proches des sources
- le volume d’informations ralentit la décision

## 3. Vision produit

Un utilisateur doit pouvoir transformer une niche en système de veille exploitable sans construire sa propre infrastructure de collecte et d’analyse.

Le parcours cible tient en une phrase :

> Je définis ma niche, le produit détecte les signaux crédibles et je repars avec quelques contenus originaux prêts à produire.

La valeur vient de la qualité des décisions, pas du volume de textes générés.

## 4. Objectifs

### 4.1 Objectif de la V1 interne

Prouver qu’un même pipeline peut :

- collecter de vraies données TikTok et Meta
- comparer les contenus dans des cohortes cohérentes
- détecter les signaux crédibles
- expliquer chaque recommandation avec des preuves
- créer des adaptations originales
- apprendre des corrections de l’opérateur
- mesurer son propre coût

### 4.2 Objectif avant passage au SaaS

Valider la qualité du moteur sur plusieurs niches avant de construire l’authentification, la facturation et l’onboarding self-service.

### 4.3 Non-objectifs de la V1

La V1 ne doit pas :

- publier automatiquement
- générer des images ou vidéos finales
- acheter des médias
- recommander des budgets publicitaires
- couvrir tous les réseaux
- garantir une performance
- entraîner un modèle propriétaire
- permettre une collaboration d’équipe avancée

## 5. Utilisateurs

### 5.1 Persona principal : opérateur de veille créative

L’opérateur travaille pour l’agence ou pour une marque. Il connaît le marché mais ne veut pas passer plusieurs heures par jour dans les bibliothèques publicitaires et les feeds.

Ses tâches :

- configurer une niche
- valider les concurrents et requêtes
- lancer une analyse
- vérifier les preuves
- choisir les opportunités
- corriger les créations
- saisir les résultats après publication

Ses irritants :

- trop de contenu à consulter
- absence de normalisation des métriques
- difficulté à distinguer une tendance d’un simple gros compte
- génération de contenu générique
- manque de traçabilité

### 5.2 Persona futur : responsable marketing d’une marque

Il veut recevoir un radar régulier, produire plus vite et relier les tendances à ses offres. Il attend une interface self-service, des quotas clairs et une connexion à ses comptes sociaux.

### 5.3 Persona futur : agence

Elle gère plusieurs clients et souhaite séparer les niches, les marques, les règles et les résultats. Elle attend une isolation stricte des données et, plus tard, une API ou une offre en marque blanche.

## 6. Jobs to be done

### JTBD-01 : cadrer une niche

Quand je démarre une veille, je veux transformer un marché large en requêtes, acteurs et exclusions précis afin d’obtenir des résultats pertinents.

### JTBD-02 : repérer les signaux

Quand de nouveaux contenus apparaissent, je veux savoir lesquels surperforment dans un cohort comparable afin de ne pas confondre taille d’audience et qualité du signal.

### JTBD-03 : comprendre la mécanique

Quand un signal est détecté, je veux voir ce qui explique sa performance et les preuves associées afin de décider s’il mérite un test.

### JTBD-04 : créer sans copier

Quand j’accepte une opportunité, je veux obtenir des hooks, scripts et storyboards adaptés à ma marque afin de produire rapidement un contenu original.

### JTBD-05 : améliorer le système

Quand je corrige ou rejette une proposition, je veux que le produit retienne ma règle afin de ne pas répéter la même correction.

### JTBD-06 : relier création et résultat

Quand un contenu est publié, je veux enregistrer ses performances afin de distinguer mes préférences éditoriales de ce qui fonctionne réellement.

## 7. Proposition de valeur

### 7.1 Promesse principale

Viral Copilot détecte les mécaniques créatives qui émergent dans une niche, montre les preuves et prépare un pack de contenu original prêt à produire.

### 7.2 Différenciation

Le produit combine :

- veille TikTok organique
- veille Meta Ads
- scoring relatif à la taille du compte et à l’âge du contenu
- preuves attachées à chaque affirmation
- adaptation à la marque
- contrôle anti-copie
- boucle de feedback

### 7.3 Limites affichées dans le produit

Le produit doit dire clairement :

- un signal n’est pas une garantie
- une publicité active n’est pas une preuve de rentabilité
- les données peuvent être observées, estimées, dérivées ou absentes
- une niche peut manquer de couverture
- le dernier choix revient à l’utilisateur

## 8. Périmètre fonctionnel

### 8.1 Must have

- profil de niche
- carte de niche générée et modifiable
- connexions TikTok organique et Meta Ads via MCP
- collecte paginée
- snapshots de métriques
- normalisation et dédoublonnage
- score TikTok
- score Meta
- regroupement en familles créatives
- cartes d’opportunité avec preuves
- génération de packs créatifs
- critique automatique
- validation humaine
- historique des versions
- suivi des coûts et erreurs
- feedback structuré
- saisie manuelle des résultats publiés

### 8.2 Should have

- planification quotidienne
- filtres par source, pays, langue et fraîcheur
- comparaison de plusieurs niches
- export Markdown
- tableau des règles de marque
- rejeu d’un run
- rapport partiel lorsqu’une source échoue

### 8.3 Could have après validation

- connexion OAuth aux comptes sociaux
- Instagram Reels
- YouTube Shorts
- X
- génération d’images
- génération de vidéos
- publication avec approbation
- API publique
- marque blanche

### 8.4 Won’t have dans la V1

- publication sans validation
- scoring commun TikTok et Meta
- ROAS concurrent estimé par le LLM
- mémoire cachée dans une conversation
- essaim d’agents autonomes
- scraping non autorisé

## 9. Parcours principal

### 9.1 Créer une niche

1. L’utilisateur ouvre la page Niches.
2. Il saisit le marché, le pays, la langue, les personas, les problèmes, les offres et les concurrents.
3. Le Niche Mapper propose une carte : vocabulaire, requêtes, acteurs, exclusions et règles.
4. L’utilisateur corrige puis valide la carte.
5. Le système vérifie la disponibilité des sources.
6. La niche passe au statut `ready`.

### 9.2 Lancer un radar

1. L’utilisateur choisit une niche.
2. Il lance le radar ou attend l’exécution planifiée.
3. Le système vérifie les quotas.
4. Il collecte TikTok et Meta.
5. Il normalise et dédoublonne les résultats.
6. Il enregistre les snapshots.
7. Il calcule les scores.
8. Il regroupe les familles créatives.
9. Il analyse les meilleurs signaux.
10. Il produit un rapport complet, partiel ou insuffisant.

### 9.3 Valider une opportunité

1. L’utilisateur ouvre une opportunité.
2. Il consulte les sources, métriques, cohortes et preuves.
3. Il accepte, modifie ou rejette l’opportunité.
4. En cas d’acceptation, le produit génère le pack créatif.

### 9.4 Valider un pack créatif

1. Le produit affiche les hooks, scripts, storyboard et brief.
2. Le Critic affiche les risques, claims et résultats du contrôle anti-copie.
3. L’utilisateur modifie ou approuve le pack.
4. Les corrections peuvent devenir des règles de marque après validation.

### 9.5 Enregistrer le résultat terrain

1. L’utilisateur ajoute l’URL du contenu publié.
2. Il saisit les métriques et résultats business.
3. Le système rattache les résultats au draft d’origine.
4. Les évaluations futures distinguent qualité éditoriale et efficacité observée.

## 10. Exigences fonctionnelles

### 10.1 Gestion des niches

#### FR-001 : créer un profil de niche

Le système doit enregistrer :

- nom de la niche
- sous-niche
- pays
- langue
- personas
- problèmes
- résultats recherchés
- offres
- concurrents
- comptes de référence
- exclusions
- règles de conformité
- ton de marque

**Critères d’acceptation :**

- les champs obligatoires sont validés
- le profil possède une version
- chaque modification est horodatée
- une niche incomplète ne peut pas lancer de radar

#### FR-002 : générer une carte de niche

Le Niche Mapper doit proposer :

- personas structurés
- douleurs et résultats attendus
- vocabulaire
- requêtes principales
- requêtes adjacentes
- concurrents
- comptes à surveiller
- exclusions
- règles de conformité

**Critères d’acceptation :**

- la sortie respecte un schéma Zod
- l’utilisateur peut modifier chaque rubrique
- la première carte exige une validation humaine
- la version validée est conservée avec le run

#### FR-003 : mesurer la couverture

Le système doit vérifier si la niche contient assez de données.

Seuils initiaux :

- TikTok : au moins 50 contenus uniques, 10 auteurs et une fenêtre de 30 jours
- Meta Ads : au moins 20 annonces actives, 5 annonceurs et une fenêtre de 90 jours
- tendance candidate : au moins 3 auteurs ou annonceurs indépendants
- cohort : au moins 30 éléments comparables
- vélocité TikTok : au moins 2 snapshots

**Critères d’acceptation :**

- les seuils sont configurables et versionnés
- aucun canal valide produit `insufficient_signal`
- un seul canal valide produit un run `partial`
- le rapport affiche la raison de l’insuffisance

### 10.2 Sources et collecte

#### FR-010 : connecter une source MCP

Le système doit appeler les fournisseurs via un adaptateur interne.

**Critères d’acceptation :**

- aucune réponse MCP brute n’entre dans le domaine métier
- les outils autorisés sont en lecture seule
- les credentials restent côté serveur
- le statut et le quota sont visibles
- les erreurs sont traduites vers des codes internes

#### FR-011 : collecter les contenus TikTok

Le système doit collecter les contenus organiques associés aux requêtes validées.

**Critères d’acceptation :**

- la pagination est persistée
- les identifiants externes sont conservés
- les URLs canoniques sont enregistrées
- les métriques portent une provenance
- un rejeu ne crée pas de doublon

#### FR-012 : collecter les publicités Meta

Le système doit collecter les annonces correspondant aux requêtes et annonceurs validés.

**Critères d’acceptation :**

- le statut actif est enregistré
- la date de première observation est conservée
- les variantes peuvent être rattachées à une famille
- le produit n’affiche pas de ROAS ou CPA non observé

#### FR-013 : enregistrer les snapshots

Le système doit conserver l’état des métriques à chaque collecte.

**Critères d’acceptation :**

- chaque snapshot est horodaté
- sa provenance est `observed`, `estimated`, `derived` ou `missing`
- deux snapshots permettent un calcul de vélocité
- une estimation n’est jamais affichée comme une observation

#### FR-014 : appliquer la politique de conservation

Le système doit suivre les droits définis pour chaque source.

**Critères d’acceptation :**

- les médias non autorisés sont traités temporairement
- les médias temporaires sont supprimés sous 24 heures
- les droits de redistribution contrôlent l’affichage
- la suppression est journalisée

### 10.3 Normalisation et scoring

#### FR-020 : dédoublonner

Le système doit reconnaître les doublons par identifiant externe et empreinte du contenu.

**Critères d’acceptation :**

- l’unicité `source_type + external_id` est garantie
- les reposts sont signalés
- les métriques successives enrichissent l’élément existant

#### FR-021 : scorer TikTok

Le score organique doit couvrir :

- surperformance
- vélocité
- qualité d’engagement
- persistance
- réplication inter-comptes
- adéquation avec la niche

**Critères d’acceptation :**

- la comparaison utilise un cohort de pays, langue, taille, âge, format et niche
- chaque dimension est transformée en percentile
- les poids initiaux sont égaux
- le résultat affiche une bande de signal et une bande de confiance
- le LLM ne peut pas modifier le score

#### FR-022 : scorer Meta Ads

Le signal commercial doit couvrir :

- longévité
- momentum lorsqu’il existe
- variantes créatives
- étendue géographique
- récurrence de l’angle
- cohérence annonce et landing page lorsque l’analyse est autorisée

**Critères d’acceptation :**

- le vocabulaire reste limité à un signal commercial
- le niveau de confiance tient compte de la provenance
- aucun indicateur de rentabilité n’est inventé

#### FR-023 : créer les familles créatives

Le système doit regrouper les contenus selon leur proximité créative.

**Critères d’acceptation :**

- le regroupement utilise embeddings, angle, hook, structure, format, preuve et CTA
- le seuil initial de similarité cosinus est `0.84`
- le seuil est versionné
- un cluster conserve ses membres et sa période d’activité

### 10.4 Analyse et opportunités

#### FR-030 : expliquer un signal

Le Signal Analyst doit produire une explication structurée.

**Critères d’acceptation :**

- chaque affirmation possède au moins un `evidence_id`
- les mécaniques transférables sont séparées des éléments à ne pas copier
- les risques sont affichés
- une preuve absente bloque l’affirmation

#### FR-031 : créer une opportunité

Le Strategist doit adapter un signal au profil de niche et à la marque.

**Critères d’acceptation :**

- l’opportunité contient `why_now`
- elle contient une bande de confiance
- elle contient saturation et fenêtre d’action
- elle respecte les exclusions de marque
- elle reste modifiable avant génération

#### FR-032 : assembler le radar

Le Report Curator doit limiter le rapport aux meilleures opportunités.

**Critères d’acceptation :**

- aucune opportunité rejetée par le Critic n’apparaît
- les opportunités sont diversifiées par angle et format
- le rapport évite les doublons
- les sources manquantes sont signalées

### 10.5 Production créative

#### FR-040 : générer les hooks

Le Creative Composer doit générer trois hooks cohérents avec l’opportunité.

**Critères d’acceptation :**

- chaque hook précise sa version visuelle, verbale et texte écran
- les hooks respectent le ton de marque
- les claims sensibles sont signalés

#### FR-041 : générer les scripts

Le système doit proposer deux scripts : une version courte et une version démonstrative.

**Critères d’acceptation :**

- chaque script contient une structure et un CTA
- le script peut être édité
- chaque version possède un historique

#### FR-042 : générer le storyboard

Le storyboard doit décrire chaque plan.

**Critères d’acceptation :**

- durée indicative
- cadrage
- action
- voix ou dialogue
- texte écran
- transition
- assets nécessaires

#### FR-043 : générer le brief de production

Le brief doit permettre à un créateur ou monteur de produire le contenu.

**Critères d’acceptation :**

- format et ratio
- style visuel
- rythme
- voix
- sous-titres
- assets
- CTA
- variantes à tester
- claims à valider

#### FR-044 : contrôler l’originalité

Le système doit comparer le draft aux sources.

**Critères d’acceptation :**

- contrôle lexical
- contrôle sémantique
- détection des noms, chiffres et claims propres au concurrent
- détection des références visuelles spécifiques
- résultat `pass`, `revise` ou `reject`
- aucun média concurrent n’est réutilisé

#### FR-045 : critiquer le pack

Le Critic doit vérifier preuves, originalité, conformité et faisabilité.

**Critères d’acceptation :**

- une raison structurée accompagne chaque rejet
- une révision conserve la version précédente
- seul un pack `pass` peut être approuvé

### 10.6 Validation et apprentissage

#### FR-050 : décider sur une opportunité

L’utilisateur peut accepter, modifier ou rejeter.

**Critères d’acceptation :**

- la décision est horodatée
- la raison peut être standardisée et commentée
- la version avant modification est conservée

#### FR-051 : décider sur un draft

L’utilisateur peut approuver, modifier ou rejeter le pack.

**Critères d’acceptation :**

- le statut est persisté
- les modifications sont comparables à la version initiale
- l’auteur de la décision est enregistré

#### FR-052 : créer une règle de marque

Le système peut proposer une règle issue de corrections répétées.

**Critères d’acceptation :**

- la règle ne devient active qu’après validation
- elle conserve le feedback source
- elle est versionnée
- elle reste désactivable

#### FR-053 : saisir les performances publiées

L’utilisateur peut associer des résultats à un draft.

**Critères d’acceptation :**

- URL et date de publication
- métriques sociales
- résultats business lorsqu’ils existent
- séparation entre feedback éditorial et performance

### 10.7 Runs, coûts et erreurs

#### FR-060 : suivre un run

Le système doit afficher chaque étape du workflow.

**Critères d’acceptation :**

- statut
- heure de début et de fin
- sources
- modèles
- coûts
- erreurs
- couverture

#### FR-061 : rejouer un run

L’utilisateur doit pouvoir relancer une étape ou un run.

**Critères d’acceptation :**

- le rejeu est idempotent
- la version du traitement est enregistrée
- les entrées identiques peuvent réutiliser le résultat existant

#### FR-062 : appliquer les budgets

Le système doit limiter les appels source et LLM.

**Critères d’acceptation :**

- plafond de coût par run
- plafond d’appels
- plafond de tokens
- timeout global
- raison visible lorsqu’une étape est omise

## 11. États métier

### 11.1 Niche

- `draft`
- `mapping`
- `awaiting_validation`
- `ready`
- `insufficient_coverage`
- `paused`
- `archived`

### 11.2 Run

- `queued`
- `running`
- `partial`
- `insufficient_signal`
- `awaiting_review`
- `completed`
- `failed`
- `cancelled`

### 11.3 Opportunité et draft

- `draft`
- `needs_revision`
- `approved`
- `rejected`
- `archived`
- `published`

## 12. Livrables produit

### 12.1 Radar

Le radar affiche :

- période couverte
- sources actives
- état complet ou partiel
- couverture
- coûts
- opportunités retenues
- signaux à surveiller
- absence de signal lorsqu’elle est constatée

### 12.2 Carte d’opportunité

- nom du pattern
- résumé
- score et confiance
- pourquoi cela fonctionne
- pourquoi maintenant
- sources
- métriques
- cohort
- éléments transférables
- éléments à ne pas copier
- saturation
- fenêtre d’action
- risques

### 12.3 Pack créatif

- trois hooks
- deux scripts
- storyboard plan par plan
- brief de production
- variantes de test
- claims à vérifier
- rapport anti-copie
- rapport du Critic

## 13. Expérience utilisateur

### 13.1 Navigation V1

- Niches
- Radar
- Opportunités
- Studio créatif
- Runs
- Évaluations
- Paramètres

### 13.2 Principes UX

- afficher les preuves avant le texte généré
- séparer signal et confiance
- rendre visible la provenance des métriques
- limiter les résultats présentés
- expliquer les statuts partiels
- conserver l’historique des modifications
- ne jamais cacher une erreur derrière un résumé positif

### 13.3 Écrans

#### Niches

- liste
- création
- carte générée
- couverture
- statut des sources

#### Radar

- lancement manuel
- dernier run
- filtres
- état des sources
- liste des opportunités

#### Opportunité

- explication
- preuves
- sources
- métriques
- cluster
- décision

#### Studio créatif

- hooks
- scripts
- storyboard
- brief
- conformité
- originalité
- historique

#### Runs

- timeline
- coûts
- erreurs
- modèles
- outils MCP
- rejeu

## 14. Modèle d’intelligence

Le produit utilise six fonctions LLM spécialisées :

1. Niche Mapper
2. Signal Analyst
3. Strategist
4. Creative Composer
5. Critic
6. Report Curator

Ces fonctions ne communiquent pas librement entre elles. Le workflow contrôle leurs entrées, sorties et budgets.

Règles :

- aucun agent ne modifie un score
- aucun agent n’appelle directement un MCP
- toutes les sorties respectent un schéma Zod
- chaque affirmation cite des preuves
- les prompts, modèles et coûts sont versionnés
- les données externes sont traitées comme non fiables

## 15. Données

### 15.1 Entités

Le schéma complet comprend :

- `workspaces`
- `users`
- `workspace_members`
- `niche_profiles`
- `source_connections`
- `source_queries`
- `source_items`
- `metric_snapshots`
- `content_features`
- `score_snapshots`
- `pattern_clusters`
- `pattern_members`
- `evidence_refs`
- `opportunities`
- `opportunity_evidence`
- `creative_drafts`
- `workflow_runs`
- `agent_steps`
- `human_feedback`
- `brand_rules`
- `published_outcomes`

Le détail des champs et contraintes est défini dans `docs/superpowers/specs/2026-09-02-viral-copilot-design.md`.

### 15.2 Source de vérité

PostgreSQL conserve :

- l’état métier
- les preuves
- les versions
- les règles de marque
- les décisions humaines
- les résultats publiés
- les traces nécessaires au rejeu

Le contexte de conversation d’un LLM ne sert jamais de mémoire produit.

## 16. Exigences non fonctionnelles

### NFR-001 : traçabilité

Chaque recommandation doit être reliée à ses sources, données, prompts et modèles.

### NFR-002 : idempotence

Un rejeu avec les mêmes entrées et versions ne doit créer ni doublon ni dépense inutile.

### NFR-003 : résilience

Le système doit reprendre après une erreur transitoire et produire un rapport partiel lorsque la couverture restante est suffisante.

### NFR-004 : sécurité

- secrets côté serveur
- allowlist d’outils MCP
- outils en lecture seule dans la V1
- validation des URLs
- limites de taille
- journalisation des actions sensibles

### NFR-005 : isolation future

Chaque donnée métier doit être rattachée à un workspace. La Row-Level Security devient obligatoire avant l’ouverture SaaS.

### NFR-006 : portabilité

Un changement de LLM ou de fournisseur de données ne doit pas modifier le domaine métier.

### NFR-007 : coût

Chaque run doit exposer son coût par source, modèle et étape.

### NFR-008 : droits

La conservation et l’affichage suivent une politique par source. Les médias non autorisés sont supprimés sous 24 heures.

### NFR-009 : observabilité

Sentry suit les erreurs. Langfuse suit prompts, modèles, coûts, latence et évaluations.

### NFR-010 : qualité

Une version de prompt ne passe en production que si elle ne dégrade pas le corpus d’évaluation.

## 17. Sécurité et conformité

### 17.1 Injection

Les contenus collectés peuvent contenir des instructions malveillantes. Le système les traite comme du texte externe. Ils ne peuvent pas modifier les outils, rôles ou étapes du workflow.

### 17.2 Droits de redistribution

La vague 0 doit confirmer par écrit :

- l’usage commercial
- la conservation des métriques
- le traitement des médias
- l’affichage de données dérivées
- les limites de redistribution
- les quotas
- les conditions de sortie

Un accès MCP ne vaut pas autorisation de revendre les données.

### 17.3 Originalité

Le système transfère :

- la structure
- le rythme
- l’émotion
- le type de preuve
- le format de CTA

Il ne transfère pas :

- le texte exact
- les médias
- les noms et chiffres propres au concurrent
- une identité visuelle spécifique
- les claims non vérifiés

## 18. Mesure du succès

### 18.1 Métrique principale de la V1

**Nombre de packs créatifs approuvés à partir d’opportunités sourcées.**

Cette métrique mesure toute la chaîne : qualité du signal, utilité de l’analyse et qualité de la génération.

### 18.2 Qualité

- taux d’opportunités approuvées
- taux de packs approuvés
- taux de packs approuvés sans modification
- volume moyen de corrections
- raisons de rejet
- taux d’affirmations avec preuve valide
- taux de drafts rejetés pour similarité

### 18.3 Produit

- nombre de niches prêtes
- taux de niches avec couverture suffisante
- fréquence d’utilisation du radar
- temps entre lancement et pack approuvé
- utilisation des règles de marque

### 18.4 Technique

- taux de runs réussis
- taux de runs partiels
- latence par étape
- erreurs par source
- taux de fallback LLM
- taux de JSON invalide
- coût par radar
- coût par pack approuvé

### 18.5 Résultats terrain

- vues par rapport à la baseline de la marque
- rétention vidéo
- partages
- sauvegardes
- commentaires
- clics
- leads
- ventes lorsque mesurables

Le produit ne doit pas optimiser sur les likes seuls.

## 19. Hypothèses à tester

### H-01 : utilité

Une sélection de quelques opportunités sourcées est plus utile qu’une bibliothèque exhaustive.

### H-02 : transfert multi-niche

Le même workflow peut fonctionner sur plusieurs niches si le profil, les requêtes et les cohortes changent.

### H-03 : preuve

Les utilisateurs font davantage confiance aux recommandations lorsque chaque affirmation possède une source consultable.

### H-04 : apprentissage

Les règles de marque réduisent progressivement le volume de corrections.

### H-05 : performance

Les créations issues de signaux récents surperforment la baseline de la marque plus souvent que des créations générées sans signal.

### H-06 : monétisation

Les agences et marques paieront pour gagner du temps et augmenter le débit de tests, à condition que le coût par pack approuvé reste prévisible.

## 20. Hypothèses de monétisation

La V1 interne ne facture pas.

Les options à tester avant le SaaS :

- abonnement par nombre de niches actives
- crédits par radar
- crédits par volume de contenus analysés
- plan agence avec plusieurs workspaces
- option d’analyse fréquente pour les niches rapides

La tarification ne doit pas être figée avant de connaître :

- coût moyen d’un radar
- coût d’un pack approuvé
- fréquence d’usage réelle
- valeur perçue par niche
- marge du fournisseur de données

## 21. Dépendances

### Données

- TrendTrack MCP ou fournisseur équivalent
- accès autorisé aux données TikTok organiques
- accès autorisé aux publicités Meta

### IA

- au moins un fournisseur LLM principal
- un fournisseur ou modèle de fallback
- embeddings

### Infrastructure

- PostgreSQL avec pgvector
- Trigger.dev
- stockage compatible S3
- Langfuse
- Sentry

### Juridique

- validation des conditions d’utilisation commerciale
- politique de conservation
- mentions utilisateur sur les limites des signaux

## 22. Vagues produit

### Vague 0 : preuve technique et droits

**Livrables :**

- validation des droits
- client MCP
- adaptateurs TikTok et Meta
- schéma normalisé
- snapshots réels
- mesure des coûts et quotas
- politique de conservation

**Critère de sortie :**

Une collecte réelle TikTok et Meta est normalisée, rejouable et exploitable selon les droits confirmés.

### Vague 1 : radar interne

**Livrables :**

- interface interne
- profil de niche
- collecte
- scoring
- clusters
- agents d’analyse et création
- opportunités
- packs créatifs
- validation humaine
- coûts et traces

**Critère de sortie :**

Un radar quotidien produit des opportunités et packs à partir de vraies données. Chaque affirmation possède une preuve.

### Vague 2 : qualité mesurée

**Livrables :**

- plusieurs niches
- mémoire de marque
- feedback structuré
- résultats publiés
- corpus d’évaluation
- comparaison de modèles

**Critère de sortie :**

Le même workflow conserve une qualité stable sur plusieurs niches sans réécriture.

### Vague 3 : SaaS self-service

**Livrables :**

- authentification
- isolation multi-tenant
- onboarding
- quotas
- facturation
- administration
- suppression de compte
- OAuth pour les résultats sociaux

**Critère de sortie :**

Des clients pilotes créent leur niche et obtiennent un radar exploitable sans intervention opérateur.

### Vague 4 : extension

- nouveaux réseaux
- génération d’images
- génération de vidéos
- publication avec approbation
- API
- marque blanche

## 23. Backlog exécutable

### Epic E0 : preuve fournisseur

| ID | Ticket | Priorité | Dépendance | Acceptation |
|---|---|---|---|---|
| E0-01 | Confirmer les droits commerciaux TrendTrack | P0 | Aucune | Réponse écrite archivée |
| E0-02 | Connecter le MCP TrendTrack | P0 | E0-01 pour usage commercial | Appel réel et quota visible |
| E0-03 | Définir l’adaptateur TikTok | P0 | E0-02 | Fixture et contrat validés |
| E0-04 | Définir l’adaptateur Meta | P0 | E0-02 | Fixture et contrat validés |
| E0-05 | Mesurer le coût d’une collecte | P0 | E0-03, E0-04 | Coût enregistré par requête |
| E0-06 | Écrire la politique de conservation | P0 | E0-01 | Règles par type de donnée |

### Epic E1 : socle produit

| ID | Ticket | Priorité | Dépendance | Acceptation |
|---|---|---|---|---|
| E1-01 | Créer le monorepo TypeScript | P0 | Aucune | Build et tests passent |
| E1-02 | Configurer PostgreSQL et pgvector | P0 | E1-01 | Migration appliquée |
| E1-03 | Implémenter le schéma de données | P0 | E1-02 | Contraintes et index validés |
| E1-04 | Configurer Trigger.dev | P0 | E1-01 | Job de test rejouable |
| E1-05 | Configurer Sentry | P1 | E1-01 | Erreur de test visible |
| E1-06 | Configurer Langfuse | P1 | E1-01 | Trace LLM visible |

### Epic E2 : niche

| ID | Ticket | Priorité | Dépendance | Acceptation |
|---|---|---|---|---|
| E2-01 | Créer le formulaire de niche | P0 | E1-03 | Validation des champs |
| E2-02 | Implémenter Niche Mapper | P0 | E2-01 | JSON Zod valide |
| E2-03 | Créer l’écran de validation | P0 | E2-02 | Édition et versionnage |
| E2-04 | Implémenter la garde de couverture | P0 | E0-03, E0-04 | Statuts corrects |

### Epic E3 : ingestion

| ID | Ticket | Priorité | Dépendance | Acceptation |
|---|---|---|---|---|
| E3-01 | Orchestrer la collecte paginée | P0 | E0-03, E0-04, E1-04 | Curseurs persistés |
| E3-02 | Normaliser les éléments | P0 | E3-01 | Schéma commun valide |
| E3-03 | Dédoublonner | P0 | E3-02 | Rejeu sans doublon |
| E3-04 | Enregistrer les snapshots | P0 | E3-02 | Provenance horodatée |
| E3-05 | Appliquer la rétention | P0 | E0-06 | Suppression sous 24 h |

### Epic E4 : signal

| ID | Ticket | Priorité | Dépendance | Acceptation |
|---|---|---|---|---|
| E4-01 | Construire les cohortes TikTok | P0 | E3-04 | Cohort explicable |
| E4-02 | Calculer le score TikTok | P0 | E4-01 | Dimensions et confiance |
| E4-03 | Calculer le signal Meta | P0 | E3-04 | Aucune rentabilité inventée |
| E4-04 | Générer les embeddings | P0 | E3-02 | Embeddings persistés |
| E4-05 | Former les clusters | P0 | E4-04 | Membres et seuil versionnés |
| E4-06 | Détecter les candidats | P0 | E4-02, E4-03, E4-05 | Garde de couverture respectée |

### Epic E5 : intelligence et création

| ID | Ticket | Priorité | Dépendance | Acceptation |
|---|---|---|---|---|
| E5-01 | Implémenter Signal Analyst | P0 | E4-06 | Evidence IDs obligatoires |
| E5-02 | Implémenter Strategist | P0 | E5-01 | Opportunité structurée |
| E5-03 | Implémenter Creative Composer | P0 | E5-02 | Pack complet |
| E5-04 | Implémenter anti-copie | P0 | E5-03 | Rapport lexical et sémantique |
| E5-05 | Implémenter Critic | P0 | E5-03, E5-04 | Pass, revise ou reject |
| E5-06 | Implémenter Curator | P0 | E5-05 | Rapport sans doublon |

### Epic E6 : interface et validation

| ID | Ticket | Priorité | Dépendance | Acceptation |
|---|---|---|---|---|
| E6-01 | Construire la page Radar | P0 | E5-06 | Rapport consultable |
| E6-02 | Construire la page Opportunité | P0 | E5-02 | Preuves visibles |
| E6-03 | Construire le Studio créatif | P0 | E5-03 | Édition et versions |
| E6-04 | Ajouter les décisions humaines | P0 | E6-02, E6-03 | Feedback persisté |
| E6-05 | Construire la page Runs | P1 | E1-04 | Coûts et erreurs visibles |

### Epic E7 : apprentissage et évaluation

| ID | Ticket | Priorité | Dépendance | Acceptation |
|---|---|---|---|---|
| E7-01 | Créer les raisons de rejet | P0 | E6-04 | Liste standardisée |
| E7-02 | Proposer les règles de marque | P1 | E7-01 | Validation requise |
| E7-03 | Saisir les résultats publiés | P1 | E6-03 | Rattachés au draft |
| E7-04 | Créer le corpus doré | P0 | E5-01 à E5-05 | Cas nominaux et adversariaux |
| E7-05 | Ajouter les évaluations automatiques | P0 | E7-04 | Rapport par version |

## 24. Stratégie de tests

### Unitaires

- normalisation
- dédoublonnage
- snapshots
- cohortes
- percentiles
- scores
- couverture
- politiques de conservation
- budgets

### Contrats fournisseurs

- réponse nominale
- pagination
- quota épuisé
- champ absent
- type incorrect
- erreur d’autorisation
- timeout
- changement de schéma

### Intégration

- pipeline complet avec fixtures
- run partiel
- rejeu idempotent
- fallback LLM
- JSON invalide
- rejet du Critic
- mémoire de marque

### Sécurité

- injection dans une transcription
- injection dans une publicité
- URL malveillante
- appel MCP non autorisé
- fuite inter-workspace
- accès à un secret

### Bout en bout

Le scénario de recette est :

1. créer une niche
2. valider la carte
3. lancer un radar
4. consulter les preuves
5. accepter une opportunité
6. générer un pack
7. modifier un hook
8. approuver le pack
9. créer une règle de marque
10. rejouer le run sans doublon

## 25. Risques

| Risque | Gravité | Réponse |
|---|---|---|
| Droits insuffisants pour commercialiser les données | Critique | Validation écrite avant ouverture commerciale |
| Dépendance à un fournisseur | Élevée | Adaptateurs internes et source de secours |
| Couverture insuffisante | Élevée | Garde de couverture et refus explicite |
| Coût imprévisible | Élevée | Budgets, cache et filtrage avant LLM |
| Hallucination analytique | Élevée | Evidence IDs, Critic et évaluations |
| Copie trop proche | Élevée | Contrôle lexical, sémantique et humain |
| Biais en faveur des grands comptes | Élevée | Cohortes par taille, âge, pays et format |
| Fuite entre clients | Critique | RLS, tests et audit avant SaaS |
| Faux apprentissage | Moyenne | Séparer préférence et résultat terrain |
| Trop de recommandations | Moyenne | Curator et plafond par rapport |

## 26. Conditions de lancement

### Lancement interne

- droits d’usage interne confirmés
- collecte TikTok et Meta fonctionnelle
- snapshots réels
- scoring testé
- chaque affirmation possède une preuve
- contrôle anti-copie actif
- coût par run visible
- rejeu sans doublon

### Passage au SaaS

- droits commerciaux confirmés
- plusieurs niches testées
- taux d’approbation stable
- coût par radar connu
- corpus d’évaluation actif
- suppression vérifiable
- isolation multi-tenant testée
- promesse commerciale alignée avec les limites

## 27. Décisions produit

| Sujet | Décision |
|---|---|
| Produit initial | Copilote d’intelligence créative |
| Canaux | TikTok organique et Meta Ads |
| Utilisateur initial | Agence interne |
| Livrables | Hooks, scripts, storyboards et briefs |
| Publication | Hors V1 |
| Architecture | Workflow hybride |
| Scoring | Déterministe par source |
| Agents | Fonctions spécialisées sans mémoire implicite |
| Mémoire | PostgreSQL et règles versionnées |
| Apprentissage | Feedback et résultats terrain |
| Fine-tuning | Reporté |
| SaaS | Après validation du moteur |

## 28. Références

- Spécification technique : `docs/superpowers/specs/2026-09-02-viral-copilot-design.md`
- Diagramme des options : `/opt/data/viral-copilot-architecture-options.html`
- Diagramme détaillé : `/opt/data/viral-copilot-detailed-architecture.html`
- Flux et scoring : `/opt/data/viral-copilot-data-flow.html`
- Livrables et garde-fous : `/opt/data/viral-copilot-guardrails.html`
- Résilience et roadmap : `/opt/data/viral-copilot-resilience-roadmap.html`
