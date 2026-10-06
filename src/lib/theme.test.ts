import { describe, expect, it } from "vitest";
import {
  readStoredTheme,
  resolveInitialTheme,
  toggleTheme,
} from "./theme";

describe("readStoredTheme", () => {
  it("accepts the light theme", () => {
    expect(readStoredTheme("light")).toBe("light");
  });

  it("accepts the dark theme", () => {
    expect(readStoredTheme("dark")).toBe("dark");
  });

  it("rejects missing and invalid stored values", () => {
    expect(readStoredTheme(null)).toBeNull();
    expect(readStoredTheme("sepia")).toBeNull();
  });
});

describe("resolveInitialTheme", () => {
  it("uses the system preference when there is no valid stored theme", () => {
    expect(resolveInitialTheme(null, true)).toBe("dark");
    expect(resolveInitialTheme("invalid", false)).toBe("light");
  });

  it("uses a valid stored theme over the system preference", () => {
    expect(resolveInitialTheme("light", true)).toBe("light");
    expect(resolveInitialTheme("dark", false)).toBe("dark");
  });
});

describe("toggleTheme", () => {
  it("switches light to dark and dark to light", () => {
    expect(toggleTheme("light")).toBe("dark");
    expect(toggleTheme("dark")).toBe("light");
  });
});
