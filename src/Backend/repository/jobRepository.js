import { JobPost }from "../model/jobPost.js";

export class JobRepository {
    static async getJobPost(jobId) {
        const jobPost = await JobPost.findOne({ _id: jobId });
        if (!jobPost) {
            return { success: false, message: "Job post not found" };
        }
        return { success: true, data: jobPost, message: "Job post fetched successfully" };
    }
    static async getFilterJob({page, location, jobType, salaryMin, salaryMax, major, experience, degree}) {
        const query = {};
        if (location) query.location = location;
        if (jobType) query.jobType = jobType;
        if (major) query.major = major;
        if (experience) query.experience = experience;
        if (degree) query.degree = degree;
        
        if (salaryMin && salaryMax){
            query.salary = { $gte: salaryMin, $lte: salaryMax}
        }
        const jobsPerPage = 12;
        const currentPage = page || 1;
        const skip = (currentPage - 1) * jobsPerPage;

        const jobPosts = await JobPost.find(query).skip(skip).limit(jobsPerPage);
        const totalJobs = await JobPost.countDocuments(query);

        return {
            success: true,
            data: jobPosts,
            totalPages: Math.ceil(totalJobs / jobsPerPage),
            currentPage
        };
    }
    static async createJobPost(jobData) {
        const newJobPost = new JobPost(jobData);
        await newJobPost.save();
        return { success: true, data: newJobPost, message: "Job post created successfully" };
    }
    static async updateJobPost(jobId, updates) {
        const updatedJobPost = await this.getJobPost(jobId);
        if (!updatedJobPost.success) {
            return { success: false, message: "Job post not found" };
        }
        const jobPostAtributes = ["title", "position", "salary", "degree", "experience", "jobType", "major", "description"];
        for (const attribute of jobPostAtributes){
            updatedJobPost.data[attribute] = updates[attribute] || updatedJobPost.data[attribute];
        }
        await JobPost.findByIdAndUpdate(jobId, updatedJobPost.data);
        return { success: true, message: "Job post updated successfully" };
    }
    static async deleteJobPost(jobId) {
        const deletedJobPost = await JobPost.findByIdAndDelete(jobId);
        if (!deletedJobPost) {
            return { success: false, message: "Job post not found" };
        }
        return { success: true, message: "Job post deleted successfully" };
    }
}

