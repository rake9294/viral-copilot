---
version: alpha
name: Viral Copilot Neon Command
description: Dark social intelligence interface inspired by Postiz, with disciplined motion patterns adapted from 21st.dev.
colors:
  primary: "#FC69FF"
  primary-strong: "#FF4CE2"
  secondary: "#8217C3"
  tertiary: "#3E30D8"
  cobalt: "#7A9BFF"
  background: "#0E0E0E"
  surface: "#1A1919"
  surface-elevated: "#242323"
  surface-violet: "#190B30"
  foreground: "#FFFFFF"
  foreground-inverse: "#0E0E0E"
  muted: "#D1D1D1"
  subtle: "#94949D"
  border: "#343238"
  border-soft: "#2A282D"
  success: "#32D583"
  warning: "#F5B942"
  danger: "#F97066"
  info: "#4B73FF"
  tiktok: "#25F4EE"
  meta: "#4B73FF"
  overlay: "rgba(8, 8, 10, 0.82)"
typography:
  display-xl:
    fontFamily: Plus Jakarta Sans
    fontSize: 70px
    fontWeight: 800
    lineHeight: 1.1
    letterSpacing: "-0.035em"
  display-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 56px
    fontWeight: 700
    lineHeight: 1.1
    letterSpacing: "-0.03em"
  heading-xl:
    fontFamily: Plus Jakarta Sans
    fontSize: 48px
    fontWeight: 700
    lineHeight: 1.1
    letterSpacing: "-0.025em"
  heading-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 36px
    fontWeight: 700
    lineHeight: 1.15
    letterSpacing: "-0.02em"
  heading-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 28px
    fontWeight: 700
    lineHeight: 1.2
    letterSpacing: "-0.015em"
  heading-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 22px
    fontWeight: 600
    lineHeight: 1.25
    letterSpacing: "-0.01em"
  title-md:
    fontFamily: DM Sans
    fontSize: 18px
    fontWeight: 600
    lineHeight: 1.35
    letterSpacing: "-0.005em"
  body-lg:
    fontFamily: DM Sans
    fontSize: 18px
    fontWeight: 400
    lineHeight: 1.5
  body-md:
    fontFamily: DM Sans
    fontSize: 16px
    fontWeight: 400
    lineHeight: 1.5
  body-sm:
    fontFamily: DM Sans
    fontSize: 14px
    fontWeight: 400
    lineHeight: 1.45
  label-md:
    fontFamily: DM Sans
    fontSize: 13px
    fontWeight: 500
    lineHeight: 1.35
  label-sm:
    fontFamily: DM Sans
    fontSize: 12px
    fontWeight: 500
    lineHeight: 1.3
    letterSpacing: "0.01em"
  metric-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 36px
    fontWeight: 700
    lineHeight: 1
    letterSpacing: "-0.025em"
  metric-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 24px
    fontWeight: 700
    lineHeight: 1.1
    letterSpacing: "-0.015em"
  data-sm:
    fontFamily: IBM Plex Mono
    fontSize: 12px
    fontWeight: 500
    lineHeight: 1.45
    letterSpacing: "0.01em"
rounded:
  xs: 6px
  sm: 10px
  md: 14px
  lg: 20px
  xl: 32px
  pill: 9999px
spacing:
  1: 4px
  2: 8px
  3: 12px
  4: 16px
  5: 20px
  6: 24px
  8: 32px
  10: 40px
  12: 48px
  16: 64px
  20: 80px
