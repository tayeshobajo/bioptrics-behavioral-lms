const CourseEnrollment = require('../models/CourseEnrollment');

exports.getEnrolledCourses = async (req, res) => {
  try {
    const enrollments = await CourseEnrollment.find({ user: req.user._id })
      .populate('course')
      .sort('-createdAt');

    res.json({
      enrollments: enrollments.map(enrollment => ({
        id: enrollment._id,
        course: {
          title: enrollment.course.title,
          description: enrollment.course.description,
          thumbnail_url: enrollment.course.thumbnail_url,
          slug: enrollment.course.slug
        },
        progress: enrollment.progress
      }))
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};