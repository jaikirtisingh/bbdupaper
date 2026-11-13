const mongoose = require('mongoose');

const subjectSchema = new mongoose.Schema(
  {
    customId: { type: String, unique: true, index: true },
    branchId: { type: String, required: true, index: true },
    semesterNumber: { type: Number, required: true, index: true },
    code: { type: String, required: true, unique: true, index: true },
    name: { type: String, required: true },
    credits: { type: Number, default: 4 },
    description: { type: String, default: '' }
  },
  { timestamps: true }
);

module.exports = mongoose.models.Subject || mongoose.model('Subject', subjectSchema);
