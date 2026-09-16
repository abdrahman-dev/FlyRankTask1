const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

let tasks = [
  { id: 1, title: 'Buy groceries', done: false },
  { id: 2, title: 'Walk the dog', done: true },
  { id: 3, title: 'Write code', done: false }
];
let nextId = 4;

app.get('/', (req, res) => {
  res.json({
    name: 'Task API',
    version: '1.0',
    endpoints: ['GET /', 'GET /health', 'GET /tasks', 'GET /tasks/:id', 'POST /tasks', 'GET /stats']
  });
});

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.get('/tasks', (req, res) => {
  let result = [...tasks];
  if (req.query.done !== undefined) {
    const done = req.query.done === 'true';
    result = result.filter(t => t.done === done);
  }
  if (req.query.search) {
    result = result.filter(t => t.title.includes(req.query.search));
  }
  const offset = parseInt(req.query.offset) || 0;
  const limit = req.query.limit ? parseInt(req.query.limit) : undefined;
  if (offset) result = result.slice(offset);
  if (limit !== undefined) result = result.slice(0, limit);
  res.json(result);
});

app.get('/tasks/:id', (req, res) => {
  const task = tasks.find(t => t.id === parseInt(req.params.id));
  if (!task) return res.status(404).json({ error: `Task ${req.params.id} not found` });
  res.json(task);
});

app.get('/stats', (req, res) => {
  const done = tasks.filter(t => t.done).length;
  res.json({ total: tasks.length, done, open: tasks.length - done });
});

app.post('/tasks', (req, res) => {
  const { title } = req.body;
  if (typeof title !== 'string' || !title.trim()) {
    return res.status(400).json({ error: 'Title is required and must be a non-empty string' });
  }
  const task = { id: nextId++, title: title.trim(), done: false };
  tasks.push(task);
  res.status(201).json(task);
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
