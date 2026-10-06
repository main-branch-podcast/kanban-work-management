import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { TodoProvider } from "../contexts/TodoContext";
import TodoColumn from "./TodoColumn";

afterEach(() => {
  cleanup();
  localStorage.clear();
});

describe("TodoColumn dark styles", () => {
  it("styles the column, header, count badge, and empty copy for dark mode", () => {
    render(
      <TodoProvider>
        <TodoColumn columnId="doing" title="In Progress" todos={[]} />
      </TodoProvider>,
    );

    expect(screen.getByText("No tasks").parentElement).toHaveClass(
      "dark:bg-gray-800",
      "dark:text-gray-100",
    );
    expect(screen.getByRole("heading", { name: "In Progress" }).parentElement).toHaveClass(
      "dark:bg-gray-700",
    );
    expect(screen.getByText("0")).toHaveClass(
      "dark:bg-yellow-300",
      "dark:text-gray-900",
    );
    expect(screen.getByText("No tasks")).toHaveClass("dark:text-gray-300");
  });
});
