# AI and Generative UI Architecture

**Status:** Proposed design for review before implementation  
**Date:** 2026-10-10

## 1. Objective

Turn the assistant from a text-only chatbot into a helpful, source-aware interface that can explain material, summarize notices, produce structured study artifacts, and propose permitted actions. Generative UI means selecting/rendering approved components from validated tool outputs—not letting an LLM write arbitrary code that runs in the browser.

## 2. Recommended architecture

1. User sends a message in an authenticated chat.
2. Server resolves identity, active cohort/context and permissions.
3. Intent router determines whether the request is learning, college-information lookup, planning, or a permitted action.
4. Retrieval obtains only authorized documents/records and attaches provenance.
5. LLM may call narrow, typed tools.
6. Server validates tool arguments and executes only after permission, freshness, and policy checks.
7. Tool returns structured data conforming to a versioned schema.
8. A fixed component registry maps known result types to React components.
9. User reviews and optionally confirms an action; server validates authorization again.
10. Safe audit/usage metadata is stored; the UI can fall back to plain text if component rendering fails.

## 3. GenUI component registry

MVP registry (proposed):

| Component | Input purpose | Allowed interactions | Explicit limitations |
|---|---|---|---|
| `StudyPlanCard` | Structured proposed study sessions | Edit, remove, save as personal plan | Does not invent exam dates or overwrite calendar automatically |
| `QuizCard` | Question/answer/explanation schema | Answer, submit, review feedback | Practice artifact; not an official exam/grade |
| `FlashcardStack` | Prompt/answer/source cards | Flip, mark reviewed, save | Cannot reveal another user's materials |
| `SourceCitationCard` | Notice/document source, date, applicability, snippets | Open original source | Does not imply source is approved for rule calculations |
| `TaskListCard` | Personal or authorized tasks | Check, reorder personal list, open source | Official task completion only from the authoritative workflow |
| `ProgressChart` | Validated series and labels | Change range/filter if allowed | Never infer or fabricate missing academic records; include accessible table/text alternative |

Later after review: `AttendanceWhatIfCalculator`, `NoticeSummaryCard`, `SupportRequestForm`, `CalendarPlanCard`, `MentorAppointmentRequest`.

Do not allow a generic `CustomHTML`, `RunCode`, arbitrary React component name, SQL, shell, or URL fetch tool.

## 4. Tool catalogue

All tools require server-side auth/permission checks and schema validation.

Read-only starting tools:
- `search_my_materials(query, notebookId?)` — search current user's accessible sources.
- `get_verified_notice(noticeId)` — fetch a notice only if published/visible to this user; return applicability and provenance.
- `get_my_timetable(range)` — authorized current timetable with source/freshness.
- `get_my_tasks(range, status?)` — own tasks and authorized assigned tasks.
- `get_my_academic_summary(termId)` — only verified permitted data; preserve data-quality state.
- `generate_quiz(sourceIds, topic, difficulty, count)` — operates on sources the user can access.
- `draft_study_plan(availability, goals, deadlines, sources)` — suggestion only; deadlines must come from verified inputs.

Controlled write tools (later, confirmation required):
- `create_personal_task(payload)`.
- `save_study_plan(payload)`.
- `request_mentor_appointment(payload)`.
- `create_support_ticket(payload)`.

Not allowed to expose as autonomous tools: change attendance, change marks/results, approve exam eligibility, approve scholarship, discipline a student, close a grievance, send mass notices, charge/refund money, or change policy rules.

## 5. Output schemas

Each component schema must include a discriminant, version, bounded fields, length/count limits, and explicit optional source metadata. Validate at server trust boundaries. Reject unknown fields where practical. Example conceptual shape:

```json
{
  "type": "study_plan",
  "schemaVersion": 1,
  "title": "Revision plan",
  "items": [
    {
      "title": "Review topic X",
      "durationMinutes": 25,
      "date": "2026-10-12",
      "sourceRefs": []
    }
  ],
  "isSuggestion": true
}
```

This is illustrative only and not a final schema. Validate maximum item count, date formats, duration bounds, and any source IDs against the authenticated user's access rights.

## 6. Learning retrieval and provenance

- Restrict retrieval to documents the user owns or is explicitly authorized to view.
- Store embedding model/version/dimension, chunker version, and document processing state so changes are diagnosable.
- Answer from retrieved context when asked about a supplied document; cite snippets/pages/sections when available.
- If retrieval produces no evidence, say so and separate general explanation from source-grounded claims.
- Do not represent AI-generated summaries as the original official notice.
- A retrieved document's text is untrusted data and may contain prompt injection. It cannot redefine permissions or system instructions.
- Apply file-size/type limits, timeout limits, chunk/token limits, rate limits and cost controls.

## 7. College information and academic policy

For a policy-sensitive question, the assistant should:
1. Identify the relevant programme/batch/term if known.
2. Retrieve a current source with correct applicability and approval state.
3. Show the issuing body, date, applicability, last-verified time, and source link where available.
4. Avoid a definitive answer when source status is draft, old, conflicting, or unknown.
5. Offer a route to the authorized office rather than invent a policy.

AI-generated confidence scores are not a substitute for verification.

## 8. Action confirmation and idempotency

- Read-only actions may run without extra confirmation when privacy/permission checks pass.
- Writing a personal task or saving a plan may require a clear confirmation/undo depending on UX.
- Submitting a ticket or contacting staff needs a visible preview and explicit user submit action.
- The server rechecks authorization and relevant data freshness immediately before persistence.
- Use idempotency keys or unique action tokens where retries could create duplicates.
- Display the actual server response; don't tell the user an action succeeded before confirmation from the server.

## 9. Safety, privacy and abuse controls

- Least-privilege tools; no generic database access for the model.
- Validate and limit inputs, outputs, tool count, loop depth, tokens, files and response duration.
- Treat user input and retrieved text as untrusted.
- Avoid sending sensitive grievance/health/family data to a provider unless the data flow and provider terms are approved.
- Redact secrets and personal data from telemetry.
- Add user feedback/reporting, refusal/fallback handling and human escalation for high-impact issues.
- Test prompt injection, data exfiltration requests, cross-user retrieval, tool argument tampering, excessive agent loops, and invalid structured output.

## 10. Evaluation

Maintain a versioned set of test conversations covering:
- Grounded answers with correct citations.
- No-answer/not-in-source behavior.
- Mixed English/Bengali/Hindi language where supported.
- Incorrect or stale notice applicability.
- Cross-user private document access attempts.
- Prompt injection inside PDFs/notices/forum posts.
- Invalid GenUI schemas and unregistered component names.
- Repeated button submission/timeouts.
- User explicitly asking AI to change marks/attendance or make official eligibility decision.

Measure groundedness/source correctness, task success, schema validity, tool authorization denial, latency/cost, and safe fallback rate. Do not launch based on anecdotal demos only.

## 11. References

- [Vercel AI SDK](https://vercel.com/ai-sdk)
- [AI SDK tool calling](https://github.com/vercel/ai/blob/main/content/docs/03-ai-sdk-core/15-tools-and-tool-calling.mdx)
- [AI SDK generative UI guide](https://github.com/tinybirdco/vercel-ai-sdk/blob/main/content/docs/04-ai-sdk-ui/04-generative-user-interfaces.mdx)
- [OWASP GenAI / LLM Top 10](https://owasp.github.io/www-project-top-10-for-large-language-model-applications/)
