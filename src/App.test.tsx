import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import App from "./App";

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
  localStorage.clear();
  document.documentElement.classList.remove("dark");
});

function renderApp() {
  vi.stubGlobal(
    "matchMedia",
    vi.fn(() => ({ matches: false }) as MediaQueryList),
  );
  return render(<App />);
}

describe("App theme chrome", () => {
  it("places the theme switch at the top-right of the page header", () => {
    renderApp();

    const switchButton = screen.getByRole("button", {
      name: "Switch to dark mode",
    });
    expect(switchButton.parentElement).toHaveClass("absolute", "right-0", "top-0");
    expect(switchButton.parentElement?.parentElement?.tagName).toBe("HEADER");
  });

  it("provides dark backgrounds and text for the page, title, and task form", () => {
    renderApp();

    expect(screen.getByText("Work Management")).toHaveClass("dark:text-gray-100");
    expect(screen.getByText("Work Management").parentElement?.parentElement).toHaveClass(
      "dark:bg-gray-900",
      "dark:text-gray-100",
    );
    expect(screen.getByPlaceholderText("Add a new task...")).toHaveClass(
      "dark:bg-gray-800",
      "dark:text-gray-100",
    );
  });
});
