import mongoose from 'mongoose';

const candidateSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    logo: {
        url: String,
        public_id: String
    },
    description: {
        type: String,
    },
    listSaveJobs: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'JobPost',
        }
    ],
    appliedJobs: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'JobPost',
        }
    ],
    CV: [
        {
            url: String,
            public_id: String,
            name: String,
            uploadedAt: { type: Date, default: Date.now }
        }
    ],
    timeStamp: {
        type: Date,
        default: Date.now,
    },
});

const Candidate = mongoose.model('Candidate', candidateSchema);

export default Candidate;
