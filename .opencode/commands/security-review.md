---
description: Security review of changed code — authorization, ownership, validation, RLS, uploads, secrets, and sensitive data logging.
---

Perform a focused security review of the current changes (staged + unstaged diff against the base branch). This is a review only — do not modify code unless the user explicitly asks you to fix a finding.

## Scope

Run `git diff` and `git diff --cached` against the merge-base with the target branch to identify changed files. Focus the review on those files. If there are no changes, say so and stop.

## Checklist

For each changed file, check the following. Mark each as PASS, FAIL, or N/A with a one-line reason.

### 1. Authorization

- Is every protected read/write gated by a server-side permission check?
- Are browser-supplied user IDs, roles, student IDs, scopes, amounts, or approval flags verified against the authenticated session and trusted records (not trusted as-is)?
- Are least-privilege boundaries respected per role (student / mentor / faculty / HOD / admin)?

### 2. Ownership / tenant isolation

- Can a user read or mutate another user's records by changing an ID in the request?
- Are queries scoped by owner/tenant boundaries (e.g., `user_id = auth.uid()`)?
- Are RLS policies present for every touched protected table, and do they deny cross-user access?

### 3. Server-side validation

- Is all input validated on the server (Zod/JSON-schema or equivalent) before use?
- Are file uploads validated for type, size, and content, and stored outside the public web root or with safe content-type headers?

### 4. Secrets and configuration

- Are any service-role keys, API keys, DB credentials, or tokens exposed in client bundles, logs, error messages, prompts, screenshots, docs, or commits?
- Are new environment variables documented in `.env.example` with safe placeholders only?
- Is anything sensitive accidentally staged for commit?

### 5. Sensitive data logging

- Are counselling, grievance, health, family, or other sensitive information logged unnecessarily?
- Do error messages leak internal details (stack traces, SQL, connection strings) to the client?

### 6. Injection and untrusted content

- Is user-supplied content (uploads, notices, forum posts, retrieved passages) treated as data, not instructions to the model or to shell/SQL?
- Are there any new paths where AI-generated or user-supplied content is executed (code, JSX, HTML) without an allowlist?

### 7. Consequential writes

- Do state-changing actions require explicit user confirmation where appropriate?
- Are idempotency/replay protection and audit events present for consequential operations?

## Output format

For each finding:

```
[SEVERITY: critical|high|medium|low] FILE:LINE — Finding description
  Recommendation: ...
```

If no findings: "No security findings in the changed files."

End with a summary: counts by severity, and an explicit statement of what was NOT verified (e.g., "RLS policies were not tested against a live database — static review only").
