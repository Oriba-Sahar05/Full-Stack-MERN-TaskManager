const { validationResult } = require('express-validator');
const Task = require('../models/Task');

// @route  GET /api/tasks?status=&category=&sort=
// @access Private
const getTasks = async (req, res, next) => {
  try {
    const filter = { user: req.user._id };
    if (req.query.status) filter.status = req.query.status;
    if (req.query.category) filter.category = req.query.category;

    let query = Task.find(filter);

    switch (req.query.sort) {
      case 'dueDate':
        query = query.sort({ dueDate: 1 });
        break;
      case 'priority':
        query = query.sort({ priority: -1 });
        break;
      default:
        query = query.sort({ createdAt: -1 });
    }

    const tasks = await query;
    res.json(tasks);
  } catch (err) {
    next(err);
  }
};

// @route  POST /api/tasks
// @access Private
const createTask = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: errors.array()[0].msg, errors: errors.array() });
    }

    const { title, description, category, priority, status, dueDate } = req.body;

    const task = await Task.create({
      user: req.user._id,
      title,
      description,
      category,
      priority,
      status,
      dueDate,
    });

    res.status(201).json(task);
  } catch (err) {
    next(err);
  }
};

// @route  PUT /api/tasks/:id
// @access Private
const updateTask = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    if (task.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to modify this task' });
    }

    const fields = ['title', 'description', 'category', 'priority', 'status', 'dueDate'];
    fields.forEach((field) => {
      if (req.body[field] !== undefined) task[field] = req.body[field];
    });

    const updated = await task.save();
    res.json(updated);
  } catch (err) {
    next(err);
  }
};

// @route  DELETE /api/tasks/:id
// @access Private
const deleteTask = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    if (task.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this task' });
    }

    await task.deleteOne();
    res.json({ message: 'Task deleted', id: req.params.id });
  } catch (err) {
    next(err);
  }
};

module.exports = { getTasks, createTask, updateTask, deleteTask };
