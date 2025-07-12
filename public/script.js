document.addEventListener('DOMContentLoaded', () => {
  fetchRentals();
  fetchMaintenanceIssues();
  fetchPayments();
});

async function fetchRentals() {
  const response = await fetch('http://localhost:3000/api/rentals');
  const rentals = await response.json();
  const rentalList = document.getElementById('rentalList');
  rentalList.innerHTML = '';
  rentals.forEach(rental => {
    const item = document.createElement('div');
    item.innerHTML = `
      <strong>Property:</strong> ${rental.propertyName}<br>
      <strong>Tenant:</strong> ${rental.tenantName}<br>
      <strong>Date:</strong> ${rental.rentalDate}<br>
      <strong>Amount:</strong> $${rental.rentalAmount}
    `;
    rentalList.appendChild(item);
  });
}

async function fetchMaintenanceIssues() {
  const response = await fetch('http://localhost:3000/api/maintenance');
  const issues = await response.json();
  const issueList = document.getElementById('issueList');
  issueList.innerHTML = '';
  issues.forEach(issue => {
    const item = document.createElement('div');
    item.innerHTML = `
      <strong>Issue:</strong> ${issue.issueDescription}<br>
      <strong>Reported by:</strong> ${issue.tenantName}
    `;
    issueList.appendChild(item);
  });
}

async function fetchPayments() {
  const response = await fetch('http://localhost:3000/api/payments');
  const payments = await response.json();
  const paymentList = document.getElementById('paymentList');
  paymentList.innerHTML = '';
  payments.forEach(payment => {
    const item = document.createElement('div');
    item.innerHTML = `
      <strong>Tenant:</strong> ${payment.tenantName}<br>
      <strong>Amount:</strong> $${payment.paymentAmount}<br>
      <strong>Date:</strong> ${new Date(payment.date).toLocaleDateString()}
    `;
    paymentList.appendChild(item);
  });
}

document.getElementById('rentalForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const data = {
    propertyName: document.getElementById('propertyName').value,
    tenantName: document.getElementById('tenantName').value,
    rentalDate: document.getElementById('rentalDate').value,
    rentalAmount: document.getElementById('rentalAmount').value
  };

  try {
    const res = await fetch('http://localhost:3000/api/rentals', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });

    if (res.ok) {
      fetchRentals();
      alert('Rental added successfully');
      e.target.reset();
    } else {
      alert('Failed to add rental.');
    }
  } catch (err) {
    console.error(err);
    alert('Something went wrong.');
  }
});

document.getElementById('maintenanceForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const data = {
    issueDescription: document.getElementById('issueDescription').value,
    tenantName: document.getElementById('tenantNameMaintenance').value
  };

  try {
    const res = await fetch('http://localhost:3000/api/maintenance', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });

    if (res.ok) {
      fetchMaintenanceIssues();
      alert('Issue submitted successfully');
      e.target.reset();
    } else {
      alert('Failed to submit issue.');
    }
  } catch (err) {
    console.error(err);
    alert('Something went wrong.');
  }
});

document.getElementById('paymentForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const data = {
    tenantName: document.getElementById('tenantNamePayment').value,
    paymentAmount: document.getElementById('paymentAmount').value,
    date: new Date().toISOString()
  };

  try {
    const res = await fetch('http://localhost:3000/api/payments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });

    if (res.ok) {
      fetchPayments();
      alert('Payment recorded successfully');
      e.target.reset();
    } else {
      alert('Failed to record payment.');
    }
  } catch (err) {
    console.error(err);
    alert('Something went wrong.');
  }
});
