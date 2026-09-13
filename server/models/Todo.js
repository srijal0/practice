const mongoose = require('mongoose');

const todoSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true,
  },
  completed: {
    type: Boolean,
    default: false,
  },
  dueDate: {
    type: Date,
    default: null,
  },
  category: {
    type: String,
    enum: ['Personal', 'Work', 'Urgent', 'Other'],
    default: 'Other',
  },
}, { timestamps: true });

module.exports = mongoose.model('Todo', todoSchema);