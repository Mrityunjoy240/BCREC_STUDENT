# Information Architecture and Route Map

**Status:** Draft · 2026-10-10

## 1. Navigation principles

- The student should reach the next action from the dashboard quickly.
- Keep the primary navigation stable; avoid duplicating the same workflow in multiple sections.
- Separate **official records**, **personal planning**, and **AI suggestions** through labels and data provenance.
- Provide a global search/command entry only when results can be permission-filtered and source-labelled.
- On smaller screens, preserve the same information hierarchy with a compact sidebar/drawer or mobile nav; the future native app may simplify workflows further.

## 2. Proposed top-level authenticated navigation

1. **Home** — today's snapshot and next actions.
2. **Learn** — AI Learning Studio, notebooks/materials, chat history, quizzes/flashcards, saved study artifacts.
3. **My Academics** — attendance, assessments/marks, assignments, results, backlog information when verified.
4. **Calendar & Tasks** — timetable, events, personal tasks, reminders.
5. **Notices** — official notices with source and applicability metadata.
6. **Career & Projects** — skills, portfolio, project milestones, internship/placement preparation.
7. **Help & Mentor** — mentor contact, support tickets, college service directory.
8. **Profile & Settings** — account, academic cohort mapping display, accessibility, language and notification preferences.

The MVP may hide incomplete sections behind a labelled “Coming later” or omit them entirely; do not display fake working navigation.

## 3. Proposed route structure

Public/auth:
- `/` — landing/product entry (final public-vs-authenticated behavior to decide)
- `/login`
- `/auth/callback` (if OAuth is used)
- `/privacy` and `/help` as content becomes approved

Student:
- `/app` — command centre
- `/app/learn` — learning home
- `/app/learn/notebooks`
- `/app/learn/notebooks/[notebookId]`
- `/app/learn/chat/[conversationId]`
- `/app/learn/quizzes/[quizId]`
- `/app/academics`
- `/app/academics/attendance`
- `/app/academics/assessments`
- `/app/academics/assignments`
- `/app/academics/results`
- `/app/calendar`
- `/app/tasks`
- `/app/notices`
- `/app/career`
- `/app/projects`
- `/app/help`
- `/app/help/tickets/[ticketId]`
- `/app/profile`
- `/app/settings`

Staff routes are not automatically part of the first student release. If enabled, use explicit route groups and permission checks, for example `/staff/...`; route hiding alone is not security.

## 4. Key page content

### Home
- Greeting and date using the configured campus timezone.
- Up next (only if schedule is verified).
- Prioritized task/deadline list with provenance.
- Academic alerts with source freshness and explanation.
- Shortcuts: continue learning, open timetable, create personal task, ask assistant.

### Learn
- Continue recently used notebook.
- Upload material action with permitted file types/size clearly stated.
- Search/chat with source cards.
- Saved quizzes/flashcards/study plans.
- Explicit distinction between private personal materials and shared/course materials.

### My Academics
- Term selector restricted to known enrolled terms.
- Attendance: attended/conducted counts, percentage, effective policy reference, freshness.
- Assessments: component, score, maximum, status, source date, correction/request path.
- Results/backlog: display only authoritative records and applicable procedure links.

### Calendar & Tasks
- Day/week/month views where appropriate; agenda view for compact screens.
- Separate event categories (official class/exam, college event, personal task, AI suggestion).
- Create/edit/complete personal tasks and manage reminder preferences.

### Notices
- Filters by category, programme/batch/term applicability and date.
- Show publisher, publication/issued date where known, imported date, verification status, source link and original attachment.

### Help & Mentor
- Authorized mentor assignment (if available), contact channel, appointment/request form.
- Ticket list/status with minimal sensitive preview.
- Verified contact details and official form links.

## 5. Main cross-cutting UI states

Every data-driven page needs: loading/skeleton, first-use empty state, filtered-empty state, error/retry, stale data, permission denied, not connected, and success confirmation. A “no data” condition must never be silently represented as zero attendance or zero marks.

## 6. Responsive breakpoints and behavior

The exact pixel tokens are set in the design system and validated with real viewports. At minimum validate narrow mobile (~360 px), larger mobile, tablet, laptop (1366 px), and wide desktop. Avoid horizontal page overflow; tables should become structured cards or allow controlled horizontal scrolling when necessary.

## 7. Search and route authorization

- Search results must be filtered on the server by the current user's permissions.
- Never disclose that a private record exists to unauthorized users.
- Every route with a dynamic ID must re-check access to the underlying resource on the server.
- Deep links opened from notifications must authenticate and authorize again.
