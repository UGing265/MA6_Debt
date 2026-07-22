# Frontend Design System for MA6 Debt

This is the canonical frontend UI/UX/design-system reference for MA6 Debt. It supersedes older combined frontend design notes for frontend work, while those older files remain historical source evidence.

## Agents must follow this before FE work

- Read this file before planning, documenting, or coding any frontend, UI, UX, component, chart, interaction, responsive, or visual change.
- Treat verified current implementation facts as source-backed constraints.
- Treat intended standards and implementation requirements as mandatory acceptance criteria for new or changed frontend work, but do not claim they are already implemented unless the source files prove it.
- If a requested frontend change conflicts with this file, call out the conflict before implementation and update this document in the same docs-scoped change if the design system intentionally changes.
- Do not use `docs/docs/design-system.md` as the canonical frontend authority when it conflicts with this split file.

## Source evidence
- `frontend/package.json`: verified current frontend stack and package versions.
- `docs/docs/frontend/structure.md`: existing frontend architecture intent and feature-module rules.
- `docs/docs/design-system.md`: legacy design intent for financial dashboard, palette, accessibility, touch, interaction, and checklist rules.
- `docs/plan/Frontend_Design.md` and `docs/done/Frontend_Design.md`: historical Digital Paper Note direction and typography intent.
- `frontend/components.json`: verified shadcn settings, CSS variables, aliases, and Lucide icon library.
- `frontend/src/app/layout.tsx`: verified implemented font loading through `next/font/google` for Patrick Hand and Quicksand.
- `frontend/src/app/globals.css`: verified current CSS variables, paper cream background, focus outlines, animation durations, and theme token surface.
- `frontend/src/components/ui/button.tsx`, `card.tsx`, `form.tsx`, and `dialog.tsx`: verified current shadcn-style component patterns and selected focus/accessibility behavior.
- GitNexus query for frontend design-system evidence: confirmed relevant frontend docs, package, and component files before direct reads.
- UI/UX Pro Max rules: applied for accessibility, interaction, layout, typography/color, animation, chart/data UI, and pre-delivery checks.

## Verified current frontend stack

- Framework: Next.js `16.1.6` with App Router.
- Runtime UI: React `19.2.3` and React DOM `19.2.3`.
- Language: TypeScript `^5`.
- Styling: Tailwind CSS `^4`, shadcn `^3.8.4`, Radix UI primitives via `radix-ui`, CSS variables, `class-variance-authority`, `clsx`, and `tailwind-merge`.
- Forms and validation: React Hook Form `^7.71.1`, `@hookform/resolvers` `^5.2.2`, and Zod `^3.24.1`.
- Data visualization: Recharts `^3.7.0`.
- Icons: Lucide React `^0.563.0`; `frontend/components.json` sets `iconLibrary` to `lucide`.
- Toasts: Sonner `^2.0.7`.
- Theme support: `next-themes` `^0.4.6` is installed; `globals.css` defines light and dark token blocks.

## Canonical theme

- Theme: financial dashboard / digital paper note / professional financial clarity.
- Product feel: high-trust personal finance, data-dense but calm, notebook-like without sacrificing dashboard precision.
- Primary structure: sidebar navigation plus main content area for authenticated workflows, with fast updates and toast feedback.
- Visual metaphor: digital paper notes for debt and wallet records, using cream surfaces, yellow highlights, ink text, pencil gray supporting copy, money green positive states, and debt red negative or destructive states.
- Standard: keep the interface warm and approachable, but never playful at the expense of legibility, tabular clarity, auditability, or financial trust.

## Canonical palette

Use these semantic roles before inventing new colors. Existing implementation already defines matching or related CSS variables in `globals.css`; when adding tokens, preserve these meanings.

