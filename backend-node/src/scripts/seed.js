require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Course = require('../models/Course');
const CourseEnrollment = require('../models/CourseEnrollment');

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await Course.deleteMany({});
    await CourseEnrollment.deleteMany({});

    // Create test user
    const user = await User.create({
      first_name: 'Tai',
      last_name: 'Shobowale',
      email: 'tai@example.com',
      username: 'taishobowale',
      password: 'password123',
      role: {
        name: 'Customer',
        slug: 'customer'
      }
    });

    // Create test course
    const course = await Course.create({
      title: 'Introduction to Behavioral Science',
      description: 'Learn the fundamentals of behavioral science and its applications.',
      thumbnail_url: 'https://example.com/thumbnail.jpg',
      slug: 'intro-behavioral-science',
      is_default: true
    });

    // Create enrollment
    await CourseEnrollment.create({
      user: user._id,
      course: course._id,
      progress: 30
    });

    console.log('Database seeded successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();
