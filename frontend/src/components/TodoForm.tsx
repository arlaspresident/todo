import { useState } from "react";
import "./TodoForm.css";

type Props = {
    onAdd: (title: string, description: string) => Promise<void> | void;
};

export default function TodoForm({ onAdd }: Props) {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [submitting, setSubmitting] = useState(false);

    function validate(): string | null {
        if (title.trim().length < 3) return "Titel måste vara minst 3 tecken";
        if (description.length > 200) return "Beskrivning får max vara 200 tecken";
        return null;
    }

    async function handleSubmit(e: React.SyntheticEvent) {
        e.preventDefault();

        const msg = validate();
        if (msg) {
            setError(msg);
            return;
        }

        try {
            setSubmitting(true);
            setError(null);
            await onAdd(title.trim(), description);
            setTitle("");
            setDescription("");
        } catch (e) {
            setError(e instanceof Error ? e.message : "Kunde inte skapa todo.");
        } finally {
            setSubmitting(false);
        }
    }

    return (
        <div className="todo-form">
            <h2>Lägg till todo</h2>

            <form onSubmit={handleSubmit}>
                <label>
                    Titel *
                    <input
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Minst 3 tecken"
                        disabled={submitting}
                    />
                </label>

                <label>
                    Beskrivning
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Max 200 tecken"
                        disabled={submitting}
                        rows={3}
                    />
                </label>

                {error && <p className="error">{error}</p>}

                <button type="submit" disabled={submitting}>
                    {submitting ? "Skickar..." : "Lägg till"}
                </button>
            </form>
        </div>
    );
}
