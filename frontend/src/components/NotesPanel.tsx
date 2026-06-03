import { useEffect, useRef, useState } from "react";
import type { Note, Todo } from "../types/todo";
import { fetchNotes, addNote } from "../api/todos";
import "./NotesPanel.css";

const CHARACTERS = ["🦊", "🐺", "🐻", "🐯", "🌙", "⚡", "🔥", "🌊"];

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return "just now";
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

type Props = {
  todo: Todo | null;
  onClose: () => void;
};

export default function NotesPanel({ todo, onClose }: Props) {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(false);
  const [text, setText] = useState("");
  const [sending, setSending] = useState(false);
  const [character, setCharacter] = useState<string>(
    () => localStorage.getItem("reputio_character") ?? ""
  );
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!todo) return;
    let alive = true;
    setLoading(true);
    setNotes([]);
    fetchNotes(todo.id).then((data) => {
      if (alive) { setNotes(data); setLoading(false); }
    }).catch(() => { if (alive) setLoading(false); });
    return () => { alive = false; };
  }, [todo?.id]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [notes]);

  function pickCharacter(emoji: string) {
    setCharacter(emoji);
    localStorage.setItem("reputio_character", emoji);
  }

  async function handleSend() {
    if (!todo || !text.trim() || !character) return;
    try {
      setSending(true);
      const note = await addNote(todo.id, character, text.trim());
      setNotes((prev) => [...prev, note]);
      setText("");
    } finally {
      setSending(false);
    }
  }

  return (
    <>
      <div className={`notes-backdrop${todo ? " notes-backdrop--open" : ""}`} onClick={onClose} />
      <aside className={`notes-panel${todo ? " notes-panel--open" : ""}`}>
        <div className="notes-header">
          <div className="notes-header-title">
            <span className="notes-header-label">Notes</span>
            {todo && <span className="notes-header-task">{todo.title}</span>}
          </div>
          <button type="button" className="notes-close" onClick={onClose} aria-label="Close">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M2 2l10 10M12 2L2 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </button>
        </div>

        <div className="notes-character-picker">
          <span className="notes-character-label">
            {character ? `You're ${character}` : "Pick your character"}
          </span>
          <div className="notes-characters">
            {CHARACTERS.map((emoji) => (
              <button
                key={emoji}
                type="button"
                className={`notes-character-btn${character === emoji ? " notes-character-btn--active" : ""}`}
                onClick={() => pickCharacter(emoji)}
              >
                {emoji}
              </button>
            ))}
          </div>
        </div>

        <div className="notes-list">
          {loading && <p className="notes-empty">Loading...</p>}
          {!loading && notes.length === 0 && (
            <p className="notes-empty">No notes yet. Be the first.</p>
          )}
          {notes.map((note) => (
            <div key={note.id} className="note-item">
              <span className="note-avatar">{note.author_emoji}</span>
              <div className="note-body">
                <p className="note-content">{note.content}</p>
                <span className="note-time">{timeAgo(note.created_at)}</span>
              </div>
            </div>
          ))}
          <div ref={bottomRef} />
        </div>

        <div className="notes-compose">
          {!character && (
            <p className="notes-compose-warning">Pick a character above to write a note</p>
          )}
          <textarea
            className="notes-textarea"
            placeholder="Write a note..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
            disabled={!character || sending}
            rows={3}
          />
          <button
            type="button"
            className="notes-send"
            onClick={handleSend}
            disabled={!character || !text.trim() || sending}
          >
            {sending ? "Sending..." : "Send"}
          </button>
        </div>
      </aside>
    </>
  );
}
