# Design System — Student Life Platform

**Status:** Provisional product tokens proposed for owner review; validate using clickable prototypes before implementation. Not official BCREC branding until college colours/logo are verified and authorized.  
**Date:** 2026-10-11 · **Revision:** 0.3 (P1 premium dashboard: warm-neutral surfaces, Lucide iconography, shadcn/ui Button/Badge adapted to these tokens, `--shadow-sm`/`--shadow-md` added)

## 1. Desired character

A calm, high-trust academic workspace: modern, structured, clear, human, and efficient. It should not look like a generic neon AI dashboard, an admin spreadsheet, or a crowded college ERP. Visual quality comes from typography, hierarchy, spacing, and state design—not decoration.

Default direction: light theme first, slate-neutral surfaces, one restrained blue accent, clear status colors, readable type, subtle borders, limited shadows, and consistent component density. No neon gradients, gratuitous animations, or unrelated page-specific styles. Dark theme can be considered after the light theme is consistent (**pending approval**).

## 2. Token policy

Implement these values as semantic CSS variables/tokens (e.g. Tailwind theme mapping); components must consume tokens rather than hard-coded color values. Changing a token must be a deliberate, reviewed change.

Status must never be communicated by color alone; include text/icon and accessible contrast.

### 2.1 Color tokens

Neutrals (slate):

| Token | Value | Usage |
|---|---|---|
| `--background` | `#f8fafc` | App background |
| `--surface` | `#ffffff` | Cards, dialogs, inputs |
| `--surface-muted` | `#f1f5f9` | Subtle panels, table headers, skeleton base |
| `--foreground` | `#0f172a` | Primary text |
| `--muted-foreground` | `#64748b` | Secondary text, captions |
| `--border` | `#e2e8f0` | Card/input/table borders |
| `--input` | `#cbd5e1` | Input borders |
| `--focus-ring` | `#2563eb` | Visible focus outline |

Brand and accents:

| Token | Value | Usage |
|---|---|---|
| `--primary` | `#1d4ed8` | Primary buttons, links, active nav |
| `--primary-foreground` | `#ffffff` | Text on primary |
| `--primary-hover` | `#1e40af` | Primary hover/active |
| `--secondary` | `#eff6ff` | Secondary surfaces, subtle brand tint |
| `--secondary-foreground` | `#1e3a8a` | Text on secondary |
| `--accent` | `#0ea5e9` | Charts, highlights (never the only status signal) |

Semantic status (each with a subtle surface pair):

| Token | Value | Subtle surface | Text on subtle |
|---|---|---|---|
| `--success` | `#15803d` | `#f0fdf4` | `#166534` |
| `--warning` | `#b45309` | `#fffbeb` | `#92400e` |
| `--danger` | `#b91c1c` | `#fef2f2` | `#991b1b` |
| `--info` | `#0369a1` | `#f0f9ff` | `#075985` |

Contrast: body text on `--background`/`--surface` targets WCAG 2.2 AA (4.5:1 normal text, 3:1 large text and UI boundaries). Verify each pairing at implementation; document known gaps rather than claiming conformance without an audit.

### 2.2 Typography

- Family: **Inter** (provisional; fallback `ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, sans-serif`). One family for all UI text; tabular numerals (`font-variant-numeric: tabular-nums`) for grades, percentages, counts, and deadlines.
- Weights used: 400 (body), 500 (labels), 600 (titles), 700 (display/stat only).

| Role (token) | Size | Line height | Weight | Usage |
|---|---|---|---|---|
| `display` | 30px | 36px | 700 | Rare hero/stat |
| `page-title` | 24px | 32px | 600 | One per page |
| `section-title` | 18px | 28px | 600 | Card/section headings |
| `body` | 15px | 24px | 400 | Default text |
| `body-strong` | 15px | 24px | 500 | Emphasis in body |
| `label` | 13px | 20px | 500 | Field labels, table headers, buttons |
| `caption` | 12px | 16px | 400 | Timestamps, provenance, help text |
| `statistic` | 22px | 28px | 600 | Numbers in stat summaries |

