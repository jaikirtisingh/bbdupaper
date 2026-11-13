const mongoose = require('mongoose');

const universitySchema = new mongoose.Schema(
  {
    customId: { type: String, unique: true, index: true },
    name: { type: String, required: true },
    shortCode: { type: String, required: true },
    state: { type: String },
    location: { type: String },
    badge: { type: String },
    website: { type: String }
  },
  { timestamps: true }
);

module.exports = mongoose.models.University || mongoose.model('University', universitySchema);
