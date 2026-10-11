import { describe, expect, it } from "vitest";
import {
  assertAnonWriteDenied,
  assertExpectedAnonDenial,
  assertNotAuthConfigError,
  isAuthConfigError,
  isPermissionDenied,
  resolveRlsTestConfig,
} from "./rls-preflight";

describe("resolveRlsTestConfig", () => {
  it("skips explicitly when the local API is unreachable (not RLS verification)", () => {
    const config = resolveRlsTestConfig({
      apiAvailable: false,
      anonKey: undefined,
      apiUrl: "http://127.0.0.1:54321",
    });
    expect(config.mode).toBe("skip_unavailable");
    if (config.mode === "skip_unavailable") {
      expect(config.reason).toMatch(/not RLS verification/i);
    }
  });

  it("fails loudly when the API is reachable but the key is missing (no placeholder fallback)", () => {
    for (const anonKey of [undefined, "", "   "]) {
      const config = resolveRlsTestConfig({
        apiAvailable: true,
        anonKey,
        apiUrl: "http://127.0.0.1:54321",
      });
      expect(config.mode).toBe("fail_missing_key");
      if (config.mode === "fail_missing_key") {
        expect(config.setupMessage).toMatch(/SUPABASE_TEST_ANON_KEY/);
        expect(config.setupMessage).toMatch(/npx supabase status/);
        expect(config.setupMessage).toMatch(/anon_key/);
        expect(config.setupMessage).toMatch(/never be used|placeholder/i);
      }
    }
  });

  it("configures only when the API is reachable and a non-blank key is provided", () => {
    const config = resolveRlsTestConfig({
      apiAvailable: true,
      anonKey: " test-key ",
      apiUrl: "http://127.0.0.1:54321",
    });
    expect(config.mode).toBe("configured");
    if (config.mode === "configured") {
      expect(config.anonKey).toBe("test-key");
      expect(config.apiUrl).toBe("http://127.0.0.1:54321");
    }
  });

  it("has no source-file placeholder fallback — only an operator-supplied env key configures the suite", () => {
    // The pre-fix suite defaulted to "local-anon-key-replace-after-supabase-start".
    // resolveRlsTestConfig must treat an absent env key as a hard failure even
    // when the API is up; no default value may be substituted anywhere.
    const noEnvKey = resolveRlsTestConfig({
      apiAvailable: true,
      anonKey: undefined,
      apiUrl: "http://127.0.0.1:54321",
    });
    expect(noEnvKey.mode).toBe("fail_missing_key");
  });
});

describe("isPermissionDenied", () => {
  it("matches only SQLSTATE 42501", () => {
    expect(
      isPermissionDenied({ code: "42501", message: "permission denied for table profiles" }),
    ).toBe(true);
    expect(
      isPermissionDenied({ code: "42P01", message: 'relation "missing" does not exist' }),
    ).toBe(false);
    expect(isPermissionDenied({ code: "", status: 401, message: "Invalid API key" })).toBe(false);
    expect(isPermissionDenied(null)).toBe(false);
  });
});