Avoid more than these sizes/weights in the first release.

### 2.3 Spacing, radii, shadows, z-index, motion

- Spacing scale (4px base): `--space-1` 4px, `-2` 8px, `-3` 12px, `-4` 16px, `-5` 20px, `-6` 24px, `-8` 32px, `-10` 40px, `-12` 48px. Default page gutter: 16px mobile, 24px desktop.
- Radii: `--radius-sm` 4px (inputs, chips), `--radius-md` 8px (cards, buttons, dialogs), `--radius-lg` 12px (modals, popovers), `--radius-full` 9999px (avatars, badges).
- Shadows (subtle): `--shadow-sm` `0 1px 2px rgb(15 23 42 / 0.06)`; `--shadow-md` `0 4px 12px rgb(15 23 42 / 0.08)` (dialogs/popovers only); no large decorative shadows.
- Borders: 1px `--border`; focus: 2px `--focus-ring` outline with 2px offset.
- Z-index layers: `base` 0, `sticky` 100 (headers/bars), `dropdown` 400, `overlay` 500, `modal` 600, `toast` 700. Do not invent ad-hoc z-index values.
- Motion: `--duration-fast` 120ms, `--duration-base` 200ms; easing `ease-in-out`. Animate only opacity/transform where needed; respect `prefers-reduced-motion` (disable non-essential motion).

### 2.4 Icon sizing

16px (inline/caption contexts), 20px (default controls), 24px (nav/empty states). Use one icon set consistently; icons are decorative unless labelled.

### 2.5 Breakpoints and layout widths

| Name | Min width | Layout behavior |
|---|---|---|
| `sm` | 360px | Single column, compact nav/drawer, cards instead of tables |
| `md` | 768px | Two-column where useful, collapsible sidebar |
| `lg` | 1024px | Persistent sidebar, richer tables |
| `xl` | 1280px | Max content width 1200px, centered; gutters 24px |

Avoid horizontal page overflow at 360px; tables become structured cards or use controlled horizontal scrolling with a visible affordance.

## 3. Component specifications (initial)

- **Button:** height 36px (compact 28px, large 44px); padding 0 16px; radius `--radius-md`; label typography. Variants: primary (`--primary`), secondary (`--secondary`), outline (transparent + border), destructive (`--danger`), ghost (transparent, hover `--surface-muted`), loading (spinner + `aria-busy`), disabled (opacity 0.5, not-interactive). One primary button per view region.
- **Card:** `--surface` background, 1px `--border`, `--radius-md`, padding `--space-4` (compact `--space-3`), optional `--shadow-sm`. Do not nest cards; do not put every field in its own card.
- **Table:** header row `--surface-muted` with `label` text; row height ≥ 40px; separators `--border`; numeric columns right-aligned with tabular numerals; responsive collapse to definition-list cards below `md`.
- **Dialog/sheet:** overlay `rgb(15 23 42 / 0.4)`; dialog `--surface`, `--radius-lg`, `--shadow-md`, max-width 480px (wide 720px); focus trap; Escape closes unless destructive-in-progress. Sheet/drawer used from the right on desktop, full-width bottom on phone.
- **Input:** height 36px; border 1px `--input`; radius `--radius-sm`; focus ring; error border `--danger` with adjacent error text (`caption`, `--danger`). Labels always visible (floating labels not used).
- **Navigation:** sidebar 240px on `lg`+; active item uses `--secondary` background + `--primary` text + left accent bar (3px). Items: icon + label; no hover-only affordances.
- **Alerts/toasts:** inline alert = subtle surface + icon + text + optional action; toast max-width 360px, auto-dismiss 5s for success only (errors persist until dismissed).
- **Charts:** one palette from `--accent`, `--primary`, `--info`, `--warning`, `--success`, `--danger` (categorical order); grid `--border`; every chart has a text/table alternative; no color-only series distinction (use patterns/labels).

### 3.1 Component inventory

