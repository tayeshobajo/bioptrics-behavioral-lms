const Goal = require('../models/Goal');

// Get all goals for a user
exports.getGoals = async (req, res) => {
  try {
    const goals = await Goal.find({ user: req.user._id })
      .sort({ createdAt: -1 });
    res.json({ goals });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching goals', error: error.message });
  }
};

// Get a single goal
exports.getGoal = async (req, res) => {
  try {
    const goal = await Goal.findOne({ 
      _id: req.params.id,
      user: req.user._id 
    });
    
    if (!goal) {
      return res.status(404).json({ message: 'Goal not found' });
    }
    
    res.json({ goal });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching goal', error: error.message });
  }
};

// Create a new goal
exports.createGoal = async (req, res) => {
  try {
    const goal = new Goal({
      ...req.body,
      user: req.user._id
    });
    
    await goal.save();
    res.status(201).json({ goal });
  } catch (error) {
    res.status(400).json({ message: 'Error creating goal', error: error.message });
  }
};

// Update a goal
exports.updateGoal = async (req, res) => {
  try {
    const goal = await Goal.findOne({ 
      _id: req.params.id,
      user: req.user._id 
    });
    
    if (!goal) {
      return res.status(404).json({ message: 'Goal not found' });
    }
    
    Object.assign(goal, req.body);
    
    if (goal.status === 'completed' && !goal.completedAt) {
      goal.completedAt = new Date();
    }
    
    await goal.save();
    res.json({ goal });
  } catch (error) {
    res.status(400).json({ message: 'Error updating goal', error: error.message });
  }
};

// Delete a goal
exports.deleteGoal = async (req, res) => {
  try {
    const goal = await Goal.findOneAndDelete({ 
      _id: req.params.id,
      user: req.user._id 
    });
    
    if (!goal) {
      return res.status(404).json({ message: 'Goal not found' });
    }
    
    res.json({ message: 'Goal deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting goal', error: error.message });
  }
};

// Add a milestone to a goal
exports.addMilestone = async (req, res) => {
  try {
    const goal = await Goal.findOne({ 
      _id: req.params.id,
      user: req.user._id 
    });
    
    if (!goal) {
      return res.status(404).json({ message: 'Goal not found' });
    }
    
    goal.milestones.push(req.body);
    goal.calculateProgress();
    await goal.save();
    
    res.status(201).json({ goal });
  } catch (error) {
    res.status(400).json({ message: 'Error adding milestone', error: error.message });
  }
};

// Update a milestone
exports.updateMilestone = async (req, res) => {
  try {
    const goal = await Goal.findOne({ 
      _id: req.params.goalId,
      user: req.user._id 
    });
    
    if (!goal) {
      return res.status(404).json({ message: 'Goal not found' });
    }
    
    const milestone = goal.milestones.id(req.params.milestoneId);
    if (!milestone) {
      return res.status(404).json({ message: 'Milestone not found' });
    }
    
    Object.assign(milestone, req.body);
    
    if (milestone.completed && !milestone.completedAt) {
      milestone.completedAt = new Date();
    }
    
    goal.calculateProgress();
    await goal.save();
    
    res.json({ goal });
  } catch (error) {
    res.status(400).json({ message: 'Error updating milestone', error: error.message });
  }
};

// Delete a milestone
exports.deleteMilestone = async (req, res) => {
  try {
    const goal = await Goal.findOne({ 
      _id: req.params.goalId,
      user: req.user._id 
    });
    
    if (!goal) {
      return res.status(404).json({ message: 'Goal not found' });
    }
    
    goal.milestones.pull(req.params.milestoneId);
    goal.calculateProgress();
    await goal.save();
    
    res.json({ goal });
  } catch (error) {
    res.status(400).json({ message: 'Error deleting milestone', error: error.message });
  }
};
