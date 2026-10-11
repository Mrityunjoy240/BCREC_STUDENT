import { beforeAll, describe, expect, it } from "vitest";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { assertNotAuthConfigError, resolveRlsTestConfig } from "./rls-preflight";

/**
 * RLS integration checks against a disposable local Supabase instance.
 *
 * Requires `npx supabase start` (Docker) and `npx supabase db reset`, plus
 * SUPABASE_TEST_ANON_KEY copied from `npx supabase status` (field `anon_key`).
 * There is intentionally NO placeholder-key fallback: a missing key fails the
 * suite loudly, and an invalid-key error is treated as a configuration
 * failure — never as evidence that RLS denied access. When the local API is
 * unreachable the suite skips explicitly, and skipped tests are not RLS
 * verification (mocked unit tests elsewhere do not prove RLS behavior).
 *
 * Never point this file at a hosted/production project.
 */

const LOCAL_URL = process.env.SUPABASE_TEST_URL ?? "http://127.0.0.1:54321";
const LOCAL_ANON_KEY = process.env.SUPABASE_TEST_ANON_KEY;

async function localApiAvailable(): Promise<boolean> {
  try {
    const response = await fetch(`${LOCAL_URL}/auth/v1/health`, {
      method: "GET",
      signal: AbortSignal.timeout(2000),
    });
    return response.ok;
  } catch {
    return false;
  }
}

const available = await localApiAvailable();
const config = resolveRlsTestConfig({
  apiAvailable: available,
  anonKey: LOCAL_ANON_KEY,
  apiUrl: LOCAL_URL,
});

describe.skipIf(config.mode !== "configured")("RLS integration (local Supabase)", () => {
  let anon: SupabaseClient;

  beforeAll(() => {
    if (config.mode !== "configured") {
      throw new Error("unreachable: suite is skipped unless configured");
    }
    anon = createClient(config.apiUrl, config.anonKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
  });

  it("authenticated as anon, protected tables are hidden or empty — never config errors", async () => {
    for (const table of [
      "profiles",
      "role_assignments",
      "student_records",
      "staff_records",
      "student_enrolments",
      "audit_events",
    ]) {
      const { data, error } = await anon.from(table).select("*").limit(1);
      // A key/configuration failure must not be counted as an RLS denial.
      assertNotAuthConfigError(error);
      if (!error) {
        expect(data).toEqual([]);
      } else {
        expect(error).toBeTruthy();
      }
    }
  });

  it("anonymous clients cannot insert into role_assignments or audit_events", async () => {
    const roleInsert = await anon.from("role_assignments").insert({
      user_id: "00000000-0000-0000-0000-000000000001",
      role: "system_admin",
      scope_type: "institution",
      scope_id: null,
    });
    assertNotAuthConfigError(roleInsert.error);
    expect(roleInsert.error).toBeTruthy();

    const auditInsert = await anon.from("audit_events").insert({
      action: "test",
      resource_type: "test",
      result: "allowed",
    });
    assertNotAuthConfigError(auditInsert.error);
    expect(auditInsert.error).toBeTruthy();
  });
});

// ---------------------------------------------------------------------------
// Environment gate. When the API is reachable but the key is missing, this
// suite fails loudly instead of reporting a false-positive RLS pass. When the
// API is unreachable, it records an explicit skip — skipped tests are not RLS
// verification.
// ---------------------------------------------------------------------------
describe.skipIf(config.mode === "configured")("RLS integration (environment)", () => {
  it("local API unreachable — suite skipped; mocked unit tests only (not RLS verification)", () => {
    expect(config.mode).toBe("skip_unavailable");
  });

  it("local API reachable but SUPABASE_TEST_ANON_KEY missing — setup required", () => {
    if (config.mode === "fail_missing_key") {
      throw new Error(config.setupMessage);
    }
    expect(config.mode).toBe("skip_unavailable");
  });
});
