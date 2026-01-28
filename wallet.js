import { users } from './auth.js';

// Get balance
export function getBalance(req, res) {
  const userId = req.params.userId;
  const user = users[userId];

  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  res.json({ balance: user.balance });
}

// Deposit money
export function deposit(req, res) {
  const { userId, amount } = req.body;
  const user = users[userId];

  if (!user || amount <= 0) {
    return res.status(400).json({ error: 'Invalid request' });
  }

  user.balance += amount;
  res.json({ balance: user.balance });
}

// Withdraw money
export function withdraw(req, res) {
  const { userId, amount } = req.body;
  const user = users[userId];

  if (!user || amount <= 0) {
    return res.status(400).json({ error: 'Invalid request' });
  }

  if (user.balance < amount) {
    return res.status(400).json({ error: 'Insufficient balance' });
  }

  user.balance -= amount;
  res.json({ balance: user.balance });
}
