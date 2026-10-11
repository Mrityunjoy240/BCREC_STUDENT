# Runbook: Local Development Setup

**Status:** Core commands below were verified during the website bootstrap (lint, format:check, typecheck, test, build, dev, npm ci). Supabase CLI is now a committed devDependency (P2.0); `npx supabase start` / `db reset` still require a running Docker-compatible runtime and remain unverified on machines where the daemon is down. Playwright commands remain **proposed**.

## Goal

Allow a team member to recreate the development environment from a clean clone, using safe credentials and synthetic data.

## Before setup

- Confirm the repository and branch are correct.
- Read `README.md`, `AGENTS.md`, and review the proposed technical ADRs (0001–0004), checking their approval status before relying on them.
- Install a supported Node.js LTS version and **npm** (package manager per ADR 0001; lockfile committed).
- Install Git. A Docker-compatible runtime is required only for Supabase local database workflows (CLI ships via the `supabase` devDependency).
- Use a local `.env.local` ignored by Git. Never paste keys into code or prompts.

## Setup sequence

Verified commands are used where the bootstrap/P2.0 task ran them; Docker-dependent Supabase steps stay unverified until the daemon is available.

1. Clone the repository and inspect `git status`.
2. Install dependencies: `npm ci` (from the committed `package-lock.json`) — **verified**.
3. Copy `.env.example` to `.env.local` (`copy .env.example .env.local` on Windows, `cp .env.example .env.local` elsewhere) and supply only local/test values — **verified pattern**; do not commit `.env.local`. Placeholder names include `APP_DATA_MODE`, `NEXT_PUBLIC_SUPABASE_URL`, and `NEXT_PUBLIC_SUPABASE_ANON_KEY` (publishable/local values only — never a service-role key).
4. Start the isolated local database (requires Docker daemon running): `npx supabase start` — **proposed** (CLI committed; not run while Docker was down).
5. Apply migrations (no committed academic seed; seed loading is disabled in `supabase/config.toml`): `npx supabase db reset` — **proposed**.
6. Run checks — **verified**: `npm run lint`, `npm run format:check`, `npm run typecheck`, `npm run test` (includes mocked auth-helper tests and static migration guards; RLS integration suite auto-skips if the local API is unreachable).
7. Production build check — **verified**: `npm run build`.
8. Start the development server — **verified**: `npm run dev`, then open the printed local URL (default `http://localhost:3000`).
9. Follow the first critical journey in the browser (`11-testing-and-acceptance.md` P0 E2E list — Playwright suite still **proposed**).
10. Confirm sign-in, protected route denial, empty-state behavior, demo-data labels, and AI-provider failure fallback (mocked provider by default) — these run only once the session/login phase lands route protection.

## Environment variable rules

- `.env.example` lists names and safe placeholders only.
- Public/client-prefixed variables must never contain service-role/provider secrets.
- Validate required variables and fail with a safe actionable message.
- Separate local, preview, staging and production credentials.
- Local runs use the demo data mode (`APP_DATA_MODE=demo`, name provisional — see `07` §8).

## Local data

- Use synthetic students, cohorts, timetables and records clearly labelled as demo (`dataOrigin = synthetic_demo`).
- No real attendance, marks, personal documents or sensitive mentor/grievance notes in seed files.
- The P2.0 migration adds identity/audit tables only; **no student or staff accounts** are committed in the seed (`[db.seed] enabled = false`).
- Reset only a disposable local database using the documented command (`npx supabase db reset`) after confirming the target environment.

## Before committing

- Review `git status` and `git diff`.
- Check for `.env` files, credentials, personal exports, build output and debug logs.
- Run relevant checks separately (Windows PowerShell 5.1 does not support `&&`; run each command on its own line, or use PowerShell 7+/cmd for chaining) — all verified at bootstrap:
  ```powershell
  npm run lint
  npm run format:check
  npm run typecheck
  npm run test
  ```
  Note any skipped checks.
- Commit only the intended files on the feature branch.

## Troubleshooting

- If env is missing, follow the setup steps; do not disable auth to “make it work.”
- If migration fails, inspect output and database state; do not blindly drop tables or rerun destructive SQL.
- If AI provider fails, verify safe configuration/quotas and test fallback; do not expose API keys in client logs.
- If a route leaks data, block further testing with real/sensitive data until authorization tests prove the fix.

## Remaining TODOs

- Run `npx supabase start` and `npx supabase db reset` once Docker is available; execute `src/lib/auth/rls.integration.test.ts` against the local API and record results in `11-testing-and-acceptance.md` §7.
- Session-refresh middleware (root `proxy.ts` / middleware) and login UI land in the **next** P2 session phase — intentionally not half-configured in P2.0.
- Playwright E2E and full integration-test commands stay **proposed** until those tasks add the suites; keep `11-testing-and-acceptance.md` §7 in sync in the same change.
