import mongoose from 'mongoose';

const applicationSchema = new mongoose.Schema(
  {
    candidateId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Candidate',
      required: true,
    },
    contactEmail: {
      type: String,
      required: true,
    },
    jobId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'JobPost',
      required: true,
    },
    CV_url: {
      type: String,
      required: true,
    },
    appliedDate: {
      type: Date,
      default: Date.now,
    },
    label: {
      type: String,
      default: 'New',
      enum: ['New', 'Viewed', 'Shortlisted', 'Interviewing', 'Offered', 'Rejected', 'Hired'],
    },
  }
);

applicationSchema.index(
    { candidateId: 1, jobId: 1 },
    { unique: true }
);

const Application = mongoose.model('Application', applicationSchema);

export default Application;