import { describe, expect, it } from "vitest";
import { matchesNameFilter, normalizeFilterQuery } from "./cardFilter";

describe("matchesNameFilter", () => {
  it("matches a case-insensitive substring", () => {
    expect(matchesNameFilter("Alphabet task", "alpha")).toBe(true);
  });

  it("rejects a substring that is not present in the card text", () => {
    expect(matchesNameFilter("Beta task", "alpha")).toBe(false);
  });

  it("matches every card for an empty query", () => {
    expect(matchesNameFilter("Any task", "")).toBe(true);
  });

  it("matches every card for a whitespace-only query", () => {
    expect(matchesNameFilter("Any task", "   ")).toBe(true);
  });

  it("uses the trimmed query for matching", () => {
    expect(normalizeFilterQuery("  alpha  ")).toBe("alpha");
    expect(matchesNameFilter("Alphabet task", "  alpha  ")).toBe(true);
  });

  it("treats bracket metacharacters as literal text", () => {
    expect(matchesNameFilter("Task [urgent]", "[urgent]")).toBe(true);
  });

  it("treats regex wildcards as literal text", () => {
    expect(matchesNameFilter("Task .*", ".*")).toBe(true);
    expect(matchesNameFilter("Any task", ".*")).toBe(false);
  });

  it("matches card text only, without considering tag names", () => {
    expect(matchesNameFilter("Write documentation", "urgent")).toBe(false);
  });
});
