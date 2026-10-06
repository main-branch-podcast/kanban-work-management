# Board Filter and Theme Tasks

## Execution Protocol (MANDATORY -- do not skip)

Implement these tasks with the `tlc-spec-driven` skill: **activate it by name and follow its Execute flow and Critical Rules.** Do not search for skill files by filesystem path. The skill is the source of truth for the full flow (per-task cycle, sub-agent delegation, adequacy review, Verifier, discrimination sensor).

**If the skill cannot be activated, STOP and tell the user - do not proceed without it.**

---

**Design**: `.specs/features/board-filter-theme/design.md`
**Status**: Draft

---

## Test Coverage Matrix

> Generated from codebase, project guidelines, and spec - confirm before Execute. Guidelines found: none - strong defaults applied. Repo had no test files, no coverage config, and README has no testing section. This feature introduces Vitest + Testing Library (AD-002).

| Code Layer | Required Test Type | Coverage Expectation | Location Pattern | Run Command |
| ---------- | ------------------ | -------------------- | ---------------- | ----------- |
| Domain (`src/lib/*`) | unit | All branches; 1:1 to spec ACs FILTER-01..03, FILTER-06, THEME-01..03; listed filter edge cases | `src/lib/*.test.ts` | `npm test` |
| Context providers | unit | Happy path + listed edge cases for filter/theme state (empty query, whitespace, stored vs OS, toggle persist) | `src/contexts/*.test.tsx` | `npm test` |
| UI components in scope | unit | Happy path + empty filter + no-match column copy + switch in top-right; THEME-05 via `dark:` classes on roots | `src/**/*.test.tsx` | `npm test` |
| Config / CSS / HTML boot | none | Build gate only | - | build gate only |

## Gate Check Commands

> Generated from codebase - confirm before Execute. After T1, `package.json` defines `test`. Lint and build already exist.

| Gate Level | When to Use | Command |
| ---------- | ----------- | ------- |
| Quick | After tasks with unit tests | `npm test` |
| Full | After tasks with UI/context tests | `npm test` |
| Build | After config/CSS/HTML tasks or phase completion | `npm run build && npm run lint && npm test` |

---

## Execution Plan

Phases are ordered and run sequentially - each phase completes before the next begins, and tasks within a phase execute in order.

### Phase 1: Foundation

```
T1 -> T2 -> T3
```

### Phase 2: Theme

```
T4 -> T5 -> T6 -> T7 -> T8 -> T9 -> T10 -> T11
```

### Phase 3: Filter

```
T12 -> T13
```

---

## Task Breakdown

### T1: Add Vitest test runner

**What**: Add Vitest, jsdom, Testing Library, a `test` script, and a `test` block in Vite config (including setup that imports `@testing-library/jest-dom/vitest`).
**Where**: `vite.config.ts`
**Depends on**: None
**Reuses**: Existing Vite + React plugin in `vite.config.ts`
**Requirement**: AD-002

**Tools**:

- MCP: NONE
- Skill: tlc-spec-driven

**Done when**:

- [x] `npm test` runs Vitest and exits 0 with zero failing tests
- [x] `npm run build && npm run lint` still pass
- [x] Gate check passes: `npm run build && npm run lint && npm test`

**Tests**: none
**Gate**: build

**Commit**: `test(board): add Vitest and Testing Library runner`

---

### T2: Theme domain functions

**What**: Implement `readStoredTheme`, `resolveInitialTheme`, and `toggleTheme` with unit tests that lock THEME-01, THEME-02, THEME-03 (logic only).
**Where**: `src/lib/theme.ts`
**Depends on**: T1
**Reuses**: None
**Requirement**: THEME-01, THEME-02, THEME-03

**Tools**:

- MCP: NONE
- Skill: tlc-spec-driven

**Done when**:

- [ ] Invalid or missing stored values fall back to `prefersDark`
- [ ] Stored `light`/`dark` win over OS
- [ ] `toggleTheme` flips `light` ↔ `dark`
- [ ] Gate check passes: `npm test`
- [ ] Test count: 6 tests pass (no silent deletions)

**Tests**: unit
**Gate**: quick

**Commit**: `feat(theme): resolve and toggle stored theme`

---

### T3: Card name filter functions