| Role | Canonical name | Current or intended value | Status | Usage |
|---|---|---|---|---|
| Page background | Paper Cream | `#FFFBEB`, `--paper-cream`, `bg-amber-50` | verified current token | App background and low-emphasis paper surfaces |
| Highlight surface | Note Yellow | `#FCD34D` or `#FEF3C7`, `--note-yellow` | verified current token plus historical intent | Active states, highlights, sticky-note accents |
| Primary text | Ink Black | `#1F2937`, `--ink-black` | verified current token | Headings, numbers, primary labels |
| Muted text | Pencil Gray | `#4B5563` or `#64748B`, `--pencil-gray` | verified current token plus historical intent | Secondary copy, placeholders, metadata |
| Success / receivable | Money Green | `#059669` or `#10B981` | intended standard | Income, receivable balances, positive confirmations |
| Danger / payable | Debt Red | `#DC2626`; soft red backgrounds such as `#FEF2F2` or `#FEE2E2` | verified support token plus historical intent | Errors, destructive actions, payable or negative balances |
| Info / secondary accent | Support Blue | `#2563EB`, `--support-blue` | verified current token | Links, info alerts, non-financial secondary actions |
| Border | Paper edge / neutral border | `#E5E7EB` or shadcn `--border` | verified current token | Cards, inputs, table separators |

Palette rules:

- Maintain at least 4.5:1 contrast for normal text against its background.
- Never use white text on yellow buttons or badges; use ink/brand-yellow foreground instead.
- Use green and red only for financial semantics, validation, or destructive status. Do not use those colors decoratively.
- Use soft backgrounds for alerts and badges so financial states remain readable in dense dashboards.
- Preserve color meaning across charts, cards, tables, tabs, and toasts.

## Typography

- Verified current implementation: `frontend/src/app/layout.tsx` loads Patrick Hand and Quicksand through `next/font/google` and attaches `--font-patrick` and `--font-quicksand` variables to `<body>`.
- Canonical heading intent: Patrick Hand is allowed for prominent notebook-style headings and warm auth/landing moments.
- Canonical body/UI intent: Quicksand is allowed for body text and UI text where readability remains strong.
- Financial data requirement: numeric amounts, dense table cells, filters, and chart labels must prioritize legibility, alignment, and scan speed. If Patrick Hand or Quicksand harms numeric clarity in a specific surface, use the current implemented CSS/font token strategy only after verifying the source and documenting the exception.
- Conflict resolution rule: older docs conflict between Inter/System UI and Patrick Hand/Quicksand. Current source verifies Patrick Hand and Quicksand loading, so future font changes must first inspect `frontend/src/app/layout.tsx` and `frontend/src/app/globals.css` before claiming or changing the implemented strategy.
- Body line-height standard: 1.5 to 1.75 for readable prose and 1.2 to 1.35 for compact headings.
- Data density standard: tabular numbers should align visually, avoid decorative weight changes, and keep currency symbols consistently positioned.

## Layout, spacing, radius, and shadow

- Dashboard layout standard: authenticated features use sidebar navigation plus a main content region; avoid deep modal-only workflows for primary financial tasks.
- Responsive standard: no mobile horizontal scroll at 375px, 768px, 1024px, or 1440px checkpoints.
- Container standard: use consistent page gutters and max widths per route family; avoid mixing unrelated container widths on the same page.
- Spacing standard: use `space-y-4` or `space-y-6` for form blocks, preserve generous whitespace for page sections, and tighten only in tables/lists where scan speed matters.
- Radius standard: outer containers use larger radii such as `rounded-xl` or `rounded-lg`; nested controls use slightly smaller radii such as `rounded-md` or `rounded-lg` for optical alignment.
- Shadow standard: use soft shadows like `shadow-sm` or `shadow-md` for paper/card elevation; do not use harsh or neon shadows in financial workflows.
- Border standard: use subtle visible borders on paper cards, forms, tables, and dialogs; avoid borders that appear only on hover and shift layout.

## Critical UI rules

- Contrast: all text, labels, badges, controls, chart labels, and toast text must meet at least 4.5:1 contrast for normal text.
- Focus: every interactive element must have a visible keyboard focus state. Existing CSS applies `focus-visible` outlines using brand yellow; preserve or improve that visibility.
- Touch: buttons, inputs, tabs, icon buttons, menu items, and row actions must provide at least 44x44px touch targets on mobile and tablet.
- Icons: use SVG icons only, preferably Lucide React because it is verified in package and shadcn config. Do not use emoji UI icons.
- Cursor: clickable controls, links, interactive cards, tabs, row actions, and dropdown triggers must show `cursor-pointer`.
- Hover: no hover layout shift. Prefer color, opacity, background, border color, or shadow changes over dimension changes.
- Motion: use 150-300ms micro-interactions. Existing `globals.css` uses 300ms fade/slide animations; new work should stay within this range unless justified.
- Reduced motion: every non-essential animation must respect `prefers-reduced-motion` as an implementation requirement for new animated work.
- Keyboard: tab order must match visual order; modals, dropdowns, tabs, forms, and sidebars must remain usable without a mouse.
- Mobile: no content, chart, table, dialog, toast, or sidebar state may create horizontal page scroll on mobile.

