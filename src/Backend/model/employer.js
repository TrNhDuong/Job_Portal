import mongoose from "mongoose";

const employerSchema = new mongoose.Schema({
    company: {
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
    phone: {
        type: String,
    },
    address: {
        type: String,
        required: true,
    },
    description: {
        type: String,
    },
    website: {
        type: String,
    },
    jobPosted: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'JobPost',
        }
    ],
    point: {
        type: Number,
        default: 0
    }
});


const Employer = mongoose.model("Employer", employerSchema);

export default Employer;
