const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcrypt');

const app = express();
const PORT = 3000;
const SALT_ROUNDS = 10;

// Connect to database
const db = new sqlite3.Database(path.join(__dirname, 'rental.db'), (err) => {
  if (err) return console.error('Database error:', err.message);
  console.log('Connected to SQLite database');
});

// Create tables
db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    fullname TEXT,
    email TEXT,
    username TEXT UNIQUE,
    password TEXT,
    role TEXT
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS rentals (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    propertyName TEXT,
    tenantName TEXT,
    rentalDate TEXT,
    rentalAmount REAL
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS maintenance (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    issueDescription TEXT,
    tenantName TEXT
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS payments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    tenantName TEXT,
    paymentAmount REAL,
    date TEXT
  )`);
});

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});


app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'login.html'));
});
app.get('/signup', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'signup.html'));
});
app.get('/dashboard', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'dashboard.html'));
});
app.get('/profile', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'profile.html'));
});

// Signup
app.post('/signup', async (req, res) => {
  let { fullname, email, username, password, role } = req.body;

  username = username.trim().toLowerCase();
  console.log(`Signup attempt: "${username}"`);

  db.get(`SELECT * FROM users WHERE LOWER(username) = ?`, [username], async (err, row) => {
    if (row) return res.status(409).send('Username already exists');

    try {
      const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
      const query = `INSERT INTO users (fullname, email, username, password, role) VALUES (?, ?, ?, ?, ?)`;
      db.run(query, [fullname, email, username, hashedPassword, role], function (err) {
        if (err) return res.status(500).send('Signup failed');
        res.status(201).send('Signup successful');
      });
    } catch (error) {
      res.status(500).send('Error hashing password');
    }
  });
});

app.post('/login', (req, res) => {
  let { username, password, role } = req.body;

  username = username.trim().toLowerCase();
  console.log(`Login attempt: "${username}" as ${role}`);

  db.get(`SELECT * FROM users WHERE LOWER(username) = ?`, [username], async (err, user) => {
    if (err) return res.status(500).send('Server error');
    if (!user) return res.status(401).send('Invalid credentials');

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).send('Invalid credentials');

    if (user.role !== role) return res.status(403).send('Incorrect role selected');

    res.status(200).json({
      message: 'Login successful',
      username: user.username.trim(),
      role: user.role
    });
  });
});

// user profile
app.get('/api/users/:username', (req, res) => {
  const username = req.params.username.trim().toLowerCase();

  db.get(`SELECT fullname, email, username, role FROM users WHERE LOWER(username) = ?`, [username], (err, row) => {
    if (err) return res.status(500).send('Error fetching user');
    if (row) res.json(row);
    else res.status(404).send('User not found');
  });
});

// Rentals
app.post('/api/rentals', (req, res) => {
  const { propertyName, tenantName, rentalDate, rentalAmount } = req.body;
  const query = `INSERT INTO rentals (propertyName, tenantName, rentalDate, rentalAmount) VALUES (?, ?, ?, ?)`;

  db.run(query, [propertyName, tenantName, rentalDate, rentalAmount], function (err) {
    if (err) return res.status(500).send('Failed to add rental');
    res.status(201).json({ id: this.lastID, propertyName, tenantName, rentalDate, rentalAmount });
  });
});

app.get('/api/rentals', (req, res) => {
  db.all(`SELECT * FROM rentals`, [], (err, rows) => {
    if (err) return res.status(500).send('Failed to fetch rentals');
    res.json(rows);
  });
});

// Maintenance
app.post('/api/maintenance', (req, res) => {
  const { issueDescription, tenantName } = req.body;
  const query = `INSERT INTO maintenance (issueDescription, tenantName) VALUES (?, ?)`;

  db.run(query, [issueDescription, tenantName], function (err) {
    if (err) return res.status(500).send('Failed to report issue');
    res.status(201).json({ id: this.lastID, issueDescription, tenantName });
  });
});

app.get('/api/maintenance', (req, res) => {
  db.all(`SELECT * FROM maintenance`, [], (err, rows) => {
    if (err) return res.status(500).send('Failed to fetch issues');
    res.json(rows);
  });
});

// Payments
app.post('/api/payments', (req, res) => {
  const { tenantName, paymentAmount } = req.body;
  const date = new Date().toISOString();
  const query = `INSERT INTO payments (tenantName, paymentAmount, date) VALUES (?, ?, ?)`;

  db.run(query, [tenantName, paymentAmount, date], function (err) {
    if (err) return res.status(500).send('Failed to record payment');
    res.status(201).json({ id: this.lastID, tenantName, paymentAmount, date });
  });
});

app.get('/api/payments', (req, res) => {
  db.all(`SELECT * FROM payments`, [], (err, rows) => {
    if (err) return res.status(500).send('Failed to fetch payments');
    res.json(rows);
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