## Frontend architecture rules

- App Router: routes live under `frontend/src/app`, using route groups such as `(auth)` and `(dashboard)` where appropriate.
- Feature modules: feature-specific code lives under `frontend/src/features/{feature-name}`.
- Feature folder standard: each feature may own `api`, `components`, `hooks`, `types`, and `utils` folders.
- Shared UI: reusable primitives and shadcn components live under `frontend/src/components/ui`.
- Shared hooks, utilities, and types: use `frontend/src/hooks`, `frontend/src/lib`, and `frontend/src/types` for truly shared code.
- API pattern: components should not scatter raw fetch logic. Use feature-owned `api` modules and a centralized API client/error parsing pattern for base URL, auth headers, `parseErrorResponse`, JSON parsing, and consistent toast or error feedback.
- State: do not introduce Redux or Zustand unless this design system is updated; current documented architecture uses React hooks, feature hooks, listener-based coordination, and on-demand server data.
- Forms: use React Hook Form plus Zod for user input validation and typed form contracts.
- Styling: use Tailwind CSS, shadcn conventions, CSS variables, and `cn`/class composition. Prefer semantic tokens over hard-coded one-off colors.
- Client/server boundary: keep interactive components marked appropriately with `"use client"`; avoid browser-only APIs in server components.

## Component rules

### Buttons

- Verified current pattern: `Button` uses class-variance-authority variants, shadcn-style focus rings, disabled pointer blocking, SVG sizing, and variants for default, destructive, outline, secondary, ghost, and link.
- Standard: primary financial actions use note yellow or the canonical primary token with ink foreground when yellow is used.
- Standard: destructive actions use debt red semantics and require clear labels, not icon-only affordances unless paired with accessible text.
- Standard: loading buttons must disable repeated submission and preserve their width to avoid layout shift.
- Standard: icon-only buttons need `aria-label` or visible screen-reader text.
- Standard: all clickable button states require `cursor-pointer`, 44x44px effective target area, visible focus, and 150-300ms transitions.

### Cards

- Verified current pattern: `Card` uses `bg-card`, `text-card-foreground`, `rounded-xl`, `border`, vertical rhythm, and `shadow-sm`.
- Standard: cards represent paper notes, financial summaries, or grouped workflows; keep heading, value, metadata, and action regions visually distinct.
- Standard: interactive cards must show clear hover/focus feedback without moving content.
- Standard: card density should match task type: summary cards can breathe; transaction and history cards should prioritize scan speed.

### Forms and inputs

- Verified current pattern: `Form` wraps React Hook Form context, `FormField` uses `Controller`, labels bind with `htmlFor`, controls receive `aria-describedby`, and invalid fields set `aria-invalid`.
- Standard: every input needs a visible label or accessible label, inline validation message, and clear helper text when a format matters.
- Standard: use Zod schemas with React Hook Form for user-entered data.
- Standard: form errors should appear near the field and may also trigger a toast for global failures.
- Standard: financial amount inputs must make currency, sign, and decimal expectations explicit.

### Modals and dialogs

- Verified current pattern: `Dialog` renders a fixed overlay, backdrop, content, title, description, footer, and a Lucide close icon with screen-reader text.
- Implementation requirement: dialogs must trap focus, restore focus on close, close predictably, and remain keyboard accessible.
- Standard: use dialogs for confirmation, focused editing, and secondary workflows. Do not hide primary data-entry flows behind unnecessary modal stacks.
- Standard: dialog content must fit mobile widths and avoid horizontal scroll.

### Tabs

- Implementation requirement: tabs need visible active state, visible focus ring, 44x44px touch targets, keyboard navigation, and no horizontal overflow on mobile.
- Standard: use tabs for sibling views of the same entity or dashboard, not for unrelated navigation.
- Standard: tab labels must be short and semantically stable.

