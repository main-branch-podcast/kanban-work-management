import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

type Status = "todo" | "doing" | "done";

export interface Todo {
  id: string;
  text: string;
  status: Status;
  tags: string[];
}

interface TodoContextType {
  // State
  todos: Todo[];
  tags: string[];
  selectedTags: string[];
  activeCard: number | null;
  draggedTag: string | null;

  // Todo actions
  addTodo: (text: string) => void;
  updateTodoText: (todoId: string, newText: string) => void;
  deleteTodo: (todoId: string) => void;

  // Tag actions
  addTag: (text: string) => void;
  deleteTag: (tag: string) => void;
  updateTagText: (oldText: string, newText: string) => void;
  toggleTagSelection: (tag: string) => void;
  updateTodoTags: (todoId: string, tagToToggle: string) => void;

  // Drag & Drop for todos
  handleDragStart: (todoId: string) => void;
  handleDragEnd: () => void;
  handleDrop: (targetColumnId: string, targetIndex: number) => void;

  // Drag & Drop for tags
  handleTagDragStart: (tagName: string) => void;
  handleTagDragEnd: () => void;
  handleTagDropOnTodo: (todoId: string, tagName: string) => void;
  handleTagDropOutside: (todoId: string, tagName: string) => void;

  // Filtered todos
  todosByStatus: {
    todo: Todo[];
    doing: Todo[];
    done: Todo[];
  };
}

const TodoContext = createContext<TodoContextType | undefined>(undefined);

export function useTodoContext() {
  const context = useContext(TodoContext);
  if (context === undefined) {
    throw new Error("useTodoContext must be used within a TodoProvider");
  }
  return context;
}

interface TodoProviderProps {
  children: ReactNode;
}

