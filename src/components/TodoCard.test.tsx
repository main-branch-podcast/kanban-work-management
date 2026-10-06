import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { TodoProvider } from "../contexts/TodoContext";
import TodoCard from "./TodoCard";

afterEach(() => {
  cleanup();
  localStorage.clear();
});

describe("TodoCard dark styles", () => {
  it("styles the card, title, tag control, and edit input for dark mode", () => {
    const { container } = render(
      <TodoProvider>
        <TodoCard todo={{ id: "1", text: "Review spec", status: "todo", tags: [] }} />
      </TodoProvider>,
    );

    const card = container.querySelector("[draggable]");
    expect(card).toHaveClass("dark:bg-gray-700", "dark:text-gray-100");
    expect(screen.getByText("Review spec")).toHaveClass("dark:text-gray-100");
    expect(screen.getByTitle("Manage Tags")).toHaveClass("dark:bg-gray-600");

    fireEvent.doubleClick(screen.getByText("Review spec"));
    expect(screen.getByRole("textbox")).toHaveClass(
      "dark:bg-gray-800",
      "dark:text-gray-100",
    );
  });
});
