# Runbook: Local Development Setup

**Status:** Proposed workflow with proposed commands; verify and finalize during framework bootstrap (see ADR 0001/0004). Commands below are marked proposed until they have actually been run from a clean clone.

## Goal

Allow a team member to recreate the development environment from a clean clone, using safe credentials and synthetic data.

## Before setup

- Confirm the repository and branch are correct.
- Read `README.md`, `AGENTS.md`, and review the proposed technical ADRs (0001–0004), checking their approval status before relying on them.
- Install a supported Node.js LTS version and **npm** (package manager per ADR 0001; lockfile committed).
- Install Git. Install Supabase CLI and a Docker-compatible runtime only if using Supabase local development.
- Use a local `.env.local` ignored by Git. Never paste keys into code or prompts.

## Proposed setup sequence

All commands are **proposed** until verified at bootstrap; replace this list with verified commands in the same change that bootstraps the app.

1. Clone the repository and inspect `git status`.
2. Install dependencies: `npm ci` (from the committed `package-lock.json`).
3. Copy `.env.example` to `.env.local` (`copy .env.example .env.local` on Windows, `cp .env.example .env.local` elsewhere) and supply only local/test values.
4. Start the isolated local database (Supabase CLI, proposed): `npx supabase start`.
5. Apply migrations and synthetic seed (proposed): `npx supabase db reset`.
6. Run checks (proposed): `npm run lint`, `npm run typecheck`, `npm run test`.
7. Start the development server (proposed): `npm run dev`, then open the printed local URL.
8. Follow the first critical journey in the browser (`11-testing-and-acceptance.md` P0 E2E list).
9. Confirm sign-in, protected route denial, empty-state behavior, demo-data labels, and AI-provider failure fallback (mocked provider by default).

## Environment variable rules

- `.env.example` lists names and safe placeholders only.
- Public/client-prefixed variables must never contain service-role/provider secrets.
- Validate required variables and fail with a safe actionable message.
- Separate local, preview, staging and production credentials.
- Local runs use the demo data mode (`APP_DATA_MODE=demo`, name provisional — see `07` §8).

## Local data

- Use synthetic students, cohorts, timetables and records clearly labelled as demo (`dataOrigin = synthetic_demo`).
- No real attendance, marks, personal documents or sensitive mentor/grievance notes in seed files.
- Reset only a disposable local database using the documented command (`npx supabase db reset` proposed) after confirming the target environment.

## Before committing

- Review `git status` and `git diff`.
- Check for `.env` files, credentials, personal exports, build output and debug logs.
- Run relevant checks separately (Windows PowerShell 5.1 does not support `&&`; run each command on its own line, or use PowerShell 7+/cmd for chaining):
  ```powershell
  npm run lint
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

## TODO after bootstrap

Replace every “proposed” command above with the exact verified command and pinned tool versions produced during bootstrap, in the same commit that introduces the application. Update `11-testing-and-acceptance.md` §7 CI commands to match.
