import type { SupabaseClient } from "@supabase/supabase-js";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import {
  filterActiveAssignments,
  permissionAllows,
  type ActiveRoleAssignment,
  type AppPermission,
} from "@/lib/auth/permissions";
import { UnauthorizedError } from "@/lib/auth/errors";
import type { SessionUser } from "@/lib/auth/session";

export type AuthorizeResult =
  | { allowed: true; assignments: ActiveRoleAssignment[] }
  | {
      allowed: false;
      reason: "not_authorized" | "invalid_session" | "disabled_account" | "missing_profile";
    };

async function resolveClient(client?: SupabaseClient): Promise<SupabaseClient> {
  return client ?? ((await createSupabaseServerClient()) as unknown as SupabaseClient);
}

/**
 * Fail-closed authorization check.
 *
 * - Re-verifies the session against the Auth server and that it matches `user`.
 * - Requires an existing, active profile.
 * - Loads only this user's time-valid role_assignments from the database
 *   (RLS also limits reads to own rows; this is defense in depth).
 * - Applies a named permission predicate from docs/08 — there is no generic
 *   "grant role X" entry point; callers cannot supply roles or scopes.
 *
 * Throws UnauthorizedError when denyShouldThrow is true (default), otherwise
 * returns a typed result. Use the result form in list/batch paths; use the
 * throw form for individual resource access.
 */
export async function authorize(
  user: SessionUser,
  permission: AppPermission,
  options: { client?: SupabaseClient; denyShouldThrow?: boolean } = {},
): Promise<AuthorizeResult> {
  const denyResult = (
    reason: "not_authorized" | "invalid_session" | "disabled_account" | "missing_profile",
  ): AuthorizeResult => {
    if (options.denyShouldThrow !== false) {
      throw new UnauthorizedError(reason);
    }
    return { allowed: false, reason };
  };

  const supabase = await resolveClient(options.client);

  const { data: authData, error: authError } = await supabase.auth.getUser();
  if (authError || !authData.user || authData.user.id !== user.id) {
    return denyResult("invalid_session");
  }

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("id, status")
    .eq("id", user.id)
    .maybeSingle();

  if (profileError) {
    return denyResult("missing_profile");
  }
  if (!profile) {
    return denyResult("missing_profile");
  }
  if (profile.status !== "active") {
    return denyResult("disabled_account");
  }

  const { data: rows, error: roleError } = await supabase
    .from("role_assignments")
    .select("role, scope_type, scope_id, valid_from, valid_to")
    .eq("user_id", user.id);

  if (roleError || !rows) {
    return denyResult("not_authorized");
  }

  const assignments = filterActiveAssignments(rows as unknown as ActiveRoleAssignment[]);

  if (!permissionAllows(assignments, permission)) {
    return denyResult("not_authorized");
  }

  return { allowed: true, assignments };
}
