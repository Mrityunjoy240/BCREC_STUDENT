-- P2.0 initial identity and audit schema
-- Canonical roles: docs/08-roles-and-permissions.md §2 (10-role set).
-- Authorization authority: role_assignments only — never profiles.role, never client input.
-- No attendance/marks/results tables in this phase (docs/08 §8 deferred writes).
-- Provenance fields (dataOrigin/sourceVerification/contentReview/freshnessStatus) apply to
-- institutional academic records added in a later phase; they are not invented on identity tables.

create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------------------
-- Enums
-- ---------------------------------------------------------------------------

create type public.app_role as enum (
  'student',
  'subject_faculty',
  'class_coordinator',
  'faculty_mentor',
  'hod',
  'exam_office',
  'student_services',
  'notice_reviewer',
  'system_admin',
  'auditor'
);

create type public.scope_type as enum (
  'institution',
  'department',
  'course_offering',
  'mentee',
  'module'
);

create type public.account_status as enum (
  'active',
  'disabled'
);

create type public.student_status as enum (
  'active',
  'inactive',
  'graduated',
  'withdrawn'
);

create type public.staff_status as enum (
  'active',
  'inactive'
);

create type public.enrolment_status as enum (
  'active',
  'completed',
  'withdrawn'
);

-- ---------------------------------------------------------------------------
-- Tables
-- ---------------------------------------------------------------------------

create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text not null,
  display_name text,
  status public.account_status not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint email_nonempty check (length(btrim(email)) > 0)
);

comment on table public.profiles is
  'Application profile for an auth user. Not an authorization source.';

create table public.departments (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  name text not null,
  created_at timestamptz not null default now(),
  constraint code_nonempty check (length(btrim(code)) > 0),
  constraint name_nonempty check (length(btrim(name)) > 0)
);

create table public.programmes (
  id uuid primary key default gen_random_uuid(),
  department_id uuid not null references public.departments (id),
  code text not null unique,
  name text not null,
  created_at timestamptz not null default now(),
  constraint code_nonempty check (length(btrim(code)) > 0),
  constraint name_nonempty check (length(btrim(name)) > 0)
);

create table public.cohorts (
  id uuid primary key default gen_random_uuid(),
  programme_id uuid not null references public.programmes (id),
  batch_label text not null,
  regulation_version text,
  created_at timestamptz not null default now(),
  constraint batch_label_nonempty check (length(btrim(batch_label)) > 0),
  constraint regulation_version_null_or_nonempty
    check (regulation_version is null or length(btrim(regulation_version)) > 0)
);

create table public.role_assignments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  role public.app_role not null,
  scope_type public.scope_type not null,
  scope_id uuid,
  valid_from timestamptz not null default now(),
  valid_to timestamptz,
  granted_by uuid references public.profiles (id),
  created_at timestamptz not null default now(),
  -- Institution scope must not carry a scope_id; every other scope must.
  constraint institution_scope_null
    check (
      (scope_type = 'institution' and scope_id is null)
      or (scope_type <> 'institution' and scope_id is not null)
    ),
  constraint valid_period
    check (valid_to is null or valid_to > valid_from)
);

comment on table public.role_assignments is
  'Scoped, time-bounded role grants. Sole authorization authority for application roles.';

-- Prevent duplicates including rows whose scope_id is NULL (Postgres 15+ NULLS NOT DISTINCT).
create unique index role_assignments_unique_assignment
  on public.role_assignments (user_id, role, scope_type, scope_id)
  nulls not distinct;

create index role_assignments_user_active_idx
  on public.role_assignments (user_id)
  where valid_to is null or valid_to > now();

create table public.student_records (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references public.profiles (id) on delete cascade,
  roll_number text not null unique,
  programme_id uuid not null references public.programmes (id),
  cohort_id uuid not null references public.cohorts (id),
  status public.student_status not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint roll_number_nonempty check (length(btrim(roll_number)) > 0)
);

create index student_records_cohort_idx on public.student_records (cohort_id);
create index student_records_programme_idx on public.student_records (programme_id);

create table public.staff_records (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references public.profiles (id) on delete cascade,
  staff_code text not null unique,
  department_id uuid not null references public.departments (id),
  title text,
  status public.staff_status not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint staff_code_nonempty check (length(btrim(staff_code)) > 0),
  constraint title_null_or_nonempty check (title is null or length(btrim(title)) > 0)
);

create index staff_records_department_idx on public.staff_records (department_id);

create table public.student_enrolments (
  id uuid primary key default gen_random_uuid(),
  student_record_id uuid not null references public.student_records (id) on delete cascade,
  programme_id uuid not null references public.programmes (id),
  cohort_id uuid not null references public.cohorts (id),
  status public.enrolment_status not null default 'active',
  effective_from timestamptz not null default now(),
  effective_to timestamptz,
  created_at timestamptz not null default now(),
  constraint enrolment_period
    check (effective_to is null or effective_to > effective_from)
);

