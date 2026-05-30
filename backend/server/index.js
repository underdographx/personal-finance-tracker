const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Data file path
const dataFile = path.join(__dirname, 'data.json');

// Initialize data file if it doesn't exist
const initializeData = () => {
  if (!fs.existsSync(dataFile)) {
    const initialData = {
      transactions: [
        {
          id: '1',
          description: 'Grocery Shopping',
          category: 'Food & Dining',
          type: 'Expense',
          amount: 75.50,
          date: '2026-05-23',
          icon: '🛒'
        },
        {
          id: '2',
          description: 'Salary',
          category: 'Income',
          type: 'Income',
          amount: 5200.00,
          date: '2026-05-23',
          icon: '💼'
        },
        {
          id: '3',
          description: 'Netflix Subscription',
          category: 'Entertainment',
          type: 'Expense',
          amount: 15.99,
          date: '2026-05-22',
          icon: '🎬'
        },
        {
          id: '4',
          description: 'Online Course',
          category: 'Education',
          type: 'Expense',
          amount: 49.99,
          date: '2026-05-21',
          icon: '📚'
        },
        {
          id: '5',
          description: 'Uber Ride',
          category: 'Transport',
          type: 'Expense',
          amount: 23.75,
          date: '2026-05-21',
          icon: '🚗'
        },
        {
          id: '6',
          description: 'Electricity Bill',
          category: 'Bills & Utilities',
          type: 'Expense',
          amount: 60.00,
          date: '2026-05-20',
          icon: '⚡'
        }
      ],
      categories: [
        { id: '1', name: 'Food & Dining', color: '#FF6B6B' },
        { id: '2', name: 'Transport', color: '#4ECDC4' },
        { id: '3', name: 'Shopping', color: '#FFE66D' },
        { id: '4', name: 'Entertainment', color: '#95E1D3' },
        { id: '5', name: 'Bills & Utilities', color: '#A8E6CF' },
        { id: '6', name: 'Education', color: '#C7CEEA' },
        { id: '7', name: 'Healthcare', color: '#FF9999' },
        { id: '8', name: 'Travel', color: '#FFB7DE' }
      ]
    };
    fs.writeFileSync(dataFile, JSON.stringify(initialData, null, 2));
  }
};

// Read data from file
const readData = () => {
  try {
    const data = fs.readFileSync(dataFile, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading data:', error);
    return { transactions: [], categories: [] };
  }
};

// Write data to file
const writeData = (data) => {
  try {
    fs.writeFileSync(dataFile, JSON.stringify(data, null, 2));
  } catch (error) {
    console.error('Error writing data:', error);
  }
};

// Initialize data on server start
initializeData();

// Routes

// GET all transactions
app.get('/api/transactions', (req, res) => {
  const data = readData();
  res.json(data.transactions);
});

// POST new transaction
app.post('/api/transactions', (req, res) => {
  const { description, category, type, amount, date } = req.body;

  if (!description || !category || !type || amount === undefined || !date) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const data = readData();
  const categoryData = data.categories.find(cat => cat.name === category);
  
  const newTransaction = {
    id: Date.now().toString(),
    description,
    category,
    type,
    amount: parseFloat(amount),
    date,
    icon: categoryData?.color || '💰'
  };

  data.transactions.unshift(newTransaction);
  writeData(data);

  res.status(201).json(newTransaction);
});

// PUT update transaction
app.put('/api/transactions/:id', (req, res) => {
  const { id } = req.params;
  const { description, category, type, amount, date } = req.body;

  const data = readData();
  const transactionIndex = data.transactions.findIndex(t => t.id === id);

  if (transactionIndex === -1) {
    return res.status(404).json({ error: 'Transaction not found' });
  }

  const categoryData = data.categories.find(cat => cat.name === category);

  data.transactions[transactionIndex] = {
    id,
    description: description || data.transactions[transactionIndex].description,
    category: category || data.transactions[transactionIndex].category,
    type: type || data.transactions[transactionIndex].type,
    amount: amount !== undefined ? parseFloat(amount) : data.transactions[transactionIndex].amount,
    date: date || data.transactions[transactionIndex].date,
    icon: categoryData?.color || '💰'
  };

  writeData(data);
  res.json(data.transactions[transactionIndex]);
});

// DELETE transaction
app.delete('/api/transactions/:id', (req, res) => {
  const { id } = req.params;
  const data = readData();

  const transactionIndex = data.transactions.findIndex(t => t.id === id);
  if (transactionIndex === -1) {
    return res.status(404).json({ error: 'Transaction not found' });
  }

  const deletedTransaction = data.transactions.splice(transactionIndex, 1);
  writeData(data);

  res.json(deletedTransaction[0]);
});

// GET all categories
app.get('/api/categories', (req, res) => {
  const data = readData();
  res.json(data.categories);
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
