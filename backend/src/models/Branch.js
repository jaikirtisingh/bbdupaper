const mongoose = require('mongoose');

const branchSchema = new mongoose.Schema(
  {
    customId: { type: String, unique: true, index: true },
    courseId: { type: String, default: 'course-btech' },
    name: { type: String, required: true },
    code: { type: String, required: true },
    icon: { type: String, default: 'Code' }
  },
  { timestamps: true }
);

module.exports = mongoose.models.Branch || mongoose.model('Branch', branchSchema);
