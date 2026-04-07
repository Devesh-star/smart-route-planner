const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
  edge: {
    from: { type: String, required: true },
    to: { type: String, required: true },
  },
  issueType: {
    type: String,
    enum: ['pothole', 'poor_lighting', 'construction', 'flooding', 'crime'],
    required: true,
  },
  description: { type: String, default: '' },
  penaltyScore: { type: Number, default: 0.2, min: 0, max: 1 },
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  reportedAt: { type: Date, default: Date.now },
  approvedAt: { type: Date },
});

module.exports = mongoose.model('Report', reportSchema);
