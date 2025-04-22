const CourseEnrollment = require('../models/CourseEnrollment');
const Course = require('../models/Course');

exports.getEnrolledCourses = async (req, res) => {
  try {
    // First check if there are any courses
    const coursesCount = await Course.countDocuments();
    if (coursesCount === 0) {
      // Create a default course if none exist
      const defaultCourse = await Course.create({
        title: 'Accountability in Action',
        description: 'Master the art of accountability and learn how to create a culture of responsibility in your organization.',
        thumbnail_url: 'https://placehold.co/800x600/552A47/FFFFFF?text=Accountability+in+Action',
        slug: 'accountability-in-action',
        is_default: true
      });

      // Enroll the user in the default course
      await CourseEnrollment.create({
        user: req.user._id,
        course: defaultCourse._id,
        progress: 0
      });
    }

    // Get user's enrolled courses
    const enrollments = await CourseEnrollment.find({ user: req.user._id })
      .populate('course')
      .sort('-createdAt');

    // Format the response to match frontend expectations
    const formattedEnrollments = enrollments.map(enrollment => ({
      id: enrollment._id,
      course: {
        title: enrollment.course.title,
        description: enrollment.course.description,
        thumbnail_url: enrollment.course.thumbnail_url || 'https://placehold.co/800x600/552A47/FFFFFF?text=Course+Thumbnail',
        slug: enrollment.course.slug
      },
      progress: enrollment.progress,
      started_at: enrollment.started_at,
      completed_at: enrollment.completed_at
    }));

    res.json({ enrollments: formattedEnrollments });
  } catch (error) {
    console.error('Error in getEnrolledCourses:', error);
    res.status(500).json({ 
      message: 'Failed to fetch enrolled courses',
      error: error.message 
    });
  }
};