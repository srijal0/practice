const express = require('express');
const router = express.Router();
const Todo = require('../models/Todo');
const authMiddleware = require('../middleware/auth');

// Apply auth middleware to ALL routes in this file
router.use(authMiddleware);

// GET all todos for the logged-in user
router.get('/', async (req, res) => {
  try {
    const todos = await Todo.find({ userId: req.userId }).sort({ createdAt: -1 });
    res.json(todos);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST a new todo
router.post('/', async (req, res) => {
  try {
    const newTodo = new Todo({
      text: req.body.text,
      dueDate: req.body.dueDate || null,
      category: req.body.category || 'Other',
      userId: req.userId,
    });
    const savedTodo = await newTodo.save();
    res.status(201).json(savedTodo);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// PUT (update) a todo — only if it belongs to this user
router.put('/:id', async (req, res) => {
  try {
    const todo = await Todo.findOne({ _id: req.params.id, userId: req.userId });
    if (!todo) {
      return res.status(404).json({ message: 'Todo not found' });
    }

    const updatedTodo = await Todo.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(updatedTodo);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE a todo — only if it belongs to this user
router.delete('/:id', async (req, res) => {
  try {
    const todo = await Todo.findOne({ _id: req.params.id, userId: req.userId });
    if (!todo) {
      return res.status(404).json({ message: 'Todo not found' });
    }

    await Todo.findByIdAndDelete(req.params.id);
    res.json({ message: 'Todo deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;