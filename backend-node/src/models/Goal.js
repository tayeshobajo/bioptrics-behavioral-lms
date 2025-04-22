const mongoose = require('mongoose');

const milestoneSchema = new mongoose.Schema({
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
  completed: {
    type: Boolean,
    default: false
  },
  completedAt: {
    type: Date
  }
}, { timestamps: true });

const goalSchema = new mongoose.Schema({
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
  category: {
    type: String,
    required: true,
    enum: ['personal', 'professional', 'learning', 'health', 'other']
  },
  priority: {
    type: String,
    required: true,
    enum: ['low', 'medium', 'high']
  },
  status: {
    type: String,
    required: true,
    enum: ['not_started', 'in_progress', 'completed', 'on_hold'],
    default: 'not_started'
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  },
  milestones: [milestoneSchema],
  progress: {
    type: Number,
    min: 0,
    max: 100,
    default: 0
  },
  completedAt: {
    type: Date
  }
}, { timestamps: true });

// Calculate progress based on completed milestones
goalSchema.methods.calculateProgress = function() {
  if (this.milestones.length === 0) return 0;
  
  const completedMilestones = this.milestones.filter(m => m.completed).length;
  this.progress = Math.round((completedMilestones / this.milestones.length) * 100);
  return this.progress;
};

const Goal = mongoose.model('Goal', goalSchema);

module.exports = Goal;
