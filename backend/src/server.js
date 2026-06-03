const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const { pool, initDb } = require("./db");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/health", (req, res) => {
  res.json({ message: "Backend is running" });
});

app.get("/api/todos", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT id, title, description, status, category, created_at FROM todos ORDER BY id DESC"
    );
    res.json(result.rows);
  } catch (err) {
    console.error("GET /api/todos failed:", err);
    res.status(500).json({ error: "Failed to fetch todos" });
  }
});

app.post("/api/todos", async (req, res) => {
  try {
    const { title, description, category } = req.body;

    if (!title || title.trim().length < 2) {
      return res.status(400).json({ error: "Title must be at least 2 characters" });
    }

    if (description && description.length > 500) {
      return res.status(400).json({ error: "Description must be max 500 characters" });
    }

    const cat = category && category.trim() ? category.trim() : "General";

    const result = await pool.query(
      `INSERT INTO todos (title, description, category)
       VALUES ($1, $2, $3)
       RETURNING id, title, description, status, category, created_at`,
      [title.trim(), description || null, cat]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("POST /api/todos failed:", err);
    res.status(500).json({ error: "Failed to create todo" });
  }
});

app.patch("/api/todos/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description } = req.body;

    if (title !== undefined && title.trim().length < 2) {
      return res.status(400).json({ error: "Title must be at least 2 characters" });
    }

    const result = await pool.query(
      `UPDATE todos
       SET title = COALESCE($1, title),
           description = CASE WHEN $2::text IS NOT NULL THEN $2 ELSE description END
       WHERE id = $3
       RETURNING id, title, description, status, category, created_at`,
      [title ? title.trim() : null, description !== undefined ? (description || null) : null, id]
    );

    if (result.rowCount === 0) return res.status(404).json({ error: "Todo not found" });
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update todo" });
  }
});

app.patch("/api/todos/:id/status", async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const allowed = ["not_started", "in_progress", "done"];
    if (!allowed.includes(status)) {
      return res.status(400).json({ error: "Invalid status" });
    }

    const result = await pool.query(
      `UPDATE todos SET status = $1 WHERE id = $2
       RETURNING id, title, description, status, category, created_at`,
      [status, id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Todo not found" });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update status" });
  }
});

app.delete("/api/todos/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      "DELETE FROM todos WHERE id = $1 RETURNING id",
      [id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Todo not found" });
    }

    res.status(204).send();
  } catch (err) {
    console.error("DELETE /api/todos/:id failed:", err);
    res.status(500).json({ error: "Failed to delete todo" });
  }
});

app.get("/api/notes", async (_req, res) => {
  try {
    const result = await pool.query(
      "SELECT id, author_emoji, content, created_at FROM global_notes ORDER BY created_at ASC"
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch notes" });
  }
});

app.post("/api/notes", async (req, res) => {
  try {
    const { author_emoji, content } = req.body;
    if (!content || !content.trim()) return res.status(400).json({ error: "Content required" });
    if (!author_emoji) return res.status(400).json({ error: "Author required" });
    const result = await pool.query(
      "INSERT INTO global_notes (author_emoji, content) VALUES ($1, $2) RETURNING id, author_emoji, content, created_at",
      [author_emoji, content.trim()]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to add note" });
  }
});

const PORT = process.env.PORT || 5000;

(async () => {
  try {
    await initDb();
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error("DB init failed:", err);
    process.exit(1);
  }
})();
