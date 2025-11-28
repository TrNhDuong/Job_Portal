import mongoose from "mongoose";

const jobPost = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    company : {  // Name of the company
        type: String,
        required: true,
    },
    position: { // Position of the job
        type: String,
        required: true,
    },
    detailedAddress: { // Detailed address (street, number)
        type: String,
        required: true, // Chúng ta đã đặt nó là bắt buộc ở form
        default: "" 
    },
    location: { // Location of the company
        type: String,
        required: true,
    },
    logo: {
        url: String,
        public_id: String
    },
    salary: {  
        type: Object, 
        required: true,
        minSalary: { type: Number, required: true }, 
        maxSalary: { type: Number, required: true }, 
        currency: {
            type: String,
            enum: ['USD', 'VND', 'EUR', 'JPY', 'GBP', 'AUD', 'CAD'],
            default: 'VND'
        }
    },
    jobType: { // Full-time, Part-time, Internship
        type: String,
        required: true,
        enum: ['Full-time', 'Part-time', 'Internship', 'Freelance', 'Contract']
    },
    major: { // Major required for the job: IT, Business, Finance, Marketing, etc.
        type: String,
        required: true,
        enum: ['IT', 'Business', 'Finance', 'Marketing', 'Sales', 'Human Resources', 'Education', 'Healthcare', 'Engineering', 'Other']
    },
    customMajor: { // Dùng khi major là 'Other'
        type: String,
        default: ""
    },
    degree: { // Degree required for the job: bachelor, master, doctorate
        type: String,
        required: true,
        enum: ['Bachelor', 'Master', 'Doctorate', 'Associate', 'Diploma', 'High School', 'No Degree']
    },
    experience: { // Number of years of experience required
        type: Number, 
        required: true,
    },
    postedAt: {
        type: Date,
        default: Date.now
    },
    state: {    // State of the job post: open, closed, pending
        type: String,
        required: true,
        enum: ['Open', 'Closed', 'Pending'],
        default: 'Open'
    },
    expireDay: {
        type: Date,
    },
    applicants: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Application',
        }
    ],
    metric: {
        newed: {
            type: Number,
            default: 0
        },
        pass: {
            type: Number,
            default: 0
        },
        interviewed: {
            type: Number,
            default: 0
        }
    },
    description: {  // Description of the job, which is displayed when the user clicks on the job post
        type: String,
        required: true,
    },
});

export const JobPost = mongoose.model("JobPost", jobPost);

