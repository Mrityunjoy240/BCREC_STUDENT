# Technical Architecture — Proposed Baseline

**Status:** Recommendation for owner approval  
**Date:** 2026-10-10  
**Principle:** Small, modular monolith first; avoid premature microservices.

## 1. Recommended starting stack

| Concern | Proposed default | Notes |
|---|---|---|
| Website | Next.js App Router + React + TypeScript | Keep current stable supported versions pinned during setup. Use server components/data fetching where appropriate and client components for actual interactivity. |
| Styling/components | Tailwind CSS + accessible shared components (shadcn/ui or equivalent) | Use a versioned design token layer. Choose one component approach and avoid parallel UI libraries without reason. |
| Forms/schema | React Hook Form where useful + Zod | Zod validates client forms for feedback and independently validates server inputs; client validation is not a security boundary. |
| Database | PostgreSQL via Supabase | Relational academic data, constraints, indexes, SQL migrations and versioned seed data. |
| Identity | Supabase Auth (proposed) | Role assignments and scope checked server-side; Auth alone does not define institution permissions. |
| File storage | Private Supabase Storage buckets or equivalent private object storage | Authorization before issuing signed URLs; retention/deletion workflow required. |
| AI UI/Core | Vercel AI SDK or comparable provider-agnostic TypeScript orchestration | Verify current stable APIs at implementation time; isolate provider-specific code behind an adapter. |
| Validation | Zod/schema validation for API payloads and AI tool results | Parse at trust boundaries. |
| Charts | Recharts or native accessible summary/table | Charts always have a data/table alternative. |
| Testing | Unit/integration tests plus Playwright browser E2E | Pick a test runner during setup and keep commands stable. |
| Observability | Structured server logs + error tracking with redaction | Never log API keys, raw sensitive mentor notes, or full private prompts by default. |
| Deployment | Managed Next.js hosting + Supabase; CI checks before deploy | Hosting choice is a later ADR; do not tie domain logic to vendor-specific APIs unnecessarily. |
| Future mobile | React Native + Expo (proposal) | Later phase, same backend/domain APIs; not part of website MVP. |

These are proposed defaults, not a requirement to add every package immediately. Check supported versions and security advisories when bootstrapping.

## 2. Architecture shape

Use a modular monolith with clear domain boundaries:

- `identity`: authenticated session and role/scope resolution.
- `student-profile`: academic identity mapping, cohort and preferences.
- `academic-catalog`: programmes, terms, courses, cohorts and policy applicability.
- `calendar-tasks`: schedule events, notices, personal tasks and reminders.
- `academic-records`: attendance, assessments, assignments and results; authoritative-source metadata required.
- `learning`: notebooks, documents, chunking/retrieval, quizzes, flashcards and saved study plans.
- `assistant`: chat orchestration, retrieval, tool registry, GenUI response schemas and evaluation.
- `support`: mentor assignment where verified, ticketing and service directory.
- `notifications`: preferences, templates, delivery state and idempotency.
- `audit`: protected-action event records.

Keep domain rules in server-side service modules; do not duplicate eligibility math in React components, AI prompts, and mobile UI.

## 3. Request flow

1. Browser submits a request or server component loads a page.
2. Server resolves the authenticated user from the trusted session/cookie context.
3. Domain service checks the user's role and resource scope.
4. Service loads data through least-privilege database access/RLS and validates data/source state.
5. Business logic produces typed result values and provenance metadata.
6. UI displays data and required status/error/freshness states.
7. Write actions are validated and authorized again on the server immediately before persistence.
8. Sensitive/official state changes record a safe audit event.

## 4. Server/client boundaries

- Keep provider keys and service-role credentials exclusively on the server.
- Use server components for appropriate initial data and content; use client components where state, events, or browser capabilities are required.
- Props crossing server/client boundaries should be serializable and minimal.
- Never use a Server Action/API route as a substitute for authorization; each entry point must verify session and permissions.
- Avoid calling database or external providers directly from deeply nested client components.

## 5. API and data contracts

- Keep contracts typed and documented in `10-api-contracts.md`.
- Validate all untrusted inputs on the server.
- Use stable response shapes and explicit error codes/categories.
- Add pagination, filters and maximum limits to list endpoints.
- Use idempotency for actions where repeated delivery could duplicate requests/notifications.
- Expose provenance (`source`, `observedAt`, `verificationState`) where relevant; do not strip these fields before the UI.

## 6. Background and async work

Document processing, embeddings, notifications, and source ingestion may take time. Do not run unbounded work inside a fragile request path. Begin with a bounded job abstraction appropriate for the chosen host; add a durable queue only when workload/retry semantics justify it. Persist processing state (`queued`, `processing`, `succeeded`, `failed`, `cancelled`) and a safe failure category.

## 7. AI provider adapter

Define a provider-neutral interface for:
- Text/structured generation.
- Tool call execution/streaming.
- Embeddings (with explicit model and dimension metadata).
- Usage/cost/latency reporting and provider errors.

The provider adapter must not contain academic authorization logic. All tools call domain services which independently check permission and source applicability.

## 8. Environments

- **Local:** synthetic data, local/env-only credentials, repeatable migrations and seed fixtures.
- **Preview/staging:** isolated database/project, restricted access, synthetic or specifically authorized test data.
- **Production:** approved privacy/access settings, backups, monitoring, least privilege, reviewed migrations and incident contact.

Never reuse production service-role credentials in local demos or preview apps.

## 9. Observability

Record request IDs, route/tool name, duration, result category, provider/model, token/cost usage where available, and correlation IDs—without recording secrets or unnecessary sensitive content. Track at least auth failures, authorization denials, failed migrations, stale-source events, AI tool validation errors, upload errors, notification failures, and critical journey latency.

## 10. Architecture constraints

- No microservices until there is a proven scaling/team boundary problem.
- No second database for the future app; it shares APIs and domain services.
- No arbitrary LLM-generated UI code execution.
- No direct dependence on a vendor's private API from UI components.
- No production academic calculation without a versioned approved policy.

## 11. Reference documentation

- [Next.js App Router](https://nextjs.org/docs/app)
- [Next.js Server and Client Components](https://nextjs.org/docs/app/getting-started/server-and-client-components)
- [Supabase local development workflows](https://supabase.com/docs/guides/local-development/cli-workflows)
- [Vercel AI SDK](https://vercel.com/ai-sdk)
- [AI SDK tool calling](https://github.com/vercel/ai/blob/main/content/docs/03-ai-sdk-core/15-tools-and-tool-calling.mdx)
- [OWASP GenAI / LLM Top 10](https://owasp.github.io/www-project-top-10-for-large-language-model-applications/)