components:
  app-shell:
    backgroundColor: "{colors.background}"
    textColor: "{colors.foreground}"
    typography: "{typography.body-md}"
  sidebar:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.muted}"
    rounded: "{rounded.xl}"
    padding: 16px
    width: 248px
  sidebar-item:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.muted}"
    typography: "{typography.label-md}"
    rounded: "{rounded.md}"
    padding: 12px
    height: 44px
  sidebar-item-hover:
    backgroundColor: "{colors.surface-elevated}"
    textColor: "{colors.foreground}"
    rounded: "{rounded.md}"
    padding: 12px
    height: 44px
  sidebar-item-active:
    backgroundColor: "{colors.surface-violet}"
    textColor: "{colors.foreground}"
    typography: "{typography.label-md}"
    rounded: "{rounded.md}"
    padding: 12px
    height: 44px
  topbar:
    backgroundColor: "{colors.background}"
    textColor: "{colors.foreground}"
    padding: 16px
    height: 64px
  button-primary:
    backgroundColor: "{colors.foreground}"
    textColor: "{colors.foreground-inverse}"
    typography: "{typography.label-md}"
    rounded: "{rounded.pill}"
    padding: 16px
    height: 48px
  button-primary-hover:
    backgroundColor: "{colors.primary-strong}"
    textColor: "{colors.foreground-inverse}"
    typography: "{typography.label-md}"
    rounded: "{rounded.pill}"
    padding: 16px
    height: 48px
  button-secondary:
    backgroundColor: "{colors.surface-elevated}"
    textColor: "{colors.foreground}"
    typography: "{typography.label-md}"
    rounded: "{rounded.pill}"
    padding: 16px
    height: 48px
  button-secondary-hover:
    backgroundColor: "{colors.secondary}"
    textColor: "{colors.foreground}"
    typography: "{typography.label-md}"
    rounded: "{rounded.pill}"
    padding: 16px
    height: 48px
  button-ghost:
    backgroundColor: "{colors.background}"
    textColor: "{colors.muted}"
    typography: "{typography.label-md}"
    rounded: "{rounded.pill}"
    padding: 12px
    height: 40px
  button-ghost-hover:
    backgroundColor: "{colors.surface-elevated}"
    textColor: "{colors.foreground}"
    typography: "{typography.label-md}"
    rounded: "{rounded.pill}"
    padding: 12px
    height: 40px
  icon-button:
    backgroundColor: "{colors.surface-elevated}"
    textColor: "{colors.foreground}"
    rounded: "{rounded.pill}"
    padding: 12px
    size: 44px
  input:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.foreground}"
    typography: "{typography.body-md}"
    rounded: "{rounded.md}"
    padding: 16px
    height: 48px
  input-focus:
    backgroundColor: "{colors.surface-elevated}"
    textColor: "{colors.foreground}"
    typography: "{typography.body-md}"
    rounded: "{rounded.md}"
    padding: 16px
    height: 48px
  select:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.foreground}"
    typography: "{typography.body-sm}"
    rounded: "{rounded.md}"
    padding: 12px
    height: 44px
  card-default:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.foreground}"
    rounded: "{rounded.lg}"
    padding: 24px
  card-raised:
    backgroundColor: "{colors.surface-elevated}"
    textColor: "{colors.foreground}"
    rounded: "{rounded.lg}"
    padding: 24px
  card-opportunity:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.foreground}"
    rounded: "{rounded.lg}"
    padding: 20px
  card-opportunity-hover:
    backgroundColor: "{colors.surface-violet}"
    textColor: "{colors.foreground}"
    rounded: "{rounded.lg}"
    padding: 20px
  card-signal-pink:
    backgroundColor: "{colors.primary-strong}"
    textColor: "{colors.foreground-inverse}"
    rounded: "{rounded.lg}"
    padding: 24px
  card-signal-purple:
    backgroundColor: "{colors.secondary}"
    textColor: "{colors.foreground}"
    rounded: "{rounded.lg}"
    padding: 24px
  card-signal-blue:
    backgroundColor: "{colors.tertiary}"
    textColor: "{colors.foreground}"
    rounded: "{rounded.lg}"
    padding: 24px
  metric-tile:
    backgroundColor: "{colors.surface-elevated}"
    textColor: "{colors.foreground}"
    typography: "{typography.metric-lg}"
    rounded: "{rounded.lg}"
    padding: 20px
  evidence-panel:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.muted}"
    typography: "{typography.body-sm}"
    rounded: "{rounded.lg}"
    padding: 24px
  data-table-header:
    backgroundColor: "{colors.surface-elevated}"
    textColor: "{colors.subtle}"
    typography: "{typography.label-sm}"
    rounded: "{rounded.sm}"
    padding: 12px
    height: 40px
  data-table-row:
    backgroundColor: "{colors.background}"
    textColor: "{colors.foreground}"
    typography: "{typography.body-sm}"
    padding: 12px
    height: 52px
  badge-neutral:
    backgroundColor: "{colors.surface-elevated}"
    textColor: "{colors.muted}"
    typography: "{typography.label-sm}"
    rounded: "{rounded.pill}"
    padding: 8px
    height: 28px
  badge-primary:
    backgroundColor: "{colors.surface-violet}"
    textColor: "{colors.primary}"
    typography: "{typography.label-sm}"
    rounded: "{rounded.pill}"
    padding: 8px
    height: 28px
  badge-success:
    backgroundColor: "{colors.success}"
    textColor: "{colors.foreground-inverse}"
    typography: "{typography.label-sm}"
    rounded: "{rounded.pill}"
    padding: 8px
    height: 28px
  badge-warning:
    backgroundColor: "{colors.warning}"
    textColor: "{colors.foreground-inverse}"
    typography: "{typography.label-sm}"
    rounded: "{rounded.pill}"
    padding: 8px
    height: 28px
  badge-danger:
    backgroundColor: "{colors.danger}"
    textColor: "{colors.foreground-inverse}"
    typography: "{typography.label-sm}"
    rounded: "{rounded.pill}"
    padding: 8px
    height: 28px
  badge-info:
    backgroundColor: "{colors.info}"
    textColor: "{colors.foreground-inverse}"
    typography: "{typography.label-sm}"
    rounded: "{rounded.pill}"
    padding: 8px
    height: 28px
  source-tiktok:
    backgroundColor: "{colors.surface-elevated}"
    textColor: "{colors.tiktok}"
    typography: "{typography.label-sm}"
    rounded: "{rounded.pill}"
    padding: 8px
    height: 28px
  source-meta:
    backgroundColor: "{colors.meta}"
    textColor: "{colors.foreground-inverse}"
    typography: "{typography.label-sm}"
    rounded: "{rounded.pill}"
    padding: 8px
    height: 28px
  link:
    backgroundColor: "{colors.background}"
    textColor: "{colors.cobalt}"
    typography: "{typography.body-sm}"
  divider:
    backgroundColor: "{colors.border}"
    textColor: "{colors.foreground}"
    height: 1px
  tab:
    backgroundColor: "{colors.background}"
    textColor: "{colors.subtle}"
    typography: "{typography.label-md}"
    rounded: "{rounded.pill}"
    padding: 12px
    height: 36px
  tab-active:
    backgroundColor: "{colors.surface-elevated}"
    textColor: "{colors.foreground}"
    typography: "{typography.label-md}"
    rounded: "{rounded.pill}"
    padding: 12px
    height: 36px
  modal:
    backgroundColor: "{colors.surface-elevated}"
    textColor: "{colors.foreground}"
    rounded: "{rounded.xl}"
    padding: 32px
    width: 720px
  modal-overlay:
    backgroundColor: "{colors.overlay}"
    textColor: "{colors.foreground}"
  tooltip:
    backgroundColor: "{colors.foreground}"
    textColor: "{colors.foreground-inverse}"
    typography: "{typography.label-sm}"
    rounded: "{rounded.sm}"
    padding: 8px
  empty-state:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.muted}"
    typography: "{typography.body-md}"
    rounded: "{rounded.xl}"
    padding: 32px
  skeleton:
    backgroundColor: "{colors.border-soft}"
    textColor: "{colors.subtle}"
    rounded: "{rounded.md}"
