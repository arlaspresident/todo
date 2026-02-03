const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { Pool } = require('pg');

dotenv.config();

const app = express();
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

app.use(cors());
app.use(express.json());

//test
pool.on('error', (err) => console.error('Unexpected error on idle client', err));

app.get('/health', (req, res) => {
  res.json({ message: 'Backend is running' });
});

//CRUD här

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});