import { useState, useRef } from "react";
import type { Todo } from "../types/todo";
import TodoItem from "./TodoItem";
import "./TodoList.css";

type Props = {
  category: string;
  colorIndex: number;
  todos: Todo[];
  onAdd: (title: string, description: string, category: string) => Promise<void>;
  onToggle: (id: number, done: boolean) => Promise<void>;
  onDelete: (id: number) => Promise<void>;
  onUpdate: (updated: Todo) => void;
};

export default function CategorySection({ category, colorIndex, todos, onAdd, onToggle, onDelete, onUpdate }: Props) {
  const [open, setOpen] = useState(true);
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [showDesc, setShowDesc] = useState(false);
  const [adding, setAdding] = useState(false);
  const [inputActive, setInputActive] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const done = todos.filter((t) => t.status === "done").length;
  const total = todos.length;

  async function handleAdd() {
    if (title.trim().length < 2) return;
    try {
      setAdding(true);
      await onAdd(title.trim(), desc.trim(), category);
      setTitle("");
      setDesc("");
      setShowDesc(false);
      setInputActive(false);
      inputRef.current?.blur();
    } finally {
      setAdding(false);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleAdd(); }
    if (e.key === "Escape") { setTitle(""); setDesc(""); setShowDesc(false); setInputActive(false); }
  }

  return (
    <div className="category-section" data-color={colorIndex}>
      <button type="button" className="category-header" onClick={() => setOpen((v) => !v)}>
        <span className="category-dot" />
        <span className="category-name">{category}</span>
        <span className="category-count">{done}/{total}</span>
        <span className={`category-chevron${open ? " category-chevron--open" : ""}`}>
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </span>
      </button>

      {open && (
        <>
          <progress className="category-progress" value={done} max={total || 1} />

          <div className="category-todos">
            <ul>
              {todos.map((t) => (
                <TodoItem key={t.id} todo={t} onToggle={onToggle} onDelete={onDelete} onUpdate={onUpdate} />
              ))}
            </ul>
          </div>

          <div className="add-task-row">
            <span className="add-task-icon">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M7 2v10M2 7h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            </span>
            <input
              ref={inputRef}
              className="add-task-input"
              placeholder="Add task..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onFocus={() => setInputActive(true)}
              onKeyDown={handleKeyDown}
              disabled={adding}
            />
            {inputActive && title.trim().length > 0 && (
              <button type="button" className="add-task-desc-toggle" onClick={() => setShowDesc((v) => !v)}>
                {showDesc ? "− note" : "+ note"}
              </button>
            )}
            {inputActive && <span className="add-task-hint">↵ to add</span>}
          </div>

          {inputActive && showDesc && (
            <div className="add-task-expanded">
              <textarea
                className="add-task-desc"
                placeholder="Add a note..."
                value={desc}
                onChange={(e) => setDesc(e.target.value)}
                rows={2}
                disabled={adding}
              />
              <div className="add-task-actions">
                <button type="button" className="add-task-submit" onClick={handleAdd} disabled={adding || title.trim().length < 2}>
                  {adding ? "Adding..." : "Add task"}
                </button>
                <button type="button" className="add-task-cancel" onClick={() => { setTitle(""); setDesc(""); setShowDesc(false); setInputActive(false); }}>
                  Cancel
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
