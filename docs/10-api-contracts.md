# API Contracts and Service Boundaries

**Status:** Proposed conventions; endpoint list is not yet a commitment to implement all routes.  
**Date:** 2026-10-10

## 1. Principles

- APIs are contracts, not thin wrappers around database tables.
- Every private endpoint derives identity from a trusted server session; never trust client-supplied `userId` or role.
- Validate all request bodies, query parameters, path IDs, and model/tool outputs.
- Keep source provenance and data-quality state in responses that depend on official data.
- List endpoints paginate and cap page size.
- Use consistent errors, request IDs, and safe messages.
- Document which service owns each rule so the website and future mobile app cannot implement different logic.

## 2. Proposed response envelope

Success may use a typed data object; list responses should include pagination metadata. Policy-driven results include source/freshness metadata. Standardize error envelope conceptually as:

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Check the highlighted fields and try again.",
    "requestId": "server-generated-correlation-id",
    "fieldErrors": {}
  }
}
```

Do not include stack traces, secrets, SQL, provider request dumps, or private records in error responses. This envelope is a proposal; keep exact naming consistent when implemented.

## 3. Status and error categories

Suggested HTTP semantics:
- `400` invalid/malformed request.
- `401` unauthenticated.
- `403` authenticated but not authorized (avoid resource-existence leaks where required).
- `404` missing or intentionally concealed protected resource.
- `409` conflict/duplicate/state transition conflict.
- `413` file too large.
- `422` well-formed but semantically invalid action.
- `429` rate/cost limit.
- `500` unexpected server failure with correlation ID.
- `503` required dependency unavailable.

## 4. Initial domain API map

The preferred Next.js implementation may use route handlers/server actions as appropriate, but each operation must have a server-side service implementation reusable by the future app.

| Domain | Candidate operation | Access/notes (see `08-roles-and-permissions.md` §3) |
|---|---|---|
| Session/profile | Get own profile/context | Authenticated; role and cohort from trusted mapping |
| Dashboard | Get dashboard summary | Authenticated; aggregates only permitted records; includes canonical provenance fields |
| Calendar | List permitted events by range | Authenticated; separate official vs personal vs suggestion |
| Tasks | List/create/update/complete personal task | Ownership and valid state transition; idempotent where needed |
| Notices | List visible notices; get detail | Filter by role/cohort applicability; four provenance fields and content review status |
| Learning documents | Upload/initiate, status, list, delete | Ownership, file validation, private storage and retention |
| AI chat | Send message, list own conversations, fetch own artifact | Rate/cost limiting; authorized retrieval; tool audit |
| GenUI action | Validate/confirm allowed proposal | Strict schema, current permissions, user confirmation and idempotency |
| Academic summary | Get attendance/marks/results where connected | **P0: read-only.** Only authoritative or clearly labelled synthetic records; provenance included; write/correction endpoints deferred per `08` §8 |
| Support | Create/list own ticket, permitted staff transitions | **P1** (ticket features deferred, `01` §4). Minimize sensitive data; ticket-specific authorization |
| Notifications | Read, acknowledge, update preference | **P0: preference read/update only.** In-app delivery, email, and server-managed/push notifications are **P1** (`01` §4). Avoid sensitive content in delivery payloads |
| Audit | Read permitted audit metadata/own receipts | Auditor, policy approver, and scoped staff per `08` §3.1; no client-side audit writes |

**Not exposed in P0** (deferred per `08` §8 until a correction owner is confirmed): attendance-correction write, marks/result change, academic policy rule approval, bulk staff import tools, and any endpoint that edits institutional academic records. Do not implement “temporary” versions of these routes.

## 5. Data-quality metadata

For policy-sensitive values, every response uses the canonical provenance fields defined in `06-data-sources-and-academic-rules.md` §9:
- `sourceId` or `sourceUrl` where safe.
- `dataOrigin` — `official_source` | `authorized_import` | `staff_curated` | `student_input` | `ai_generated` | `synthetic_demo`.
- `sourceVerification` — `unverified` | `verified` | `conflicting` | `rejected`.
- `contentReview` — `unreviewed` | `reviewed` | `approved_for_display` | `approved_for_rule_engine` | `rejected` | `superseded`.
- `freshnessStatus` — `current` | `stale` | `unavailable` | `unknown`.
- `observedAt`/`lastVerifiedAt`.
- `applicability` or a resolvable policy version.
- `isAdvisory` for predictive/risk output.

Do not invent alternate enums; combined shorthands (e.g. `verified_current`) are derived presentation values only, per §9.6 of doc 06. If `sourceVerification` is `unverified`/`conflicting`, `freshnessStatus` is `unavailable`, or `dataOrigin` is `synthetic_demo`, the caller must not present the value as authoritative; production sessions must not receive `synthetic_demo` academic records at all (see `07` §8 and `12` §7).

## 6. Mutation safeguards

- Use server-side transactional writes for related records.
- Reject fields the client is not allowed to change rather than silently accepting them.
- Use version/etag or update preconditions for race-sensitive records.
- Include idempotency for support submission/notification scheduling or repeated provider callbacks as required.
- Audit official corrections, approvals, permission changes, and sensitive ticket transitions.
- Return the persisted state or a confirmed receipt; do not rely solely on optimistic client state.

## 7. Pagination and filtering

- Default page size small enough for responsive rendering; enforce a maximum server limit.
- Validate all date ranges and allowed sort keys.
- Avoid arbitrary user-supplied SQL order expressions or filter expressions.
- Scope queries to authorized records before pagination/counts.
- Do not expose cross-user result counts through global aggregates without approval.

## 8. AI-specific service boundaries

LLM requests should call typed domain tools, not generic SQL or unrestricted HTTP fetch. Each tool contract defines input schema, permission requirements, result schema, timeout, side effects, audit requirements, and fallback. Structured outputs must be parsed by the server before the client renders them.

## 9. Contract versioning

Prefer additive changes where possible. When a breaking change is unavoidable:
1. Update this document and tests.
2. Coordinate website and mobile consumers.
3. Use explicit schema/version fields where useful.
4. Migrate persisted artifacts safely.
5. Remove old behavior only after all consumers are updated.

## 10. Open items

- Decide exact route/API organization after architecture approval.
- Choose typed client generation strategy (if any) after schema stabilizes.
- Define production rate limits and request-size limits based on baseline measurements.
- Define pagination/retention behavior for chat, notice, task and audit history.
