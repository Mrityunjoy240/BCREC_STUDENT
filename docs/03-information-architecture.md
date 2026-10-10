# Information Architecture and Route Map

**Status:** Draft · 2026-10-10 · **Revision:** 0.2 (P0/P1 route separation)

## 1. Navigation principles

- The student should reach the next action from the dashboard quickly.
- Keep the primary navigation stable; avoid duplicating the same workflow in multiple sections.
- Separate **official records**, **personal planning**, and **AI suggestions** through labels and data provenance.
- Provide a global search/command entry only when results can be permission-filtered and source-labelled.
- On smaller screens, preserve the same information hierarchy with a compact sidebar/drawer or mobile nav; the future native app may simplify workflows further.
- **P1 features are not shown as functional navigation in the P0 build.** Either omit them entirely or show a single labelled “Coming later” entry with no dead links (see §2).

## 2. Top-level authenticated navigation

### P0 — active navigation (first usable website demo)

1. **Home** — today's snapshot and next actions.
2. **Learn** — AI Learning Studio, notebooks/materials, chat history, quizzes/flashcards, saved study artifacts.
3. **My Academics** — attendance, assessments/marks, assignments, results overview; P0 content is clearly labelled synthetic demo data with provenance (see `01` P0.6).
4. **Calendar & Tasks** — timetable, events, personal tasks, reminders.
5. **Notices** — notices with source and applicability metadata.
6. **Profile & Settings** — account, academic cohort mapping display, accessibility, language and notification preferences.

### P1 — deferred (not active links in the P0 build)

7. **Help & Mentor** — mentor contact, support tickets, college service directory.
8. **Career & Projects** — skills, portfolio, project milestones, internship/placement preparation.

In the P0 build, items 7–8 are either omitted or represented by a non-link “Coming later” group. Do not render them as clickable navigation that 404s. Staff routes are likewise absent from the P0 student build.

## 3. Route structure

### P0 routes (implemented)

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
- `/app/profile`
- `/app/settings`

Academic routes in P0 render demo data with a persistent demo label; they are read-only.

### P1 routes (reserved — do not implement or link in P0)

- `/app/help`
- `/app/help/tickets/[ticketId]`
- `/app/career`
- `/app/projects`
- Any `/staff/...` routes

Reserved routes must not appear in P0 navigation, sitemaps, or search results. When enabled in P1, use explicit route groups and permission checks; route hiding alone is not security.

## 4. Key page content

### Home
- Greeting and date using the configured campus timezone (`Asia/Kolkata` initially, pending owner approval).
- Up next (only if schedule is verified or clearly labelled demo).
- Prioritized task/deadline list with provenance.
- Academic alerts with source freshness and explanation; P0 alerts are demo/advisory only.
- Shortcuts: continue learning, open timetable, create personal task, ask assistant.

### Learn
- Continue recently used notebook.
- Upload material action with permitted file types/size clearly stated.
- Search/chat with source cards.
- Saved quizzes/flashcards/study plans.
- Explicit distinction between private personal materials and shared/course materials.

### My Academics
- Term selector restricted to known enrolled terms (synthetic terms in P0).
- Attendance: attended/conducted counts, percentage, effective policy reference (hypothetical in P0), freshness, demo label.
- Assessments: component, score, maximum, status, source date. P0 offers contact-the-office guidance only; submitting an in-product support ticket or correction request is a **P1 feature** (tickets ship with Help & Mentor).
- Results/backlog: display only authoritative records when connected; otherwise explicit unavailable state; P0 shows demo rows with provenance.

### Calendar & Tasks
- Day/week/month views where appropriate; agenda view for compact screens.
- Separate event categories (official class/exam, college event, personal task, AI suggestion).
- Create/edit/complete personal tasks and manage reminder preferences.

### Notices
- Filters by category, programme/batch/term applicability and date.
- Show publisher, publication/issued date where known, imported date, the four provenance fields, source link and original attachment.
- P0 summaries use only verified reference material from `13-research-and-source-register.md`, labelled with source and review state.

### Help & Mentor (P1)
- Authorized mentor assignment (if available), contact channel, appointment/request form.
- Ticket list/status with minimal sensitive preview.
- Verified contact details and official form links.
- Until P1 ships, a support/contact fallback may appear on Profile/Help content pages without ticket infrastructure.

## 5. Main cross-cutting UI states

Every data-driven page needs: loading/skeleton, first-use empty state, filtered-empty state, error/retry, stale data, permission denied, not connected, demo-data label, and success confirmation. A “no data” condition must never be silently represented as zero attendance or zero marks. State specifications are defined in `04-design-system.md` §4.

## 6. Responsive breakpoints and behavior

Breakpoints and layout widths are defined in `04-design-system.md` §2.5 (`sm` 360, `md` 768, `lg` 1024, `xl` 1280; max content width 1200px). Validate narrow mobile (360 px), tablet, laptop (1366 px), and wide desktop. Avoid horizontal page overflow; tables should become structured cards or allow controlled horizontal scrolling when necessary.

## 7. Search and route authorization

- Search results must be filtered on the server by the current user's permissions.
- Never disclose that a private record exists to unauthorized users.
- Every route with a dynamic ID must re-check access to the underlying resource on the server.
- Deep links opened from notifications must authenticate and authorize again.
