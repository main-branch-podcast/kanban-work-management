import { act, renderHook } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { TodoProvider, useTodoContext } from "./TodoContext";

function wrapper({ children }: { children: React.ReactNode }) {
  return <TodoProvider>{children}</TodoProvider>;
}

afterEach(() => localStorage.clear());

describe("TodoProvider name filter", () => {
  it("filters card names case-insensitively in every column", () => {
    localStorage.setItem(
      "todos",
      JSON.stringify([
        { id: "1", text: "Alpha", status: "todo", tags: [] },
        { id: "2", text: "Beta", status: "doing", tags: [] },
        { id: "3", text: "alphabet", status: "done", tags: [] },
      ]),
    );
    const { result } = renderHook(() => useTodoContext(), { wrapper });

    act(() => result.current.setNameFilter("ALP"));

    expect(result.current.todosByStatus.todo.map((todo) => todo.id)).toEqual(["1"]);
    expect(result.current.todosByStatus.doing).toEqual([]);
    expect(result.current.todosByStatus.done.map((todo) => todo.id)).toEqual(["3"]);
  });

  it("does not match tag names", () => {
    localStorage.setItem(
      "todos",
      JSON.stringify([
        { id: "1", text: "Write report", status: "todo", tags: ["urgent"] },
      ]),
    );
    const { result } = renderHook(() => useTodoContext(), { wrapper });

    act(() => result.current.setNameFilter("urgent"));

    expect(result.current.todosByStatus.todo).toEqual([]);
  });

  it("shows all cards when the query is empty", () => {
    localStorage.setItem(
      "todos",
      JSON.stringify([
        { id: "1", text: "Alpha", status: "todo", tags: [] },
        { id: "2", text: "Beta", status: "done", tags: [] },
      ]),
    );
    const { result } = renderHook(() => useTodoContext(), { wrapper });

    act(() => result.current.setNameFilter(""));

    expect(result.current.todosByStatus.todo.map((todo) => todo.id)).toEqual(["1"]);
    expect(result.current.todosByStatus.done.map((todo) => todo.id)).toEqual(["2"]);
  });

  it("shows all cards when the query contains only whitespace", () => {
    localStorage.setItem(
      "todos",
      JSON.stringify([{ id: "1", text: "Alpha", status: "doing", tags: [] }]),
    );
    const { result } = renderHook(() => useTodoContext(), { wrapper });

    act(() => result.current.setNameFilter("   "));

    expect(result.current.todosByStatus.doing.map((todo) => todo.id)).toEqual(["1"]);
  });

  it("recomputes the filtered column after adding a card", () => {
    const { result } = renderHook(() => useTodoContext(), { wrapper });
    act(() => result.current.setNameFilter("match"));

    act(() => result.current.addTodo("Unrelated card"));
    expect(result.current.todosByStatus.todo).toEqual([]);

    act(() => result.current.addTodo("Match this"));
    expect(result.current.todosByStatus.todo.map((todo) => todo.text)).toEqual([
      "Match this",
    ]);
  });

  it("recomputes the filtered column after editing a card name", () => {
    localStorage.setItem(
      "todos",
      JSON.stringify([{ id: "1", text: "Keep me", status: "todo", tags: [] }]),
    );
    const { result } = renderHook(() => useTodoContext(), { wrapper });
    act(() => result.current.setNameFilter("keep"));

    act(() => result.current.updateTodoText("1", "No longer matching"));
    expect(result.current.todosByStatus.todo).toEqual([]);

    act(() => result.current.updateTodoText("1", "Keep again"));
    expect(result.current.todosByStatus.todo.map((todo) => todo.text)).toEqual([
      "Keep again",
    ]);
  });
});
