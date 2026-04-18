const pool = require("../db/db");

// GET tasks
exports.getTasks = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM tasks ORDER BY id DESC");
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

// ADD task
exports.addTask = async (req, res) => {
  try {
    const { title, bucket, priority } = req.body;

    const result = await pool.query(
      "INSERT INTO tasks (title, bucket, priority) VALUES ($1, $2, $3) RETURNING *",
      [title, bucket || "today", priority || "medium"]
    );

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

// DELETE task
exports.deleteTask = async (req, res) => {
  try {
    const { id } = req.params;

    await pool.query("DELETE FROM tasks WHERE id=$1", [id]);

    res.json({ message: "Deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

//COMPLETE TASK
exports.toggleTask = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      "UPDATE tasks SET completed = NOT completed WHERE id=$1 RETURNING *",
      [id]
    );

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

//UPDATE TASK 
exports.updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const { title } = req.body;

    const result = await pool.query(
      "UPDATE tasks SET title=$1 WHERE id=$2 RETURNING *",
      [title, id]
    );

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};