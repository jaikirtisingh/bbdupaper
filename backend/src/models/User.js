const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    customId: { type: String, unique: true, index: true },
    fullName: { type: String, required: true },
    email: { type: String, required: true, unique: true, index: true },
    passwordHash: { type: String, required: true },
    role: { type: String, enum: ['ADMIN', 'STUDENT'], default: 'ADMIN' },
    universityId: { type: String, default: 'univ-aktu' },
    branchId: { type: String, default: 'br-cse' },
    semester: { type: Number, default: 8 }
  },
  { timestamps: true }
);

module.exports = mongoose.models.User || mongoose.model('User', userSchema);
