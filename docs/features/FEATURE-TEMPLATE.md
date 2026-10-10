# Feature: [Short name]

- **Status:** Proposed / Ready / In progress / Review / Done
- **Priority:** P0 / P1 / P2
- **Owner:** [name/role]
- **Last updated:** YYYY-MM-DD
- **Related PRD/ADR:** [links]

## Problem and user outcome

Who has the problem? What outcome should change? Avoid describing a solution only.

## Scope

### In scope
- [Item]

### Out of scope
- [Item]

## User story

As a [user], I want [capability], so that [benefit].

## Requirements

- **FR-1:** [testable behavior]
- **FR-2:** [testable behavior]

## Data and provenance

- Data required:
- Authoritative source / owner:
- Freshness/verification behavior:
- Synthetic or real data in each environment:
- Retention/deletion implications:

## Permissions and security

- Roles allowed:
- Resource scope/ownership:
- Sensitive data involved:
- Server-side validation and authorization:
- Audit/idempotency requirements:

## UI/UX states

- Initial/loading:
- Success:
- Empty:
- Validation error:
- Network/provider failure:
- Stale/unverified data:
- Permission denied:
- Narrow-screen/keyboard behavior:

## Acceptance criteria

Use observable statements, for example:
- Given [context], when [action], then [result].
- Given a user without permission, when the endpoint is called directly, then the operation is denied and no sensitive data leaks.

## Implementation plan

1. Inspect affected files and current tests.
2. List smallest set of components/services/schema changes.
3. Implement one bounded change.
4. Add/update tests and documentation.

## Tests

- Unit:
- Integration/RLS:
- E2E:
- Accessibility/responsive:
- Failure/injection/idempotency:

## Migration and rollout

- Migration needed? If yes, link file and recovery plan.
- Feature flag/pilot scope:
- Rollback/forward-fix plan:

## Risks and open questions

- [Risk or unknown, owner, resolution date]

## Definition of Done

- [ ] Acceptance criteria pass.
- [ ] Type check/lint/relevant tests pass.
- [ ] Allowed and denied permission paths tested.
- [ ] Loading/empty/error/stale states implemented.
- [ ] Docs and contracts updated.
- [ ] Diff reviewed; no secrets or unrelated changes.
