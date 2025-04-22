const express = require('express');
const router = express.Router();
const courseController = require('../controllers/courseController');
const auth = require('../middleware/auth');

router.get('/courses/enrolled', auth, courseController.getEnrolledCourses);

module.exports = router;