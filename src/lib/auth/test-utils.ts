import type { SupabaseClient } from "@supabase/supabase-js";

type Row = Record<string, unknown>;

export type MockAuthUser = { id: string; email?: string | null } | null;

export type MockSupabaseState = {
  authUser?: MockAuthUser;
  authError?: { message: string } | null;
  profiles?: Row[];
  roleAssignments?: Row[];
  profileError?: { message: string } | null;
  roleError?: { message: string } | null;
};

/**
 * Minimal chainable Supabase client mock covering only the query patterns used
 * by src/lib/auth/session.ts and authorize.ts. Not a general-purpose mock.
 */
export function createMockSupabaseClient(state: MockSupabaseState): SupabaseClient {
  const selectTable = (table: "profiles" | "role_assignments") => {
    const rows = table === "profiles" ? (state.profiles ?? []) : (state.roleAssignments ?? []);
    const error = table === "profiles" ? (state.profileError ?? null) : (state.roleError ?? null);

    let filtered = [...rows];
    const api = {
      select() {
        return api;
      },
      eq(column: string, value: unknown) {
        filtered = filtered.filter((row) => row[column] === value);
        return api;
      },
      maybeSingle: async () => ({ data: filtered[0] ?? null, error }),
      then(resolve: (value: { data: unknown; error: unknown }) => unknown) {
        return Promise.resolve({ data: filtered, error }).then(resolve);
      },
    };
    return api;
  };

  return {
    auth: {
      getUser: async () => ({
        data: { user: state.authUser ?? null },
        error: state.authError ?? null,
      }),
    },
    from(table: string) {
      if (table === "profiles" || table === "role_assignments") {
        return selectTable(table);
      }
      throw new Error(`Unexpected table in mock: ${table}`);
    },
  } as unknown as SupabaseClient;
}
