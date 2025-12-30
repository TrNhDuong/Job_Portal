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
    name: { // Dùng để lưu tên "Họ tên" (CEO/Người đại diện)
        type: String,
        default: "" 
    },
    password: {
        type: String,
        required: true,
    },
    logo: {
        url: String,
        public_id: String
    },
    wallpaper: {
        url: String,
        public_id: String
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
    contact: {
        email: String,
        phone: String
    },
    scale: {
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
    },
    timeStamp: {
        type: Date,
        default: Date.now,
    },
});


const Employer = mongoose.model("Employer", employerSchema);

export default Employer;
