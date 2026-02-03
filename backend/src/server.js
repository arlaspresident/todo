const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const { pool, initDb } = require("./db");

const app = express();

app.use(cors());
app.use(express.json());

//health
app.get("/health", (req, res) => {
  res.json({ message: "Backend is running" });
});

//GET todos
app.get("/api/todos", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT id, title, description, status, created_at FROM todos ORDER BY id DESC"
    );
    res.json(result.rows);
  } catch (err) {
    console.error("GET /api/todos failed:", err);
    res.status(500).json({ error: "Failed to fetch todos" });
  }
});

//POST

app.post("/api/todos", async (req, res) => {
  try {
    const { title, description } = req.body;

    //validering
    if (!title || title.trim().length < 3) {
      return res.status(400).json({ error: "Title must be at least 3 characters" });
    }

    if (description && description.length > 200) {
      return res.status(400).json({ error: "Description must be max 200 characters" });
    }

    const result = await pool.query(
      `INSERT INTO todos (title, description)
       VALUES ($1, $2)
       RETURNING id, title, description, status, created_at`,
      [title.trim(), description || null]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("POST /api/todos failed:", err);
    res.status(500).json({ error: "Failed to create todo" });
  }
});

//PATCH
app.patch("/api/todos/:id/status", async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const allowed = ["not_started", "in_progress", "done"];
    if (!allowed.includes(status)) {
      return res.status(400).json({ error: "Invalid status" });
    }

    const result = await pool.query(
      `UPDATE todos
       SET status = $1
       WHERE id = $2
       RETURNING id, title, description, status, created_at`,
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

//DELETE
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


const PORT = process.env.PORT || 5000;

// starta server efter db init
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
