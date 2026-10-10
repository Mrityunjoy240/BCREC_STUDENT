# Runbook: Local Development Setup

**Status:** Intended workflow; exact commands finalized after framework bootstrap.

## Goal

Allow a team member to recreate the development environment from a clean clone, using safe credentials and synthetic data.

## Before setup

- Confirm the repository and branch are correct.
- Read `README.md`, `AGENTS.md`, and the approved technical ADRs.
- Install supported Node.js/package-manager versions required by the selected framework.
- Install Git. Install Supabase CLI and a Docker-compatible runtime only if using Supabase local development.
- Use a local `.env.local` ignored by Git. Never paste keys into code or prompts.

## Planned setup sequence

1. Clone the repository and inspect `git status`.
2. Install dependencies from the committed lockfile with the package manager chosen by the team.
3. Copy `.env.example` to the local ignored env file and supply only local/test values.
4. Start or connect to the isolated development database.
5. Apply version-controlled migrations and synthetic seed data.
6. Run type check, lint and unit tests.
7. Start the development server and follow the first critical journey in the browser.
8. Confirm sign-in, protected route denial, empty-state behavior and AI-provider failure fallback.

## Environment variable rules

- `.env.example` lists names and safe placeholders only.
- Public/client-prefixed variables must never contain service-role/provider secrets.
- Validate required variables and fail with a safe actionable message.
- Separate local, preview, staging and production credentials.

## Local data

- Use synthetic students, cohorts, timetables and records clearly labelled as demo.
- No real attendance, marks, personal documents or sensitive mentor/grievance notes in seed files.
- Reset only a disposable local database using a documented command after confirming the target environment.

## Before committing

- Review `git status` and `git diff`.
- Check for `.env` files, credentials, personal exports, build output and debug logs.
- Run relevant checks and note any skipped checks.
- Commit only the intended files on the feature branch.

## Troubleshooting

- If env is missing, follow the setup steps; do not disable auth to “make it work.”
- If migration fails, inspect output and database state; do not blindly drop tables or rerun destructive SQL.
- If AI provider fails, verify safe configuration/quotas and test fallback; do not expose API keys in client logs.
- If a route leaks data, block further testing with real/sensitive data until authorization tests prove the fix.

## TODO after bootstrap

Replace this runbook's generic steps with exact version numbers and verified commands produced by the repository's selected package manager, database workflow and deployment host.
