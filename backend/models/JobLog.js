const mongoose = require('mongoose');

const jobLogSchema = new mongoose.Schema({
  jobId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'CronJob',
    required: true
  },
  status: {
    type: String,
    required: true,
    enum: ['STARTED', 'SUCCESS', 'ERROR']
  },
  responseStatus: {
    type: Number
  },
  responseBody: {
    type: String
  },
  error: {
    type: String
  },
  runAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('JobLog', jobLogSchema);
