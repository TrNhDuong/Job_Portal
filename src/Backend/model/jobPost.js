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
    salary: {   // Range of salary
        type: String,
        required: true,
    },
    jobType: { // Full-time, Part-time, Internship
        type: String,
        required: true,
    },
    major: { // Major required for the job: IT, Business, Finance, Marketing, etc.
        type: String,
        required: true,
    },
    degree: { // Degree required for the job: bachelor, master, doctorate
        type: String,
        required: true,
    },
    experience: {   // Experience required for the job: 1 year, 2 years, 3 years, or no experience
        type: Number,
        required: true,
    },
    state: {    // State of the job post: open, closed, pending
        type: String,
        required: true,
    },
    expireDay: {
        type: Date,
    },
    applicants: [String], // array of candidate emails who applied for the job
    description: {  // Description of the job, which is displayed when the user clicks on the job post
        type: String,
        required: true,
    },
});
const JobPost = mongoose.model("JobPost", jobPost);

export default JobPost;