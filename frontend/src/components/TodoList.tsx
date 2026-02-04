import type { Todo, TodoStatus } from "../types/todo";

type Props = {
  todos: Todo[];
  onStatusChange: (id: number, status: TodoStatus) => Promise<void> | void;
  onDelete: (id: number) => Promise<void> | void;
};

export default function TodoList(_props: Props) {
  return null;
}
