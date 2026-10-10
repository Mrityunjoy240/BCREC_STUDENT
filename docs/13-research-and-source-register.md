# Research and Source Register

**Status:** Initial external references reviewed on 2026-10-10  
**Purpose:** Provide source provenance for technical recommendations and BCREC/MAKAUT workflow observations.

## 1. BCREC sources

### BCREC official notices/examination posts
- URL: https://bcrec.ac.in/facality-details-withtype/1
- URL: https://www.bcrec.ac.in/notice-list
- Observation: Public notices cover course enrollment, examination forms, results/PPR, revised routines, book distribution/return and different categories of students. Some notices expressly distinguish MAKAUT students from autonomous batches (for example, the surfaced 27 May 2026 backlog-fee notice excludes the autonomous batch 2024–25 onwards).
- Product implication: Notice applicability must be structured and reviewed; don't apply one notice to all students by default.
- Verification limit: Each exact notice and attached document must be opened/reviewed before a real workflow relies on it.

### BCREC Draft Academic Regulations
- URL: https://bcrec.ac.in/BCREC-Acadaemic-Regulations-Draft.pdf
- Observation: A public PDF titled “Draft Academic Regulations” includes attendance provisions.
- Product implication: A draft is not a safe source for a definitive, current eligibility rule. Obtain the current approved regulation and applicability mapping from an authorized owner.
- Verification limit: No hardcoded threshold is approved by this research note.

## 2. MAKAUT mentoring references

### Mentoring circular (2019)
- URL: https://www.makautwb.ac.in/datas/users/0-circular%20of%20mentoring%202019.pdf
- Observation: Historical circular asks for mentor-linked student lists and information such as attendance, participation, career development, communication pattern and health/wellbeing-related observations.
- Product implication: Mentorship is not only an academic list; however, sensitive fields require stricter privacy and current policy verification.
- Verification limit: The circular is historical. It does not establish the current BCREC mentor assignment ratio, responsibilities, or permission scope.

### Mentoring document (2018)
- URL: https://www.makautwb.ac.in/datas/users/0-mentoring.pdf
- Observation: Historical guidance describes mentorship and record-keeping.
- Product implication: Support workflow can be considered; current procedures must be confirmed.

## 3. Technical sources

### Next.js App Router and component boundaries
- [App Router](https://nextjs.org/docs/app)
- [Server and Client Components](https://nextjs.org/docs/app/getting-started/server-and-client-components)
- Design implication: Prefer server-side data access/secret handling where suitable and use client components for actual interactivity. Verify current APIs and upgrade guidance at implementation time.

### Supabase local workflows and migrations
- [Local development workflow](https://supabase.com/docs/guides/local-development/cli-workflows)
- Design implication: Track schema/migrations/seed data in version control and make local setup reproducible.

### Vercel AI SDK / tool calling / GenUI
- [AI SDK](https://vercel.com/ai-sdk)
- [Tool calling source](https://github.com/vercel/ai/blob/main/content/docs/03-ai-sdk-core/15-tools-and-tool-calling.mdx)
- [Generative UI guide](https://github.com/tinybirdco/vercel-ai-sdk/blob/main/content/docs/04-ai-sdk-ui/04-generative-user-interfaces.mdx)
- Design implication: tools can return validated structured results rendered through a fixed React component map; exact package versions/APIs should be checked when implementation begins.

### Expo notifications (future mobile app)
- [Using push notifications](https://docs.expo.dev/guides/using-push-notifications-services/)
- Design implication: plan a shared notification service, but implement native push only after the website's event/data model and notification preferences are stable.

### OWASP GenAI / LLM security
- [OWASP GenAI / LLM Top 10](https://owasp.github.io/www-project-top-10-for-large-language-model-applications/)
- Design implication: guard against prompt injection, insecure output handling, sensitive-information disclosure, excessive agency, resource abuse and insecure tool design.

### Browser testing
- [Playwright introduction](https://playwright.dev/docs/intro)
- [Next.js testing guide](https://nextjs.org/docs/app/guides/testing)
- Design implication: maintain end-to-end tests for critical user journeys and authorization boundaries.

## 4. Source verification workflow

When a new source is added:
1. Prefer official institution/provider documentation.
2. Record title, URL, date accessed, publication/effective date if known, and the decision it supports.
3. Separate direct source facts from our design inference.
4. For college rules, record programme/cohort applicability and approval state.
5. Re-check time-sensitive sources before release and on policy changes.

This register must be updated when architecture changes or a current institutional rule is formally confirmed.
