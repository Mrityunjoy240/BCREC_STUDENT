# Roles and Permissions Matrix

**Status:** Proposed least-privilege baseline; institutional role descriptions require confirmation.  
**Date:** 2026-10-10 · **Revision:** 0.2 (full role/operation coverage; deferred writes recorded)

## 1. Policy principles

- Authorization is enforced on the server/API and at the database layer where appropriate; UI visibility is only a usability feature.
- Access is granted for a specific resource and scope, not only because a user has a role label.
- A user may hold more than one role, each with explicit scope and validity period.
- “Admin” is not an all-powerful default in application logic; privileged actions must be explicit and audited.
- Access to counselling, health, family, discrimination/harassment, and grievance details is more restrictive than normal academic records.
- No AI tool has more permissions than the current user's authorized capabilities.

## 2. Proposed roles

- **Student:** Own profile, own private learning items, own permitted academic data, personal tasks, notices applicable to the student, own support tickets.
- **Subject faculty:** Assigned course offerings, course content/announcements, permitted marks/attendance entry or review only if officially authorized.
- **Class teacher/coordinator:** Authorized class-level overview and communication; exact BCREC-specific scope needs confirmation.
- **Faculty mentor:** Current assigned mentees and permitted follow-up fields; sensitive notes are restricted separately.
- **HOD:** Authorized department-scoped academic overview and escalation. Cannot bypass record-correction approvals just by being HOD unless policy grants that permission.
- **Examination/academic office:** Exam notices, applicable records and authorized workflow operations according to official responsibility.
- **Student services/placement staff:** Only their module and required student fields.
- **Notice reviewer/policy approver:** Review/import notices; only specially authorized policy approvers can approve rule-engine use.
- **System administrator:** Identity/technical configuration and access management, not automatic access to all sensitive content.
- **Auditor/support operator:** Narrow read-only access to operational metadata where assigned; avoid raw private content.

These are product roles, not a claim that each has an identically named or defined current post at BCREC. These ten roles are the **canonical role set**; do not add roles without recording the decision in this document.

## 3. Default access matrix

Legend: **Own** = own records only; **Assigned** = explicitly assigned resource/scope; **Dept** = authorized department scope; **Module** = authorized module scope; **Approve** = separately granted approval permission; **Deferred** = not exposed until the correction-ownership decision is confirmed (§8); **No** = no access by default.

Role abbreviations: STU student · FAC subject faculty · CLS class coordinator · MNT faculty mentor · HOD · EXM examination/academic office · SVC student services/placement staff · POL notice reviewer/policy approver · ADM system administrator · AUD auditor/support operator.

### 3.1 Read operations

| Resource/action (read) | STU | FAC | CLS | MNT | HOD | EXM | SVC | POL | ADM | AUD |
|---|---|---|---|---|---|---|---|---|---|---|
| Own profile/preferences | Own | Own | Own | Own | Own | Own | Own | Own | Own | Own |
| Other user profile | No | Assigned/minimal | Assigned/minimal | Assigned/minimal | Dept/minimal | Module/minimal | Module/minimal | Minimal | Identity fields only by need | Metadata by need |
| Private notes/uploads/chat | Own | No | No | No | No | No | No | No | No by default; break-glass only if established | No |
| Learning documents (own materials) | Own | Own | Own | Own | No | No | No | No | No by default | No |
| Official attendance read | Own | Assigned courses | Authorized class | Assigned mentees, minimal | Dept aggregate/authorized | Module | No | No | No by default | Operational metadata |
| Marks/results read | Own | Assigned courses/components | Authorized overview | Assigned mentees/minimal | Dept scope | Module | No | No | No by default | Operational metadata |
| Academic overview (dashboard aggregates) | Own aggregates | Assigned courses | Authorized class | Assigned mentees/minimal | Dept aggregates | Module | No | No | No | Aggregate metadata |
| Calendar/timetable read | Own + published events | Assigned courses | Authorized class | Assigned mentees | Dept | Module | No | Published notices | No | No |
| Notices read | Applicable notices | Assigned course | Class-applicable | Assigned mentees | Dept | Module | Module | All | No | No |
| Support ticket read | Own | Own tickets | Assigned tickets only | Assigned permitted tickets | Escalation metadata | Module tickets | Module tickets | No | Metadata only by need | Metadata only |
| Mentor sensitive notes | No | No | No | Own assigned notes if policy allows | No by default | No | No | No | No by default | No |
| Notifications read | Own | Own | Own | Own | Own | Own | Own | Own | Own | Metadata only |
| Audit records | Own action receipt only | Limited own action receipt | No broad access | No broad access | Authorized summaries | Authorized module | No | Policy audit | Operational metadata; restricted | Read-only operational metadata |

### 3.2 Write, approve, and export operations

