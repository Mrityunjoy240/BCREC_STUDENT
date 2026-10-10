# Design System — Student Life Platform

**Status:** Draft design direction; validate using clickable prototypes before implementation.  
**Date:** 2026-10-10

## 1. Desired character

A calm, high-trust academic workspace: modern, structured, clear, human, and efficient. It should not look like a generic neon AI dashboard, an admin spreadsheet, or a crowded college ERP. Visual quality comes from typography, hierarchy, spacing, and state design—not decoration.

Default direction: light-first neutral canvas, restrained blue/ink accent, clear status colors, readable type, subtle borders, limited shadows, and consistent component density. Dark theme can be considered after the light theme is consistent.

## 2. Token policy

Implement actual values as semantic CSS variables/tokens; components must consume tokens rather than hard-coded color values.

Token groups:
- `background`, `surface`, `surface-muted`, `foreground`, `muted-foreground`.
- `border`, `input`, `focus-ring`.
- `primary`, `primary-foreground`, `secondary`, `accent`.
- `success`, `warning`, `danger`, `info` and their subtle surfaces.
- Spacing scale, radius scale, shadow scale, z-index layers, motion durations.
- Typography roles: display/page title, section title, body, label, caption, numeric/statistic.

Status must never be communicated by color alone; include text/icon and accessible contrast.

## 3. Typography and layout

- Use a highly legible sans-serif for the application UI; choose and document one font stack before coding.
- Establish a typographic scale and line-height; avoid too many font weights or sizes.
- Main page layout: stable navigation, clear page title/breadcrumb when useful, one primary action, then scannable content sections.
- Keep cards meaningful. Do not put every field into its own bordered card.
- Use consistent alignment and spacing. Avoid large empty hero areas on operational pages.
- Use tabular numerals for grades, percentage, counts, and deadlines where appropriate.

## 4. Component inventory

### Foundations
- Button: primary, secondary, outline, destructive, ghost, loading, disabled.
- Link: internal navigation, external source with external indicator.
- Input, textarea, select, checkbox, radio, switch, date/time picker.
- Tooltip/popover, dialog, sheet/drawer, tabs, breadcrumbs.
- Badge/status chip, avatar, separator, skeleton, toast/inline alert.

### Data display
- Stat summary, data table, responsive list/card, progress bar, line/bar chart, source/provenance row, timestamp/freshness label, empty state, pagination.

### Domain
- Class/event card, task row/card, notice card, attendance summary, assessment/mark row, source citation card, mentor/ticket status card.

### GenUI registry (separate spec in `09-ai-and-generative-ui.md`)
- `StudyPlanCard`
- `QuizCard`
- `FlashcardStack`
- `SourceCitationCard`
- `TaskListCard`
- `ProgressChart`
- later, only after permission/security review: `AttendanceWhatIfCalculator`, `NoticeSummaryCard`, `SupportRequestForm`

## 5. Interaction and state rules

- Every button must perform the labelled action; if it cannot yet, do not display it as functional.
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
- Minimum reasonable touch target sizes for interactive controls.
- Appropriate contrast and non-color status indicators.
- Text alternatives or tabular data for charts.
- Responsive zoom/text resizing; no information lost at narrow width.

Use WCAG 2.2 AA as the target baseline where practical; document any known gaps rather than claiming conformance without an audit.

## 7. Responsive rules

- Desktop can use persistent sidebar and richer tables.
- Tablet may collapse navigation and reduce columns.
- Phone web view uses single-column sections, compact actions, and card-form data patterns.
- Avoid making desktop hover a requirement for discovering actions.
- Test dialog height, virtual keyboard, sticky bars, and long labels on narrow screens.

## 8. Content and tone

Use direct, calm, non-shaming language. Say “Attendance data may need review” rather than “Poor student.” Explain why an alert appears and what the student can do. Never display AI-inferred wellbeing/personality labels.

## 9. Design review checklist

Before a screen is accepted, inspect: hierarchy, consistency, responsiveness, keyboard operation, contrast, empty/loading/error/stale states, long text, localization expansion, data freshness, action clarity, and whether the screen is more complex than the task requires.
