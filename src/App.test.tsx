import { cleanup, fireEvent, render, screen } from "@testing-library/react";
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

describe("App name filter", () => {
  function seedTodos() {
    localStorage.setItem(
      "todos",
      JSON.stringify([
        { id: "1", text: "Alpha task", status: "todo", tags: [] },
        { id: "2", text: "Beta task", status: "doing", tags: [] },
        { id: "3", text: "alphabet task", status: "done", tags: [] },
      ]),
    );
  }

  it("filters cards across columns as the user types", () => {
    seedTodos();
    renderApp();

    fireEvent.change(screen.getByRole("searchbox", { name: "Filter tasks by name" }), {
      target: { value: "alp" },
    });

    expect(screen.getByText("Alpha task")).toBeInTheDocument();
    expect(screen.getByText("alphabet task")).toBeInTheDocument();
    expect(screen.queryByText("Beta task")).not.toBeInTheDocument();
  });

  it("restores all cards when the filter is cleared", () => {
    seedTodos();
    renderApp();
    const filter = screen.getByRole("searchbox", { name: "Filter tasks by name" });

    fireEvent.change(filter, { target: { value: "alpha" } });
    fireEvent.change(filter, { target: { value: "" } });

    expect(screen.getByText("Alpha task")).toBeInTheDocument();
    expect(screen.getByText("Beta task")).toBeInTheDocument();
    expect(screen.getByText("alphabet task")).toBeInTheDocument();
  });

  it("keeps all column headings visible when no card matches", () => {
    renderApp();
    fireEvent.change(screen.getByRole("searchbox", { name: "Filter tasks by name" }), {
      target: { value: "no matching task" },
    });

    expect(screen.getByRole("heading", { name: "To Do" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "In Progress" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Done" })).toBeInTheDocument();
  });
});