**What**: Implement `normalizeFilterQuery` and `matchesNameFilter` with unit tests for FILTER-01, FILTER-02, FILTER-03, FILTER-06 and whitespace/regex-literal edges.
**Where**: `src/lib/cardFilter.ts`
**Depends on**: T2
**Reuses**: None
**Requirement**: FILTER-01, FILTER-02, FILTER-03, FILTER-06

**Tools**:

- MCP: NONE
- Skill: tlc-spec-driven

**Done when**:

- [ ] Case-insensitive substring match; empty/whitespace query matches all
- [ ] Metacharacters match as literals (`includes`, not `RegExp`)
- [ ] Function accepts only card text (tags cannot influence the result)
- [ ] Gate check passes: `npm test`
- [ ] Test count: 8 tests pass (no silent deletions)

**Tests**: unit
**Gate**: quick

**Commit**: `feat(filter): match cards by literal name substring`

---

### T4: Enable class-based dark variant

**What**: Override Tailwind v4 `dark` variant to `.dark` class strategy per AD-001.
**Where**: `src/styles.css`
**Depends on**: T3
**Reuses**: Existing `@import "tailwindcss";`
**Requirement**: THEME-05

**Tools**:

- MCP: NONE
- Skill: tlc-spec-driven

**Done when**:

- [ ] File contains `@custom-variant dark (&:where(.dark, .dark *));`
- [ ] Gate check passes: `npm run build && npm run lint && npm test`

**Tests**: none
**Gate**: build

**Commit**: `feat(theme): use class strategy for Tailwind dark variant`

---

### T5: Blocking theme boot script

**What**: Inline script that applies `document.documentElement.classList.toggle('dark', ...)` using the same rules as `resolveInitialTheme` before React loads.
**Where**: `index.html`
**Depends on**: T4
**Reuses**: `THEME_STORAGE_KEY` rules from `src/lib/theme.ts` (duplicated in the inline script)
**Requirement**: THEME-01, THEME-02

**Tools**:

- MCP: NONE
- Skill: tlc-spec-driven

**Done when**:

- [ ] Script runs in `<head>` without `type="module"`
- [ ] Missing/invalid storage follows `prefers-color-scheme`; stored value wins
- [ ] Gate check passes: `npm run build && npm run lint && npm test`

**Tests**: none
**Gate**: build

**Commit**: `feat(theme): apply html.dark class before first paint`

---

### T6: Theme React context

**What**: `ThemeProvider` initializes from `resolveInitialTheme`, `toggleTheme` updates state, `localStorage`, and the `html` class.
**Where**: `src/contexts/ThemeContext.tsx`
**Depends on**: T5
**Reuses**: `src/contexts/TodoContext.tsx` provider pattern; `src/lib/theme.ts`
**Requirement**: THEME-01, THEME-02, THEME-03

**Tools**:

- MCP: NONE
- Skill: tlc-spec-driven

**Done when**:

- [ ] Tests cover: no key + prefers dark → dark; stored light beats prefers dark; toggle writes `theme`
- [ ] `localStorage` throw on write does not crash the toggle
- [ ] Gate check passes: `npm test`
- [ ] Test count: 4 tests pass (no silent deletions)

**Tests**: unit
**Gate**: quick

**Commit**: `feat(theme): add ThemeProvider with localStorage sync`

---

### T7: Theme switch control

**What**: Button that calls `useTheme().toggleTheme` and exposes an accessible name.
**Where**: `src/components/ThemeSwitch.tsx`
**Depends on**: T6
**Reuses**: Heroicons; existing button hover/cursor classes
**Requirement**: THEME-03, THEME-04

**Tools**:

- MCP: NONE
- Skill: tlc-spec-driven

**Done when**:

- [ ] Click invokes toggle (tested with a mock or wrapped provider)
- [ ] Control has an accessible name (e.g. "Switch to dark mode" / "Switch to light mode")
- [ ] Gate check passes: `npm test`
- [ ] Test count: 2 tests pass (no silent deletions)

**Tests**: unit
**Gate**: quick

**Commit**: `feat(theme): add ThemeSwitch control`

---

### T8: Mount theme switch in App chrome

**What**: Wrap the tree with `ThemeProvider` and render `ThemeSwitch` in the top-right. Add `dark:` classes for page background, title, and add-task form.
**Where**: `src/App.tsx`
**Depends on**: T7
**Reuses**: `src/components/ThemeSwitch.tsx`; `src/contexts/ThemeContext.tsx`
**Requirement**: THEME-04, THEME-05

