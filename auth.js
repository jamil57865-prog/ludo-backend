const users = {};

export function loginUser(req, res) {
  const { mobile, password } = req.body;

  if (!mobile || !password) {
    return res.status(400).json({ error: 'Missing fields' });
  }

  // New user auto-create
  if (!users[mobile]) {
    users[mobile] = {
      id: mobile,
      password,
      balance: 5000
    };
  }

  // Password check
  if (users[mobile].password !== password) {
    return res.status(401).json({ error: 'Invalid password' });
  }

  res.json({
    userId: users[mobile].id,
    balance: users[mobile].balance
  });
}

export { users };
