import { useState } from "react";
import type { Todo } from "../types/todo";
import "./TodoItem.css";

type Props = {
  todo: Todo;
  onToggle: (id: number, done: boolean) => Promise<void> | void;
  onDelete: (id: number) => Promise<void> | void;
};

export default function TodoItem({ todo, onToggle, onDelete }: Props) {
  const [expanded, setExpanded] = useState(false);
  const done = todo.status === "done";

  return (
    <li className={`todo-item${done ? " todo-item--done" : ""}`}>
      <button
        type="button"
        className="todo-checkbox"
        onClick={() => onToggle(todo.id, !done)}
        aria-label={done ? "Mark incomplete" : "Mark complete"}
      >
        {done ? (
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <circle cx="8" cy="8" r="7.5" fill="#22c55e" stroke="#22c55e" strokeWidth="1"/>
            <path d="M5 8l2 2 4-4" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        ) : (
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <circle cx="8" cy="8" r="7.5" stroke="#3a3a3f" strokeWidth="1"/>
          </svg>
        )}
      </button>

      <div className="todo-content">
        <span className="todo-title">{todo.title}</span>
        {todo.description && (
          <button
            type="button"
            className="todo-note-toggle"
            onClick={() => setExpanded((v) => !v)}
          >
            {expanded ? "Hide note" : "Note"}
          </button>
        )}
        {todo.description && expanded && (
          <p className="todo-description">{todo.description}</p>
        )}
      </div>

      <button
        type="button"
        className="todo-delete"
        onClick={() => onDelete(todo.id)}
        aria-label="Delete task"
      >
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <path d="M2 2l10 10M12 2L2 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
      </button>
    </li>
  );
}
