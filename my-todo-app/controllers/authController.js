// controllers/authController.js
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/db');

// Register a new user
exports.register = (req, res) => {
  const { username, password } = req.body;

  // Check if username is provided
  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password are required' });
  }

  // Hash the password
  bcrypt.hash(password, 10, (err, hashedPassword) => {
    if (err) return res.status(500).json({ message: 'Server error' });

    // Insert user into the database
    db.run("INSERT INTO users (username, password) VALUES (?, ?)", [username, hashedPassword], function (err) {
      if (err) return res.status(500).json({ message: 'Error registering user' });
      res.status(201).json({ id: this.lastID, username });
    });
  });
};
// Login a user
exports.login = (req, res) => {
  const { username, password } = req.body;

  // Check if username and password are provided
  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password are required' });
  }

  // Fetch user from the database
  db.get("SELECT * FROM users WHERE username = ?", [username], (err, user) => {
    if (err) return res.status(500).json({ message: 'Server error' });
    if (!user) return res.status(401).json({ message: 'User not found' });

    // Compare the password with the hashed password
    bcrypt.compare(password, user.password, (err, isMatch) => {
      if (err) return res.status(500).json({ message: 'Server error' });
      if (!isMatch) return res.status(401).json({ message: 'Invalid password' });

      // Generate a JWT
      const token = jwt.sign({ id: user.id, username: user.username }, process.env.JWT_SECRET, { expiresIn: '1h' });

      // Send the token to the client
      res.json({ token });
    });
  });
};


// Login a user (updated to include token expiration)
exports.login = (req, res) => {
  const { username, password } = req.body;

  // Fetch user from the database
  db.get("SELECT * FROM users WHERE username = ?", [username], (err, user) => {
    if (err) return res.status(500).json({ message: 'Server error' });
    if (!user) return res.status(401).json({ message: 'User not found' });

    // Compare the password with the hashed password
    bcrypt.compare(password, user.password, (err, isMatch) => {
      if (err) return res.status(500).json({ message: 'Server error' });
      if (!isMatch) return res.status(401).json({ message: 'Invalid password' });

      // Generate a JWT with an expiration time
      const token = jwt.sign({ id: user.id, username: user.username }, process.env.JWT_SECRET, { expiresIn: '1h' });

      // Send the token to the client
      res.json({ token });
    });
  });
};


// Log user login activity
const logUserActivity = (userId, activity) => {
  db.run(
    "INSERT INTO user_activity (user_id, activity) VALUES (?, ?)",
    [userId, activity],
    (err) => {
      if (err) console.error('Error logging user activity:', err);
    }
  );
};

// Log login activity in the login method
exports.login = (req, res) => {
  const { username, password } = req.body;

  db.get("SELECT * FROM users WHERE username = ?", [username], (err, user) => {
    if (err) return res.status(500).json({ message: 'Server error' });
    if (!user) return res.status(401).json({ message: 'User not found' });

    bcrypt.compare(password, user.password, (err, isMatch) => {
      if (err) return res.status(500).json({ message: 'Server error' });
      if (!isMatch) return res.status(401).json({ message: 'Invalid password' });

      const token = jwt.sign({ id: user.id, username: user.username }, process.env.JWT_SECRET, { expiresIn: '1h' });
      
      // Log login activity
      logUserActivity(user.id, 'User logged in');

      res.json({ token });
    });
  });
};


// controllers/authController.js (continued)
// Get all user sessions (activity logs)
exports.getSessions = (req, res) => {
  const userId = req.user.id;

  db.all("SELECT * FROM user_activity WHERE user_id = ?", [userId], (err, rows) => {
    if (err) return res.status(500).json({ message: 'Error fetching user sessions' });
    res.json(rows);
  });
};


