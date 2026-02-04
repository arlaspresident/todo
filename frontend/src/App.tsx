import { useEffect, useState } from "react";
import type { Todo, TodoStatus } from "./types/todo";
import { fetchTodos, createTodo, updateTodoStatus, deleteTodo } from "./api/todos";
import TodoForm from "./components/TodoForm";
import TodoList from "./components/TodoList";
import "./App.css";

export default function App() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;

    (async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchTodos();
        if (alive) setTodos(data);
      } catch (e) {
        if (alive) setError(e instanceof Error ? e.message : "Något gick fel");
      } finally {
        if (alive) setLoading(false);
      }
    })();

    return () => {
      alive = false;
    };
  }, []);

  async function handleAdd(title: string, description: string) {
    try {
      setError(null);

      const newTodo = await createTodo({
        title,
        description: description.trim() ? description.trim() : undefined,
      });

      setTodos((prev) => [newTodo, ...prev]);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Kunde inte lägga till todo");
    }
  }

  async function handleStatusChange(id: number, status: TodoStatus) {
    try {
      setError(null);

      const updated = await updateTodoStatus(id, status);

      setTodos((prev) => prev.map((t) => (t.id === id ? updated : t)));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Kunde inte uppdatera status");
    }
  }

  async function handleDelete(id: number) {
    try {
      setError(null);

      await deleteTodo(id);

      setTodos((prev) => prev.filter((t) => t.id !== id));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Kunde inte ta bort todo");
    }
  }


  return (
    <div className="app">
      <h1>Todo</h1>

      {loading && <p>Laddar...</p>}
      {error && <p className="error">{error}</p>}

      {!loading && !error && (
        <div className="grid">
          <TodoForm onAdd={handleAdd} />
          <TodoList
            todos={todos}
            onStatusChange={handleStatusChange}
            onDelete={handleDelete}
          />
        </div>
      )}
    </div>
  );
}