---

## Overview

Neon Command is the visual system for Viral Copilot. It takes Postiz's dark social-media energy as the primary reference: near-black backgrounds, generous rounded surfaces, white pill actions, Plus Jakarta Sans display type, DM Sans interface text, and saturated pink, purple, and cobalt signal cards.

The product is not a Postiz clone. Viral Copilot is an intelligence workspace, so the system uses color as evidence rather than decoration. Neutral surfaces carry navigation, tables, configuration, and long-form analysis. Saturated surfaces are reserved for strong signals, progress, selected opportunities, and the moments where the system finds something worth acting on.

21st.dev contributes motion discipline, not its brand. Viral Copilot uses a blur-to-sharp entry for completed radar results, a card-to-detail view transition, and a slow ambient glow while a radar is actively running. These movements must never interfere with comparison, reading, or review.

The signature interaction is the signal sweep: a thin magenta-to-cobalt line crosses the radar once when analysis starts, then resolves into the evidence trail linking a score to its sources.

## Colors

### Core dark surfaces

- `background` `#0E0E0E` is the page canvas and application shell.
- `surface` `#1A1919` is the default card, sidebar, input, and panel surface.
- `surface-elevated` `#242323` separates active controls and raised information without relying on large shadows.
- `surface-violet` `#190B30` marks selection, active navigation, and opportunity hover states.
- `border` `#343238` is the normal divider on elevated surfaces.
- `border-soft` `#2A282D` is used for quiet separators and skeletons.

