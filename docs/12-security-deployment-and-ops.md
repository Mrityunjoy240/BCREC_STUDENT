# Security, Deployment, and Operations

**Status:** Initial control plan; production launch requires review  
**Date:** 2026-10-10 · **Revision:** 0.2 (synthetic-data isolation; hosting gate per ADR 0004)

## 1. Security objective

Protect student identity, academic records, private learning materials, support/grievance data, staff permissions, AI provider credentials, and institutional trust. Security is part of feature acceptance, not a final clean-up stage.

## 2. Secrets and configuration

- Keep all credentials in local ignored env files or deployment secret stores.
- `.env.example` contains variable names and placeholders only, never working secrets.
- Validate required environment variables during server startup/deploy; fail clearly if required secrets are absent.
- Public-prefixed environment variables are client-exposed by convention; never place service-role/API keys there.
- Rotate exposed credentials and revoke compromised keys; do not “delete the line” and assume Git history is clean.
- Check commits for secrets and private datasets before push.

## 3. Authentication and authorization

- Use secure supported session patterns for the chosen auth service.
- Enforce authorization on every server endpoint, server action, tool, file URL, and database path.
- Use RLS for protected tables and test direct API/database attempts.
- Do not use the service-role key as the normal client-user database path.
- Prevent privilege escalation through profile updates, metadata, invite flows, or untrusted role fields.
- Implement secure sign-out and session expiry behavior.

## 4. Files and uploads

- Private buckets by default for student-uploaded files.
- Validate size, MIME type/content, extension and processing cost.
- Generate storage keys server-side; sanitize displayed filenames.
- Limit PDF pages/characters/chunks and embedding concurrency to prevent denial of service/cost spikes.
- Never execute macros, embedded scripts, arbitrary HTML, or document instructions.
- Apply deletion/retention consistently across object storage, extracted chunks, embeddings, cached artifacts and derived study notes where linked.
- Return signed download URLs only after authorization and keep them short-lived.

## 5. AI/LLM security

- Follow OWASP GenAI/LLM guidance for prompt injection, insecure output handling, sensitive information disclosure, excessive agency, resource abuse and unsafe tool/plugin design.
- Treat retrieved documents and notices as untrusted data.
- No unrestricted SQL, shell, code execution, or generic network-fetch tool.
- Strict schemas, allowlisted UI component names, bounded arrays/strings, and revalidation on server.
- Separate informational answers from high-impact decisions.
- Narrow tool access and re-check permissions at action execution time.
- Redact prompts/results from logs by default; do not ship private student records to an AI provider before reviewing terms, region/retention and approved data flow.
- Add request/token/file limits and per-user/per-IP rate limits based on pilot observations.

## 6. Privacy and sensitive student support

Before production, identify the data controller/owner, purpose, lawful/approved collection basis, notices/consents where applicable, retention periods, access/export/deletion process, vendor data flows, and breach contact. Do not create sensitive mentor/health/harassment notes in the general academic record by default. Prefer referral state and minimal metadata unless authorized policy requires more.

Notifications should show minimum necessary content; sensitive ticket details should not appear on lock screens or broad email subjects.

## 7. Deployment environments

Deployment target and the production gate are defined in **ADR 0004** (`docs/adr/0004-hosting-and-deployment.md`). Environment data-mode rules mirror `07` §8.

### Local
- Synthetic seed data only (`dataOrigin = synthetic_demo`); demo labels required in UI.
- Local/test provider keys with limited quotas.
- Repeatable migration/seed flow.
- `APP_DATA_MODE=demo` (name provisional).

### Preview/staging
- Isolated database and storage.
- No real student data without explicit authorization and controls.
- Protected preview access and separate credentials.
- Test migrations and workflows before release.
- Default `APP_DATA_MODE=demo`; any authorized test data is explicitly labelled, never silent.

### Production
- HTTPS and secure cookie/session configuration.
- Reviewed env variables and access permissions.
- Protected branches and CI checks.
- Database backups, restore test, monitoring, security contact, source-owner contact, and migration/recovery plan.
- No uncontrolled public enrollment to privileged staff roles.
- `APP_DATA_MODE=production`: the server never returns synthetic academic records; missing authoritative data yields an explicit unavailable state (see `07` §8, `01` §6). Seed tooling refuses synthetic academic seeds.
- Production deployment requires the completed security/privacy/operational review checklist in ADR 0004; until then, deploys target local and preview only.

### Synthetic-data isolation controls
- Provenance: every policy-sensitive row carries `dataOrigin`; synthetic rows are visibly labelled in every environment that serves them.
- Enforcement: server-side data-mode gate + database constraints/policies; a browser flag cannot enable synthetic data in production.
- Mixing check: release checklist includes a query confirming zero `synthetic_demo` academic rows are reachable by production sessions.
- Incident path: if synthetic data is discovered in a production session, treat as SEV-2 per `incident-recovery.md`; label/suppress and fix the data-mode guard.

## 8. Migration and backup runbook requirements

For every production schema change:
1. Review migration and data-impact.
2. Test against a recent representative backup in isolated environment where appropriate.
3. Establish backup/restore point and recovery owner.
4. Use forward-compatible migration where feasible.
5. Deploy application/schema in a compatible order.
6. Verify critical reads/writes and logs.
7. Document rollback or forward-fix; do not casually force-push migration history.

A backup is not proven until a restore is tested.

## 9. Monitoring and incident response

Monitor authentication failures, authorization denials, unexpected data reads, AI tool schema rejects, prompt-injection tests/alerts where supported, provider costs, upload failures, failed source syncs, stale data, notification failures, migration errors and uptime.

On suspected data leak or credential compromise:
1. Contain access/disable affected token or integration.
2. Preserve relevant safe logs and identify affected resources.
3. Notify the designated project/college owner through the approved channel.
4. Follow approved institutional reporting procedures; do not speculate publicly.
5. Rotate credentials, patch root cause, test regression and document lessons.

## 10. Release checklist

- [ ] All secret and dependency checks reviewed.
- [ ] RLS and role tests pass.
- [ ] Policy sources and data integrations are verified and labelled.
- [ ] Privacy notice, terms, retention and support contact reviewed by appropriate owner.
- [ ] Backup/restore procedure tested.
- [ ] Logs redact sensitive fields.
- [ ] AI tool permissions and GenUI schemas reviewed.
- [ ] Zero `synthetic_demo` academic rows reachable in production mode; demo labels verified in demo mode.
- [ ] Accessibility and critical flows tested.
- [ ] Rollback/incident owner identified.
- [ ] ADR 0004 production gate (security, privacy, operational review) signed off.

## 11. References

- `docs/adr/0004-hosting-and-deployment.md` — hosting decision and production gate
- [Supabase local development workflows](https://supabase.com/docs/guides/local-development/cli-workflows)
- [OWASP GenAI / LLM Top 10](https://owasp.github.io/www-project-top-10-for-large-language-model-applications/)
- [Next.js security considerations for Server Functions](https://nextjs.org/docs/app/api-reference/directives/use-server)
