const express = require('express');
const router = express.Router();
const goalController = require('../controllers/goalController');
const auth = require('../middleware/auth');

// Apply auth middleware to all routes
router.use(auth);

// Goal routes
router.get('/', goalController.getGoals);
router.get('/:id', goalController.getGoal);
router.post('/', goalController.createGoal);
router.put('/:id', goalController.updateGoal);
router.delete('/:id', goalController.deleteGoal);

// Milestone routes
router.post('/:id/milestones', goalController.addMilestone);
router.put('/:goalId/milestones/:milestoneId', goalController.updateMilestone);
router.delete('/:goalId/milestones/:milestoneId', goalController.deleteMilestone);

module.exports = router;
