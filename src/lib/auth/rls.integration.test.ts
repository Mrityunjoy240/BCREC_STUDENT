import { beforeAll, describe, expect, it } from "vitest";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

/**
 * RLS integration checks against a disposable local Supabase instance.
 *
 * Requires `npx supabase start` (Docker) and `npx supabase db reset`.
 * The suite is SKIPPED automatically when the local API is unreachable —
 * mocked unit tests elsewhere do not prove RLS behavior.
 *
 * Never point this file at a hosted/production project.
 */

const LOCAL_URL = process.env.SUPABASE_TEST_URL ?? "http://127.0.0.1:54321";
const LOCAL_ANON_KEY =
  process.env.SUPABASE_TEST_ANON_KEY ?? "local-anon-key-replace-after-supabase-start";

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

describe.skipIf(!available)("RLS integration (local Supabase)", () => {
  let anon: SupabaseClient;

  beforeAll(() => {
    anon = createClient(LOCAL_URL, LOCAL_ANON_KEY, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
  });

  it("anonymous clients cannot read protected application tables", async () => {
    for (const table of [
      "profiles",
      "role_assignments",
      "student_records",
      "staff_records",
      "student_enrolments",
      "audit_events",
    ]) {
      const { data, error } = await anon.from(table).select("*").limit(1);
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
    expect(roleInsert.error).toBeTruthy();

    const auditInsert = await anon.from("audit_events").insert({
      action: "test",
      resource_type: "test",
      result: "allowed",
    });
    expect(auditInsert.error).toBeTruthy();
  });
});

describe.skipIf(available)("RLS integration (unavailable)", () => {
  it("records that local Supabase was not reachable — mocked unit tests only", () => {
    expect(available).toBe(false);
  });
});
