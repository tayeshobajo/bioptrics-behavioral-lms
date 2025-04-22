require('dotenv').config();
const mongoose = require('mongoose');
const Course = require('../models/Course');

async function updateDefaultCourse() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Find and update the default course
    const result = await Course.findOneAndUpdate(
      { is_default: true },
      {
        title: 'Accountability in Action',
        description: 'Master the art of accountability and learn how to create a culture of responsibility in your organization.',
        thumbnail_url: 'https://placehold.co/800x600/552A47/FFFFFF?text=Accountability+in+Action',
        slug: 'accountability-in-action',
      },
      { new: true }
    );

    if (result) {
      console.log('Default course updated successfully:', result);
    } else {
      console.log('No default course found to update');
    }
  } catch (error) {
    console.error('Error updating default course:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

updateDefaultCourse();