### Tables and lists

- Implementation requirement: tables/lists must support dense financial scanning, readable numbers, clear empty states, and accessible row actions.
- Standard: provide mobile alternatives for wide tables through stacked rows, horizontal containment within a card, or prioritized columns without page-level horizontal scroll.
- Standard: align currency values consistently, preserve debt/receivable color semantics, and avoid color-only status communication.
- Standard: filters and search controls belong close to the list they affect and must show loading/error feedback.

### Toasts

- Verified current stack: Sonner is installed and `frontend/src/components/ui/sonner.tsx` is indexed by GitNexus.
- Standard: use toast feedback for success, recoverable errors, and cross-feature updates, especially API outcomes.
- Standard: toasts must not replace inline validation for forms.
- Standard: toast copy must be concise, specific, and actionable for financial operations.

### Navigation and sidebar

- Standard: authenticated dashboard navigation uses a sidebar plus main content area.
- Standard: the active route must be visible through text, color, and/or shape, not color alone.
- Standard: navigation must be keyboard reachable, mobile safe, and must not cover main content without an obvious close path.
- Standard: keep primary financial flows no more than one clear navigation decision away from the dashboard.

### Charts and data UI

- Verified current stack: Recharts is installed.
- Standard: choose chart types by question. Use bars for monthly expenses, lines for trends, and simple totals/cards for snapshot metrics.
- Standard: every chart needs a nearby text summary or table alternative for accessibility and precision.
- Standard: use green/red financial semantics carefully and add labels, legends, or patterns so color is not the only indicator.
- Standard: chart tooltips must format currency and dates consistently with the surrounding UI.
- Standard: preserve readable contrast for axes, grid lines, labels, and tooltip content.

### Loading, error, and empty states

- Standard: loading states should reserve layout space with skeletons or stable placeholders to avoid content jumping.
- Standard: error states must state what failed, what the user can do next, and whether retry is available.
- Standard: empty states must explain the missing data and provide the next best action, such as creating a wallet, adding a debt partner, or recording a transaction.
- Standard: do not block the entire dashboard when only one card, table, or chart is loading.

## Accessibility checklist

- [ ] 4.5:1 contrast or better for normal text.
- [ ] Visible focus states on inputs, buttons, links, tabs, dialogs, menus, and row actions.
- [ ] 44x44px minimum touch targets on mobile/tablet.
- [ ] SVG icons only; no emoji UI icons.
- [ ] Icon-only controls include `aria-label` or screen-reader text.
- [ ] Keyboard navigation works in visual order.
- [ ] Form fields have labels and inline errors.
- [ ] Color is not the only indicator for status, debt direction, validation, or chart meaning.
- [ ] Motion respects `prefers-reduced-motion`.
- [ ] No mobile horizontal scroll.

## Performance and implementation checklist

- [ ] Use Next.js App Router conventions and avoid unnecessary client components.
- [ ] Keep feature-specific data fetching in feature `api` modules or shared client utilities, not directly in presentation components.
- [ ] Start independent data requests early and avoid avoidable waterfalls when composing dashboard surfaces.
- [ ] Use semantic CSS variables and Tailwind utilities instead of repeated hard-coded values.
- [ ] Keep hover/focus transitions to transform-safe or paint-safe properties when possible.
- [ ] Avoid large client bundles for charts or heavy components unless the route needs them.
- [ ] Preserve loading, error, and empty states for every async data surface.
- [ ] Test at 375px, 768px, 1024px, and 1440px before claiming responsive completion.

## Pre-delivery checklist for frontend changes

- [ ] Source evidence checked for any concrete stack, path, or implementation claim.
- [ ] Theme still reads as financial dashboard / digital paper note / professional financial clarity.
- [ ] Cream/yellow/ink/gray/green/red semantics are preserved.
- [ ] Typography strategy was verified before changing fonts.
- [ ] Buttons, cards, forms, dialogs, tabs, tables/lists, toasts, navigation/sidebar, charts/data UI, and loading/error/empty states follow this file when touched.
- [ ] No unsupported stale frontend stack claim is introduced.
- [ ] No unsupported backend-integration claim is introduced.
- [ ] No `.env` contents are read or copied into docs.
