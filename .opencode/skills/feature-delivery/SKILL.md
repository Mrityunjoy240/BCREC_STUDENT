---
name: feature-delivery
description: Deliver a feature end-to-end — inspect code, define acceptance criteria, implement the smallest change, add regression tests, verify, review the diff, and report risks. Use when asked to implement a new feature or substantial change.
---

# Feature Delivery Skill

Follow this sequence for every feature or substantial change. Adapt depth to task size; never skip verification.

## 1. Inspect

- Run `git status` and identify the active branch and base.
- Read the files you expect to touch and their tests.
- Read any relevant `docs/` sections (architecture, data model, permissions, design system).
- If requirements are ambiguous, list assumptions explicitly — do not invent official college rules or policy.

## 2. Acceptance criteria

Write a short, testable list before coding:

- What the user sees/does.
- What the system must enforce (permissions, data boundaries).
- What must NOT happen (fabricated data, dead links, leaked secrets).
- Which existing tests must continue to pass.

## 3. Implement (smallest coherent change)

- Touch only the files needed for this feature.
- Follow existing code conventions (imports, naming, component patterns, design tokens).
- No unrelated refactors, no reformatting of untouched files.
- Server components by default; client components only where interactivity requires it.
- Design loading, empty, error, and success states — not just the happy path.

## 4. Regression tests

- Add or update tests that would catch a regression of this feature.
- Cover the positive path and at least one negative/edge case.
- For authorization changes, add both an allowed and a denied test.
- Follow the existing test file naming and mocking patterns in the codebase.

## 5. Verify

Run the applicable checks and record real results:

- `npm run typecheck`
- `npm run lint`
- `npm run format:check`
- `npm test`
- `npm run build` (for user-visible or route-level changes)

If a check cannot run, state why. Never claim an unrun check passed.

## 6. Diff review

Before reporting done, review `git diff` for:

- Unexpected file changes or debug code left behind.
- Secrets, tokens, or credentials accidentally included.
- Weakened validation or removed security checks.
- Accessibility issues (missing labels, focus traps, contrast).
- Responsive behavior at 360 / 768 / 1024 / 1366 px for UI changes.

## 7. Report

End with:

1. What changed and why (1–3 sentences).
2. Files affected (list).
3. Checks run and their real results (table).
4. Security / migration implications (or "none").
5. Assumptions made, blockers encountered, and the next smallest task.

If anything is unverified (e.g., browser QA not possible, DB migration not tested), say so explicitly.
