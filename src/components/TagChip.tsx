import React, { useState, useRef, useEffect } from "react";
import { PlusIcon, XMarkIcon } from "@heroicons/react/16/solid";
import { useTodoContext } from "../contexts/TodoContext";

// Define the possible modes as a type
type TagChipMode = "full" | "toggle-only" | "read-only" | "add-button";

interface TagChipProps {
  text: string;
  isSelected?: boolean;
  mode?: TagChipMode;
  onClick?: () => void;
  todoId?: string; // For tags on todo cards - so we know which todo to remove from
  draggable?: boolean;
}

const TagChip: React.FC<TagChipProps> = ({
  text,
  isSelected = false,
  mode = "full", // Default is full functionality
  onClick,
  todoId,
  draggable = true,
}) => {
  const {
    deleteTag,
    updateTagText,
    handleTagDragStart,
    handleTagDragEnd,
    draggedTag,
  } = useTodoContext();

  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(text);
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Focus input when editing starts
  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  const handleSave = () => {
    const updatedEditText = editText.trim();
    if (updatedEditText === "") {
      setEditText(text); // Revert to original
      setIsEditing(false);
      return;
    }

    if (updatedEditText !== text) {
      updateTagText(text, updatedEditText);
    }

    setIsEditing(false);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    deleteTag(text);
  };

  const handleDragStart = (e: React.DragEvent) => {
    e.stopPropagation();
    setIsDragging(true);
    handleTagDragStart(text);

    // Set drag data
    e.dataTransfer.setData("text/plain", text);
    e.dataTransfer.setData("application/tag-source", todoId || "creation-area");
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragEnd = () => {
    setIsDragging(false);
    handleTagDragEnd();
  };

  if (mode === "add-button") {
    return (
      <button
        onClick={onClick}
        className="flex items-center bg-gray-200 border border-gray-300 hover:bg-gray-300 px-2 py-1 rounded-full text-sm transition-colors cursor-pointer"
      >
        <PlusIcon className="h-4 w-4 mr-1" />
        <span className="mr-2">{text}</span>
      </button>
    );
  }

  // Determine if checkbox should be shown
  const showCheckbox = mode === "full" || mode === "toggle-only";

  // Determine if editing is allowed
  const canEdit = mode === "full";

  // Determine if delete is allowed
  const canDelete = mode === "full";

  // Determine if the tag can be dragged
  const canDrag = draggable && !isEditing;

  return (
    <div
      draggable={canDrag}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onClick={onClick}
      className={`flex items-center px-2 py-1 rounded-full text-sm border transition-all ${
        isSelected
          ? "bg-blue-100 text-blue-800 border-blue-300 hover:bg-blue-200"
          : "bg-gray-100 text-gray-800 border-gray-200 hover:bg-gray-200"
      } ${
        isEditing
          ? "cursor-text"
          : mode !== "read-only"
          ? "cursor-pointer"
          : "cursor-default"
      } ${isDragging ? "opacity-50 scale-95" : ""} ${
        draggedTag === text ? "ring-2 ring-blue-400" : "" // Highlight existed tag
      }`}
    >
      {showCheckbox && (
        <input
          type="checkbox"
          checked={isSelected}
          className="mr-1 h-3 w-3 cursor-pointer"
        />
      )}

      {isEditing ? (
        <input
          ref={inputRef}
          type="text"
          value={editText}
          onChange={(e) => setEditText(e.target.value)}
          onBlur={handleSave}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleSave();
            if (e.key === "Escape") {
              setEditText(text); // Revert to original
              setIsEditing(false);
            }
            e.stopPropagation();
          }}
          className="bg-transparent w-full outline-none text-sm"
          onClick={(e) => e.stopPropagation()}
        />
      ) : (
        <span
          onDoubleClick={(e) => {
            e.stopPropagation();
            if (canEdit) setIsEditing(true);
          }}
          className="overflow-hidden text-ellipsis whitespace-nowrap max-w-[100px]"
          title={text}
        >
          {text}
        </span>
      )}

      {canDelete && !isEditing && (
        <button
          onClick={handleDelete}
          className="ml-1 text-gray-500 hover:text-red-500 cursor-pointer"
        >
          <XMarkIcon className="h-3 w-3" />
        </button>
      )}
    </div>
  );
};

export default TagChip;
