/**
 * Preflight helpers for the RLS integration suite (rls.integration.test.ts).
 *
 * Pure functions with no network side effects so the classification logic can
 * be unit-tested without a local Supabase runtime. The goal is that a
 * misconfigured API key can never masquerade as a successful RLS denial.
 *
 * Setup (requires a running local stack — never hosted/production):
 *   1. npx supabase start   (Docker must be running)
 *   2. npx supabase status  → copy the `anon_key` value
 *   3. PowerShell for the test process only:
 *        $env:SUPABASE_TEST_ANON_KEY = '<anon_key from supabase status>'
 *      then re-run `npm run test`.
 * Never paste keys into source files or commit them.
 */

export type RlsTestConfig =
  | { mode: "skip_unavailable"; reason: string }
  | { mode: "fail_missing_key"; setupMessage: string }
  | { mode: "configured"; apiUrl: string; anonKey: string };

export type RlsTestConfigInput = {
  apiAvailable: boolean;
  anonKey: string | undefined;
  apiUrl: string;
};

const MISSING_KEY_SETUP_MESSAGE =
  "RLS integration preflight failed: the local Supabase API is reachable but " +
  "SUPABASE_TEST_ANON_KEY is not set. A placeholder key must never be used — an " +
  "invalid-key error is not evidence that RLS works, and skipped tests are not " +
  "RLS verification. Obtain the local anon key by running `npx supabase status` " +
  "(field `anon_key`), then set it for the test process only, e.g. PowerShell: " +
  "$env:SUPABASE_TEST_ANON_KEY = '<anon_key from supabase status>' and re-run " +
  "`npm run test`. Do not paste the key into source files or commit it.";

/**
 * Decide how the RLS integration suite must behave given environment facts.
 * - API unreachable        → skip (explicitly not verification).
 * - API reachable, no key  → FAIL the suite with setup instructions (never skip
 *                            silently, never run with a placeholder key).
 * - API reachable + key    → run the real RLS assertions.
 */
export function resolveRlsTestConfig(input: RlsTestConfigInput): RlsTestConfig {
  if (!input.apiAvailable) {
    return {
      mode: "skip_unavailable",
      reason:
        "Local Supabase API unreachable — mocked unit tests only; skipped tests are not RLS verification.",
    };
  }
  const anonKey = input.anonKey?.trim();
  if (!anonKey) {
    return { mode: "fail_missing_key", setupMessage: MISSING_KEY_SETUP_MESSAGE };
  }
  return { mode: "configured", apiUrl: input.apiUrl, anonKey };
}

/**
 * True when an error indicates an authentication/API-configuration problem
 * (invalid or missing key, malformed JWT), NOT an expected RLS authorization
 * denial. RLS denials surface as PostgREST "permission denied" errors
 * (SQLSTATE 42501) or as an empty result set — never as 401/config errors.
 */
export function isAuthConfigError(error: unknown): boolean {
  if (!error || typeof error !== "object") {
    return false;
  }
  const candidate = error as { message?: unknown; code?: unknown; status?: unknown };
  const message = typeof candidate.message === "string" ? candidate.message.toLowerCase() : "";
  const configPatterns =
    /invalid api key|invalid x-api-key|api key (is )?missing|no api key found|invalid jwt|jwt malformed|missing authorization|bearer token/i;
  if (configPatterns.test(message)) {
    return true;
  }
  if (candidate.status === 401) {
    return true;
  }
  return candidate.code === "PGRST301" || candidate.code === "PGRST302";
}

/**
 * Throw a loud setup error when the given error is an auth/config failure;
 * otherwise return normally so the caller can proceed with its RLS assertion.
 * This guarantees "Invalid API key" and similar failures are never counted as
 * proof that RLS denied the request.
 */
export function assertNotAuthConfigError(error: unknown): void {
  if (isAuthConfigError(error)) {
    const detail =
      error && typeof error === "object" && "message" in error
        ? String((error as { message?: unknown }).message)
        : "unknown error";
    throw new Error(
      `RLS preflight failed — the local API returned an authentication/configuration error, ` +
        `which is NOT an RLS denial: ${detail}. Verify SUPABASE_TEST_ANON_KEY was copied from ` +
        `\`npx supabase status\` (field \`anon_key\`) and exported for this test process. ` +
        `See src/lib/auth/rls-preflight.ts for setup notes.`,
    );
  }
}
