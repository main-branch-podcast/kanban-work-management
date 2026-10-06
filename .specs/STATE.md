# STATE

## Decisions

### AD-001
- **Decision**: Dark mode uses a `dark` class on `document.documentElement`, with Tailwind v4 `@custom-variant dark (&:where(.dark, .dark *));` so `dark:` utilities follow the user toggle instead of `prefers-color-scheme`.
- **Reason**: After the first explicit toggle, stored `light`/`dark` must win over the OS. Tailwind v4's default `dark:` variant is media-based and would ignore the switch.
- **Trade-off**: Components must add `dark:` classes (or tokens) instead of relying on OS media queries alone.
- **Scope**: All UI that participates in light/dark appearance
- **Date**: 2026-09-27
- **Status**: active

### AD-002
- **Decision**: Automated tests use Vitest plus Testing Library (jsdom). Domain logic lives in pure modules under `src/lib/` so ACs can be asserted without the full UI.
- **Reason**: The repo had no test runner. Vitest shares the Vite toolchain already in use.
- **Trade-off**: No Playwright/e2e layer in this feature; UI coverage is component tests, not a real browser.
- **Scope**: Test layout, commands, and where domain logic is placed
- **Date**: 2026-09-27
- **Status**: active

## Handoff
