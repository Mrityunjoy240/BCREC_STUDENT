# ADR 0002: Database, Authentication, and Data Access

- **Status:** Proposed — owner approval and data-owner review required
- **Date:** 2026-10-10

## Context

The Student Website has relational academic data, user-owned learning documents, notices and workflow records. The future app must share identity and data. Student and staff scope is sensitive; data-source truth and cohort-specific rules matter.

## Proposed decision

- Use **PostgreSQL via Supabase** as the proposed data platform for the initial build.
- Use a supported managed authentication service (Supabase Auth proposed) for sessions.
- Keep academic domain data normalized and migrations/seed data in version control.
- Use Row Level Security (RLS) for protected tables and server-side role/scope checks for every operation.
- Store uploads in private buckets and issue authorized, short-lived signed URLs where needed.
- Split institutional academic records, personal tasks, learning artefacts, and AI-generated suggestions into distinct domains.
- Maintain the four canonical provenance fields (`dataOrigin`, `sourceVerification`, `contentReview`, `freshnessStatus`) and effective-dated policy mapping for policy-driven records.

## Alternatives considered

- Custom authentication/session stack: more control but larger security and maintenance burden for a small team.
- A non-relational database for all data: weak fit for the many relationships/constraints among students, cohorts, courses, sessions, results and assignments.
- Client-only database access: acceptable for tightly scoped operations only when RLS is correct; not sufficient for high-impact workflow rules or provider secrets.

## Consequences

Positive:
- Strong relational integrity and constraints.
- Reproducible database changes through migrations.
- Authentication and private object storage can be integrated.

Trade-offs:
- RLS is easy to misconfigure and must be tested explicitly.
- Provider setup and migration workflow require local/staging discipline.
- Academic authority mapping and data import remain institutional dependencies, not features that a database choice solves automatically.

## Guardrails

- No `userId` from the request body is trusted as the caller identity.
- No service-role key in the client.
- No destructive resets of existing/shared schemas as a routine workflow.
- Test cross-user access, role scope and denied paths.
- Start with synthetic data until data access is authorized; synthetic academic records stay in demo/dev environments only (see ADR 0004 and `07` §8).

## Implementation note (P2.0 foundation, 2026-10-11)

The P2.0 phase implemented the approved development foundation without changing this ADR's approval status for production:

- Initial migration `supabase/migrations/20261011120000_initial_identity_and_audit.sql`: `profiles`, `role_assignments` (canonical 10-role enum, scoped + time-bounded, `NULLS NOT DISTINCT` uniqueness), org units, `student_records` / `staff_records` / `student_enrolments`, `audit_events`; RLS + explicit grants; auth-user provisioning trigger (no automatic roles).
- Server helpers: `src/lib/supabase/server.ts` (anon-key, cookie-based `createServerClient`); `src/lib/auth/session.ts` (`getSessionUser`, `requireUser`); `src/lib/auth/authorize.ts` (named, fail-closed permission predicates from `docs/08`).
- Public signup disabled in `supabase/config.toml`; seed disabled (no committed accounts). No route protection, login UI, or session-refresh middleware yet — deferred to the P2 login phase.
- Live `supabase db reset` / RLS integration execution still requires a local Docker runtime and remains outstanding (see `11` §7).

## References

- https://supabase.com/docs/guides/local-development/cli-workflows
- https://supabase.com/docs/guides/database/postgres/row-level-security
