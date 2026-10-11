import { describe, expect, it } from "vitest";
import { authorize } from "@/lib/auth/authorize";
import { UnauthorizedError } from "@/lib/auth/errors";
import { createMockSupabaseClient } from "@/lib/auth/test-utils";
import type { SessionUser } from "@/lib/auth/session";

const user: SessionUser = { id: "user-1", email: "student@example.test" };

function studentClient(overrides = {}) {
  return createMockSupabaseClient({
    authUser: { id: "user-1", email: "student@example.test" },
    profiles: [{ id: "user-1", status: "active" }],
    roleAssignments: [
      {
        user_id: "user-1",
        role: "student",
        scope_type: "institution",
        scope_id: null,
        valid_from: "2026-01-01T00:00:00.000Z",
        valid_to: null,
      },
    ],
    ...overrides,
  });
}

describe("authorize", () => {
  it("denies when the session is missing", async () => {
    const client = createMockSupabaseClient({ authUser: null });
    await expect(
      authorize(user, "profile:read_own", { client, denyShouldThrow: false }),
    ).resolves.toEqual({ allowed: false, reason: "invalid_session" });
  });

  it("denies when the session belongs to a different user", async () => {
    const client = createMockSupabaseClient({
      authUser: { id: "someone-else", email: "other@example.test" },
      profiles: [{ id: "user-1", status: "active" }],
    });
    await expect(
      authorize(user, "profile:read_own", { client, denyShouldThrow: false }),
    ).resolves.toEqual({ allowed: false, reason: "invalid_session" });
  });

  it("denies when the profile is missing", async () => {
    const client = createMockSupabaseClient({
      authUser: { id: "user-1", email: "student@example.test" },
      profiles: [],
    });
    await expect(
      authorize(user, "profile:read_own", { client, denyShouldThrow: false }),
    ).resolves.toEqual({ allowed: false, reason: "missing_profile" });
  });

  it("denies when the profile is disabled", async () => {
    const client = studentClient({
      profiles: [{ id: "user-1", status: "disabled" }],
    });
    await expect(
      authorize(user, "profile:read_own", { client, denyShouldThrow: false }),
    ).resolves.toEqual({ allowed: false, reason: "disabled_account" });
  });

  it("denies when the user has no role assignments", async () => {
    const client = studentClient({ roleAssignments: [] });
    await expect(
      authorize(user, "student_record:read_own", { client, denyShouldThrow: false }),
    ).resolves.toEqual({ allowed: false, reason: "not_authorized" });
  });

  it("allows student_record read for an active student assignment", async () => {
    const client = studentClient();
    const result = await authorize(user, "student_record:read_own", {
      client,
      denyShouldThrow: false,
    });
    expect(result.allowed).toBe(true);
  });

  it("denies student_record read when the only assignment is expired", async () => {
    const client = studentClient({
      roleAssignments: [
        {
          user_id: "user-1",
          role: "student",
          scope_type: "institution",
          scope_id: null,
          valid_from: "2026-01-01T00:00:00.000Z",
          valid_to: "2026-02-01T00:00:00.000Z",
        },
      ],
    });
    await expect(
      authorize(user, "student_record:read_own", { client, denyShouldThrow: false }),
    ).resolves.toEqual({ allowed: false, reason: "not_authorized" });
  });

  it("does not treat a profile role/isAdmin field as authorization", async () => {
    // Even if a compromised row smuggled role columns onto profiles, authorize()
    // only loads role_assignments for permission decisions.
    const client = studentClient({
      profiles: [{ id: "user-1", status: "active", role: "system_admin", is_admin: true }],
      roleAssignments: [],
    });
    await expect(
      authorize(user, "student_record:read_own", { client, denyShouldThrow: false }),
    ).resolves.toEqual({ allowed: false, reason: "not_authorized" });
  });

  it("throws UnauthorizedError by default on denial", async () => {
    const client = studentClient({ roleAssignments: [] });
    await expect(authorize(user, "student_record:read_own", { client })).rejects.toBeInstanceOf(
      UnauthorizedError,
    );
  });

  it("supports out-of-scope staff denial for student_record", async () => {
    const staffUser: SessionUser = { id: "staff-1", email: "staff@example.test" };
    const client = createMockSupabaseClient({
      authUser: { id: "staff-1", email: "staff@example.test" },
      profiles: [{ id: "staff-1", status: "active" }],
      roleAssignments: [
        {
          user_id: "staff-1",
          role: "subject_faculty",
          scope_type: "course_offering",
          scope_id: "offer-9",
          valid_from: "2026-01-01T00:00:00.000Z",
          valid_to: null,
        },
      ],
    });
    await expect(
      authorize(staffUser, "student_record:read_own", { client, denyShouldThrow: false }),
    ).resolves.toEqual({ allowed: false, reason: "not_authorized" });
  });
});