### Text

- `foreground` `#FFFFFF` is reserved for headings, primary values, and active labels.
- `muted` `#D1D1D1` is the normal reading color for body copy.
- `subtle` `#94949D` is limited to metadata, timestamps, provenance, and disabled labels.
- Never place `subtle` text below 14px unless it is nonessential metadata.

### Brand and signal colors

- `primary` `#FC69FF` is the recognizable brand accent.
- `primary-strong` `#FF4CE2` is the hover and high-energy state.
- `secondary` `#8217C3` represents pattern formation and creative clustering.
- `tertiary` `#3E30D8` represents measured signal strength.
- `cobalt` `#2455E6` is used for charts, links, and technical focus states.

Saturated colors must not fill every dashboard tile. On a normal radar screen, no more than one large saturated panel and three small saturated cards should be visible in the same viewport.

### Status colors

- `success` `#32D583`: validated, approved, healthy source.
- `warning` `#F5B942`: partial coverage, claim requiring review, approaching quota.
- `danger` `#F97066`: failed run, rejected draft, destructive action.
- `info` `#4B73FF`: active processing, neutral information, Meta source.
- `tiktok` `#25F4EE`: TikTok source label only.

Do not use status colors as decorative accents.

### Signal gradients

Gradients belong in CSS because DESIGN.md component colors remain single tokens.

```css
--gradient-signal-hot: linear-gradient(135deg, #8217C3 0%, #FF4CE2 58%, #FC69FF 100%);
--gradient-signal-deep: linear-gradient(135deg, #190B30 0%, #3E30D8 100%);
--gradient-signal-spectrum: linear-gradient(90deg, #FC69FF 0%, #8217C3 44%, #3E30D8 100%);
--gradient-surface-glow: radial-gradient(circle at 60% 0%, rgba(62,48,216,.30), transparent 58%);
```

## Typography

### Families

- Plus Jakarta Sans carries marketing headlines, page titles, opportunity names, and prominent metrics. It is the strongest direct reference to Postiz.
- DM Sans is the default application face. It handles body copy, buttons, filters, forms, and navigation.
- IBM Plex Mono is limited to evidence IDs, timestamps, model versions, costs, run logs, and raw metric labels.

All three families are open-source and should be self-hosted as WOFF2 files in production.

### Hierarchy

- `display-xl` is limited to the marketing homepage and launch presentation.
- `display-lg` is used for a landing hero or onboarding completion screen.
- `heading-xl` is a marketing section title, not a dashboard title.
- `heading-lg` is the largest dashboard page title.
- `heading-md` names a major panel or opportunity.
- `heading-sm` names cards and workflow sections.
- `title-md` names rows, tabs, and compact cards.
- `body-md` is the application default.
- `body-sm` carries secondary explanations and evidence snippets.
- `label-md` and `label-sm` carry actions and metadata.
- `metric-lg` and `metric-md` are for actual observed or derived values, never decorative numbers.

Use sentence case throughout the product. Do not use all caps except for short source or status labels of four words or fewer.

## Layout

