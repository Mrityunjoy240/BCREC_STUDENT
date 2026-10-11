import { afterEach, describe, expect, it, vi } from "vitest";

vi.mock("next/headers", () => ({
  cookies: async () => ({
    getAll: () => [],
    set: () => {
      throw new Error("read-only cookie store in test");
    },
  }),
}));

describe("createSupabaseServerClient env validation", () => {
  afterEach(() => {
    vi.resetModules();
    delete process.env.NEXT_PUBLIC_SUPABASE_URL;
    delete process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  });

  it("throws a clear error when the project URL is missing", async () => {
    const { createSupabaseServerClient } = await import("@/lib/supabase/server");
    delete process.env.NEXT_PUBLIC_SUPABASE_URL;
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = "test-anon-key";
    await expect(createSupabaseServerClient()).rejects.toThrow(/NEXT_PUBLIC_SUPABASE_URL/);
  });

  it("throws a clear error when the anon key is missing", async () => {
    const { createSupabaseServerClient } = await import("@/lib/supabase/server");
    process.env.NEXT_PUBLIC_SUPABASE_URL = "http://127.0.0.1:54321";
    delete process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    await expect(createSupabaseServerClient()).rejects.toThrow(/NEXT_PUBLIC_SUPABASE_ANON_KEY/);
  });

  it("never reads a service-role variable", async () => {
    const { createSupabaseServerClient } = await import("@/lib/supabase/server");
    process.env.NEXT_PUBLIC_SUPABASE_URL = "http://127.0.0.1:54321";
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = "test-anon-key";
    process.env.SUPABASE_SERVICE_ROLE_KEY = "must-not-be-read";
    const client = await createSupabaseServerClient();
    expect(client).toBeDefined();
    delete process.env.SUPABASE_SERVICE_ROLE_KEY;
  });
});
