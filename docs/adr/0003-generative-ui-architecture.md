# ADR 0003: Generative UI Architecture

- **Status:** Proposed — owner approval required
- **Date:** 2026-10-10

## Context

The product should retain a NotebookLM-style learning experience and add an AI chat that can return useful interactive study aids and college-life actions. Unrestricted LLM-generated code is unsafe, hard to test, and visually inconsistent.

## Proposed decision

Implement **schema-driven Generative UI through a fixed, allowlisted React component registry**.

- AI may select an approved tool/component and produce structured data.
- Server validates tool inputs, user permissions, data provenance and outputs.
- UI renders approved components such as `StudyPlanCard`, `QuizCard`, `FlashcardStack`, `SourceCitationCard`, `TaskListCard`, and `ProgressChart`.
- Unknown component names and invalid payloads fall back to readable text or an error card.
- Any meaningful write operation previews the effect, obtains user confirmation where required, then rechecks server-side authorization before persistence.
- No arbitrary JSX, executable JS, generated imports, shell, SQL or generic network-fetch tool is allowed.

## Alternatives considered

- Text-only chatbot: safest and simplest but does not fulfil the product's interactive UI differentiator.
- Fully generated HTML/JSX: flexible but creates execution, XSS, authorization and testability risks; rejected.
- Every AI result mapped to one static page: safer but less useful for contextual, in-chat study interactions.

## Consequences

Positive:
- UI stays visually consistent and testable.
- Components are reusable across chat and normal pages.
- Structured payloads support validation and evaluation.
- User can interact with study artifacts without accepting arbitrary code.

Trade-offs:
- The component catalogue must be curated.
- New component types require implementation, schema, tests and documentation.
- Some requests will need a text fallback rather than novel UI.

## Guardrails

- Schema validation at server trust boundaries.
- Server-side authorization for tool execution.
- Provenance for institutional claims.
- Rate/cost/output limits and safe fallback.
- Evaluation set covers prompt injection, data exfiltration, bad payloads and unauthorized actions.

## References

- https://vercel.com/ai-sdk
- https://github.com/vercel/ai/blob/main/content/docs/03-ai-sdk-core/15-tools-and-tool-calling.mdx
- https://owasp.github.io/www-project-top-10-for-large-language-model-applications/