**Tools**:

- MCP: NONE
- Skill: tlc-spec-driven

**Done when**:

- [ ] Test asserts the switch is in the top-right of the page chrome
- [ ] Page, title, and form controls include `dark:` background/text classes
- [ ] Gate check passes: `npm test`
- [ ] Test count: 2 tests pass (no silent deletions)

**Tests**: unit
**Gate**: quick

**Commit**: `feat(theme): place switch in App header and darken chrome`

---

### T9: Dark styles for columns

**What**: Add `dark:` classes for column shell, header, count badge contrast, and "No tasks" text.
**Where**: `src/components/TodoColumn.tsx`
**Depends on**: T8
**Reuses**: Existing column layout
**Requirement**: THEME-05

**Tools**:

- MCP: NONE
- Skill: tlc-spec-driven

**Done when**:

- [ ] Column root/header/empty copy include dark background and light text utilities
- [ ] Gate check passes: `npm test`
- [ ] Test count: 1 test pass (no silent deletions)

**Tests**: unit
**Gate**: quick

**Commit**: `feat(theme): add dark styles to TodoColumn`

---

### T10: Dark styles for cards

**What**: Add `dark:` classes for card background, title text, tag button, and edit input.
**Where**: `src/components/TodoCard.tsx`
**Depends on**: T9
**Reuses**: Existing card layout
**Requirement**: THEME-05

**Tools**:

- MCP: NONE
- Skill: tlc-spec-driven

**Done when**:

- [ ] Card root uses a dark background and light text in dark mode
- [ ] Gate check passes: `npm test`
- [ ] Test count: 1 test pass (no silent deletions)

**Tests**: unit
**Gate**: quick

**Commit**: `feat(theme): add dark styles to TodoCard`

---

### T11: Dark styles for tags

**What**: Add `dark:` classes for selected/unselected chips and the add-tag button.
**Where**: `src/components/TagChip.tsx`
**Depends on**: T10
**Reuses**: Existing chip variants
**Requirement**: THEME-05

**Tools**:

- MCP: NONE
- Skill: tlc-spec-driven

**Done when**:

- [ ] Chip surfaces remain readable in dark mode
- [ ] Gate check passes: `npm test`
- [ ] Test count: 1 test pass (no silent deletions)

**Tests**: unit
**Gate**: quick

**Commit**: `feat(theme): add dark styles to TagChip`

---

### T12: Apply name filter in TodoContext

**What**: Add `nameFilter` / `setNameFilter` and filter `todosByStatus` with `matchesNameFilter`. Cover FILTER-01, FILTER-02, FILTER-05 and edit/add edges.
**Where**: `src/contexts/TodoContext.tsx`
**Depends on**: T11
**Reuses**: `src/lib/cardFilter.ts`; existing `todosByStatus`
**Requirement**: FILTER-01, FILTER-02, FILTER-04, FILTER-05

**Tools**:

- MCP: NONE
- Skill: tlc-spec-driven

**Done when**:

- [ ] Non-empty query keeps only matching `text` per column; tags do not match
- [ ] Empty/whitespace query returns all cards
- [ ] Column with zero matches yields `[]` (UI shows "No tasks")
- [ ] After add/edit, `todosByStatus` reflects the current query
- [ ] Gate check passes: `npm test`
- [ ] Test count: 6 tests pass (no silent deletions)

**Tests**: unit
**Gate**: quick

**Commit**: `feat(filter): filter todosByStatus by card name`

---

### T13: Name filter field in App

**What**: Add a live text input above the columns, near the add-task form, bound to `nameFilter`. Assert FILTER-04 (three columns still in the document).
**Where**: `src/App.tsx`
**Depends on**: T12
**Reuses**: Existing add-task input styles; `useTodoContext`
**Requirement**: FILTER-01, FILTER-02, FILTER-04

**Tools**:

- MCP: NONE
- Skill: tlc-spec-driven

**Done when**:

- [ ] Typing filters cards across columns without submitting a form
- [ ] Clearing the field restores cards
- [ ] To Do, In Progress, and Done headings remain visible when nothing matches
- [ ] Gate check passes: `npm run build && npm run lint && npm test`
- [ ] Test count: 3 tests pass (no silent deletions)

