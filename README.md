# BCREC Student Life Platform — Project Handbook

**Status:** Planning baseline (draft for owner review)  
**Last reviewed:** 2026-10-10  
**Repository target:** [`Mrityunjoy240/BCREC_STUDENT`](https://github.com/Mrityunjoy240/BCREC_STUDENT)  
**First product:** Student Website  
**Later product:** Essential Student Mobile App sharing the same backend

## Purpose

This handbook is the product and engineering source of truth for building a dependable Agentic College Assistant for BCREC. It is designed to prevent uncontrolled vibe coding: unclear requirements, broad prompts, unreviewed database rewrites, regression bugs, inconsistent UI, and invented academic rules.

These documents are **proposals, not institutional approvals**. Verify BCREC-specific workflows and academic rules with current approved documents and authorized staff before representing them as official policy.

## Read in this order

1. [`AGENTS.md`](AGENTS.md) — coding-agent operating rules.
2. [`docs/00-product-brief.md`](docs/00-product-brief.md) — why the product exists.
3. [`docs/01-prd-and-mvp-scope.md`](docs/01-prd-and-mvp-scope.md) — what the first release includes.
4. [`docs/02-user-journeys.md`](docs/02-user-journeys.md) — critical user workflows.
5. [`docs/03-information-architecture.md`](docs/03-information-architecture.md) and [`docs/04-design-system.md`](docs/04-design-system.md) — screens and visual rules.
6. [`docs/05-data-model-and-erd.md`](docs/05-data-model-and-erd.md), [`docs/06-data-sources-and-academic-rules.md`](docs/06-data-sources-and-academic-rules.md), and [`docs/08-roles-and-permissions.md`](docs/08-roles-and-permissions.md) — trusted data and access.
7. [`docs/07-technical-architecture.md`](docs/07-technical-architecture.md), [`docs/09-ai-and-generative-ui.md`](docs/09-ai-and-generative-ui.md), and [`docs/10-api-contracts.md`](docs/10-api-contracts.md) — implementation boundaries.
8. [`docs/11-testing-and-acceptance.md`](docs/11-testing-and-acceptance.md), [`docs/12-security-deployment-and-ops.md`](docs/12-security-deployment-and-ops.md), and [`docs/13-research-and-source-register.md`](docs/13-research-and-source-register.md).
9. Architecture decisions in [`docs/adr/`](docs/adr/), the feature template in [`docs/features/FEATURE-TEMPLATE.md`](docs/features/FEATURE-TEMPLATE.md), and runbooks in [`docs/runbooks/`](docs/runbooks/).

## Current scope decision

- Build the **Student Website first**.
- Build the **Student Mobile App later**, with the same APIs, identity, domain rules, and database.
- Preserve the learning concept of EduGen AI (personal notes/materials, grounded study chat, quizzes, flashcards, and career support) as product requirements; do not blindly port old code or schema.
- Add college-life workflows in separate domain modules: timetable/calendar, task and deadline tracking, attendance and academic progress, notices, exams/results/backlog tracking, mentorship/help desk, and student services.
- Use Generative UI in the AI chat where an interactive component is better than plain text.
- No official student data integration or college policy is assumed to exist until verified and authorized.

## Document status conventions

- **Decision proposed:** recommended default awaiting owner approval.
- **Confirmed by source:** directly supported by a cited source.
- **Assumption:** plausible but not verified; must not drive an official action until checked.
- **Open question:** requires a decision or evidence.
- **Future:** explicitly excluded from the first release.

## Change-control rule

A material change to product scope, database ownership, authorization, academic-policy behavior, or GenUI action permissions must update the relevant document and (where appropriate) create an Architecture Decision Record (ADR). Implementations must not silently contradict this handbook.
