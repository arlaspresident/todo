import type { Todo, TodoStatus } from "../types/todo";

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
        <li
            style={{
                border: "1px solid #ddd",
                borderRadius: 8,
                padding: 12,
                display: "grid",
                gap: 8,
            }}
        >
            <div>
                <strong>{todo.title}</strong>
                {todo.description ? <p style={{ margin: "6px 0 0" }}>{todo.description}</p> : null}
            </div>

            <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
                <label>
                    Status:
                    <select
                        value={todo.status}
                        onChange={(e) => onStatusChange(todo.id, e.target.value as TodoStatus)}
                        style={{ marginLeft: 8, padding: 6 }}
                    >
                        <option value="not_started">{statusLabel.not_started}</option>
                        <option value="in_progress">{statusLabel.in_progress}</option>
                        <option value="done">{statusLabel.done}</option>
                    </select>
                </label>

                <button
                    onClick={() => onDelete(todo.id)}
                    style={{ padding: "6px 10px" }}
                >
                    Ta bort
                </button>
            </div>
        </li>
    );
}
