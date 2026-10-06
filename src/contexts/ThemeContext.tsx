import {
  createContext,
  useContext,
  useState,
  ReactNode,
} from "react";
import {
  resolveInitialTheme,
  THEME_STORAGE_KEY,
  Theme,
  toggleTheme,
} from "../lib/theme";

interface ThemeContextValue {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>(() =>
    resolveInitialTheme(
      localStorage.getItem(THEME_STORAGE_KEY),
      window.matchMedia("(prefers-color-scheme: dark)").matches,
    ),
  );

  const changeTheme = () => {
    const nextTheme = toggleTheme(theme);
    setTheme(nextTheme);
    document.documentElement.classList.toggle("dark", nextTheme === "dark");
    try {
      localStorage.setItem(THEME_STORAGE_KEY, nextTheme);
    } catch {
      // The in-memory theme still changes when persistence is unavailable.
    }
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme: changeTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}
