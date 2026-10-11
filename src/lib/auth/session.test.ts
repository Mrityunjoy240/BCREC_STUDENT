import { describe, expect, it } from "vitest";
import { getSessionUser, requireUser } from "@/lib/auth/session";
import { UnauthorizedError } from "@/lib/auth/errors";
import { createMockSupabaseClient } from "@/lib/auth/test-utils";

describe("getSessionUser", () => {
  it("returns an unauthenticated result when there is no session", async () => {
    const client = createMockSupabaseClient({ authUser: null });
    const result = await getSessionUser(client);
    expect(result).toEqual({ authenticated: false, reason: "invalid_session" });
  });

  it("returns an unauthenticated result when the session is invalid", async () => {
    const client = createMockSupabaseClient({
      authUser: null,
      authError: { message: "jwt expired" },
    });
    const result = await getSessionUser(client);
    expect(result.authenticated).toBe(false);
  });

  it("returns the session identity from a verified Auth user", async () => {
    const client = createMockSupabaseClient({
      authUser: { id: "user-1", email: "student@example.test" },
    });
    const result = await getSessionUser(client);
    expect(result).toEqual({
      authenticated: true,
      user: { id: "user-1", email: "student@example.test" },
    });
  });

  it("rejects sessions without an email claim", async () => {
    const client = createMockSupabaseClient({
      authUser: { id: "user-1", email: null },
    });
    const result = await getSessionUser(client);
    expect(result.authenticated).toBe(false);
  });
});

describe("requireUser", () => {
  it("throws no_session-equivalent for missing sessions", async () => {
    const client = createMockSupabaseClient({ authUser: null });
    await expect(requireUser(client)).rejects.toMatchObject({
      name: "UnauthorizedError",
      code: "invalid_session",
    });
  });

  it("throws missing_profile when no profile row exists", async () => {
    const client = createMockSupabaseClient({
      authUser: { id: "user-1", email: "a@example.test" },
      profiles: [],
    });
    await expect(requireUser(client)).rejects.toMatchObject({
      code: "missing_profile",
    });
  });

  it("throws disabled_account when the profile is disabled", async () => {
    const client = createMockSupabaseClient({
      authUser: { id: "user-1", email: "a@example.test" },
      profiles: [{ id: "user-1", status: "disabled" }],
    });
    await expect(requireUser(client)).rejects.toMatchObject({
      code: "disabled_account",
    });
  });

  it("returns the session user for an active profile", async () => {
    const client = createMockSupabaseClient({
      authUser: { id: "user-1", email: "a@example.test" },
      profiles: [{ id: "user-1", status: "active" }],
    });
    await expect(requireUser(client)).resolves.toEqual({
      id: "user-1",
      email: "a@example.test",
    });
  });

  it("never trusts client-supplied roles or isAdmin flags", async () => {
    // The helpers accept only an optional Supabase client — there is no
    // parameter for role, studentId, or isAdmin to forge.
    const client = createMockSupabaseClient({
      authUser: { id: "user-1", email: "a@example.test" },
      profiles: [{ id: "user-1", status: "active", role: "hod", is_admin: true }],
    });
    const user = await requireUser(client);
    expect(user).toEqual({ id: "user-1", email: "a@example.test" });
    expect(user).not.toHaveProperty("role");
    expect(user).not.toHaveProperty("isAdmin");
  });

  it("throws UnauthorizedError instances", async () => {
    const client = createMockSupabaseClient({ authUser: null });
    await expect(requireUser(client)).rejects.toBeInstanceOf(UnauthorizedError);
  });
});
