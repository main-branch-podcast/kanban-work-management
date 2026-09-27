import React, { useState, useRef, useEffect } from "react";
import { Bars3Icon, TrashIcon, TagIcon } from "@heroicons/react/16/solid";
import { useTodoContext } from "../contexts/TodoContext";
import TagChip from "./TagChip";

interface TodoCardProps {
  todo: {
    id: string;
    text: string;
    status: string;
    tags: string[];
  };
}

const TodoCard: React.FC<TodoCardProps> = ({ todo }) => {
  const {
    tags: availableTags,
    handleDragStart,
    handleDragEnd,
    updateTodoText,
    updateTodoTags,
    deleteTodo,
    handleTagDropOnTodo,
    draggedTag,
  } = useTodoContext();

  // UI State
  const [showTagSelector, setShowTagSelector] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(todo.text);

  // Drag State
  const [isDragging, setIsDragging] = useState(false); // The (current) todo card is being dragged
  const [isCardHoveringOver, setIsCardHoveringOver] = useState(false); // Another todo card is hovering over it
  const [isTagHoveringOver, setIsTagHoveringOver] = useState(false); // A tag is hovering over it

  // Refs
  const tagSelectorRef = useRef<HTMLDivElement>(null);
  const tagButtonRef = useRef<HTMLButtonElement>(null);
  const editInputRef = useRef<HTMLInputElement>(null);

  // Handle clicks outside the tag selector
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        showTagSelector &&
        tagSelectorRef.current &&
        !tagSelectorRef.current.contains(event.target as Node) &&
        tagButtonRef.current &&
        !tagButtonRef.current.contains(event.target as Node)
      ) {
        setShowTagSelector(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape" && showTagSelector) {
        setShowTagSelector(false);
      }
    }

    if (showTagSelector) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [showTagSelector]);

  // Focus input when editing starts
  useEffect(() => {
    if (isEditing && editInputRef.current) {
      editInputRef.current.focus();
    }
  }, [isEditing]);

  // Handle global mouse up to reset drag state
  // this is for the to-do card shrink bug: when you click on the drag handle on
  // the edge and mouse up, the to-do card is still in dragging state
  useEffect(() => {
    const handleGlobalMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      document.addEventListener("mouseup", handleGlobalMouseUp);
    }

    return () => {
      document.removeEventListener("mouseup", handleGlobalMouseUp);
    };
  }, [isDragging]);

  // Save edited text
  const saveEdit = () => {
    if (editText.trim() !== "") {
      updateTodoText(todo.id, editText);
      setIsEditing(false);
    } else {
      // If empty, revert to original
      setEditText(todo.text);
      setIsEditing(false);
    }
  };

  // Unified drag over handler - determines what's being dragged
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();

    if (draggedTag) {
      // A tag is being dragged - show green background
      setIsTagHoveringOver(true);
      setIsCardHoveringOver(false);
    } else {
      // A todo card is being dragged - show red background
      setIsCardHoveringOver(true);
      setIsTagHoveringOver(false);
    }
  };

  const handleDragLeave = (e: React.DragEvent) => {
    // Only reset if we're actually leaving the card
    if (!e.currentTarget.contains(e.relatedTarget as Node)) {
      setIsCardHoveringOver(false);
      setIsTagHoveringOver(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();

    // Reset hover states
    setIsCardHoveringOver(false);
    setIsTagHoveringOver(false);

    // Handle tag drops
    if (draggedTag) {
      const tagName = e.dataTransfer.getData("text/plain");
      const sourceId = e.dataTransfer.getData("application/tag-source");

      if (tagName && sourceId !== todo.id) {
        handleTagDropOnTodo(todo.id, tagName);
      }
    }
  };

  // Get the appropriate color based on status
  const getStatusColor = () => {
    switch (todo.status) {
      case "todo":
        return "border-l-blue-500";
      case "doing":
        return "border-l-yellow-500";
      case "done":
        return "border-l-green-500";
      default:
        return "";
    }
  };

  // Get background color based on drag state
  const getBackgroundColor = () => {
    if (isTagHoveringOver) {
      return "bg-green-100";
    }
    if (isCardHoveringOver) {
      return "bg-red-100";
    }
    return "bg-white";
  };

  return (
    <div
      draggable={isDragging}
      onDragStart={() => handleDragStart(todo.id)}
      onDragEnd={() => {
        handleDragEnd();
        setIsDragging(false);
      }}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onMouseLeave={() => {
        // Reset drag state when mouse leaves the entire card
        if (isDragging) {
          setIsDragging(false);
        }
      }}
      className={`flex flex-col p-3 rounded-md shadow-sm border-l-4 select-none transition-all
        hover:shadow-md ${getStatusColor()} ${getBackgroundColor()} ${
        isDragging ? "opacity-50 scale-95" : ""
      }`}
    >
      {/* Card header content */}
      <div className="flex items-start mb-2">
        {/* Drag handle */}
        <div
          className="pr-3 text-gray-500 cursor-move"
          onMouseDown={() => setIsDragging(true)}
          // no `onMouseUp` for this div since we will handle it globally
          title="Drag to move"
        >
          <Bars3Icon className="h-5 w-5" />
        </div>

        {/* Editable text */}
        {isEditing ? (
          <input
            ref={editInputRef}
            type="text"
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
            onBlur={saveEdit}
            onKeyDown={(e) => {
              if (e.key === "Enter") saveEdit();
              if (e.key === "Escape") {
                setEditText(todo.text);
                setIsEditing(false);
              }
            }}
            className="flex-1 ml-1 border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        ) : (
          <span
            className="flex-1 ml-1 text-gray-800 cursor-text"
            onDoubleClick={() => setIsEditing(true)}
          >
            {todo.text}
          </span>
        )}

        <button
          ref={tagButtonRef}
          onClick={() => setShowTagSelector(!showTagSelector)}
          className="mr-2 bg-gray-100 hover:bg-gray-200 p-1 rounded cursor-pointer"
          title="Manage Tags"
        >
          <TagIcon className="h-4 w-4 text-gray-600" />
        </button>
        <button
          onClick={() => deleteTodo(todo.id)}
          className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded text-sm transition-colors cursor-pointer"
        >
          <TrashIcon className="h-4 w-4" />
        </button>
      </div>

      {/* Tags display area */}
      {todo.tags.length > 0 && !showTagSelector && (
        <div
          onDoubleClick={() => setShowTagSelector(true)}
          className="flex flex-wrap gap-1 pl-8 mt-1 cursor-pointer relative z-20"
        >
          {todo.tags.map((tag) => (
            <TagChip
              key={tag}
              text={tag}
              isSelected={true}
              mode="read-only"
              todoId={todo.id}
            />
          ))}
        </div>
      )}

      {/* Empty tag area when no tags */}
      {todo.tags.length === 0 && !showTagSelector && (
        <div className="pl-9 mt-1 rounded transition-colors min-h-[20px] relative z-20">
          <span
            className="text-gray-400 text-sm cursor-pointer"
            onClick={() => setShowTagSelector(true)}
          >
            No tags - click to add
          </span>
        </div>
      )}

      {/* Tag selector */}
      {showTagSelector && (
        <div
          ref={tagSelectorRef}
          className="ml-9 mt-2 p-2 bg-gray-50 rounded border cursor-default relative z-20"
        >
          <div className="text-xs text-gray-500 mb-1">
            Click to toggle tags:
          </div>
          <div className="flex flex-wrap gap-1">
            {availableTags.map((tag) => (
              <TagChip
                key={tag}
                text={tag}
                isSelected={todo.tags.includes(tag)}
                mode="toggle-only"
                onClick={() => updateTodoTags(todo.id, tag)}
                draggable={false}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default TodoCard;
