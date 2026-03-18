const express = require('express');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.get('/', (req, res) => {
  res.json({ message: 'test-watchflow API is running' });
});

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});


app.get('/users', (req, res) => {
  const users = [
    { id: 1, name: 'Alice', email: 'alice@example.com' },
    { id: 2, name: 'Bob', email: 'bob@example.com' },
  ];
  res.json(users);
});

app.post('/users', (req, res) => {
  const { name, email } = req.body;
  if (!name || !email) {
    return res.status(400).json({ error: 'name and email are required' });
  }
  res.status(201).json({ id: 3, name, email });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
