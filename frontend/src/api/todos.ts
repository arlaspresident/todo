import type { Todo, TodoStatus, CreateTodoPayload, Note } from "../types/todo";

const BASE = import.meta.env.VITE_API_BASE_URL as string;

if (!BASE) {
  throw new Error("VITE_API_BASE_URL is missing");
}

async function handle(promise: Promise<Response>) {
  const res = await promise;
  if (!res.ok) {
    let msg = `HTTP ${res.status}`;
    try {
      const data = await res.json();
      if (data?.error) msg = data.error;
    } catch {}
    throw new Error(msg);
  }
  return res;
}

export async function fetchTodos(): Promise<Todo[]> {
  const res = await handle(fetch(`${BASE}/api/todos`));
  return res.json();
}

export async function createTodo(payload: CreateTodoPayload): Promise<Todo> {
  const res = await handle(
    fetch(`${BASE}/api/todos`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })
  );
  return res.json();
}

export async function updateTodo(id: number, fields: { title?: string; description?: string }): Promise<Todo> {
  const res = await handle(
    fetch(`${BASE}/api/todos/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(fields),
    })
  );
  return res.json();
}

export async function updateTodoStatus(id: number, status: TodoStatus): Promise<Todo> {
  const res = await handle(
    fetch(`${BASE}/api/todos/${id}/status`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    })
  );
  return res.json();
}

export async function fetchNotes(): Promise<Note[]> {
  const res = await handle(fetch(`${BASE}/api/notes`));
  return res.json();
}

export async function addNote(author_emoji: string, content: string): Promise<Note> {
  const res = await handle(
    fetch(`${BASE}/api/notes`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ author_emoji, content }),
    })
  );
  return res.json();
}

export async function deleteTodo(id: number): Promise<void> {
  const res = await handle(
    fetch(`${BASE}/api/todos/${id}`, { method: "DELETE" })
  );
  if (res.status !== 204) await res.text();
}
