import { MoonIcon, SunIcon } from "@heroicons/react/24/outline";
import { useTheme } from "../contexts/ThemeContext";

export default function ThemeSwitch() {
  const { theme, toggleTheme } = useTheme();
  const nextTheme = theme === "light" ? "dark" : "light";

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={`Switch to ${nextTheme} mode`}
      className="rounded-md p-2 text-gray-700 hover:bg-gray-200 cursor-pointer dark:text-gray-200 dark:hover:bg-gray-700"
    >
      {theme === "light" ? (
        <MoonIcon aria-hidden="true" className="h-5 w-5" />
      ) : (
        <SunIcon aria-hidden="true" className="h-5 w-5" />
      )}
    </button>
  );
}