### Marketing site

- Maximum content width: 1320px.
- Desktop gutter: 60px.
- Tablet gutter: 32px.
- Mobile gutter: 20px.
- Hero content uses a centered 10-column composition, with a maximum text width of 920px.
- Marketing sections use 96px to 144px vertical rhythm.
- Feature panels use 32px radii and 40px internal padding on desktop.

### Application shell

- Desktop sidebar: 248px wide, with 16px outer inset and 32px radius.
- Desktop topbar: 64px high.
- Main content gutter: 24px under 1280px, 32px at 1280px and above.
- Content grid: 12 columns, 12px gap for dashboards, 16px gap for content-heavy pages.
- Maximum reading width for analysis: 760px.
- Maximum evidence drawer width: 520px.
- Opportunity detail uses a 7-column main area and 5-column evidence area.

### Responsive breakpoints

- 640px: compact mobile controls.
- 768px: two-column cards where appropriate.
- 1024px: persistent sidebar and split evidence view.
- 1280px: full 12-column dashboard.
- 1536px: increased gutters, never increased body text size.

On mobile, the evidence panel becomes a full-screen sheet. Signal cards stack vertically. Horizontal metric rails may scroll, but tables must convert to labeled rows.

## Elevation & Depth

Neon Command follows Postiz's low-shadow approach. Surface contrast and thin borders do most of the work.

```css
--shadow-card-rest: 0 1px 0 rgba(255,255,255,.04) inset;
--shadow-card-hover: 0 1px 0 rgba(255,255,255,.08) inset, 0 18px 44px rgba(0,0,0,.28);
--shadow-popover: 0 18px 60px rgba(0,0,0,.55);
--shadow-modal: 0 32px 96px rgba(0,0,0,.72);
--ring-focus: 0 0 0 3px rgba(252,105,255,.32);
```

- Default cards use one border and `shadow-card-rest`.
- Hover lift is limited to interactive cards.
- Tables and static evidence panels never lift on hover.
- Modals use the strongest shadow and the `overlay` token.
- Do not stack glass blur, large shadow, gradient border, and scale on the same component.

## Shapes

- `xs` and `sm` belong to data controls, code blocks, tooltips, and dense tables.
- `md` is the default input and compact navigation radius.
- `lg` is the default card radius and the main Postiz-inspired shape.
- `xl` is reserved for large feature panels, modals, empty states, and the sidebar.
- `pill` is used for buttons, filters, tabs, badges, and source chips.

A page should not mix more than three radius levels in one viewport. Use `lg` cards with pill controls as the default combination.

## Components

### Application shell

The shell uses `app-shell`, `sidebar`, and `topbar`. The sidebar is visually detached from the viewport edge by a 16px inset. Active navigation uses `sidebar-item-active`; it does not use a saturated full pink fill.

### Buttons

- `button-primary` is white on black, matching Postiz's strongest call to action.
- `button-primary-hover` turns pink rather than scaling beyond 1.02.
- `button-secondary` is the normal application action.
- `button-ghost` is for low-priority actions.
- Buttons use action verbs: "Lancer le radar", "Valider l’opportunité", "Créer le pack".
- A page should have one primary button in its top action area.

### Cards

- `card-default` carries normal content.
- `card-raised` carries selected context or a secondary action.
- `card-opportunity` is an interactive pattern summary.
- `card-signal-pink`, `card-signal-purple`, and `card-signal-blue` are reserved for the strongest live signals and metric rails.
- Saturated signal cards always include a plain-language label, source, confidence, and capture time. Color alone never conveys strength.

### Metrics

`metric-tile` uses Plus Jakarta Sans. Every metric must include its unit, time window, and provenance. Avoid large numbers without labels.

### Evidence

`evidence-panel` must visually separate observed facts from LLM interpretation. Evidence IDs and timestamps use `data-sm`. Source links remain cobalt or source-colored and underlined on hover.

### Tables

Tables use quiet rows on the page background. The header uses `data-table-header`. Do not put every table row inside a rounded card. Selected rows may use `surface-violet` with a 3px primary left indicator.

