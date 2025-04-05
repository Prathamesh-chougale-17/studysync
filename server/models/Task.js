const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  isDone: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
});

// Add indexes for efficient querying
taskSchema.index({ userId: 1, createdAt: -1 });
taskSchema.index({ userId: 1, isDone: 1 });

module.exports = mongoose.model('Task', taskSchema);
