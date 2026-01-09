require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");

const app = express();

/* -----------------------
   Connect to database
----------------------- */
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }, // needed for Railway
});

pool
  .query("SELECT NOW()")
  .then(() => console.log("DB connected"))
  .catch((err) => console.error("DB connection failed", err));


/* -----------------------
   Middleware
----------------------- */
app.use(cors()); // allow frontend access
app.use(express.json());

/* -----------------------
   API routes
----------------------- */

// Test route
app.get("/", (req, res) => {
  res.send("API running");
});

// Example: fetch stories
app.get("/stories", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM stories ORDER BY id DESC");
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database query failed" });
  }
});

/* -----------------------
   Start server
----------------------- */
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`API listening on port ${PORT}`);
});
