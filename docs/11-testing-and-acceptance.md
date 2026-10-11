# Testing Strategy and Acceptance Gates

**Status:** Proposed quality bar  
**Date:** 2026-10-10 · **Revision:** 0.2 (P0/P1 test mapping; toolchain commands proposed)

## 1. Testing philosophy

Test user-visible behavior and security boundaries, not only implementation details. Build one vertical slice at a time. A green TypeScript check alone does not prove that a role cannot access someone else's data or that a deadline is accurate.

## 2. Test layers

### Unit tests
- Pure academic calculations (including zero denominator, rounding and invalid/missing policy) on synthetic fixtures.
- Rule applicability by programme/cohort/effective date.
- Derived data-quality shorthands from the four canonical provenance fields (`06` §9.6).
- Task priority/date normalization/time zones.
- Zod schemas for forms, API payloads and GenUI outputs.
- Permission predicates and state-transition functions, including every cell of the `08` §3 matrix.
- Notice deduplication/provenance state transitions (`unreviewed → reviewed → approved_for_display → approved_for_rule_engine`, `rejected`, `superseded`).
- **Implemented so far (dashboard shell):** `isDemoMode` exact-match semantics; landing page demo banner + always-visible not-connected notice across demo/production/missing/invalid modes; dashboard nav (brand, P0 labels, `/app` active via `aria-current`, planned items non-interactive, accessible mobile `<details>` disclosure); dashboard page title/sections with honest unavailable/empty states and no fabricated values; UI state primitives (error retry only when an action exists).

### Integration tests
- Database constraints and RLS policies.
- Server service authorization and transactional writes.
- Upload ownership/storage access.
- AI tool execution with mocked provider responses.
- Source provenance propagation from persistence to API/UI.
- Notification scheduling/deduplication and retry state.

### End-to-end tests (P0)
- Login → student dashboard.
- Dashboard → calendar → create/complete personal task.
- Upload supported sample document → query it → open source citation.
- Invalid GenUI payload → safe fallback.
- Student A cannot access Student B's record by changing IDs.
- Notice marked unverified is not shown as an approved rule.
- Synthetic academic overview shows the demo label and provenance (`dataOrigin = synthetic_demo`); it never shows an official eligibility verdict.
- Production-mode configuration receives `unavailable` (not synthetic rows) for academic data.
- Deferred write endpoints (attendance correction, marks change, policy approval) return not-implemented/denied; no partial write occurs.
- P1 navigation items (Help & Mentor, Career & Projects) are absent or non-functional “Coming later” entries—no dead links.

### End-to-end tests (P1 — enable when the features ship)
- Submit support ticket → confirmation → status persists after refresh.
- Authorized attendance/marks integration shows source, freshness and correction-request path.
- Policy-backed advisory alert includes policy version and remains advisory, not an eligibility decision.

### Manual UX/accessibility review
- Keyboard navigation and visible focus.
- Mobile width/zoom/long content.
- Dialog behavior, labels, contrast and screen-reader semantics.
- Loading, empty, error, stale, permission denied and network-offline state.
- Text expansion for Bengali/Hindi if those languages are included.

## 3. Required environments

- Unit tests use deterministic fixtures.
- Database integration tests use a disposable local/test project with synthetic data.
- E2E tests use isolated test users with controlled roles and seeded demo data.
- No production student records in the public/CI test dataset.
- External AI and notification calls mocked by default; run opt-in provider smoke tests only with safe test inputs and budget limits.

## 4. Critical negative tests

- No authenticated session.
- Role is forged in body/profile metadata.
- Resource ID belongs to another user.
- Mentor assignment expired/changed.
- Cross-department or cross-course access.
- Direct API call despite hidden UI button.
- Invalid/oversized upload or unsupported MIME type.
- Poisoned/prompt-injection content inside document.
- LLM returns unregistered component, extra fields, malformed dates, huge arrays or unsafe URL.
- Double submit/retry creates duplicate tickets/reminders.
- Stale/conflicting/draft policy source is used for eligibility.
- Synthetic (`synthetic_demo`) rows appear in a production-mode session or escape the demo label.
- Database migration fails part-way or a backup restore is needed.

