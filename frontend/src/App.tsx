import { useEffect, useState } from "react";
import type { Todo } from "./types/todo";
import { fetchTodos, createTodo, updateTodoStatus, deleteTodo } from "./api/todos";
import CategorySection from "./components/TodoList";
import NotesPanel from "./components/NotesPanel";
import "./App.css";

const PRESET_CATEGORIES = [
  "Pricing",
  "Legal",
  "Enterprise",
  "Scraper / Loading",
  "Integrations",
  "Before Launch",
];

export default function App() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [extraCategories, setExtraCategories] = useState<string[]>([]);
  const [addingCategory, setAddingCategory] = useState(false);
  const [newCatName, setNewCatName] = useState("");
  const [selectedTodo, setSelectedTodo] = useState<Todo | null>(null);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const data = await fetchTodos();
        if (!alive) return;
        setTodos(data);
        const known = new Set(PRESET_CATEGORIES);
        const extra = [...new Set(data.map((t) => t.category).filter((c) => !known.has(c)))];
        setExtraCategories(extra);
      } catch (e) {
        if (alive) setError(e instanceof Error ? e.message : "Failed to load");
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => { alive = false; };
  }, []);

  const allCategories = [...PRESET_CATEGORIES, ...extraCategories];

  async function handleAdd(title: string, description: string, category: string) {
    try {
      setError(null);
      const t = await createTodo({ title, description: description || undefined, category });
      setTodos((prev) => [t, ...prev]);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to add task");
    }
  }

  async function handleToggle(id: number, done: boolean) {
    try {
      setError(null);
      const updated = await updateTodoStatus(id, done ? "done" : "not_started");
      setTodos((prev) => prev.map((t) => (t.id === id ? updated : t)));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to update task");
    }
  }

  function handleUpdate(updated: Todo) {
    setTodos((prev) => prev.map((t) => (t.id === updated.id ? updated : t)));
    if (selectedTodo?.id === updated.id) setSelectedTodo(updated);
  }

  async function handleDelete(id: number) {
    try {
      setError(null);
      await deleteTodo(id);
      setTodos((prev) => prev.filter((t) => t.id !== id));
      if (selectedTodo?.id === id) setSelectedTodo(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to delete task");
    }
  }

  function handleAddCategory() {
    const name = newCatName.trim();
    if (!name || allCategories.includes(name)) return;
    setExtraCategories((prev) => [...prev, name]);
    setNewCatName("");
    setAddingCategory(false);
  }

  const totalDone = todos.filter((t) => t.status === "done").length;
  const totalAll = todos.length;

  return (
    <>
      <div className="app">
        <header className="app-header">
          <div className="app-header-top">
            <h1 className="app-title">Reputio MVP</h1>
            <span className="app-stats">{totalDone}/{totalAll} done</span>
          </div>
          <progress className="app-progress-bar" value={totalDone} max={totalAll || 1} />
        </header>

        {error && <div className="error-banner">{error}</div>}
        {loading && <p className="loading-state">Loading...</p>}

        {!loading && (
          <>
            <div className="categories">
              {allCategories.map((cat, i) => (
                <CategorySection
                  key={cat}
                  category={cat}
                  colorIndex={i % 10}
                  todos={todos.filter((t) => t.category === cat)}
                  onAdd={handleAdd}
                  onToggle={handleToggle}
                  onDelete={handleDelete}
                  onUpdate={handleUpdate}
                  onOpenNotes={setSelectedTodo}
                />
              ))}
            </div>

            <div className="add-category-row">
              {addingCategory ? (
                <div className="new-category-form">
                  <input
                    className="new-category-input"
                    placeholder="Category name"
                    value={newCatName}
                    onChange={(e) => setNewCatName(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleAddCategory();
                      if (e.key === "Escape") { setAddingCategory(false); setNewCatName(""); }
                    }}
                    autoFocus
                  />
                  <button type="button" className="new-category-confirm" onClick={handleAddCategory}>Add</button>
                  <button type="button" className="new-category-cancel" onClick={() => { setAddingCategory(false); setNewCatName(""); }}>Cancel</button>
                </div>
              ) : (
                <button type="button" className="add-category-btn" onClick={() => setAddingCategory(true)}>
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                    <path d="M6 1v10M1 6h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                  </svg>
                  New category
                </button>
              )}
            </div>
          </>
        )}
      </div>

      <NotesPanel todo={selectedTodo} onClose={() => setSelectedTodo(null)} />
    </>
  );
}
