# ADR 0004: Hosting and Deployment

- **Status:** Proposed — owner approval required; **production deployment is gated on security, privacy, and operational review**
- **Date:** 2026-10-10
- **Decision owner:** Product/technical lead

## Context

The Student Website is a Next.js application with server-side domain logic, Supabase (PostgreSQL/Auth/Storage), background-capable work (document processing, embeddings, notifications), and an AI provider adapter. The hosting choice was previously deferred in `07-technical-architecture.md`; this ADR now records that decision's proposed default and the gates before any production deployment.

## Proposed decision

- **Initial hosting:** a managed Next.js platform (e.g. Vercel or an equivalent approved platform) for the website, with Supabase as the managed data/auth/storage platform. The exact vendor is **pending owner approval** and a cost/region review.
- **Environments:** local → preview/staging → production, matching `12-security-deployment-and-ops.md` §7. Preview deployments use an isolated database; they never point at production data.
- **CI before deploy:** every deploy passes the CI quality gates in `11-testing-and-acceptance.md` §7 (lint, typecheck, unit, migration test, integration, build, critical E2E).
- **AI provider:** remains behind the provider adapter defined in `07` §7; the concrete provider, embeddings model/dimension, and account/region are **pending decisions** until benchmarked and approved. No provider is authorized for real student data yet.
- **Domain logic:** host-agnostic; avoid vendor-lock-in in domain services. Vendor-specific APIs (edge config, proprietary queues) are not used until a recorded decision.

## Production deployment gate

Production deployment is **not** authorized by this ADR alone. Before the first production deploy, all of the following must be complete and approved:

1. Security review: RLS/authorization negative tests pass; secrets handling verified; dependency/security scan clean (`12` §10 checklist).
2. Privacy review: data controller/owner identified, lawful/approved collection basis, retention/deletion rules, vendor data flows and AI provider terms approved (`12` §6).
3. Operational review: backup restore tested, monitoring and alerting active, incident contacts filled in (`docs/runbooks/incident-recovery.md`), migration/recovery runbook rehearsed.
4. Owner sign-off on pilot type (`01` §1.1) and remaining assumptions.

Until then, deploys target local and preview/staging only, with synthetic data.

## Alternatives considered

- **Self-hosted VPS/container:** maximum control, but adds patching, TLS, scaling and backup burden for a small team; rejected for the initial phase.
- **Static-only export:** incompatible with server-side authorization, private data and AI tool endpoints.
- **Separate backend service on day one:** premature; the modular monolith (`07` §2) already isolates domains.

## Consequences

Positive:
- One-command-style deploys with CI gates; preview environments for review.
- Supabase local workflow keeps development reproducible.
- Clear, written gate prevents “deploy first, review later.”

Trade-offs:
- Managed platforms cost money at scale and constrain some runtime choices.
- Pending vendor decisions block production, not the P0 demo build.
- Background jobs on serverless-style hosts need a bounded job abstraction (`07` §6).

## Guardrails

- Never reuse production service-role credentials in local or preview apps.
- Never deploy to production with `dataOrigin = synthetic_demo` data mixed into real records.
- Hosting vendor changes require an updated ADR; do not silently switch.
- Production env vars validated at startup; missing secrets fail the deploy clearly.

## References

- `07-technical-architecture.md` §1, §6–8
- `11-testing-and-acceptance.md` §7
- `12-security-deployment-and-ops.md` §7, §10
- `docs/runbooks/local-development.md`, `docs/runbooks/incident-recovery.md`
