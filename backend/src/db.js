const { Pool } = require("pg");

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DB_SSL === "true" ? { rejectUnauthorized: false } : false,
});

async function initDb() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS notes (
      id SERIAL PRIMARY KEY,
      todo_id INTEGER REFERENCES todos(id) ON DELETE CASCADE,
      author_emoji VARCHAR(10) NOT NULL,
      content TEXT NOT NULL,
      created_at TIMESTAMP DEFAULT NOW()
    );
  `);
  await pool.query(`
    CREATE TABLE IF NOT EXISTS todos (
      id SERIAL PRIMARY KEY,
      title VARCHAR(255) NOT NULL,
      description VARCHAR(500),
      status VARCHAR(20) NOT NULL DEFAULT 'not_started',
      category VARCHAR(100) NOT NULL DEFAULT 'General',
      created_at TIMESTAMP DEFAULT NOW()
    );
  `);
  await pool.query(`
    ALTER TABLE todos ADD COLUMN IF NOT EXISTS category VARCHAR(100) NOT NULL DEFAULT 'General';
  `);
  await pool.query(`
    ALTER TABLE todos ALTER COLUMN description TYPE VARCHAR(500);
  `);
}

module.exports = { pool, initDb };
