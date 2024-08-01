
// routes/auth.js
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Register a new user
router.post('/register', authController.register);

// Log in an existing user
router.post('/login', authController.login);

// Retrieve all user sessions (activity logs)
router.get('/sessions', authenticateJWT, authController.getSessions);


module.exports = router;

