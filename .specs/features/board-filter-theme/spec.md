# Board Filter and Theme Specification

## Problem Statement

Users cannot find a card by name when the board has many tasks across columns. The UI is light-only, with no control in the header to switch appearance. This feature adds a name filter across all columns and a light/dark switch in the top-right corner.

## Goals

- [x] User can type a name fragment and see only matching cards in every column
- [x] User can switch light and dark mode from the top-right corner; the choice survives reload

## Out of Scope

Explicitly excluded. Documented to prevent scope creep.

| Feature | Reason |
| ------- | ------ |
| Filter by tag, status, or date | User asked for name only |
| Per-column search | Filter applies to all columns with one field |
| Custom color themes | Only light and dark |
| Filter persistence | Filter is a session search, not a saved view |

---

## Assumptions & Open Questions

Every ambiguity is resolved or recorded here - nothing is left silently unclear.

| Assumption / decision | Chosen default | Rationale | Confirmed? |
| --------------------- | -------------- | --------- | ---------- |
| Filter match rule | Case-insensitive substring of card `text`; live as the user types | Fast find without extra controls | y |
| Empty filter | Empty or whitespace-only query shows all cards | Clearing search restores the board | y |
| Filter field placement | One field above the columns, near the add-task form | Theme switch stays exclusive to the top-right | y |
| Filter matching surface | Card name (`text`) only; tags are ignored | Scope is name filter | y |
| No-match empty state | Columns stay visible; a column with zero matches shows "No tasks" | Reuses existing empty copy | y |
| Filter query parsing | Literal substring, not regex | Special characters must not change match rules | y |
| Theme switch placement | Top-right of the page | Explicit user request | y |
| Theme persistence | `localStorage` key `theme` with values `light` or `dark` | Todos already persist in `localStorage` | y |
| First-visit theme | `prefers-color-scheme` of the OS/browser | Sensible default before the user chooses | y |
| After first explicit toggle | Stored value wins over OS until the user toggles again | User intent beats system after a choice | y |
| Dark mode coverage | Page background, title, forms, tags area, columns, cards, and empty-state text | Switch is useless if only the chrome changes | y |
| Filter persistence | Not stored; reset on full page reload | Search is ephemeral | y |

**Open questions:** none - all resolved or logged above.

---

## User Stories

### P1: Filter cards by name ⭐ MVP

**User Story**: As a board user, I want to filter cards by name across all columns so that I can find a task without scanning every column.

**Why P1**: This is one of the two stated goals; the board is unusable at scale without search.

**Acceptance Criteria** (each line is one EARS pattern):

1. WHEN the user types a non-empty query in the name filter THEN the system SHALL display in each column only cards whose `text` contains that query as a case-insensitive substring.
2. WHEN the filter value is empty or whitespace-only THEN the system SHALL display all cards in their current columns.
3. WHEN the filter query contains regex metacharacters THEN the system SHALL treat the query as a literal substring.
4. WHILE a filter query is active the system SHALL keep all three columns visible.
5. IF a column has no cards matching the query THEN the system SHALL show the text "No tasks" in that column.
6. The system SHALL ignore tag names when deciding whether a card matches the filter.

**Independent Test**: Create cards named "Alpha", "Beta", and "alphabet" in different columns; type "alp"; only "Alpha" and "alphabet" remain visible; clear the field and all three return.

---

### P1: Light and dark theme switch ⭐ MVP

**User Story**: As a board user, I want a light/dark switch in the top-right corner so that I can read the board in either appearance and keep that choice after reload.

**Why P1**: This is the second stated goal.

**Acceptance Criteria** (each line is one EARS pattern):

1. WHEN the page loads and `localStorage` has no `theme` key THEN the system SHALL apply dark mode if `prefers-color-scheme` is `dark`, otherwise light mode.
2. WHEN the page loads and `localStorage` `theme` is `light` or `dark` THEN the system SHALL apply that stored theme even if it differs from the OS preference.
3. WHEN the user activates the theme switch THEN the system SHALL toggle between light and dark immediately and write the new value to `localStorage` key `theme`.
4. The system SHALL render the theme switch in the top-right corner of the page.
5. WHILE dark mode is active the system SHALL use dark backgrounds and light text on the page, columns, cards, title, and form controls.

**Independent Test**: With no stored theme, load the app and confirm it follows OS preference; toggle the switch; reload and confirm the chosen theme remains.

---

## Edge Cases

- IF the filter is only spaces THEN the system SHALL treat it as empty and show all cards.
- WHEN the user edits a visible card's name so it no longer matches THEN the system SHALL hide that card from the filtered view.
- WHEN the user adds a new card whose name does not match the active filter THEN the system SHALL not show that card until the query matches or is cleared.

---

## Requirement Traceability

Each requirement gets a unique ID for tracking across design, tasks, and validation.

| Requirement ID | Story | Phase | Status |
| -------------- | ----- | ----- | ------ |
| FILTER-01 | P1: Filter cards by name | Tasks | Verified |
| FILTER-02 | P1: Filter cards by name | Tasks | Verified |
| FILTER-03 | P1: Filter cards by name | Tasks | Verified |
| FILTER-04 | P1: Filter cards by name | Tasks | Verified |
| FILTER-05 | P1: Filter cards by name | Tasks | Verified |
| FILTER-06 | P1: Filter cards by name | Tasks | Verified |
| THEME-01 | P1: Light and dark theme switch | Tasks | Verified |
| THEME-02 | P1: Light and dark theme switch | Tasks | Verified |
| THEME-03 | P1: Light and dark theme switch | Tasks | Verified |
| THEME-04 | P1: Light and dark theme switch | Tasks | Verified |
| THEME-05 | P1: Light and dark theme switch | Tasks | Verified |

**ID format:** `[CATEGORY]-[NUMBER]` (e.g., `AUTH-01`, `CART-03`, `NOTIF-02`)

**Status values:** Pending → In Design → In Tasks → Implementing → Verified

**Coverage:** 11 total, 11 mapped to T2–T13, 0 unmapped

---

## Success Criteria

How we know the feature is successful:

- [x] Typing a name fragment hides non-matching cards in To Do, In Progress, and Done at the same time
- [x] Clearing the filter restores every card
- [x] Theme switch in the top-right toggles appearance and survives a full reload
