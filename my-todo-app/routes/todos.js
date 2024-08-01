// routes/todos.js
const express = require('express');
const router = express.Router();
const todoController = require('../controllers/todoController');
const authenticateJWT = require('../middlewares/authMiddleware');

// Apply authentication middleware
router.use(authenticateJWT);

// Create a new to-do item
router.post('/', todoController.createTodo);

// Retrieve all to-do items for the logged-in user
router.get('/', todoController.getAllTodos);

// Update a to-do item by ID
router.put('/:id', todoController.updateTodo);

// Delete a to-do item by ID
router.delete('/:id', todoController.deleteTodo);

module.exports = router;
