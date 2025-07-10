// Function to fetch rentals from the backend
async function fetchRentals() {
    const response = await fetch('http://localhost:3000/api/rentals');
    const rentals = await response.json();
    const rentalList = document.getElementById('rentalList');
    rentalList.innerHTML = '';
    rentals.forEach(rental => {
        const listItem = document.createElement('li');
        listItem.textContent = `${rental.propertyName} rented by ${rental.tenantName} on ${rental.rentalDate} for $${rental.rentalAmount}`;
        rentalList.appendChild(listItem);
    });
}

// Function to fetch maintenance issues from the backend
async function fetchMaintenanceIssues() {
    const response = await fetch('http://localhost:3000/api/maintenance');
    const issues = await response.json();
    const issueList = document.getElementById('issueList');
    issueList.innerHTML = '';
    issues.forEach(issue => {
        const listItem = document.createElement('li');
        listItem.textContent = `${issue.issueDescription} reported by ${issue.tenantName}`;
        issueList.appendChild(listItem);
    });
}

// Function to fetch payments from the backend
async function fetchPayments() {
    const response = await fetch('http://localhost:3000/api/payments');
    const payments = await response.json();
    const paymentList = document.getElementById('paymentList');
    paymentList.innerHTML = '';
    payments.forEach(payment => {
        const listItem = document.createElement('li');
        listItem.textContent = `${payment.tenantName} paid $${payment.paymentAmount} on ${new Date(payment.date).toLocaleDateString()}`;
        paymentList.appendChild(listItem);
    });
}

// Add event listeners for forms
document.getElement