- **Foundations:** Button (primary, secondary, outline, destructive, ghost, loading, disabled); Link (internal, external with indicator); Input, textarea, select, checkbox, radio, switch, date/time picker; tooltip/popover, dialog, sheet/drawer, tabs, breadcrumbs; badge/status chip, avatar, separator, skeleton, toast/inline alert.
- **Data display:** stat summary, data table, responsive list/card, progress bar, line/bar chart, source/provenance row, timestamp/freshness label, empty state, pagination.
- **Domain:** class/event card, task row/card, notice card, attendance summary, assessment/mark row, source citation card, mentor/ticket status card (mentor/ticket card ships with P1).

### 3.2 GenUI registry (separate spec in `09-ai-and-generative-ui.md`)

- P0: `StudyPlanCard`, `QuizCard`, `FlashcardStack`, `SourceCitationCard`, `TaskListCard`, `ProgressChart`.
- Later, only after permission/security review: `AttendanceWhatIfCalculator`, `NoticeSummaryCard`, `SupportRequestForm`, `CalendarPlanCard`, `MentorAppointmentRequest`.
- Registry components must reuse these tokens and states; an unregistered component falls back to text (ADR 0003).

## 4. State specifications

Every data-driven view designs all of: **loading**, **empty**, **filtered-empty**, **error**, **stale**, **unavailable/not connected**, **demo data**, **permission denied**, and **success confirmation**.

- **Loading:** skeleton blocks in `--surface-muted`; no full-page spinner for partial loads; buttons show inline spinner.
- **Empty:** one sentence explaining why it is empty and one primary next action. Never fake records.
- **Error:** plain-language message + retry + request ID when available; `--danger` accent.
- **Stale:** show last-updated timestamp and `--warning` treatment with source note; do not hide the data silently.
- **Unavailable / not connected:** explicit “data not connected / not verified” copy; never render zero attendance or zero marks for missing data.
- **Demo data:** persistent banner/badge “Demo data” when `dataOrigin` is `synthetic_demo` (see `06-data-sources-and-academic-rules.md`); production sessions never display synthetic academic records.
- **Permission denied:** explain access is restricted without revealing whether the resource exists.

## 5. Interaction rules

- Every button must perform the labelled action; if it cannot yet, do not display it as functional. No dead links for unimplemented features—use labelled “Coming later” entries instead (see `03-information-architecture.md`).
- Destructive operations need clear context and confirmation.
- Long-running AI/file actions show progress, cancellation/retry if supported, and useful failure messages.
- Preserve typed form values on validation errors where safe.
- Confirm saved state using server results, not optimistic success that cannot be reconciled.
- Use toasts for lightweight confirmation; use inline messages for errors that need attention.
- Avoid unexpected layout shifts and excessive animation; respect reduced-motion preference.

## 6. Accessibility baseline

- Semantic heading hierarchy and landmarks.
- Keyboard access for navigation, dialogs, charts' data alternatives, and controls.
- Visible focus indicators; no keyboard traps.
- Associated labels and descriptive validation errors.
- Minimum 44×44px touch targets on coarse pointers; 36px minimum control height on desktop.
- Appropriate contrast and non-color status indicators.
- Text alternatives or tabular data for charts.
- Responsive zoom/text resizing; no information lost at narrow width.

Use WCAG 2.2 AA as the target baseline where practical; document any known gaps rather than claiming conformance without an audit.

## 7. Content and tone

Use direct, calm, non-shaming language. Say “Attendance data may need review” rather than “Poor student.” Explain why an alert appears and what the student can do. Never display AI-inferred wellbeing/personality labels.

First UI language: **English** (proposed). The AI layer is designed to support English, Bengali and Hindi subject to model/quality evaluation (**pending approval**); plan for text expansion when localizing.

## 8. Design review checklist

Before a screen is accepted, inspect: hierarchy, consistency with these tokens, responsiveness, keyboard operation, contrast, empty/loading/error/stale/unavailable/demo states, long text, localization expansion, data freshness labels, action clarity, and whether the screen is more complex than the task requires.

## 9. Open decisions

- Confirm or replace the provisional Inter font stack and slate/blue palette with authorized BCREC branding (pending owner approval).
- Dark theme (deferred).
- Spacing/density tuning after the first clickable prototype review.
