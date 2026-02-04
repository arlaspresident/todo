import type { Todo, TodoStatus } from "../types/todo";
import TodoItem from "./TodoItem";

type Props = {
    todos: Todo[];
    onStatusChange: (id: number, status: TodoStatus) => Promise<void> | void;
    onDelete: (id: number) => Promise<void> | void;
};

export default function TodoList({ todos, onStatusChange, onDelete }: Props) {
    if (todos.length === 0) return <p>Inga todos än.</p>;

    return (
        <div>
            <h2>Lista</h2>
            <ul style={{ listStyle: "none", padding: 0, display: "grid", gap: 10 }}>
                {todos.map((t) => (
                    <TodoItem key={t.id} todo={t} onStatusChange={onStatusChange} onDelete={onDelete} />
                ))}
            </ul>
        </div>
    );
}
