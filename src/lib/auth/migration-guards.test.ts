import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

const migrationPath = path.join(
  process.cwd(),
  "supabase/migrations/20261011120000_initial_identity_and_audit.sql",
);
const sql = readFileSync(migrationPath, "utf8");

/**
 * Static guards on the committed migration. These do not replace live RLS
 * integration tests (see rls.integration.test.ts) but catch accidental
 * regressions in reviewable SQL when a local database is unavailable.
 */
describe("initial identity migration static guards", () => {
  const sensitiveTables = [
    "profiles",
    "departments",
    "programmes",
    "cohorts",
    "role_assignments",
    "student_records",
    "staff_records",
    "student_enrolments",
    "audit_events",
  ];

  it("defines all P2.0 tables", () => {
    for (const table of sensitiveTables) {
      expect(sql, `missing table ${table}`).toMatch(
        new RegExp(`create table public\\.${table}\\b`),
      );
    }
  });

  it("enables RLS on every sensitive table", () => {
    for (const table of sensitiveTables) {
      expect(sql, `missing RLS for ${table}`).toMatch(
        new RegExp(`alter table public\\.${table} enable row level security`),
      );
    }
  });

  it("defines the canonical 10-role enum", () => {
    for (const role of [
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
    ]) {
      expect(sql).toContain(`'${role}'`);
    }
  });

  it("has no client INSERT/UPDATE/DELETE policy on role_assignments or audit_events", () => {
    const policyBlock = sql
      .split(/create policy /i)
      .slice(1)
      .map((chunk) => chunk.split(";")[0] ?? "");
    for (const policy of policyBlock) {
      if (/on public\.(role_assignments|audit_events)\b/i.test(policy)) {
        expect(policy).toMatch(/\bfor select\b/i);
      }
    }
  });

  it("enforces institution-scope null rule and duplicate prevention", () => {
    expect(sql).toMatch(/institution_scope_null/);
    expect(sql).toMatch(/nulls not distinct/i);
    expect(sql).toMatch(/valid_period/);
  });

  it("provisions profiles without copying metadata into roles", () => {
    expect(sql).toMatch(/handle_new_user/);
    expect(sql).toMatch(/security definer/);
    expect(sql).toMatch(/set search_path = ''/);
    // Trigger inserts only into profiles, never role_assignments.
    const triggerFn =
      sql.split("create or replace function public.handle_new_user")[1]?.split("$$;")[0] ?? "";
    expect(triggerFn).not.toMatch(/role_assignments/);
  });

  it("does not create academic-record tables in this phase", () => {
    for (const forbidden of [
      "attendance_records",
      "assessment_results",
      "result_records",
      "notices",
      "tasks",
    ]) {
      expect(sql, `unexpected table ${forbidden}`).not.toMatch(
        new RegExp(`create table public\\.${forbidden}\\b`),
      );
    }
  });

  it("revokes default anon access and grants least privilege", () => {
    expect(sql).toMatch(/revoke all on all tables in schema public from anon/i);
    expect(sql).toMatch(/revoke all on all tables in schema public from authenticated/i);
    expect(sql).toMatch(/grant select on public\.profiles to authenticated/i);
    expect(sql).not.toMatch(
      /grant (insert|update|delete) on public\.(role_assignments|audit_events)/i,
    );
  });
});
