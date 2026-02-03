const { Pool } = require("pg");

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl:
    process.env.DB_SSL === "true"
      ? { rejectUnauthorized: false }
      : false,
});

async function initDb() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS todos (
      id SERIAL PRIMARY KEY,
      title VARCHAR(255) NOT NULL,
      description VARCHAR(200),
      status VARCHAR(20) NOT NULL DEFAULT 'not_started',
      created_at TIMESTAMP DEFAULT NOW()
    );
  `);
}

module.exports = { pool, initDb };
