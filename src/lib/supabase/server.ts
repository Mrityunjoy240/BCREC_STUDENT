import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(
      `Missing required environment variable ${name}. Copy .env.example to .env.local and supply local values.`,
    );
  }
  return value;
}

/**
 * Request-scoped Supabase client for Server Components, Server Actions, and
 * route handlers. Uses the user's session cookies (anon key + RLS). Never
 * use this pattern with the service-role key for end-user requests.
 *
 * The cookie `setAll` adapter is a no-op when called from a read-only Server
 * Component context; session refresh belongs to middleware in a later phase.
 */
export async function createSupabaseServerClient() {
  const supabaseUrl = requireEnv("NEXT_PUBLIC_SUPABASE_URL");
  const supabaseAnonKey = requireEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY");
  const cookieStore = await cookies();

  return createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          for (const { name, value, options } of cookiesToSet) {
            cookieStore.set(name, value, options);
          }
        } catch {
          // Called from a Server Component where cookies() is read-only.
          // Middleware will refresh the session in the login phase.
        }
      },
    },
  });
}