| Resource/action (write/approve/export) | STU | FAC | CLS | MNT | HOD | EXM | SVC | POL | ADM | AUD |
|---|---|---|---|---|---|---|---|---|---|---|
| Personal task create/update/complete | Own | Own | Own | Own | Own | Own | Own | Own | No by default | No |
| Notice draft/import | No | Assigned course if allowed | Allowed if granted | No by default | Dept if granted | Module | No | Yes by assignment | Config only | No |
| Notice publish (approve for display) | No | No | No | No | Only if granted | Module if granted | No | Approve | No | No |
| Attendance correction write | Request only | Deferred | No | No | Deferred | Deferred | No | No | No | No |
| Marks/result change | No | Deferred | No | No | Deferred | Deferred | No | No | No | No |
| Academic policy rule approval | No | No | No | No | Not automatic | Not automatic | No | Deferred | Not automatic | No |
| Support ticket create | Own | Own | Own | Own | Own | Own | Own | Own | Own | No |
| Support ticket transition/resolve | No | Own tickets if granted | Assigned only | Assigned permitted | Escalation only | Module | Module | No | No | No |
| GenUI/tool write actions (personal task, saved plan) | Own-scoped | Own-scoped | Own-scoped | Own-scoped | Own-scoped | Own-scoped | Own-scoped | Own-scoped | Own-scoped | No |
| Student data export | Own export only | No | No | No | Dept aggregate only if approved | Module only if approved | No | Policy audit export | Restricted operational export | Restricted operational export |
| Role/permission assignment | No | No | No | No | No | No | No | No | Explicit, audited grant only | No |
| Break-glass/content access | No | No | No | No | No | No | No | No | Only via documented break-glass (§7) | No |

Audit events are system-generated; no role creates them by direct write.

This matrix is deliberately conservative. Final access must be adjusted to signed-off institutional workflows, privacy review, and the actual scope of each role. Every cell above must have a matching server-side permission check and a negative authorization test before the corresponding endpoint ships (`10-api-contracts.md`, `11-testing-and-acceptance.md`).

## 4. Scope resolution

Permission checks must resolve:
- Authenticated identity and active account state.
- Assigned role(s) and validity period.
- Resource owner and relationship (enrolled student, assigned course, assigned mentee, department, or module).
- Requested operation (`read`, `create`, `update`, `delete`, `submit`, `approve`, `export`).
- Additional classification/consent requirements for sensitive data.
- Whether the record is current, superseded, or under dispute if action depends on that state.

Never accept `role`, `studentId`, `departmentId`, `mentorId`, or “isAdmin” from the browser as the authority. Resolve from trusted records.

## 5. Sensitive data classification

- **Public:** approved public notices, public handbook contacts.
- **Internal:** ordinary internal timetable/task metadata.
- **Personal:** student profile, personal notes, individual attendance and marks.
- **Restricted:** credentials, support/grievance details, health/family information, sensitive mentor notes, disciplinary records, security/audit internals.

Collect/store only what the product needs. Sensitive workflows need an identified data owner, permitted viewers, retention period, and access/audit plan before implementation.

## 6. Required authorization tests

- Student A requests Student B's attendance, marks, notebook, file, conversation, task, or ticket by changing an ID.
- Student promotes self to teacher/HOD through metadata or request body.
- Former mentor attempts to read a student after assignment expiration.
- Teacher accesses a course they do not teach.
- HOD attempts to read another department's restricted records.
- UI button is hidden but API is called directly.
- Service-role path is invoked without appropriate end-user permission.
- GenUI tool call carries guessed resource ID or forged “confirmed” flag.
- Signed file URL reuse occurs after expiration or after permissions change.
- Direct write attempt to attendance/marks/policy-approval endpoints (deferred, §8) is rejected; no silent partial write occurs.
- Production-mode session requests academic data and receives `synthetic_demo` rows — must be impossible; response must be `unavailable` instead.

Each must prove denial without leaking whether sensitive records exist.

## 7. Break-glass access

If future operations require emergency support access, implement a documented time-bound workflow with reason, explicit approval, alerting, and audit. Do not create silent universal impersonation or unrestricted support-mode access.

## 8. Unresolved decision: academic correction and policy ownership

**Open decision (owner/institutional):** which exact staff role and authorized process owns (a) attendance corrections, (b) marks/result corrections, and (c) approval of policy rules for rule-engine use? This is asked in `05-data-model-and-erd.md` §8 and `06-data-sources-and-academic-rules.md` §10 and is **not answered** by any current source.

**Consequences until confirmed:**

- No production write APIs for attendance correction, marks/result change, or academic policy rule approval may be exposed (cells marked Deferred in §3.2). `10-api-contracts.md` lists them as out of the P0 endpoint set.
- Demo/development academic views are **read-only**; any interactive demo correction flow must be clearly separated from institutional records and labelled synthetic (`dataOrigin = synthetic_demo`).
- Students may eventually submit a support ticket or correction **request** through the normal ticket workflow (**P1**); the request goes to a human, it does not edit official records. Until P1 ships, no in-product correction-request channel exists—P0 provides contact-the-office guidance only.
- Policy calculations remain suppressed or advisory-only for real cohorts until `contentReview = approved_for_rule_engine` is granted by an authorized approver.

This section must be updated (with a recorded decision and source) before any deferred write endpoint is implemented.
