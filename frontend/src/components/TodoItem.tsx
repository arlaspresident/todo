import { useState, useRef } from "react";
import type { Todo } from "../types/todo";
import { updateTodo } from "../api/todos";
import "./TodoItem.css";

type Props = {
  todo: Todo;
  onToggle: (id: number, done: boolean) => Promise<void> | void;
  onDelete: (id: number) => Promise<void> | void;
  onUpdate: (updated: Todo) => void;
  onOpenNotes: (todo: Todo) => void;
};

export default function TodoItem({ todo, onToggle, onDelete, onUpdate, onOpenNotes }: Props) {
  const [editingTitle, setEditingTitle] = useState(false);
  const [titleVal, setTitleVal] = useState(todo.title);
  const [editingDesc, setEditingDesc] = useState(false);
  const [descVal, setDescVal] = useState(todo.description ?? "");
  const [expanded, setExpanded] = useState(false);
  const [saving, setSaving] = useState(false);
  const titleRef = useRef<HTMLInputElement>(null);
  const done = todo.status === "done";

  async function saveTitle() {
    const val = titleVal.trim();
    if (!val || val === todo.title) { setEditingTitle(false); setTitleVal(todo.title); return; }
    try {
      setSaving(true);
      const updated = await updateTodo(todo.id, { title: val });
      onUpdate(updated);
    } finally {
      setSaving(false);
      setEditingTitle(false);
    }
  }

  async function saveDesc() {
    if (descVal.trim() === (todo.description ?? "")) { setEditingDesc(false); return; }
    try {
      setSaving(true);
      const updated = await updateTodo(todo.id, { description: descVal.trim() || "" });
      onUpdate(updated);
    } finally {
      setSaving(false);
      setEditingDesc(false);
    }
  }

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
        {editingTitle ? (
          <input
            ref={titleRef}
            className="todo-title-input"
            placeholder="Task title"
            value={titleVal}
            onChange={(e) => setTitleVal(e.target.value)}
            onBlur={saveTitle}
            onKeyDown={(e) => { if (e.key === "Enter") saveTitle(); if (e.key === "Escape") { setEditingTitle(false); setTitleVal(todo.title); } }}
            disabled={saving}
            autoFocus
          />
        ) : (
          <span
            className="todo-title"
            onClick={() => { if (!done) { setEditingTitle(true); } }}
            title={done ? undefined : "Click to edit"}
          >
            {todo.title}
          </span>
        )}

        {!editingTitle && (
          <button
            type="button"
            className="todo-note-toggle"
            onClick={() => setExpanded((v) => !v)}
          >
            {expanded ? "hide" : todo.description ? "note" : "+ note"}
          </button>
        )}

        {expanded && (
          editingDesc ? (
            <textarea
              className="todo-desc-input"
              placeholder="Add a note..."
              value={descVal}
              onChange={(e) => setDescVal(e.target.value)}
              onBlur={saveDesc}
              onKeyDown={(e) => { if (e.key === "Escape") { setEditingDesc(false); setDescVal(todo.description ?? ""); } }}
              disabled={saving}
              rows={2}
              autoFocus
            />
          ) : (
            <p
              className="todo-description"
              onClick={() => setEditingDesc(true)}
              title="Click to edit note"
            >
              {todo.description || <span className="todo-desc-placeholder">Add a note...</span>}
            </p>
          )
        )}
      </div>

      <button
        type="button"
        className="todo-notes-btn"
        onClick={() => onOpenNotes(todo)}
        aria-label="Open notes"
      >
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <path d="M2 2h10a1 1 0 011 1v6a1 1 0 01-1 1H5l-3 2V3a1 1 0 011-1z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round"/>
        </svg>
      </button>

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
