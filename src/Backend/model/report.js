import mongoose from 'mongoose';

const ReportSchema = new mongoose.Schema({
    reportedBy: {
        type: String,
        required: true,
    },
    reason: {
        type: String,
        required: true,
    },
    JobPost: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'JobPost',
        required: true,
    },
    timeStamp: {
        type: Date,
        default: Date.now,
    },
});

export const Report = mongoose.model('Report', ReportSchema);