export function TodoProvider({ children }: TodoProviderProps) {
  // Load todos from localStorage
  const [todos, setTodos] = useState<Todo[]>(() => {
    const savedTodos = localStorage.getItem("todos");
    if (savedTodos) {
      return JSON.parse(savedTodos);
    }
    return [];
  });

  // Load tags from localStorage
  const [tags, setTags] = useState<string[]>(() => {
    const savedTags = localStorage.getItem("tags");
    if (savedTags) {
      return JSON.parse(savedTags);
    }
    return [];
  });

  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [activeCard, setActiveCard] = useState<number | null>(null);
  const [draggedTag, setDraggedTag] = useState<string | null>(null);

  // Save todos and tags to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("todos", JSON.stringify(todos));
  }, [todos]);

  useEffect(() => {
    localStorage.setItem("tags", JSON.stringify(tags));
  }, [tags]);

  // Add new todo
  const addTodo = (text: string) => {
    const trimmedText = text.trim();
    if (trimmedText === "") return;

    const newTodo: Todo = {
      id: crypto.randomUUID(),
      text: trimmedText,
      status: "todo",
      tags: [...selectedTags],
    };

    setTodos([...todos, newTodo]);
    setSelectedTags([]);
  };

  // Update todo card's text
  const updateTodoText = (todoId: string, newText: string) => {
    setTodos(
      todos.map((todo) => {
        if (todo.id === todoId) {
          return { ...todo, text: newText };
        }
        return todo;
      })
    );
  };

  // Delete todo
  const deleteTodo = (id: string) => {
    setTodos(todos.filter((todo) => todo.id !== id));
  };

  // Add new tag
  const addTag = (text: string) => {
    const trimmedText = text.trim();
    if (trimmedText === "") return;

    // Only add if the tag doesn't already exist
    if (!tags.includes(trimmedText)) {
      setTags([...tags, trimmedText]);
    }
  };

  // Delete tag
  const deleteTag = (tagToDelete: string) => {
    // Remove tag from tags list
    setTags(tags.filter((tag) => tag !== tagToDelete));

    // Remove tag from selectedTags
    setSelectedTags(selectedTags.filter((tag) => tag !== tagToDelete));

    // Remove tag from all todos that have it
    setTodos(
      todos.map((todo) => ({
        ...todo,
        tags: todo.tags.filter((tag) => tag !== tagToDelete),
      }))
    );
  };

  // Update tag text globally
  const updateTagText = (oldText: string, newText: string) => {
    // Check if the new tag name already exists
    if (tags.includes(newText)) {
      alert("This tag already exists!");
      return;
    }

    // Update the tags array
    setTags(tags.map((tag) => (tag === oldText ? newText : tag)));

    // Update selectedTags array
    setSelectedTags(
      selectedTags.map((tag) => (tag === oldText ? newText : tag))
    );

    // Update all todos that have this tag
    setTodos(
      todos.map((todo) => ({
        ...todo,
        tags: todo.tags.map((tag) => (tag === oldText ? newText : tag)),
      }))
    );
  };

  // Toggle tag selection for new todo
  const toggleTagSelection = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter((t) => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  // Update todo tags
  const updateTodoTags = (todoId: string, tagToToggle: string) => {
    setTodos(
      todos.map((todo) => {
        if (todo.id === todoId) {
          const updatedTags = todo.tags.includes(tagToToggle)
            ? todo.tags.filter((t) => t !== tagToToggle)
            : [...todo.tags, tagToToggle];

          return { ...todo, tags: updatedTags };
        }
        return todo;
      })
    );
  };

  // Handle drag and drop between columns
  const handleDragStart = (todoId: string) => {
    const todoIndex = todos.findIndex((todo) => todo.id === todoId);
    setActiveCard(todoIndex);
  };

  const handleDragEnd = () => {
    setActiveCard(null);
  };

  const handleDrop = (targetColumnId: string, targetIndex: number) => {
    if (activeCard === null) return;

    // Remove the item from its original position
    const updatedTodos = [...todos]; // we don't mutate directly the state
    const [activeTodo] = updatedTodos.splice(activeCard, 1);

    // If the todo is dropped in the same column
    if (activeTodo.status === targetColumnId) {
      const currentTodoIndex = todosByStatus[
        targetColumnId as Status
      ].findIndex((t) => t.id === activeTodo.id);

      // Decrement target index because the item's removal shifts indices down
      if (currentTodoIndex < targetIndex) {
        targetIndex--;
      }
    }

    // Create the updated todo with possibly new status
    const newTodo = {
      ...activeTodo,
      status: targetColumnId as Status,
    };

    // Get todos in the target column after removal
    const targetColumnTodos = updatedTodos.filter(
      (t) => t.status === targetColumnId
    );

    // Insert at beginning of the target column
    if (targetIndex === 0) {
      const firstTargetColumnIndex = updatedTodos.findIndex(
        (t) => t.status === targetColumnId
      );
      if (firstTargetColumnIndex === -1) {
        updatedTodos.push(newTodo);
      } else {
        updatedTodos.splice(firstTargetColumnIndex, 0, newTodo);
      }
    }
    // Insert at a specific position
    else if (targetIndex < targetColumnTodos.length) {
      // Find the todo that should appear before our dropped item
      const targetTodo = targetColumnTodos[targetIndex - 1];
      const insertAtIndex = updatedTodos.findIndex(
        (t) => t.id === targetTodo.id
      );
      updatedTodos.splice(insertAtIndex + 1, 0, newTodo);
    }
    // Add to the end of the column
    else {
      updatedTodos.push(newTodo);
    }

    setTodos(updatedTodos);
    setActiveCard(null);
  };

  // Tag drag and drop handlers
  const handleTagDragStart = (tagName: string) => {
    setDraggedTag(tagName);
  };

  const handleTagDragEnd = () => {
    setDraggedTag(null);
  };

  const handleTagDropOnTodo = (todoId: string, tagName: string) => {
    // Add tag to todo if it doesn't already have it
    setTodos(
      todos.map((todo) => {
        if (todo.id === todoId && !todo.tags.includes(tagName)) {
          return { ...todo, tags: [...todo.tags, tagName] };
        }
        return todo;
      })
    );
    setDraggedTag(null);
  };

  const handleTagDropOutside = (todoId: string, tagName: string) => {
    // Remove tag from todo
    setTodos(
      todos.map((todo) => {
        if (todo.id === todoId) {
          return { ...todo, tags: todo.tags.filter((tag) => tag !== tagName) };
        }
        return todo;
      })
    );
    setDraggedTag(null);
  };

  // Filter todos by status for easier to work with
  const todosByStatus = {
    todo: todos.filter((todo) => todo.status === "todo"),
    doing: todos.filter((todo) => todo.status === "doing"),
    done: todos.filter((todo) => todo.status === "done"),
  };

  const value = {
    todos,
    tags,
    selectedTags,
    activeCard,
    draggedTag,
    addTodo,
    updateTodoText,
    deleteTodo,
    addTag,
    deleteTag,
    updateTagText,
    toggleTagSelection,
    updateTodoTags,
    handleDragStart,
    handleDragEnd,
    handleDrop,
    handleTagDragStart,
    handleTagDragEnd,
    handleTagDropOnTodo,
    handleTagDropOutside,
    todosByStatus,
  };

  return <TodoContext.Provider value={value}>{children}</TodoContext.Provider>;
}
