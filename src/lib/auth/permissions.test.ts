import { describe, expect, it } from "vitest";
import {
  APP_PERMISSIONS,
  APP_ROLES,
  filterActiveAssignments,
  isAssignmentActive,
  permissionAllows,
  type ActiveRoleAssignment,
} from "@/lib/auth/permissions";

function assignment(overrides: Partial<ActiveRoleAssignment> = {}): ActiveRoleAssignment {
  return {
    role: "student",
    scope_type: "institution",
    scope_id: null,
    valid_from: "2026-01-01T00:00:00.000Z",
    valid_to: null,
    ...overrides,
  };
}

describe("canonical role set", () => {
  it("matches the documented 10-role set from docs/08", () => {
    expect([...APP_ROLES].sort()).toEqual(
      [
        "auditor",
        "class_coordinator",
        "exam_office",
        "faculty_mentor",
        "hod",
        "notice_reviewer",
        "student",
        "student_services",
        "subject_faculty",
        "system_admin",
      ].sort(),
    );
  });
});

describe("permissionAllows", () => {
  it("denies when there are no role assignments (fail closed)", () => {
    for (const permission of APP_PERMISSIONS) {
      expect(permissionAllows([], permission)).toBe(false);
    }
  });

  it("allows student_record read only for an active student role", () => {
    expect(permissionAllows([assignment({ role: "student" })], "student_record:read_own")).toBe(
      true,
    );
    expect(
      permissionAllows(
        [assignment({ role: "subject_faculty", scope_type: "department", scope_id: "d1" })],
        "student_record:read_own",
      ),
    ).toBe(false);
    expect(
      permissionAllows(
        [assignment({ role: "hod", scope_type: "department", scope_id: "d1" })],
        "student_record:read_own",
      ),
    ).toBe(false);
  });

  it("allows staff_record read for staff roles but not student", () => {
    expect(
      permissionAllows(
        [assignment({ role: "faculty_mentor", scope_type: "mentee", scope_id: "s1" })],
        "staff_record:read_own",
      ),
    ).toBe(true);
    expect(permissionAllows([assignment({ role: "student" })], "staff_record:read_own")).toBe(
      false,
    );
  });

  it("treats identity and catalogue reads as requiring any active assignment", () => {
    const student = [assignment({ role: "student" })];
    expect(permissionAllows(student, "profile:read_own")).toBe(true);
    expect(permissionAllows(student, "role_assignment:read_own")).toBe(true);
    expect(permissionAllows(student, "department:read")).toBe(true);
  });

  it("does not consult any client-supplied role — only passed assignments count", () => {
    // Simulates a request body claiming role=hod / isAdmin=true: those values
    // never enter this function; only DB-resolved assignments do.
    const claimedButUnresolved = "hod" as unknown as ActiveRoleAssignment[];
    expect(
      permissionAllows(
        claimedButUnresolved as unknown as ActiveRoleAssignment[],
        "student_record:read_own",
      ),
    ).toBe(false);
  });

  it("denies unknown permission strings", () => {
    const bogus = "profile:read_everything" as unknown as (typeof APP_PERMISSIONS)[number];
    expect(
      permissionAllows(
        [assignment({ role: "system_admin", scope_type: "institution", scope_id: null })],
        bogus,
      ),
    ).toBe(false);
  });
});

describe("isAssignmentActive / filterActiveAssignments", () => {
  const at = new Date("2026-06-15T12:00:00.000Z");

  it("accepts assignments valid at the given instant", () => {
    expect(isAssignmentActive({ valid_from: "2026-01-01T00:00:00.000Z", valid_to: null }, at)).toBe(
      true,
    );
    expect(
      isAssignmentActive(
        {
          valid_from: "2026-06-01T00:00:00.000Z",
          valid_to: "2026-07-01T00:00:00.000Z",
        },
        at,
      ),
    ).toBe(true);
  });

  it("rejects expired and not-yet-valid assignments", () => {
    expect(
      isAssignmentActive(
        {
          valid_from: "2026-01-01T00:00:00.000Z",
          valid_to: "2026-06-01T00:00:00.000Z",
        },
        at,
      ),
    ).toBe(false);
    expect(
      isAssignmentActive(
        {
          valid_from: "2026-07-01T00:00:00.000Z",
          valid_to: null,
        },
        at,
      ),
    ).toBe(false);
  });

  it("rejects invalid timestamps", () => {
    expect(isAssignmentActive({ valid_from: "not-a-date", valid_to: null }, at)).toBe(false);
  });

  it("filters a mixed list down to active assignments only", () => {
    const filtered = filterActiveAssignments(
      [
        assignment({ valid_from: "2026-01-01T00:00:00.000Z", valid_to: null }),
        assignment({
          valid_from: "2026-01-01T00:00:00.000Z",
          valid_to: "2026-02-01T00:00:00.000Z",
        }),
      ],
      at,
    );
    expect(filtered).toHaveLength(1);
    expect(filtered[0]?.valid_to).toBeNull();
  });
});