create index student_enrolments_record_idx on public.student_enrolments (student_record_id);
create index student_enrolments_cohort_idx on public.student_enrolments (cohort_id);

create table public.audit_events (
  id uuid primary key default gen_random_uuid(),
  actor_user_id uuid references public.profiles (id),
  action text not null,
  resource_type text not null,
  resource_id uuid,
  result text not null,
  correlation_id text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  constraint action_nonempty check (length(btrim(action)) > 0),
  constraint resource_type_nonempty check (length(btrim(resource_type)) > 0),
  constraint result_nonempty check (length(btrim(result)) > 0),
  constraint metadata_is_object check (jsonb_typeof(metadata) = 'object')
);

comment on table public.audit_events is
  'System-generated audit trail. No client role writes these rows; server paths only.';

create index audit_events_actor_idx on public.audit_events (actor_user_id, created_at desc);
create index audit_events_resource_idx on public.audit_events (resource_type, resource_id);
create index audit_events_created_idx on public.audit_events (created_at desc);

-- ---------------------------------------------------------------------------
-- Auth profile provisioning trigger
-- Restricted search_path, fully qualified references, no role grants, no metadata copy
-- into authorization. Disabled public signup is enforced in supabase/config.toml.
-- ---------------------------------------------------------------------------

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, email, status)
  values (
    new.id,
    coalesce(new.email, ''),
    'active'
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ---------------------------------------------------------------------------
-- updated_at maintenance (profiles / student_records / staff_records)
-- ---------------------------------------------------------------------------

create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

create trigger profiles_set_updated_at
  before update on public.profiles
  for each row execute function public.set_updated_at();

create trigger student_records_set_updated_at
  before update on public.student_records
  for each row execute function public.set_updated_at();

create trigger staff_records_set_updated_at
  before update on public.staff_records
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- Row Level Security
-- Design goals (P2.0):
--  * anon: no protected application data
--  * authenticated: own profile / own role assignments / own student or staff record only
--  * no broader staff/HOD access until scope-based policies are implemented and tested
--  * no client writes to role_assignments or audit_events
--  * privileged writes go through server-side service_role paths (RLS-bypassing) only,
--    after explicit application authorization (docs/07 §3 request flow)
-- ---------------------------------------------------------------------------

alter table public.profiles enable row level security;
alter table public.departments enable row level security;
alter table public.programmes enable row level security;
alter table public.cohorts enable row level security;
alter table public.role_assignments enable row level security;
alter table public.student_records enable row level security;
alter table public.staff_records enable row level security;
alter table public.student_enrolments enable row level security;
alter table public.audit_events enable row level security;

-- profiles: read own; no client insert/update/delete (status and privileged fields
-- are managed only via server-side service_role paths).
create policy profiles_select_own
  on public.profiles for select
  to authenticated
  using ((select auth.uid()) = id);

-- departments / programmes / cohorts: authenticated read (org structure); no client writes.
create policy departments_select_authenticated
  on public.departments for select
  to authenticated
  using (true);

create policy programmes_select_authenticated
  on public.programmes for select
  to authenticated
  using (true);

create policy cohorts_select_authenticated
  on public.cohorts for select
  to authenticated
  using (true);

-- role_assignments: read own only; no client writes of any kind.
create policy role_assignments_select_own
  on public.role_assignments for select
  to authenticated
  using ((select auth.uid()) = user_id);

-- student_records: own row only (user_id match). No staff/HOD read yet.
create policy student_records_select_own
  on public.student_records for select
  to authenticated
  using ((select auth.uid()) = user_id);

-- staff_records: own row only. No cross-staff read yet.
create policy staff_records_select_own
  on public.staff_records for select
  to authenticated
  using ((select auth.uid()) = user_id);

-- student_enrolments: readable only via ownership of the parent student record.
create policy student_enrolments_select_own
  on public.student_enrolments for select
  to authenticated
  using (
    exists (
      select 1
      from public.student_records sr
      where sr.id = student_enrolments.student_record_id
        and sr.user_id = (select auth.uid())
    )
  );

-- audit_events: no client policies — all client access denied by default.
-- Inserts happen only through service_role (bypasses RLS) from trusted server code.

-- ---------------------------------------------------------------------------
-- Explicit table grants
-- RLS alone does not grant privileges. Default Supabase grants are revoked and
-- replaced with least privilege. service_role retains full access (RLS bypass)
-- for trusted server-side paths only.
-- ---------------------------------------------------------------------------

revoke all on all tables in schema public from anon;
revoke all on all tables in schema public from authenticated;

grant select on public.profiles to authenticated;
grant select on public.departments to authenticated;
grant select on public.programmes to authenticated;
grant select on public.cohorts to authenticated;
grant select on public.role_assignments to authenticated;
grant select on public.student_records to authenticated;
grant select on public.staff_records to authenticated;
grant select on public.student_enrolments to authenticated;

-- service_role: full table access (used only by server-side code after authorize()).
grant all on all tables in schema public to service_role;
grant all on all sequences in schema public to service_role;
