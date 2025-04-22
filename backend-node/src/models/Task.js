const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  dueDate: {
    type: Date,
    required: true
  },
  priority: {
    type: String,
    required: true,
    enum: ['low', 'medium', 'high']
  },
  status: {
    type: String,
    required: true,
    enum: ['pending', 'in_progress', 'completed', 'on_hold'],
    default: 'pending'
  },
  category: {
    type: String,
    required: true,
    enum: ['daily', 'weekly', 'monthly']
  },
  tags: [{
    type: String,
    trim: true
  }],
  relatedGoal: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Goal'
  },
  completedAt: {
    type: Date
  },
  reminderDate: {
    type: Date
  }
}, { timestamps: true });

// Index for efficient querying
taskSchema.index({ user: 1, category: 1, dueDate: 1 });
taskSchema.index({ user: 1, status: 1 });

const Task = mongoose.model('Task', taskSchema);

module.exports = Task;
