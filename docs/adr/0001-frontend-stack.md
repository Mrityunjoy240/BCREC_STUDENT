# ADR 0001: Frontend Stack and Development Toolchain

- **Status:** Proposed — owner approval required
- **Date:** 2026-10-10 · **Revision:** 0.2 (development toolchain added)
- **Decision owner:** Product/technical lead

## Context

We need a high-quality desktop/web-first Student Website, and later an essential mobile app sharing the same backend. The team uses TypeScript/React-style web development and wants to avoid framework churn and uncontrolled AI-generated rewrites. A reproducible, boring toolchain reduces ad-hoc choices during bootstrap.

## Proposed decision

### Application stack

- Use **Next.js App Router + React + TypeScript** for the Student Website.
- Use Tailwind CSS with one accessible shared component system (shadcn/ui or an equivalent selected at setup), driven by the design tokens in `04-design-system.md`.
- Prefer server components for suitable page rendering and data fetching; use client components where user interaction or browser features require them.
- Use shared design tokens and small reusable components; do not generate a new visual language per page.
- Treat the future mobile app as a separate client, likely React Native + Expo, consuming the same domain APIs. Do not implement the mobile app in this ADR's scope.

### Development toolchain

- **Package manager:** npm, with `package-lock.json` committed. Do not introduce pnpm/yarn without a recorded decision.
- **Lint/format:** ESLint (with TypeScript and Next.js configs) + Prettier with a committed configuration; one style, no per-developer overrides.
- **Type checking:** `tsc --noEmit` via `npm run typecheck`.
- **Unit/component tests:** **Vitest** with React Testing Library for components.
- **Browser tests:** **Playwright** for critical journeys and authorization E2E flows (`11-testing-and-acceptance.md`).
- **Database workflow:** Supabase CLI migrations against local/throwaway databases; migrations versioned in Git.
- **CI:** run lint → typecheck → unit → migration test → integration → build → E2E before deploy (commands proposed in `11` §7; finalize during bootstrap).

## Alternatives considered

- **Vite + React SPA:** simpler static client, but application data and server-side responsibilities would require a separate backend framework/API arrangement.
- **Other React meta-framework:** potentially viable, but switching without a demonstrated need adds uncertainty and maintenance cost.
- **Build UI without a component system:** fast for the first screen, but likely to create inconsistent controls and costly redesign.
- **Jest instead of Vitest:** mature, but Vitest aligns more naturally with the Vite/Next.js TypeScript toolchain; revisit only with evidence.
- **pnpm/yarn:** fine tools, but a second package-manager convention adds setup friction for a small team; npm is the lowest-friction default.

## Consequences

Positive:
- One TypeScript codebase for pages, server routes and client interactions.
- Clear server/client boundaries for protected data and provider keys.
- Shared visual primitives reduce UI drift.
- Reproducible install/test/lint commands from a clean clone.
- The future mobile app can reuse types/contracts and backend logic without sharing React components.

Trade-offs:
- Team must understand server/client component boundaries and caching behavior.
- Framework-specific APIs can change; pin supported versions and upgrade intentionally.
- Need discipline to avoid turning every page into a large client component.

## Guardrails

- Validate the current supported stable version before initialization.
- Use the official App Router and server/client guidance.
- No framework initialization before this ADR, ADR 0002, ADR 0004 and product documents are reviewed.
- Test keyboard, responsive and loading/error states as first-class requirements.
- Commands in runbooks/CI remain marked “proposed” until verified during bootstrap, then updated in the same change.

## References

- https://nextjs.org/docs/app
- https://nextjs.org/docs/app/getting-started/server-and-client-components
