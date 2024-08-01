// controllers/todoController.js
const db = require('../config/db');

// Create a new to-do item
exports.createTodo = (req, res) => {
  const { description, status = false } = req.body;
  const userId = req.user.id;

  // Validate input
  if (!description) {
    return res.status(400).json({ message: 'Description is required' });
  }

  // Insert the new to-do item into the database
  db.run(
    "INSERT INTO todos (user_id, description, status) VALUES (?, ?, ?)",
    [userId, description, status],
    function (err) {
      if (err) return res.status(500).json({ message: 'Error creating to-do item' });
      res.status(201).json({ id: this.lastID, description, status });
    }
  );
};
// Fetch all to-do items for the logged-in user
exports.getAllTodos = (req, res) => {
  const userId = req.user.id;

  db.all("SELECT * FROM todos WHERE user_id = ?", [userId], (err, rows) => {
    if (err) return res.status(500).json({ message: 'Error fetching to-do items' });
    res.json(rows);
  });
};
// Update an existing to-do item
exports.updateTodo = (req, res) => {
  const { description, status } = req.body;
  const todoId = req.params.id;
  const userId = req.user.id;

  // Validate input
  if (description === undefined && status === undefined) {
    return res.status(400).json({ message: 'At least one field (description or status) is required to update' });
  }

  // Update the to-do item in the database
  db.run(
    `UPDATE todos SET description = COALESCE(?, description), status = COALESCE(?, status) WHERE id = ? AND user_id = ?`,
    [description, status, todoId, userId],
    function (err) {
      if (err) return res.status(500).json({ message: 'Error updating to-do item' });
      if (this.changes === 0) return res.status(404).json({ message: 'To-do item not found' });
      res.json({ message: 'To-do item updated' });
    }
  );
};
// Delete a to-do item
exports.deleteTodo = (req, res) => {
  const todoId = req.params.id;
  const userId = req.user.id;

  db.run("DELETE FROM todos WHERE id = ? AND user_id = ?", [todoId, userId], function (err) {
    if (err) return res.status(500).json({ message: 'Error deleting to-do item' });
    if (this.changes === 0) return res.status(404).json({ message: 'To-do item not found' });
    res.json({ message: 'To-do item deleted' });
  });
};
