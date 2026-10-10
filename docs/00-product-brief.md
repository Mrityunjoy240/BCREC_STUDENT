# Product Brief — BCREC Student Life Platform

**Status:** Draft for owner review  
**Version:** 0.2  
**Date:** 2026-10-10  
**Product sequence:** Student Website first; essential Student Mobile App later

## 1. One-sentence vision

Help BCREC students understand what matters next in college, learn effectively from their own material, and resolve academic/administrative problems before those problems become crises—using reliable data, clear workflows, and a bounded AI assistant.

## 2. Problem statement

College information and student tasks are spread across notices, routines, portals, faculty communication, notebooks, and personal reminders. Students may not know where to find the current authoritative answer, which deadlines apply to their batch, how their academic position is changing, or whom to contact when a task fails. Learning tools often remain separate from attendance, deadlines, mentorship, and student support.

The product should reduce this fragmentation without pretending to replace official college systems or institutional decision-makers.

## 3. Target users

### Primary
- Current BCREC students across programmes and admission batches, including students under different applicable academic regulations.
- Students using study materials, revision tools, quizzes, and AI explanations.
- Students who need help tracking tasks, routine changes, deadlines, attendance, assessment progress, examination processes, and support requests.

### Secondary users (eventual role-aware workflows)
- Subject faculty and lab instructors.
- Class teachers/coordinators.
- Faculty mentors and assigned student-support personnel.
- HODs and authorized academic administrators.
- Examination/academic office staff.
- Placement/career staff and authorized student-services teams.

The exact authority and duties of each role must be confirmed with current BCREC policy/orders before production use.

## 4. Jobs to be done

1. **Know my next action:** “What do I need to do today, and what deadline is nearest?”
2. **Stay academically informed:** “What are my current attendance and assessment records, and what is their source/date?”
3. **Learn from my materials:** “Explain this concept from my notes, quiz me, and help me revise.”
4. **Avoid surprises:** “Warn me early about missing work or possible attendance/assessment risk.”
5. **Complete college workflows:** “Tell me the verified procedure and help me reach the correct office or submit a supported request.”
6. **Plan my growth:** “Connect projects, skills, activities, internships, and career goals to practical next steps.”

## 5. Product principles

- **Accuracy before automation:** Never invent official information or conceal uncertainty.
- **Proactive, not noisy:** Prioritize actionable and time-sensitive items; let students manage reminder preferences.
- **Human authority preserved:** AI may explain, recommend, and prepare actions; formal decisions remain with authorized processes.
- **Accessible by default:** Responsive, keyboard accessible, readable, low-friction, and usable on modest hardware/network connections.
- **One source of truth:** Website and future app share identity, domain logic, and authoritative data sources.
- **Explainable risk:** Show the underlying dates/counts/rules and distinguish verified data from inference.
- **Small, testable delivery:** Build vertical slices and prove them before expanding scope.
- **Privacy and dignity:** A risk indicator is a prompt for support, not a label or punishment.

## 6. Product boundaries

### In scope for the website direction
- Student home/command centre.
- AI learning studio retaining the planned NotebookLM-style experience.
- Calendar, timetable, tasks, notices, reminders.
- Academic progress view: attendance, assessments, assignments, practicals, results when authoritative data is available.
- Exam/process deadline tracking and backlog support workflows.
- Mentor/support request tracking.
- Student services information and career/skill development.
- Bounded Generative UI components in the assistant conversation.
- Role-aware staff workflows as needed to create/verify the data students see.

Release sequencing within this direction (P0 demo → P1 → future) is defined in `docs/01-prd-and-mvp-scope.md`; items above may ship after the first demo.

### Not assumed in the initial release
- Direct integration with BCREC ERP, EMS, MAKAUT portals, attendance devices, fee gateway, or placement software.
- Automated official eligibility/promotion decisions.
- Autonomous changes to marks, attendance, results, fee status, or institutional policy.
- Full exam-cell or placement-cell management suite.
- Social feed, public leaderboard, biometric attendance, surveillance, or high-stakes student scoring.
- A separate mobile app before the website's core workflows and APIs are stable.

## 7. Differentiators

1. College-life dashboard that turns verified context into an ordered next-action list.
2. Learning chat grounded in student-provided material, with source references where possible.
3. Generative UI that renders useful interactive components rather than only text.
4. Early support workflows for attendance, assessment, and missed deadlines.
5. Source/version-aware academic rules that do not treat every batch as identical.
6. One consistent backend supporting website now and mobile app later.

## 8. Outcome measures (initial hypotheses)

The following are proposed measures, not promised outcomes. Establish baselines in pilot testing before setting targets.

- Percentage of critical notices with source, applicability, published date, and last-verified date.
- Task/deadline reminder delivery and click-through rates.
- Percentage of students who can find today's timetable and next deadline in a usability test without help.
- Time to complete core tasks (find attendance, ask a notes-grounded question, create a study plan, raise a support request).
- AI answer quality: source correctness, unsupported-claim rate, tool error rate, and user-rated helpfulness.
- Reliability: uptime, API error rates, p95 latency for key user journeys, and failed-notification rate.
- Security/quality: denied cross-user access tests, escaped production secrets, and release-blocking regressions (target zero known critical issues).

## 9. Constraints and assumptions

- The public repository is intended to start as a clean codebase; this does not mean all old EduGen AI features must be discarded. Reuse concepts and port code only after review.
- Current college systems may lack authorized APIs. Start with verified notices and controlled sample data when necessary.
- Academic regulations differ by programme, admission batch, and regulation version. Store applicability and effective dates.
- Some student support information may be sensitive. Collect the minimum needed and enforce strict access rules.
- A small student team should keep operational complexity low and avoid microservices until there is a demonstrated need.

## 10. Decisions required from the owner

Proposed defaults are recorded in `01-prd-and-mvp-scope.md` §1.1; they are **pending approval**, not authorizations:

- Which programme and admission batches are included in the pilot? *(proposed: synthetic cohort only for the first demo)*
- Which staff member(s) can authorize policy documents and correction of academic records? *(unresolved; writes stay deferred — `08` §8)*
- Which official data sources/API credentials, if any, are actually available? *(none assumed)*
- Is the initial pilot demonstration-only, a closed college pilot, or institution-approved production? *(proposed: local development/demo with labelled synthetic data first)*
- Which languages are required at launch (English only, or English + Bengali/Hindi)? *(proposed: English UI first; AI layer designed for EN/BN/HI pending evaluation)*
- Which notification channel is allowed and operational (in-app, email, web push, later mobile push)? *(in-app first; others pending)*

## 11. Review gate

Approve this brief before coding. Changes to target users, MVP scope, data authority, or AI permission boundary require a recorded decision.
