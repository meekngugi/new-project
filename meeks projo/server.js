const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// In-memory data storage
let rentals = [];
let maintenanceIssues = [];
let payments = [];

// Routes

// Add Rental
app.post('/api/rentals', (req, res) => {
    const { propertyName, tenantName, rentalDate, rentalAmount } = req.body;
    const newRental = { propertyName, tenantName, rentalDate, rentalAmount };
    rentals.push(newRental);
    res.status(201).json(newRental);
});

// Get Rentals
app.get('/api/rentals', (req, res) => {
    res.json(rentals);
});

// Report Maintenance Issue
app.post('/api/maintenance', (req, res) => {
    const { issueDescription, tenantName } = req.body;
    const newIssue = { issueDescription, tenantName };
    maintenanceIssues.push(newIssue);
    res.status(201).json(newIssue);
});

// Get Maintenance Issues
app.get('/api/maintenance', (req, res) => {
    res.json(maintenanceIssues);
});

// Process Payment
app.post('/api/payments', (req, res) => {
    const { tenantName, paymentAmount } = req.body;
    const newPayment = { tenantName, paymentAmount, date: new Date() };
    payments.push(newPayment);
    res.status(201).json(newPayment);
});

// Get Payments
app.get('/api/payments', (req, res) => {
    res.json(payments);
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});