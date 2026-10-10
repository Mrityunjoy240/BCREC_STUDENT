# User Journeys and Critical Flows

**Status:** Draft · 2026-10-10 · **Revision:** 0.2 (P0/P1 journey mapping)

Journeys describe intended behavior, not an assertion that BCREC currently provides every integration. “Official data” means authorized and verified data with provenance; otherwise the UI must clearly label the data as unavailable, unverified, or synthetic. Each journey is tagged **P0** (first usable demo) or **P1** (after the demo, per `01-prd-and-mvp-scope.md` §4).

## Journey 1 — First login and orientation · P0

**Goal:** Student can orient themselves without manually repeating profile details or seeing another user's data.

1. Student opens the website.
2. If unauthenticated, route to sign-in and explain available sign-in options.
3. Server validates the session.
4. Load only the authenticated user's profile and approved academic cohort mapping.
5. If cohort mapping is missing, ask the student to request correction or show a setup state; do not let the student grant themselves an official role/batch.
6. Show a short orientation: dashboard, learning workspace, calendar/tasks, academic data, notices, and a static help/contact page (ticket workflows are P1).
7. Ask for notification preferences only where the channel exists and consent/permission is needed.

**Failure cases:** expired session, disabled account, duplicate profile, missing role assignment, database unavailable. Provide retry/support paths; do not expose identifiers or stack traces.

**Acceptance:** Student A cannot edit URL/request values to access Student B's data or privileged routes.

## Journey 2 — Daily command centre · P0

**Goal:** Student can identify the next meaningful action quickly.

1. Load today's schedule, personal tasks, verified notices, upcoming deadlines, and authorized academic alerts in parallel where practical.
2. Label each item by source type (official, teacher-created, personal, AI-suggested) and timestamp.
3. Rank tasks using transparent factors such as due date, urgency, and user-defined priority. Do not infer disciplinary or academic outcomes.
4. Student opens a task, follows its source, completes it, snoozes a reminder, or asks the AI for help.
5. Update the task state and refresh the dashboard.

**Failure cases:** no events, stale schedule, time-zone mismatch, missing source URL, repeated task action, notification delivery failure.

**Acceptance:** Empty data does not become fake “today's classes”; a completed task remains completed after refresh; official and personal events are visually distinguishable.

## Journey 3 — AI learning from personal material · P0

**Goal:** Student gets useful help grounded in their own notes and can save the result.

1. Student opens a notebook or uploads a supported file.
2. Validate ownership, file type, file size, and processing policy.
3. Show processing state; record a safe source/document reference.
4. Extract text and create chunks/embeddings in the approved backend workflow.
5. Student asks a question. Server retrieves only materials the student is permitted to access and sends the minimum necessary context to the approved provider.
6. Assistant answers, identifies source excerpts when available, and indicates when it is using general knowledge or cannot find support.
7. Student may request quiz, flashcards, explanation, or a study plan.
8. Render an allowlisted GenUI component from validated structured data. Allow editing before saving a plan or task.

**Failure cases:** scanned/unreadable PDF, no relevant chunks, vector search failure, provider timeout, prompt injection in document, invalid component payload, user deletes a source.

**Acceptance:** Uploaded document instructions cannot override system policy; a different student cannot retrieve the document; invalid tool output falls back safely; user can see the source of a grounded answer.

## Journey 4 — Attendance concern and support

**Priority:** P0 demo portion (hypothetical arithmetic on labelled synthetic data); P1 for official-source advisory and what-if calculator.

**Goal:** Student is informed early without the product impersonating an examination authority.

1. In P0, attendance comes only from clearly labelled synthetic demo data (`dataOrigin = synthetic_demo`) and is shown as hypothetical arithmetic with numerator/denominator; in P1, load attendance only from an authorized current source and retain `observed_at` and `source_id`.
2. Resolve the applicable policy version only when an approved policy exists for the cohort; in P0 no official policy is assumed, and no eligibility statement is produced.
3. Compute a clearly labelled value. Include numerator/denominator and explain the policy version/date where a real approved policy applies (P1).
4. In P1 only: if a configured advisory threshold is crossed, show an early alert. The `AttendanceWhatIfCalculator` GenUI component is deferred until after permission/security review (`04` §GenUI registry, `09` §3).
5. Offer supported next actions: check records, contact the responsible teacher/office, raise a support request, or view the official policy.
6. If the student disputes a real record (P1), create a correction request through the support workflow; do not edit official attendance directly. Write endpoints stay deferred until a correction owner is confirmed (`08` §8).
7. Authorized staff review and resolve (P1); retain an audit trail.