### Badges and source chips

- Neutral badges identify state or metadata.
- Status badges use success, warning, danger, or info.
- `source-tiktok` and `source-meta` identify provenance.
- Every colored badge needs text. Never use an unlabeled colored dot as the only status cue.

### Inputs and filters

Inputs use `surface`, 14px radius, and a visible pink focus ring. Filter groups use pill tabs only when the options are mutually exclusive. Long forms use labels above fields, not placeholders as labels.

### Dialogs and detail views

Opportunity cards open into a detail panel using a View Transition when supported. The transition name is assigned to the selected card and its target panel. Unsupported browsers receive a normal 180ms opacity transition.

## Motion

Motion is taken from the restraint and timing observed on 21st.dev, then recolored for Neon Command.

### Motion tokens

```css
--ease-standard: cubic-bezier(.4, 0, .2, 1);
--ease-enter: cubic-bezier(.2, .6, .2, 1);
--ease-emphasized: cubic-bezier(.22, 1, .36, 1);
--duration-fast: 150ms;
--duration-base: 220ms;
--duration-panel: 500ms;
--duration-reveal: 1000ms;
--duration-ambient: 10000ms;
```

### Radar reveal

A completed radar enters from 14px below with 14px blur. It resolves over 1000ms with `ease-enter`. Child cards stagger by 50ms, with a maximum total stagger of 250ms.

```css
@keyframes radar-reveal {
  from { opacity: 0; filter: blur(14px); transform: translateY(14px); }
  to { opacity: 1; filter: blur(0); transform: translateY(0); }
}
```

### Signal sweep

The signal sweep appears once when a radar begins. It is a 2px line using `gradient-signal-spectrum`, with a restrained glow. It must not loop.

```css
@keyframes signal-sweep {
  from { transform: translateX(-110%); opacity: 0; }
  15% { opacity: 1; }
  85% { opacity: 1; }
  to { transform: translateX(110%); opacity: 0; }
}
```

Duration: 1400ms. Timing: `ease-emphasized`.

### Active radar glow

A soft cobalt-violet radial glow may pulse behind the run progress panel. Scale ranges from 1 to 1.05 and opacity from 0.72 to 0.9 over 10 seconds. It stops when the run finishes.

### Card to detail morph

The selected opportunity uses a 500ms View Transition with `ease-emphasized`. The card background must resolve to `surface-elevated`, not flash white.

### Hover and press

- Hover: border or background transition in 150ms.
- Interactive card: translateY(-2px), never more.
- Pressed button: scale(0.98).
- No bouncing icons in the application shell.

### Reduced motion

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 1ms !important;
    animation-iteration-count: 1 !important;
    scroll-behavior: auto !important;
    transition-duration: 1ms !important;
  }
}
```

All information revealed through motion must already exist in the DOM and remain accessible when animation is disabled.

## Do's and Don'ts

### Do

- Use black and warm charcoal as the dominant canvas.
- Keep primary actions white until hover.
- Reserve pink, purple, and cobalt for meaningful signal states.
- Pair Plus Jakarta Sans headings with DM Sans interface copy.
- Use 20px cards and pill controls as the default shape language.
- Attach confidence, provenance, and capture time to every signal.
- Use one orchestrated animation per workflow moment.
- Keep evidence visually calmer than the opportunity card it supports.
- Test text contrast and focus rings on every saturated card.
- Make partial coverage and insufficient signal visible, not apologetic.

### Don't

- Do not copy Postiz's logo, doodles, marketing illustrations, screenshots, or exact gradient compositions.
- Do not use 21st.dev's logo, serif word treatment, component thumbnails, or blue landing glow as brand assets.
- Do not fill every card with a gradient.
- Do not use pink for ordinary metadata.
- Do not use animation as a loading substitute when progress can be shown.
- Do not animate tables, logs, or evidence while the user is reading.
- Do not combine glassmorphism, neon borders, large shadows, and scale on one component.
- Do not use color as the only signal of status or confidence.
- Do not show a score without its cohort and confidence.
- Do not present estimates as observed metrics.
