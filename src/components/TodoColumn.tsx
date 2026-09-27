import React from "react";
import TodoCard from "./TodoCard";
import DropArea from "./DropArea";
import { Todo } from "../contexts/TodoContext";
import { useTodoContext } from "../contexts/TodoContext";

interface TodoColumnProps {
  columnId: string;
  todos: Todo[];
  title: string;
}

const TodoColumn: React.FC<TodoColumnProps> = ({ columnId, todos, title }) => {
  const { activeCard, handleDrop, todos: allTodos } = useTodoContext();

  // Get badge color based on column
  const getBadgeColor = () => {
    switch (columnId) {
      case "todo":
        return "bg-blue-500";
      case "doing":
        return "bg-yellow-500";
      case "done":
        return "bg-green-500";
      default:
        return "bg-gray-500";
    }
  };

  const activeTodoId = allTodos[activeCard!]?.id;

  return (
    <div className="min-h-[200px]">
      {/* Column header with task count */}
      <div className="flex items-center justify-start mb-4 bg-gray-200 py-2 px-3 rounded">
        <h2 className="text-lg font-semibold mr-2">{title}</h2>
        <span
          className={`${getBadgeColor()} text-white text-xs font-medium px-2.5 py-0.5 rounded-full`}
        >
          {todos.length}
        </span>
      </div>

      {/* First drop area at top */}
      {/* Hide only if the first todo in this column is being dragged */}
      {!(todos.length > 0 && activeTodoId === todos[0].id) && (
        <DropArea
          isVisible={activeCard !== null}
          onDrop={() => handleDrop(columnId, 0)}
        />
      )}

      {todos.length === 0 ? (
        <div className="text-center py-4 text-gray-500">No tasks</div>
      ) : (
        todos.map((todo, index) => (
          <div key={todo.id} className="mb-2">
            <TodoCard todo={todo} />

            {/* Drop area after each item */}
            {/* Hide if current todo or next todo is being dragged */}
            {!(
              activeTodoId === todo.id ||
              (index < todos.length - 1 && activeTodoId === todos[index + 1].id)
            ) && (
              <DropArea
                isVisible={activeCard !== null}
                onDrop={() => handleDrop(columnId, index + 1)}
              />
            )}
          </div>
        ))
      )}
    </div>
  );
};

export default TodoColumn;
