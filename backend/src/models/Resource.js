const mongoose = require('mongoose');

const resourceSchema = new mongoose.Schema(
  {
    customId: { type: String, unique: true, index: true },
    universityId: { type: String, default: 'univ-aktu', index: true },
    collegeId: { type: String, default: null },
    courseId: { type: String, default: 'course-btech' },
    branchId: { type: String, required: true, index: true },
    semesterNumber: { type: Number, required: true, index: true },
    subjectId: { type: String, required: true, index: true },
    subjectName: { type: String, required: true },
    subjectCode: { type: String, required: true, index: true },
    title: { type: String, required: true },
    type: {
      type: String,
      required: true,
      enum: ['PYQ', 'SYLLABUS', 'NOTE', 'ASSIGNMENT', 'PRACTICAL_FILE', 'LAB_MANUAL', 'VIVA', 'IMP_QUESTION', 'UNIT_MATERIAL', 'EXAM_PREP'],
      index: true
    },
    year: { type: Number, index: true },
    moduleNumber: { type: Number, default: null },
    unitNumber: { type: Number, default: null },
    description: { type: String, default: '' },
    fileUrl: { type: String, required: true }, // Cloudinary CDN URL or local upload URL
    fileSize: { type: String, default: '1.2 MB' },
    pageCount: { type: Number, default: 8 },
    downloadCount: { type: Number, default: 0 },
    viewCount: { type: Number, default: 0 },
    isSampleData: { type: Boolean, default: false },
    uploadedBy: { type: String, default: 'Academic Administrator' }
  },
  { timestamps: true }
);

module.exports = mongoose.models.Resource || mongoose.model('Resource', resourceSchema);
