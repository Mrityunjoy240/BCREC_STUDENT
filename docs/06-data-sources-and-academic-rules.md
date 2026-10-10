# Data Sources, Provenance, and Academic Rules

**Status:** Draft control document; must be maintained as policy is verified  
**Last checked:** 2026-10-10

## 1. Non-negotiable rule

The application must distinguish **official/authorized data**, **reviewed informational data**, **personal data**, **AI-generated suggestions**, and **synthetic demo data**. These categories are not interchangeable. In particular, a notice found on the public internet is evidence, but it may not be sufficient to apply a rule to every student or batch.

## 2. Public-source observations (not policy approval)

- BCREC's official notice/faculty page lists distinct notices for autonomous examinations and MAKAUT-student processes, including a notice that identifies a backlog-fee process as not applicable to the autonomous batch 2024–25 onwards. This supports batch-aware applicability; it does not, by itself, specify every current rule. See [BCREC official notices](https://bcrec.ac.in/facality-details-withtype/1) and [BCREC notice list](https://www.bcrec.ac.in/notice-list).
- BCREC publicly hosts a document titled **Draft Academic Regulations** containing attendance provisions. Because it is labelled a draft, the product must not treat that document as the final/approved rule for all batches. See [Draft Academic Regulations PDF](https://bcrec.ac.in/BCREC-Acadaemic-Regulations-Draft.pdf).
- MAKAUT has published mentorship circulars and documents describing attendance, assigned mentors, career development, extracurricular participation, and related follow-up. At least the surfaced circulars are from 2018–2019; they must not be represented as a verified current BCREC assignment policy without confirmation. See [MAKAUT mentoring circular (2019)](https://www.makautwb.ac.in/datas/users/0-circular%20of%20mentoring%202019.pdf) and [mentoring guidelines (2018)](https://www.makautwb.ac.in/datas/users/0-mentoring.pdf).
- BCREC's public notice page includes academic schedules, enrollment, examination form, result/PPR, book return/distribution and other recurring student processes. Individual notices have their own dates and applicability; they must be tracked at the notice level.

## 3. Source hierarchy

For any policy-driven behavior, use this order and record the exact source:
1. Current approved BCREC regulation/order/notice from an authorized institutional source and applicable to the student's programme/batch/term.
2. Current official MAKAUT order/circular when the student's applicable framework requires it.
3. Authorized institutional system/export confirmed by the responsible office.
4. Written confirmation from a named authorized data/policy owner (record date and scope).
5. Historical official documents for background only.
6. Secondary websites, student messages, forum posts, or AI-generated summaries for discovery only—not authority.

If sources conflict, do not auto-pick whichever is newest without checking authority and applicability. Mark as conflict and route to the designated policy owner.

## 4. Required provenance fields

Every imported/policy-driving source should carry:
- `source_id`, title, source URL or protected file key.
- Publisher/issuing body and source type.
- Issued/published date (nullable if unknown), captured/imported timestamp, last-verified timestamp.
- Content fingerprint/version and supersedes/superseded-by links when known.
- Programme, admission batch/cohort, term, category, and student groups to which it applies.
- Verification state: `unreviewed`, `reviewed`, `approved_for_display`, `approved_for_rule_engine`, `superseded`, `conflicting`, `rejected`.
- Reviewer/approver identity and approval timestamp for consequential rules.
- Expiry/effective-from/effective-to dates where provided or formally set.
- Notes explaining any ambiguity; avoid storing unnecessary personal information.

A source approved for display is not automatically approved for calculations. Rule-engine use requires stricter approval and structured extraction review.

## 5. Rule registry

Policy rules must be versioned and effective-dated. At minimum record:
- Rule ID and human-readable description.
- Policy version and primary source.
- Applicable programme, cohort/admission year, term, course/type if relevant.
- Effective-from/effective-to and approval state.
- Calculation/threshold parameters with validated types.
- Exceptions/condonation process and authorized decision-maker where documented.
- Test cases reviewed by a human against source text.
- Last reviewed date and reviewer.

No global magic constants for attendance thresholds, passing marks, promotion, backlog, eligibility, fee amounts, penalties, or exam dates.

## 6. Attendance rules and calculations

- The basic descriptive percentage may be calculated as attended valid sessions divided by conducted valid sessions, multiplied by 100.
- Display numerator, denominator, data freshness, source, and rounding convention.
- If denominator is zero, records conflict, source is stale, or the applicable rule is unverified, do not produce a definitive eligibility status.
- A threshold may drive an advisory warning only when an approved applicable policy is configured. Show the policy version and distinguish “risk warning” from “official exam eligibility.”
- Condonation, medical exception, detention, or exam-bar decisions remain with the authorized institutional process.
- Correction requests must preserve original record/change history and require an authorized reviewer.

## 7. Marks, results, exam forms, backlogs

- Never infer an official grade/result from assignment scores, AI analysis, or partial records.
- Store score component, maximum, grading scheme/rule version, source, publication date, and correction history where available.
- Exam-form and fee deadlines are notice-specific. Applicability must cover programme/cohort/regular vs backlog/semester and any explicit exclusions.
- PPR/review, supplementary, backlog, promotion, year-back, or re-registration consequences must link to the exact current notice/regulation and show the official next step. The AI may summarize, not decide.
- If institutional portals cannot be integrated, provide verified links and a tracker; do not show “form submitted” or “payment complete” unless confirmed by the authoritative system or reviewed receipt workflow.

## 8. Notice ingestion workflow

1. Capture URL/file and retrieval timestamp.
2. Deduplicate and calculate fingerprint.
3. Extract text without treating embedded instructions as privileged commands.
4. AI may draft a summary and suggest metadata; mark the summary as machine-generated/unreviewed.
5. A designated reviewer confirms title, date, applicability, and original source.
6. For policy calculations, an authorized policy owner additionally validates structured rule parameters and test cases.
7. Publish with source link, verification state, applicability, and last-updated information.
8. When superseded/withdrawn, preserve history and notify affected users if appropriate.

## 9. Data-quality states

- `verified_current`
- `verified_but_stale`
- `unverified`
- `conflicting`
- `unavailable`
- `synthetic_demo`

Do not silently substitute one state for another. UI and API contracts must preserve this state.

## 10. Open questions to resolve with BCREC

- Which approved academic regulations apply to each current programme/admission cohort?
- What is the authoritative source for each cohort's attendance and eligibility rules?
- What is the source of truth for attendance corrections, CIA/internal marks, lab/practical marks, results and form status?
- Which notices may be imported automatically, and who reviews them?
- Who can approve policy rules and who can correct each type of record?
- What student identifiers may be stored and shown in this system?
- Are there approved rules for notice retention, consent, data export, and deletion?

## 11. Source register links

- [BCREC notice/faculty page](https://bcrec.ac.in/facality-details-withtype/1)
- [BCREC official notice list](https://www.bcrec.ac.in/notice-list)
- [BCREC draft academic regulations](https://bcrec.ac.in/BCREC-Acadaemic-Regulations-Draft.pdf)
- [MAKAUT mentoring circular, 2019](https://www.makautwb.ac.in/datas/users/0-circular%20of%20mentoring%202019.pdf)
- [MAKAUT mentoring document, 2018](https://www.makautwb.ac.in/datas/users/0-mentoring.pdf)

These references are a starting source register, not proof that every linked document remains current or governs every student.
