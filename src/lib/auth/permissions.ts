/**
 * Canonical application roles — docs/08-roles-and-permissions.md §2.
 * Do not add roles without updating that document.
 */
export const APP_ROLES = [
  "student",
  "subject_faculty",
  "class_coordinator",
  "faculty_mentor",
  "hod",
  "exam_office",
  "student_services",
  "notice_reviewer",
  "system_admin",
  "auditor",
] as const;

export type AppRole = (typeof APP_ROLES)[number];

export const SCOPE_TYPES = [
  "institution",
  "department",
  "course_offering",
  "mentee",
  "module",
] as const;

export type ScopeType = (typeof SCOPE_TYPES)[number];

/** Active, time-valid role assignment as resolved server-side from the database. */
export type ActiveRoleAssignment = {
  role: AppRole;
  scope_type: ScopeType;
  scope_id: string | null;
  valid_from: string;
  valid_to: string | null;
};

/**
 * Named permissions for the P2.0 identity slice, derived from the docs/08 §3
 * matrix. Expand only alongside a matching matrix cell and negative test.
 */
export const APP_PERMISSIONS = [
  "profile:read_own",
  "role_assignment:read_own",
  "student_record:read_own",
  "staff_record:read_own",
  "enrolment:read_own",
  "department:read",
  "programme:read",
  "cohort:read",
] as const;

export type AppPermission = (typeof APP_PERMISSIONS)[number];

const STUDENT_FACING_ROLES: readonly AppRole[] = ["student"];

const STAFF_FACING_ROLES: readonly AppRole[] = [
  "subject_faculty",
  "class_coordinator",
  "faculty_mentor",
  "hod",
  "exam_office",
  "student_services",
  "notice_reviewer",
  "system_admin",
  "auditor",
];

function hasAnyRole(
  assignments: readonly ActiveRoleAssignment[],
  roles: readonly AppRole[],
): boolean {
  return assignments.some((assignment) => roles.includes(assignment.role));
}

/**
 * Pure permission predicate over already-loaded, time-valid role assignments.
 * Fail closed: unknown permissions and empty assignment sets are denied.
 *
 * Identity-level reads (own profile, own role assignments, org-structure
 * catalogue tables) require only that the caller has any active role
 * assignment; academic-record reads require the specific documented role.
 * Client-supplied roles are never consulted — callers pass only assignments
 * resolved from the database by the server.
 */
export function permissionAllows(
  assignments: readonly ActiveRoleAssignment[],
  permission: AppPermission,
): boolean {
  if (!Array.isArray(assignments)) {
    return false;
  }
  switch (permission) {
    case "profile:read_own":
    case "role_assignment:read_own":
    case "department:read":
    case "programme:read":
    case "cohort:read":
      return assignments.length > 0;
    case "student_record:read_own":
    case "enrolment:read_own":
      return hasAnyRole(assignments, STUDENT_FACING_ROLES);
    case "staff_record:read_own":
      return hasAnyRole(assignments, STAFF_FACING_ROLES);
    default:
      return false;
  }
}

/** True when the assignment is valid at the given instant. */
export function isAssignmentActive(
  assignment: Pick<ActiveRoleAssignment, "valid_from" | "valid_to">,
  at: Date = new Date(),
): boolean {
  const from = new Date(assignment.valid_from).getTime();
  const to = assignment.valid_to === null ? null : new Date(assignment.valid_to).getTime();
  const now = at.getTime();
  if (Number.isNaN(from) || (to !== null && Number.isNaN(to))) {
    return false;
  }
  if (now < from) {
    return false;
  }
  if (to !== null && now >= to) {
    return false;
  }
  return true;
}

/** Filter raw rows down to time-valid assignments (defense in depth after the query). */
export function filterActiveAssignments(
  assignments: readonly ActiveRoleAssignment[],
  at: Date = new Date(),
): ActiveRoleAssignment[] {
  return assignments.filter((assignment) => isAssignmentActive(assignment, at));
}
