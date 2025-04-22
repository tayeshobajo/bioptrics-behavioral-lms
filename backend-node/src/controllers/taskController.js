const Task = require('../models/Task');

// Get all tasks for a user
exports.getTasks = async (req, res) => {
  try {
    const { category, status, startDate, endDate } = req.query;
    const query = { user: req.user._id };

    if (category) query.category = category;
    if (status) query.status = status;
    if (startDate && endDate) {
      query.dueDate = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }

    const tasks = await Task.find(query)
      .populate('relatedGoal', 'title')
      .sort({ dueDate: 1 });
    
    res.json({ tasks });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching tasks', error: error.message });
  }
};

// Get a single task
exports.getTask = async (req, res) => {
  try {
    const task = await Task.findOne({ 
      _id: req.params.id,
      user: req.user._id 
    }).populate('relatedGoal', 'title');
    
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    
    res.json({ task });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching task', error: error.message });
  }
};

// Create a new task
exports.createTask = async (req, res) => {
  try {
    const task = new Task({
      ...req.body,
      user: req.user._id
    });
    
    await task.save();
    res.status(201).json({ task });
  } catch (error) {
    res.status(400).json({ message: 'Error creating task', error: error.message });
  }
};

// Update a task
exports.updateTask = async (req, res) => {
  try {
    const task = await Task.findOne({ 
      _id: req.params.id,
      user: req.user._id 
    });
    
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    
    Object.assign(task, req.body);
    
    if (task.status === 'completed' && !task.completedAt) {
      task.completedAt = new Date();
    }
    
    await task.save();
    res.json({ task });
  } catch (error) {
    res.status(400).json({ message: 'Error updating task', error: error.message });
  }
};

// Delete a task
exports.deleteTask = async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({ 
      _id: req.params.id,
      user: req.user._id 
    });
    
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    
    res.json({ message: 'Task deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting task', error: error.message });
  }
};

// Get task statistics
exports.getTaskStats = async (req, res) => {
  try {
    const stats = await Task.aggregate([
      { $match: { user: req.user._id } },
      {
        $group: {
          _id: '$category',
          total: { $sum: 1 },
          completed: {
            $sum: {
              $cond: [{ $eq: ['$status', 'completed'] }, 1, 0]
            }
          },
          pending: {
            $sum: {
              $cond: [{ $eq: ['$status', 'pending'] }, 1, 0]
            }
          },
          inProgress: {
            $sum: {
              $cond: [{ $eq: ['$status', 'in_progress'] }, 1, 0]
            }
          }
        }
      }
    ]);

    res.json({ stats });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching task statistics', error: error.message });
  }
};
