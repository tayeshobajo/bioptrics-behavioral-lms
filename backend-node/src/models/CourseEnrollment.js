const mongoose = require('mongoose');

const courseEnrollmentSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
  progress: { type: Number, default: 0 },
  started_at: { type: Date, default: Date.now },
  completed_at: { type: Date }
}, { timestamps: true });

module.exports = mongoose.model('CourseEnrollment', courseEnrollmentSchema);