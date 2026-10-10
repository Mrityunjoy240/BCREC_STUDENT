# Product Requirements Document and MVP Scope

**Status:** Draft for owner review  
**Version:** 0.2 · 2026-10-10 (MVP boundaries reconciled with routes; pilot/data mode recorded)

## 1. Release strategy

Build and validate a Student Website first using a vertical-slice approach. Deliver a coherent working path rather than many disconnected screens. The mobile app, full administrative suite, and deeper institutional integrations follow only after core website behavior and API boundaries are stable.

Priority labels:
- **P0 — First usable website demo:** required for a credible, safe demo/pilot.
- **P1 — After the first working demo:** valuable once P0 workflows are stable.
- **P2 — Future:** explicitly not required for the first two releases.

### 1.1 Pilot and data mode (proposed default — pending owner approval)

- The initial release targets a **local development/demo environment using clearly labelled synthetic data** (`dataOrigin = synthetic_demo`).
- Do **not** assume BCREC has authorized access to official ERP/EMS or student records. No official integration is implied until verified and authorized.
- Do **not** introduce real student data until access, authorization, privacy review, and source reliability have been verified.
- In **production mode**, missing official data displays an explicit unavailable state. Never silently fall back to synthetic data (see §6 Reliability/Privacy and `12` §7).
- Proposed first UI language: **English**. The AI layer is designed to support English, Bengali and Hindi, subject to model and quality evaluation (**pending approval**).
- Choices above that require owner or institutional approval are marked pending; they are defaults, not authorizations.

## 2. Personas

| Persona | Needs | Main risk if unsupported |
|---|---|---|
| Student | Understand schedule/tasks; study; see verified academic data; get help | Missed deadlines, confusion, late discovery of risks |
| Faculty data contributor | Publish/confirm tasks, material, or assigned-course records where authorized | Incorrect or stale information propagates |
| Class coordinator | View permitted class-level status and communicate relevant updates | Fragmented follow-up |
| Faculty mentor | See assigned mentees and authorized follow-ups | Students with issues are missed or privacy is overexposed |
| HOD/authorized academic lead | Department-scoped oversight and escalation | Unresolved issues have no accountable owner |
| Admin/data steward | Manage accounts, source records, and permissions | Data integrity and access failures |

## 3. P0 — MVP requirements

### P0.1 Identity and onboarding
- Support secure sign-in and sign-out.
- Show a student's permitted profile and programme/batch context (synthetic cohort in demo mode).
- Handle unauthenticated access, expired sessions, and disabled accounts safely.
- Do not let public registration grant a privileged staff role.
- Test/demo accounts are labelled and isolated from any real data.

**Acceptance:** A user can authenticate and see only authorized navigation/data. A student cannot set their own role or programme/batch by editing a request.

### P0.2 Student command centre
- Display the current day/date, next known scheduled activity, upcoming deadlines, unread important notices, pending tasks, and links to learning.
- Each time-sensitive item has a source, last-updated timestamp, and applicable audience when it is official information.
- Empty, stale, failed, and loading states are designed.

**Acceptance:** With no schedule/tasks configured, the dashboard explains that data is not yet available instead of showing invented records. A stale feed is labelled.

### P0.3 Timetable/calendar/tasks
- Present a day/weekly schedule and chronological calendar.
- Keep official events separate from personal tasks and AI suggestions.
- Support task creation, edit, completion, due date, priority, and reminder preference for personal tasks.
- Support confirmed notice/task links where available.
- Apply timezone consistently; default campus timezone to Asia/Kolkata unless configuration says otherwise (**proposed default — pending owner approval**, consistent with `03` §4 and `05` §1).

**Acceptance:** A task can be created, refreshed, marked complete, and shown consistently in the calendar and dashboard. Duplicate submissions do not duplicate actions.

### P0.4 Learning workspace
- Preserve the product requirement for private study materials/notes, learning chat, summaries, quiz/flashcards, and saved learning artifacts.
- Make clear whether an answer is grounded in a user's uploaded material or general knowledge.
- Provide source references to retrieved material when available.
- Provide graceful handling for unsupported file types, unreadable PDFs, oversized files, provider failures, and empty retrieval.

**Acceptance:** One test document can be uploaded through the approved pipeline, searched by the owning user, and not accessed by another user. Failed processing is visible and recoverable.

### P0.5 GenUI in the assistant
- Use a fixed allowlist of interactive UI components driven by validated structured data.
- MVP components: study-plan card, quiz, flashcards, source citation card, task list, and progress chart.
- Progress/academic GenUI components in P0 render only synthetic demo or the user's own learning artifacts, with visible provenance labels.
- Explain errors in plain text if a component cannot render.
- Do not execute model-generated JavaScript/JSX/HTML.

**Acceptance:** Invalid component names/schema values are rejected and safely fall back to text; component actions are permission-checked.

### P0.6 Academic overview screens — synthetic demo data only
- Provide data models and views for attendance, assessments/marks, assignments, and results, driven in P0 by clearly labelled synthetic demo data.
- Every record carries the four canonical provenance fields (`dataOrigin`, `sourceVerification`, `contentReview`, `freshnessStatus` — see `06` §9); synthetic rows show `dataOrigin = synthetic_demo` with a visible demo badge/banner.
- Attendance may show **hypothetical arithmetic** (e.g. attended/conducted for the demo cohort) but must not claim official exam eligibility, detention, or promotion status.
- These views are **read-only** in P0; no attendance/marks write endpoints are exposed (see `08` §8).
- Do not imply integration with an official portal until one is authorized and implemented.

