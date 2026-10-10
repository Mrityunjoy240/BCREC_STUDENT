# Product Requirements Document and MVP Scope

**Status:** Draft for owner review  
**Version:** 0.1 · 2026-10-10

## 1. Release strategy

Build and validate a Student Website first using a vertical-slice approach. Deliver a coherent working path rather than many disconnected screens. The mobile app, full administrative suite, and deeper institutional integrations follow only after core website behavior and API boundaries are stable.

Priority labels:
- **P0 — MVP blocking:** required for a credible, safe pilot.
- **P1 — Next:** valuable after the primary workflows are stable.
- **P2 — Future:** explicitly not required for the first release.

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
- Show a student's permitted profile and programme/batch context.
- Handle unauthenticated access, expired sessions, and disabled accounts safely.
- Do not let public registration grant a privileged staff role.
- If the pilot uses test accounts, label and isolate them from real data.

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
- Apply timezone consistently; default campus timezone to Asia/Kolkata unless configuration says otherwise.

**Acceptance:** A task can be created, refreshed, marked complete, and shown consistently in the calendar and dashboard. Duplicate submissions do not duplicate actions.

### P0.4 Learning workspace
- Preserve the product requirement for private study materials/notes, learning chat, summaries, quiz/flashcards, and saved learning artifacts.
- Make clear whether an answer is grounded in a user's uploaded material or general knowledge.
- Provide source references to retrieved material when available.
- Provide graceful handling for unsupported file types, unreadable PDFs, oversized files, provider failures, and empty retrieval.

**Acceptance:** One test document can be uploaded through the approved pipeline, searched by the owning user, and not accessed by another user. Failed processing is visible and recoverable.

### P0.5 GenUI in the assistant
- Use a fixed allowlist of interactive UI components driven by validated structured data.
- MVP components: study-plan card, quiz, flashcards, source card, task list, and progress chart with synthetic/demo data where appropriate.
- Explain errors in plain text if a component cannot render.
- Do not execute model-generated JavaScript/JSX/HTML.

**Acceptance:** Invalid component names/schema values are rejected and safely fall back to text; component actions are permission-checked.

### P0.6 Academic record views — only when source exists
- Provide data models and views for attendance, assessments/marks, assignments, and results in the pilot scope.
- Every record indicates source and last-updated timestamp.
- Mark demonstration data as synthetic.
- Do not imply integration with an official portal until one is authorized and implemented.

**Acceptance:** If authoritative records are absent, show “not connected/not verified”; never derive an official status from blank or simulated data.

### P0.7 Notices and source provenance
- Store a notice with title, body/summary, source URL/document, issued/published date if known, captured date, applicability tags, status, and reviewer/verification state.
- Treat imported notice text and attachments as untrusted data.

**Acceptance:** A student can open the original source for a verified notice; missing date or applicability is visibly marked unknown.

### P0.8 Access control, audit, and error handling
- Every protected server operation uses session-derived identity and a permission check.
- RLS protects user-owned data and is tested.
- Security-sensitive/official write actions generate appropriate audit records.
- No secrets are committed or sent to the client.

**Acceptance:** Tests prove both allowed and denied access paths for student A, student B, and a permitted staff test role.

## 4. P1 — after the MVP's critical workflows pass

- Mentor appointment requests and assigned-mentee follow-up workflow.
- Help-desk/support tickets with assignment, status, and audit trail.
- More complete examination forms/results/backlog information based on approved sources.
- Career roadmaps, internships, portfolio/project tracking.
- In-app notifications and email notifications, as operationally approved.
- Staff tools for reviewing/importing verified notices and permitted academic records.
- Data quality monitoring and administrator dashboards.
- Expanded accessibility and multilingual UX based on pilot feedback.

## 5. P2 — future, not MVP

- Essential native mobile app with push notifications.
- Authorized integrations with institutional ERP/EMS/MAKAUT portals.
- Finance/payment gateway, scholarship application submission, and deep library/hostel integrations.
- Full exam-cell or placement-cell product.
- Broad workflow automation with external system writes.
- Social feed, public leaderboards, attendance device/biometric integrations, predictive academic scoring beyond explainable advisory alerts.

## 6. Non-functional requirements

### Reliability
- All network requests have timeout/error behavior and user-readable recovery guidance.
- Critical data is never silently replaced with demo/stale values.
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
- Use synthetic data in public demo environments.
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
| Approved pilot audience/programme/batch list | Correct policy applicability | Use clearly labelled synthetic cohort only |
| Official academic rules and effective dates | Attendance/exam calculations | Show guidance only; no eligibility determination |
| Authoritative timetable/notice feed | Reliable dashboard reminders | Curated manual records with source/reviewer and freshness label |
| Authorized attendance/marks source | Academic analytics | Do not show simulated values as official |
| Authentication/identity mapping | Secure access | Restrict to demo accounts, not real student data |
| Approved AI provider and data policy | AI chat/upload | Use non-sensitive synthetic materials in development |

## 9. MVP release gate

Do not pilot with real student data until identity and role checks, RLS policies, source/provenance, backup/recovery, privacy notice, error states, and the critical test suite have been reviewed. The owner must approve remaining assumptions and release scope.
