import type { Todo, TodoStatus } from "../types/todo";
import TodoItem from "./TodoItem";
import "./TodoList.css";

type Props = {
    todos: Todo[];
    onStatusChange: (id: number, status: TodoStatus) => Promise<void> | void;
    onDelete: (id: number) => Promise<void> | void;
};

export default function TodoList({ todos, onStatusChange, onDelete }: Props) {
    if (todos.length === 0) return <p>Inga todos än.</p>;

    return (
        <div className="todo-list">
            <h2>Lista</h2>
            <ul>
                {todos.map((t) => (
                    <TodoItem
                        key={t.id}
                        todo={t}
                        onStatusChange={onStatusChange}
                        onDelete={onDelete}
                    />
                ))}
            </ul>
        </div>
    );
}