describe("isAuthConfigError", () => {
  it("classifies invalid/missing API key errors as configuration failures", () => {
    expect(isAuthConfigError({ message: "Invalid API key", code: "", status: 401 })).toBe(true);
    expect(isAuthConfigError({ message: "invalid x-api-key provided" })).toBe(true);
    expect(isAuthConfigError({ message: "No API key found in request" })).toBe(true);
    expect(isAuthConfigError({ message: "jwt malformed" })).toBe(true);
    expect(isAuthConfigError({ message: "Invalid JWT: expected a valid JWT" })).toBe(true);
    expect(isAuthConfigError({ status: 401, message: "unauthorized" })).toBe(true);
    expect(isAuthConfigError({ code: "PGRST301", message: "JWT expired" })).toBe(true);
    expect(isAuthConfigError({ code: "PGRST302", message: "JWT invalid" })).toBe(true);
  });

  it("classifies a 42501 permission denial with HTTP 401 as a denial, NOT a config error", () => {
    // PostgREST can return 42501 with HTTP status 401 for unauthenticated/anon
    // requests against privilege-revoked tables. The SQLSTATE must win.
    expect(
      isAuthConfigError({
        message: "permission denied for table role_assignments",
        code: "42501",
        status: 401,
      }),
    ).toBe(false);
    expect(
      isAuthConfigError({
        message: "permission denied for table profiles",
        code: "42501",
        status: 401,
      }),
    ).toBe(false);
  });

  it("does NOT classify RLS authorization denials as configuration failures", () => {
    expect(
      isAuthConfigError({
        message: "permission denied for table role_assignments",
        code: "42501",
        status: 403,
      }),
    ).toBe(false);
    expect(
      isAuthConfigError({
        message: 'new row violates row-level security policy for table "audit_events"',
        code: "42501",
      }),
    ).toBe(false);
    expect(isAuthConfigError(null)).toBe(false);
    expect(isAuthConfigError(undefined)).toBe(false);
    expect(isAuthConfigError("plain string")).toBe(false);
  });
});

describe("assertExpectedAnonDenial", () => {
  it("accepts a 42501 denial (including with HTTP 401) and a null error", () => {
    expect(() =>
      assertExpectedAnonDenial(
        { code: "42501", status: 401, message: "permission denied for table profiles" },
        "anon SELECT on profiles",
      ),
    ).not.toThrow();
    expect(() => assertExpectedAnonDenial(null, "anon SELECT on profiles")).not.toThrow();
    expect(() => assertExpectedAnonDenial(undefined, "anon SELECT on profiles")).not.toThrow();
  });

  it("fails loudly on unexpected errors such as missing table (42P01)", () => {
    expect(() =>
      assertExpectedAnonDenial(
        { code: "42P01", status: 404, message: 'relation "profiles" does not exist' },
        "anon SELECT on profiles",
      ),
    ).toThrow(/42501/);
    expect(() =>
      assertExpectedAnonDenial(
        { code: "42P01", status: 404, message: 'relation "profiles" does not exist' },
        "anon SELECT on profiles",
      ),
    ).toThrow(/42P01/);
  });

  it("propagates auth/config errors as loud setup failures", () => {
    expect(() =>
      assertExpectedAnonDenial(
        { message: "Invalid API key", code: "", status: 401 },
        "anon SELECT on profiles",
      ),
    ).toThrow(/NOT an RLS denial/i);
  });
});

describe("assertAnonWriteDenied", () => {
  it("accepts a 42501 write denial", () => {
    expect(() =>
      assertAnonWriteDenied(
        { code: "42501", status: 401, message: "permission denied for table role_assignments" },
        "anon INSERT into role_assignments",
      ),
    ).not.toThrow();
  });

  it("fails loudly when the write unexpectedly succeeds (no error)", () => {
    expect(() => assertAnonWriteDenied(null, "anon INSERT into role_assignments")).toThrow(
      /unexpectedly succeeded/,
    );
  });

  it("fails loudly on unexpected errors such as missing table (42P01)", () => {
    expect(() =>
      assertAnonWriteDenied(
        { code: "42P01", status: 404, message: 'relation "audit_events" does not exist' },
        "anon INSERT into audit_events",
      ),
    ).toThrow(/42P01/);
  });
});

describe("assertNotAuthConfigError", () => {
  it("throws a loud setup error for invalid-key failures", () => {
    expect(() => assertNotAuthConfigError({ message: "Invalid API key", status: 401 })).toThrow(
      /authentication\/configuration error/i,
    );
    expect(() => assertNotAuthConfigError({ message: "Invalid API key" })).toThrow(
      /NOT an RLS denial/i,
    );
  });

  it("passes RLS denials through without throwing", () => {
    expect(() =>
      assertNotAuthConfigError({
        message: "permission denied for table profiles",
        code: "42501",
      }),
    ).not.toThrow();
    expect(() => assertNotAuthConfigError(null)).not.toThrow();
  });
});
