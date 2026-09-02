# Extraction visuelle : Postiz et 21st.dev

**Date de capture :** 2 septembre 2026  
**Produit cible :** Viral Copilot  
**Direction retenue :** Neon Command

## Sources

- https://postiz.com/
- https://21st.dev/

Les pages ont été chargées dans Chromium aux formats desktop 1440 × 1000 et mobile 390 × 844. Les styles calculés ont été extraits depuis le DOM rendu, pas seulement depuis le HTML initial.

## Fichiers de preuve

### Postiz

- `postiz-desktop.png`
- `postiz-mobile.png`
- `postiz-mid.png`
- `postiz-lower.png`
- `postiz-computed.json`

### 21st.dev

- `21st-desktop.png`
- `21st-mobile.png`
- `21st-mid.png`
- `21st-lower.png`
- `21st-computed.json`

## Relevé Postiz

### Palette observée

- fond principal : `#0E0E0E`
- surfaces récurrentes : `#1A1919` avec opacité, `#242323`, `#190B30`
- texte principal : `#FFFFFF`
- texte secondaire : `#D1D1D1`
- rose : `#FC69FF` et `#FF4CE2`
- violet : `#8217C3`
- indigo des cartes métriques : `#3E30D8`
- bordures : blanc à environ 10 % d’opacité

### Typographie observée

- Plus Jakarta Sans pour les titres
- DM Sans pour le corps et les contrôles
- hero desktop : 70px, graisse 800, interligne 77px
- titres de section : 48px, graisse 700, interligne 52.8px
- corps dominant : 16px et 18px
- actions principales : 16px à 19px, graisse 500

### Formes observées

- cartes : rayons 20px
- grands panneaux : 30px à 32px
- boutons et filtres : rayon pilule
- inputs et menus compacts : environ 14px à 16px

### Composants observés

- CTA blanc sur noir avec hover rose
- CTA secondaire transparent avec bordure blanche
- cartes métriques en rails horizontaux
- cartes saturées rose, violet ou bleu
- grands panneaux marketing contenant des captures produit
- témoignages sur surfaces `#1A1919` à bordure blanche faible
- FAQ en cartes de 20px

### Mouvement observé

- rail horizontal continu sur les cartes de résultats
- transitions standard de 150ms
- peu de shadows, la profondeur vient surtout des surfaces et de la couleur

## Relevé 21st.dev

### Palette observée

- fond sombre proche de `#09090B`
- surface sombre `oklch(0.21 0.006 285.883)`
- texte principal `oklch(0.968 0.001 286.375)`
- texte secondaire `oklch(0.654 0.014 286.01)`
- bleu primaire `oklch(0.485 0.291 264.121)`
- bordures `oklch(0.274 0.005 286.033)`

### Typographie observée

- General Sans pour l’interface
- Averia Serif Libre pour quelques mots expressifs en italique
- monospace pour les extraits techniques
- hero : 64px, graisse 500, interligne 1.06, tracking `-0.022em`
- titres de section : 44px, graisse 500
- navigation : 13px, graisse 500
- forte densité de labels entre 11px et 15px

### Formes observées

- rayons dominants : 6px, 8px et 12px
- boutons principaux en pilule
- composants denses avec bordures fines
- cartes profondes avec shadows internes et externes mesurées

### Mouvement observé

- entrée hero : blur 14px et translation 14px pendant 1 seconde
- fade secondaire : 0.9 seconde
- entrée du halo : 1.6 seconde
- pulsation du halo : 10 secondes
- transition carte vers dialogue : 500ms
- micro-interactions : 150ms à 300ms
- versions `prefers-reduced-motion` présentes

### Motifs retenus pour Viral Copilot

- reveal flou vers net à la fin d’un radar
- transition carte vers détail
- halo lent uniquement pendant un run actif
- support systématique de la réduction de mouvement

### Motifs écartés

- mot serif animé dans les titres d’application
- shader permanent
- texte ondulant
- effet machine à écrire en boucle
- galerie de composants en défilement continu

## Décision finale

Neon Command reste volontairement plus proche de Postiz :

- même logique de fond noir
- mêmes familles Plus Jakarta Sans et DM Sans
- grands rayons de 20px et 32px
- boutons blancs en pilule
- énergie rose, violet et indigo
- cartes de signal saturées

Les adaptations propres à Viral Copilot sont :

- gradients limités aux signaux forts
- statut et confiance toujours écrits
- IBM Plex Mono pour la provenance et les coûts
- signal sweep magenta vers cobalt au lancement d’un radar
- preuve et interprétation visuellement séparées
- contrôles WCAG corrigés par rapport aux combinaisons observées

Aucun logo, doodle, screenshot produit, illustration, composant ou média propriétaire de Postiz ou 21st.dev n’est repris dans le design system.
