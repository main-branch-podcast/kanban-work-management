export type Theme = "light" | "dark";

export const THEME_STORAGE_KEY = "theme";

export function readStoredTheme(raw: string | null): Theme | null {
  if (raw === "light" || raw === "dark") {
    return raw;
  }

  return null;
}

export function resolveInitialTheme(
  stored: string | null,
  prefersDark: boolean,
): Theme {
  return readStoredTheme(stored) ?? (prefersDark ? "dark" : "light");
}

export function toggleTheme(current: Theme): Theme {
  return current === "light" ? "dark" : "light";
}
