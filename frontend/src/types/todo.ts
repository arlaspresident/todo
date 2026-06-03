export type TodoStatus = "not_started" | "in_progress" | "done";

export interface Todo {
  id: number;
  title: string;
  description: string | null;
  status: TodoStatus;
  category: string;
  created_at: string;
}

export interface CreateTodoPayload {
  title: string;
  description?: string;
  category: string;
}
