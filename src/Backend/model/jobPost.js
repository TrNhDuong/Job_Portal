import mongoose from "mongoose";
import cron from "node-cron";

const jobPost = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    companyEmail: {
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
        default: 'Closed',
    },
    expireDay: {
        type: Date,
    },
    daysLeft: { type: Number, default: 0 },// chỉ tính khi state = 'Closed'
    applicants: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Application',
        }
    ],
    metric: {
        new: {
            type: Number,
            default: 0
        },
        interviewing: {
            type: Number,
            default: 0
        },
        hired: {
            type: Number,
            default: 0
        }
    },
    description: {  // Description of the job, which is displayed when the user clicks on the job post
        type: String,
        required: true,
    },
    requirement: {
        type: String,
    },
    welfare: {
        type: String,
    }
});

// --- Static method để đóng job hết hạn ---
jobPost.statics.closeExpiredJobs = async function() {
    try {
        const today = new Date();
        today.setHours(0,0,0,0); // chỉ so sánh ngày

        const result = await this.updateMany(
            { state: 'Open', expireDay: { $lte: today } },
            { $set: { state: 'Pending' } }
        );

        console.log(`[JobPost] ${result.modifiedCount} job(s) đã được đóng tự động.`);
    } catch (err) {
        console.error('[JobPost] Lỗi khi đóng job hết hạn:', err);
    }
};

// --- Cron job tự động chạy 0h mỗi ngày ---
cron.schedule('0 0 * * *', async () => {
    const JobPost = mongoose.model('JobPost'); // lấy model hiện tại
    await JobPost.closeExpiredJobs();
});

export const JobPost = mongoose.model("JobPost", jobPost);

