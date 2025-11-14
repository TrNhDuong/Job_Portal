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
    location: { // Location of the company
        type: String,
        required: true,
    },
    logo: {
        url: String,
        public_id: String
    },
    detailedAddress: { // Detailed address (street, number)
        type: String,
        required: true, // Chúng ta đã đặt nó là bắt buộc ở form
        default: "" 
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
    experience: {
        type: Object,
        required: true,
        default: { value: 0, unit: 'years' },
        value: {
            type: Number,
            required: true,
            default: 0
        },
        unit: {
            type: String,
            enum: ['years', 'months'],
            default: 'years'
        }
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
    ], // array of candidate emails who applied for the job
    description: {  // Description of the job, which is displayed when the user clicks on the job post
        type: String,
        required: true,
    },
});

export const JobPost = mongoose.model("JobPost", jobPost);