**Tests**: unit
**Gate**: build

**Commit**: `feat(filter): add live name filter above columns`

---

## Phase Execution Map

Visual representation of task ordering. Phases run in sequence, and tasks within a phase run in order:

```
Phase 1 -> Phase 2 -> Phase 3

Phase 1:  T1 -> T2 -> T3
Phase 2:  T4 -> T5 -> T6 -> T7 -> T8 -> T9 -> T10 -> T11
Phase 3:  T12 -> T13

T1 -> T2 -> T3 -> T4 -> T5 -> T6 -> T7 -> T8 -> T9 -> T10 -> T11 -> T12 -> T13
```

Execution is strictly sequential - there is no intra-phase parallelism. A single agent (or batch worker) works one task at a time, in order.

**How phase-based execution works:**

At Execute, the agent counts total tasks and packs phases into **task-budgeted batches** (~7 tasks
per worker, whole phases). A **phase** is the semantic/dependency unit; a **batch** is one or more *consecutive whole phases* assigned to one worker. The cut only ever lands on a phase boundary.

This feature has 13 tasks in 3 phases. Packing: Phase 1 (3) + Phase 2 (8) exceeds one ~7-task batch, so Execute must offer sub-agents (batch 1: Phase 1; batch 2: Phase 2; batch 3: Phase 3) or run inline if the user declines.

---

## Task Granularity Check

| Task | Scope | Status |
| ---- | ----- | ------ |
| T1: Vitest runner | 1 config change (Vite test block) | ✅ Granular |
| T2: theme.ts | 1 module | ✅ Granular |
| T3: cardFilter.ts | 1 module | ✅ Granular |
| T4: styles.css variant | 1 file | ✅ Granular |
| T5: index.html boot | 1 file | ✅ Granular |
| T6: ThemeContext | 1 component/module | ✅ Granular |
| T7: ThemeSwitch | 1 component | ✅ Granular |
| T8: App theme mount | 1 file | ✅ Granular |
| T9: TodoColumn dark | 1 component | ✅ Granular |
| T10: TodoCard dark | 1 component | ✅ Granular |
| T11: TagChip dark | 1 component | ✅ Granular |
| T12: TodoContext filter | 1 context change | ✅ Granular |
| T13: App filter field | 1 file | ✅ Granular |

**Granularity check**: all tasks are one file / one concept.

---

## Diagram-Definition Cross-Check

| Task | Depends On (task body) | Diagram Shows | Status |
| ---- | ---------------------- | ------------- | ------ |
| T1 | None | (no inbound) | ✅ Match |
| T2 | T1 | T1 -> T2 | ✅ Match |
| T3 | T2 | T2 -> T3 | ✅ Match |
| T4 | T3 | T3 -> T4 | ✅ Match |
| T5 | T4 | T4 -> T5 | ✅ Match |
| T6 | T5 | T5 -> T6 | ✅ Match |
| T7 | T6 | T6 -> T7 | ✅ Match |
| T8 | T7 | T7 -> T8 | ✅ Match |
| T9 | T8 | T8 -> T9 | ✅ Match |
| T10 | T9 | T9 -> T10 | ✅ Match |
| T11 | T10 | T10 -> T11 | ✅ Match |
| T12 | T11 | T11 -> T12 | ✅ Match |
| T13 | T12 | T12 -> T13 | ✅ Match |

---

## Test Co-location Validation

| Task | Code Layer Created/Modified | Matrix Requires | Task Says | Status |
| ---- | --------------------------- | --------------- | --------- | ------ |
| T1 | Config | none | none | ✅ OK |
| T2 | Domain | unit | unit | ✅ OK |
| T3 | Domain | unit | unit | ✅ OK |
| T4 | Config / CSS | none | none | ✅ OK |
| T5 | Config / HTML boot | none | none | ✅ OK |
| T6 | Context providers | unit | unit | ✅ OK |
| T7 | UI components | unit | unit | ✅ OK |
| T8 | UI components | unit | unit | ✅ OK |
| T9 | UI components | unit | unit | ✅ OK |
| T10 | UI components | unit | unit | ✅ OK |
| T11 | UI components | unit | unit | ✅ OK |
| T12 | Context providers | unit | unit | ✅ OK |
| T13 | UI components | unit | unit | ✅ OK |

---