**Failure cases:** policy not approved, attendance feed stale, no classes conducted, inconsistent totals, student belongs to a different regulation cohort.

**Acceptance:** Unknown policy or stale official data suppresses definitive eligibility statements. Risk is labelled “advisory.” P0 never presents synthetic attendance as official.

## Journey 5 — Assignment / task tracking · P0 (personal tasks); P1 (official assignment feeds)

1. Student receives a task from an authoritative notice/teacher assignment or creates a personal task.
2. Show subject, description, source/owner, due date, submission mechanism, and status if known.
3. Student creates a personal plan or asks the AI to split work into steps.
4. AI-generated steps are suggestions, not official new assignments.
5. Student marks the task complete or follows the external official submission process.
6. Show a submission receipt only if the actual submission service confirms it.

**Acceptance:** Marking a personal reminder complete cannot falsely mark an institutional LMS submission as received.

## Journey 6 — Examination and result workflow · P1

Requires authorized official sources and reviewer workflows; P0 shows only the source-labelled reference notices from `13-research-and-source-register.md` with applicability flags, not live exam/result records.

1. Verified source notice is imported or published by an authorized reviewer.
2. Record applicability: programme, batch, term, regular/backlog category, source URL/file, effective dates and verification status.
3. Student sees deadline/routine/form information relevant to the known cohort. If applicability is unknown, show the notice but flag “confirm applicability.”
4. For a result, show only authorized result data and its publication/source date.
5. For a marks concern, show the applicable review/PPR procedure if verified; create a reminder or support request.
6. For a backlog, show the relevant process and deadlines only if a current applicable source exists.

**Failure cases:** changed notice, contradictory sources, duplicate notice, missing applicability, stale cached result.

**Acceptance:** A rule or notice for one batch cannot silently be applied to another; AI cannot approve eligibility or modify marks.

## Journey 7 — Mentor contact and support ticket · P1

Ticket and mentor features are deferred to P1 (`01` §4, `03` §2–3); they are not linked from P0 navigation.

1. Student sees the assigned mentor only if assignment data is approved and current.
2. Student selects a reason and shares only necessary details.
3. The ticket receives an ID, status, timestamps, and authorized assignee.
4. Notifications reveal minimal content; sensitive details are not pushed to lock-screen messages.
5. Assigned staff sees only permitted tickets. Sensitive counselling or grievance workflows use separate restricted permissions when necessary.
6. Staff logs actions and resolves/reopens according to configured policy.

**Acceptance:** An unrelated faculty member cannot read a ticket by guessing its ID; audit logs avoid copying sensitive body text.

## Journey 8 — AI creates a plan or performs an action · P0 (personal-scope writes only)

1. Student requests a study plan or a supported action.
2. AI may call only tools in its allowlist. Each tool has a schema and narrow purpose.
3. Server validates user identity, scope, data freshness, and permission.
4. Display a preview of a proposed write action with clear effects.
5. Student confirms; server revalidates authorization immediately before writing.
6. Record a safe audit event and return the authoritative result.

**Acceptance:** Prompt injection cannot grant permission; model-generated UI cannot execute code; denied write operations have no side effect.

## Journey 9 — Mobile hand-off · Future (P2)

The mobile app consumes the same authenticated APIs and data contracts. A push notification opens the correct route after re-checking authentication and authorization. Do not put private marks, grievance details, or sensitive mentor notes in push payloads.

## Journey 10 — Platform incident or source outage · P0

1. Detect the failure and mark affected data unavailable/stale.
2. Keep non-dependent features usable where safe.
3. Do not fall back to synthetic demo data in a production student session. Synthetic rows (`dataOrigin = synthetic_demo`) are permitted only in explicitly labelled demo environments (`01` §1.1, `12` §7).
4. Show a brief message, last successful update time, and a safe retry/help path.
5. Follow `docs/runbooks/incident-recovery.md`; record impact and resolve the root cause.
