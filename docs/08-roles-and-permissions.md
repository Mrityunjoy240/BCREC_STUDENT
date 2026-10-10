# Roles and Permissions Matrix

**Status:** Proposed least-privilege baseline; institutional role descriptions require confirmation.  
**Date:** 2026-10-10

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

These are product roles, not a claim that each has an identically named or defined current post at BCREC.

## 3. Default access matrix

Legend: **Own** = own records only; **Assigned** = explicitly assigned resource/scope; **Dept** = authorized department scope; **Module** = authorized module scope; **Approve** = separately granted approval permission; **No** = no access by default.

| Resource/action | Student | Faculty | Class coord. | Mentor | HOD | Exam office | Policy approver | System admin |
|---|---|---|---|---|---|---|---|---|
| Own profile/preferences | Own | Own | Own | Own | Own | Own | Own | Own |
| Other user profile | No | Assigned/minimal | Assigned/minimal | Assigned/minimal | Dept/minimal | Module/minimal | Minimal | Identity fields only by need |
| Private notes/uploads/chat | Own | No | No | No | No | No | No | No by default; controlled break-glass only if established |
| Official attendance read | Own | Assigned courses | Authorized class | Assigned mentees, minimal | Dept aggregate/authorized | Module | No | No by default |
| Attendance correction | Request only | Only if explicitly authorized | No by default | No | Escalate/approve only if policy grants | Only if authorized | No | No by default |
| Marks/results read | Own | Assigned courses/components | Authorized overview | Assigned mentees/minimal | Dept scope | Module | No | No by default |
| Marks/result change | No | Only if explicitly authorized | No by default | No | Only via approved workflow | Only if authorized | No | No by default |
| Notice draft/import | No | Assigned course if allowed | Allowed if granted | No by default | Dept if granted | Module | Yes by assignment | Config only |
| Policy rule approval | No | No by default | No | No | Not automatic | Not automatic | Approve | Not automatic |
| Personal tasks | Own | Own | Own | Own | Own | Own | Own | No by default |
| Support ticket | Own | Own tickets | Assigned tickets only | Assigned permitted tickets | Escalation metadata | Module tickets | No | Metadata only by need |
| Mentor sensitive notes | No | No | No | Own assigned notes if policy allows | No by default | No | No | No by default |
| Audit records | Own action receipt only | Limited own action receipt | No broad access | No broad access | Authorized summaries | Authorized module | Policy audit | Operational metadata; restricted |

This matrix is deliberately conservative. Final access must be adjusted to signed-off institutional workflows, privacy review, and the actual scope of each role.

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

Each must prove denial without leaking whether sensitive records exist.

## 7. Break-glass access

If future operations require emergency support access, implement a documented time-bound workflow with reason, explicit approval, alerting, and audit. Do not create silent universal impersonation or unrestricted support-mode access.
