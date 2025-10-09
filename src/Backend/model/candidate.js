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
    listSaveJobs: [String],
    appliedJobs: [String],
    CV: Buffer,
});

const Candidate = mongoose.model('Candidate', candidateSchema);

export default Candidate;
