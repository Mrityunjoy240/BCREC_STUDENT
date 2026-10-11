---
description: Run all project verification checks and report each result accurately.
---

Run every applicable verification check for this project and report each result honestly. Never claim a check passed if it did not run or failed.

## Checks to run (in order)

For each check, run the command, capture the exit code and key output, then record PASS, FAIL, or SKIPPED with a reason.

1. **Type check** — `npm run typecheck`
2. **Lint** — `npm run lint`
3. **Format check** — `npm run format:check`
4. **Unit/integration tests** — `npm test`
5. **Production build** — `npm run build` (run this for user-visible or route-level changes; skip for doc-only changes and note why)

## Rules

- Run checks from the repository root (or the relevant worktree).
- If `node_modules` is missing, run `npm ci` first and note it.
- If a check fails, capture the first meaningful error and stop that check — do not mask it.
- If a check cannot run (missing tool, missing env, infrastructure down), mark it SKIPPED with the exact reason.
- Do not modify source code to make a check pass unless the user asked you to fix the failure.
- Report a summary table at the end: check name, result, duration if available, and notes.

## Output format

```
| Check        | Result | Notes |
|-------------|--------|-------|
| typecheck   | PASS/FAIL/SKIPPED | ... |
| lint        | PASS/FAIL/SKIPPED | ... |
| format:check| PASS/FAIL/SKIPPED | ... |
| test        | PASS/FAIL/SKIPPED | ... |
| build       | PASS/FAIL/SKIPPED | ... |
```

Then list any failures with their first relevant error message and the file/line if available.
