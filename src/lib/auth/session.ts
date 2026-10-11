import type { SupabaseClient } from "@supabase/supabase-js";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { UnauthorizedError } from "@/lib/auth/errors";

/** Minimal server-derived identity. Never assembled from request input. */
export type SessionUser = {
  id: string;
  email: string;
};

export type SessionUserResult =
  | { authenticated: true; user: SessionUser }
  | { authenticated: false; reason: "no_session" | "invalid_session" };

async function resolveClient(client?: SupabaseClient): Promise<SupabaseClient> {
  return client ?? ((await createSupabaseServerClient()) as unknown as SupabaseClient);
}

/**
 * Resolve identity from a verified Supabase session (auth.getUser() validates
 * the JWT with the Auth server; getSession() alone is not trusted).
 *
 * Profile existence and account status are checked by requireUser().
 */
export async function getSessionUser(client?: SupabaseClient): Promise<SessionUserResult> {
  const supabase = await resolveClient(client);
  const { data, error } = await supabase.auth.getUser();

  if (error || !data.user) {
    return { authenticated: false, reason: "invalid_session" };
  }

  const email = data.user.email;
  if (!email) {
    return { authenticated: false, reason: "invalid_session" };
  }

  return {
    authenticated: true,
    user: { id: data.user.id, email },
  };
}

/**
 * Require an authenticated user with an existing, active application profile.
 * Throws UnauthorizedError on any failure. Never trusts user id, role, isAdmin,
 * or scope from the request — identity comes only from the verified session,
 * and profile state only from the database.
 *
 * Reusable by Server Components, Server Actions, and route handlers.
 */
export async function requireUser(client?: SupabaseClient): Promise<SessionUser> {
  const session = await getSessionUser(client);
  if (!session.authenticated) {
    throw new UnauthorizedError(session.reason);
  }

  const supabase = await resolveClient(client);
  const { data: profile, error } = await supabase
    .from("profiles")
    .select("id, status")
    .eq("id", session.user.id)
    .maybeSingle();

  if (error) {
    throw new UnauthorizedError("invalid_session", "Failed to load profile");
  }
  if (!profile) {
    throw new UnauthorizedError("missing_profile");
  }
  if (profile.status !== "active") {
    throw new UnauthorizedError("disabled_account");
  }

  return session.user;
}