## 5. Definition of Ready (before coding a feature)

A feature has:
- User problem and success outcome.
- Required/optional behavior.
- Permission/data source requirements.
- UI states and error cases.
- Acceptance criteria.
- Dependencies and migration impact.
- A named decision owner for any institutional rule.

## 6. Definition of Done

A feature is done when:
- Acceptance criteria pass.
- Relevant type check/lint/unit/integration/E2E tests pass.
- Protected read/write paths have authorization tests.
- Loading, empty, stale, error, and denied states are handled.
- Accessibility/responsiveness reviewed.
- No secrets, raw private data, or debug output leaked.
- Docs/contracts/migrations updated as appropriate.
- Diff is small, reviewed, and committed on the correct branch.
- Any skipped check is explicitly listed as a limitation.

## 7. CI quality gates

Commands **verified at website bootstrap** (2026-10-11): lint, format:check, typecheck, test (Vitest starter), build, npm ci, dev. Supabase CLI is a committed devDependency after P2.0; live database and E2E commands remain **proposed** until a Docker runtime and their suites are exercised (see `docs/runbooks/local-development.md`):

1. Formatting/lint — `npm run lint` and `npm run format:check` (ESLint + Prettier) — **verified**.
2. Type check — `npm run typecheck` (`tsc --noEmit`) — **verified**.
3. Unit tests — `npm run test` (Vitest) — **verified**; now includes mocked auth-helper tests (`src/lib/auth/*.test.ts`), static migration guards (`migration-guards.test.ts`), preflight classification guards (`rls-preflight.test.ts`), and an RLS integration suite that auto-skips when the local Supabase API is unreachable (`rls.integration.test.ts`). Skipped tests are not RLS verification; a reachable API without `SUPABASE_TEST_ANON_KEY` fails the suite loudly (no placeholder-key fallback, so an invalid-key error can never masquerade as a successful RLS denial).
4. Schema/migration check or disposable-database migration test — `npx supabase db reset` against a local disposable database — **CLI committed (P2.0)**; still **unverified** where Docker is unavailable. Static SQL guards run in unit tests; they do not replace live RLS execution.
5. Integration tests — `npm run test:integration` (Vitest + local/test database) — **partially added (P2.0)**: `rls.integration.test.ts` runs when `npx supabase start` is up **and** `SUPABASE_TEST_ANON_KEY` is exported from `npx supabase status` (field `anon_key`); it fails loudly on a reachable API without the key and otherwise skips, reporting that only mocked/unit results are available. Dedicated `test:integration` script still **proposed**.
6. Production build — `npm run build` — **verified**.
7. Critical Playwright flows and authorization E2E tests — `npm run test:e2e` — **proposed** (Playwright task).
8. Dependency/security checks supported by chosen tooling (e.g. `npm audit` plus the chosen scanner) — scanner choice **open**; note known advisories from `npm audit` at bootstrap rather than force-fixing blindly. P2.0 re-check: `npm audit --omit=dev` reported 0 production vulnerabilities; known dev-only `braces` advisory remains unfixable upstream.

Package manager: **npm** with a committed lockfile (`package-lock.json`) — **verified**. Set branch protection when the team is ready. Never disable a failing critical test simply to merge.

## 8. Reliability/experience measures

Establish real baselines before publishing numeric SLOs. Track:
- Dashboard usable time and data load latency.
- AI first-token/complete response latency, tool success and structured-output validity.
- Document processing success and time.
- Notification delivery success.
- API errors and authorization denials.
- Wrong/stale source and user-correction reports.
- Core journey completion rate.

## 9. Tools reference

- [Playwright documentation](https://playwright.dev/docs/intro)
- [Vitest documentation](https://vitest.dev/guide/)
- [Next.js testing guidance](https://nextjs.org/docs/app/guides/testing)
- [Supabase local development and migrations](https://supabase.com/docs/guides/local-development/cli-workflows)
