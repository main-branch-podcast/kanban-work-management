# Board Filter and Theme Context

**Gathered:** 2026-09-27
**Spec:** `.specs/features/board-filter-theme/spec.md`
**Status:** Ready for design

---

## Feature Boundary

Deliver a name filter across all Kanban columns and a light/dark switch in the top-right corner. No filter by tag, status, or date. No custom palettes.

---

## Implementation Decisions

### Filter matching

- Case-insensitive substring of card `text`, applied live as the user types
- Empty or whitespace-only query shows all cards
- Query is a literal substring, not a regular expression
- Tags are not part of the match

### Filter UI placement

- One field above the columns, near the add-task form
- Theme switch stays in the top-right only

### Empty results

- Columns remain visible
- A column with zero matches shows the existing "No tasks" copy

### Theme

- Switch in the top-right
- Persist `light` or `dark` in `localStorage` key `theme`
- First visit follows `prefers-color-scheme`
- After an explicit toggle, stored value wins over OS
- Dark mode covers page, title, forms, tag area, columns, cards, and empty-state text

### Agent's Discretion

Visual details of the switch control (icon vs labeled toggle) and exact spacing of the filter field, as long as placement and behavior match the spec.

### Declined / Undiscussed Gray Areas → Assumptions

User accepted all recommended defaults in one pass. Those defaults are recorded in the spec Assumptions table as confirmed.

---

## Specific References

Filter by card name across all columns. Theme switch in the top-right. User accepted the agent's recommended defaults.

---

## Deferred Ideas

None - discussion stayed within feature scope