**Acceptance:** If authoritative records are absent (production mode), show “not connected/not verified”; never derive an official status from blank or simulated data; no P0 screen presents synthetic values as official records.

### P0.7 Notices and source provenance
- Store a notice with title, body/summary, source URL/document, issued/published date if known, captured date, applicability tags, status, and the four canonical provenance fields (`06` §9).
- P0 notice summaries use verified reference material from `13-research-and-source-register.md`, labelled with source and review state.
- Treat imported notice text and attachments as untrusted data.

**Acceptance:** A student can open the original source for a verified notice; missing date or applicability is visibly marked unknown.

### P0.8 Access control, audit, and error handling
- Every protected server operation uses session-derived identity and a permission check.
- RLS protects user-owned data and is tested.
- Security-sensitive/official write actions generate appropriate audit records.
- No secrets are committed or sent to the client.

**Acceptance:** Tests prove both allowed and denied access paths for student A, student B, and a permitted staff test role.

## 4. P1 — after the first working demo

- Authorized institutional attendance/marks integrations, when an authorized source actually exists.
- Policy-backed academic-risk and eligibility calculations (only with `approved_for_rule_engine` policy versions; see `06` §9.5).
- Attendance what-if calculator and correction-request workflow, after the correction owner is confirmed (`08` §8).
- Mentor appointment requests and assigned-mentee follow-up workflow.
- Help-desk/support tickets with assignment, status, and audit trail.
- Examination-form, results and backlog workflows that require official data or institutional actions.
- Career roadmaps, internships, portfolio/project tracking and placement-preparation services.
- In-app notifications and email notifications, as operationally approved; push and other integrations requiring additional permissions/infrastructure.
- Staff tools for reviewing/importing verified notices and permitted academic records.
- Data quality monitoring and administrator dashboards.
- Expanded accessibility and multilingual UX based on pilot feedback.

## 5. P2 — future, not the first two releases

- Essential native mobile app with push notifications.
- Broader authorized integrations with institutional ERP/EMS/MAKAUT portals beyond the P1 attendance/marks scope.
- Finance/payment gateway, scholarship application submission, and deep library/hostel integrations.
- Full exam-cell or placement-cell product.
- Broad workflow automation with external system writes.
- Social feed, public leaderboards, attendance device/biometric integrations, predictive academic scoring beyond explainable advisory alerts.

## 6. Non-functional requirements

### Reliability
- All network requests have timeout/error behavior and user-readable recovery guidance.
- Critical data is never silently replaced with demo/stale values.
- Synthetic academic records may be used only in development/test/demo environments and must be clearly labelled. Production sessions must never substitute synthetic attendance, marks, exam dates, results, or eligibility data when authoritative data is missing.
- Database migrations are versioned and tested before shared-environment application.

### Performance
- Establish a baseline before setting numeric SLOs.
- Avoid loading full document collections or heavy AI libraries into the initial route.
- Paginate or incrementally load long lists; provide loading feedback.
- Measure initial render, dashboard data latency, chat first-token latency, and file-processing time in pilot testing.

### Accessibility
- Use semantic HTML, keyboard navigation, visible focus, labels, descriptive errors, and WCAG-informed contrast.
- Do not rely on color alone for risk/status.

### Privacy
- Minimize personal data. Restrict access by ownership and assignment.
- Use synthetic data only in development/test/demo environments, clearly labelled; never mix it into production student sessions (see §6 Reliability and `12` §7).
- Establish retention/deletion rules before production, especially for uploaded materials, prompts, support tickets, and sensitive mentor notes.

### Maintainability
- Centralize academic policy calculations, validation schemas, and permission rules.
- Avoid duplicated business rules across pages and the future app.
- Keep decisions and tests close to the relevant domain module.

## 7. Out of scope / prohibited behavior

- AI makes a final decision on exam eligibility, promotion, scholarship approval, discipline, or grievance disposition.
- Automatic changes to official marks/attendance/results without a verified authorized workflow.
- Treating a draft academic regulation as the approved rule for every batch.
- Executing arbitrary UI code returned by an LLM.
- Publicly exposing student lists, private notes, mentor notes, or grievance content.
- Destructive schema reset/migration in a shared database without explicit approved recovery plan.

## 8. Dependencies and blockers

| Dependency | Needed for | If unavailable |
|---|---|---|
| Approved pilot audience/programme/batch list | Correct policy applicability | Use clearly labelled synthetic cohort only (P0 default) |
| Official academic rules and effective dates | Attendance/exam calculations (P1) | Show guidance/hypothetical arithmetic only; no eligibility determination |
| Authoritative timetable/notice feed | Reliable dashboard reminders | Curated manual records with source/reviewer and freshness label, or clearly labelled demo schedule |
| Authorized attendance/marks source | Official academic analytics (P1) | Synthetic demo views only, visibly labelled; never simulated-as-official |
| Authentication/identity mapping | Secure access | Restrict to demo accounts, not real student data |
| Approved AI provider and data policy | AI chat/upload | Use non-sensitive synthetic materials in development; mock provider in tests |
| Confirmed academic correction owner | Attendance/marks write APIs, rule approval (P1) | Writes stay deferred; ticket-based requests only (`08` §8) |

## 9. MVP release gate

Do not pilot with real student data until identity and role checks, RLS policies, source/provenance, backup/recovery, privacy notice, error states, and the critical test suite have been reviewed. The owner must approve the pilot/data-mode defaults in §1.1, remaining assumptions, and release scope. A P0 demo with synthetic data may proceed on the approved feature branch once ADRs 0001–0004 are accepted.
