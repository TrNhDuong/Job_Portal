import mongoose from 'mongoose';

const applicationSchema = new mongoose.Schema(
  {
    candidateId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Candidate',
      required: true,
    },
    jobId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'JobPost',
      required: true,
    },
    CV_url: {
      url: String,
    },
    appliedDate: {
      type: Date,
      default: Date.now,
    },
    label: {
      type: String,
      default: 'New',
      enum: ['New', 'Viewed', 'Interviewing', 'Rejected', 'Hired'],
    },
  },
  { timestamps: true }
);

// Không tạo index cho jobId hoặc candidateId để tránh chi phí bảo trì

const Application = mongoose.model('Application', applicationSchema);

export default Application;