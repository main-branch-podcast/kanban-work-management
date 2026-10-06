import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { TodoProvider } from "../contexts/TodoContext";
import TagChip from "./TagChip";

afterEach(() => {
  cleanup();
  localStorage.clear();
});

describe("TagChip dark styles", () => {
  it("keeps selected, unselected, and add chips readable in dark mode", () => {
    render(
      <TodoProvider>
        <TagChip text="Selected" mode="read-only" isSelected />
        <TagChip text="Unselected" mode="read-only" />
        <TagChip text="Add Tag" mode="add-button" />
      </TodoProvider>,
    );

    expect(screen.getByText("Selected").parentElement).toHaveClass(
      "dark:bg-blue-900",
      "dark:text-blue-100",
      "dark:border-blue-700",
    );
    expect(screen.getByText("Unselected").parentElement).toHaveClass(
      "dark:bg-gray-700",
      "dark:text-gray-100",
      "dark:border-gray-600",
    );
    expect(screen.getByRole("button", { name: "Add Tag" })).toHaveClass(
      "dark:bg-gray-700",
      "dark:text-gray-100",
    );
  });
});
