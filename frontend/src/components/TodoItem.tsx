import type { Todo, TodoStatus } from "../types/todo";
import "./TodoItem.css";

type Props = {
  todo: Todo;
  onStatusChange: (id: number, status: TodoStatus) => Promise<void> | void;
  onDelete: (id: number) => Promise<void> | void;
};

const statusLabel: Record<TodoStatus, string> = {
  not_started: "Ej påbörjad",
  in_progress: "Pågående",
  done: "Avklarad",
};

export default function TodoItem({ todo, onStatusChange, onDelete }: Props) {
  return (
    <li className="todo-item">
      <div className="content">
        <strong className="title">{todo.title}</strong>
        {todo.description && <p className="desc">{todo.description}</p>}
      </div>

      <div className="actions">
        <label className="status">
          Status:
          <select
            value={todo.status}
            onChange={(e) => onStatusChange(todo.id, e.target.value as TodoStatus)}
          >
            <option value="not_started">{statusLabel.not_started}</option>
            <option value="in_progress">{statusLabel.in_progress}</option>
            <option value="done">{statusLabel.done}</option>
          </select>
        </label>

        <button className="danger" onClick={() => onDelete(todo.id)}>
          Ta bort
        </button>
      </div>
    </li>
  );
}
