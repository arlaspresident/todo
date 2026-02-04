import { useEffect, useState } from "react";
import type { Todo, TodoStatus } from "./types/todo";
import { fetchTodos, createTodo, updateTodoStatus, deleteTodo } from "./api/todos";
import TodoForm from "./components/TodoForm";
import TodoList from "./components/TodoList";

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
    const newTodo = await createTodo({
      title,
      description: description.trim() ? description.trim() : undefined,
    });
    setTodos((prev) => [newTodo, ...prev]);
  }

  async function handleStatusChange(id: number, status: TodoStatus) {
    const updated = await updateTodoStatus(id, status);
    setTodos((prev) => prev.map((t) => (t.id === id ? updated : t)));
  }

  async function handleDelete(id: number) {
    await deleteTodo(id);
    setTodos((prev) => prev.filter((t) => t.id !== id));
  }

  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: 16 }}>
      <h1>Todo</h1>

      {loading && <p>Laddar</p>}
      {error && <p style={{ color: "crimson" }}>{error}</p>}

      {!loading && !error && (
        <>
          <TodoForm onAdd={handleAdd} />
          <TodoList todos={todos} onStatusChange={handleStatusChange} onDelete={handleDelete} />
        </>
      )}
    </div>
  );
}
