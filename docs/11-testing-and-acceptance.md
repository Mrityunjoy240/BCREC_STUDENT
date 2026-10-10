# Testing Strategy and Acceptance Gates

**Status:** Proposed quality bar  
**Date:** 2026-10-10

## 1. Testing philosophy

Test user-visible behavior and security boundaries, not only implementation details. Build one vertical slice at a time. A green TypeScript check alone does not prove that a role cannot access someone else's data or that a deadline is accurate.

## 2. Test layers

### Unit tests
- Pure academic calculations (including zero denominator, rounding and invalid/missing policy).
- Rule applicability by programme/cohort/effective date.
- Task priority/date normalization/time zones.
- Zod schemas for forms, API payloads and GenUI outputs.
- Permission predicates and state-transition functions.
- Notice deduplication/verification state transitions.

### Integration tests
- Database constraints and RLS policies.
- Server service authorization and transactional writes.
- Upload ownership/storage access.
- AI tool execution with mocked provider responses.
- Source provenance propagation from persistence to API/UI.
- Notification scheduling/deduplication and retry state.

### End-to-end tests
- Login → student dashboard.
- Dashboard → calendar → create/complete personal task.
- Upload supported sample document → query it → open source citation.
- Invalid GenUI payload → safe fallback.
- Student A cannot access Student B's record by changing IDs.
- Notice marked unverified is not shown as an approved rule.
- Stale/absent attendance feed does not show a fabricated percentage/eligibility verdict.
- Submit support ticket → confirmation → status persists after refresh.

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

Proposed sequence:
1. Formatting/lint.
2. Type check.
3. Unit tests.
4. Schema/migration check or disposable-database migration test.
5. Integration tests.
6. Production build.
7. Critical Playwright flows and authorization E2E tests.
8. Dependency/security checks supported by chosen tooling.

Set branch protection when the team is ready. Never disable a failing critical test simply to merge.

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
- [Next.js testing guidance](https://nextjs.org/docs/app/guides/testing)
- [Supabase local development and migrations](https://supabase.com/docs/guides/local-development/cli-workflows)
