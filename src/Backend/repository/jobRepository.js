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
        try {
            const newJobPost = new JobPost(jobData);
            console.log('Job data o createJobPost repository')
            console.log(jobData)
            const savedPost = await newJobPost.save();
            
            return { 
                success: true, 
                data: savedPost, 
                message: "Job post created successfully" 
            };
            
        } catch (error) {
            console.error("Lỗi khi lưu bài đăng:", error.message);
            if (error.name === 'ValidationError') {
                // Lỗi do thiếu trường bắt buộc, enum sai, hoặc kiểu dữ liệu không khớp
                return { 
                    success: false, 
                    message: "Validation failed: Please check required fields and data types.", 
                    errors: error.errors // Trả về chi tiết lỗi validation
                };
            }
            
            return { 
                success: false, 
                message: "Server error during job creation.",
                rawError: error 
            };
        }
    }
    static async updateJobPost(jobId, updates) {
        const updatedJobPost = await this.getJobPost(jobId);
        if (!updatedJobPost.success) {
            return { success: false, message: "Job post not found" };
        }
        const jobPostAtributes = ["title", "company", "position", "salary", "degree", 
            "experience", "jobType", "major", "description", "requirement", "welfare", "logo", "expireDay", "state"];
        for (const attribute of jobPostAtributes){
            updatedJobPost.data[attribute] = updates[attribute] || updatedJobPost.data[attribute];
        }
        if (updates["addApplicants"]){
            updatedJobPost.data.applicants.push(updates["addApplicants"]);
            updatedJobPost.data.metric.new += 1;
        }
        if (updates["newLabel"]){
            const label = updates["newLabel"];
            if (label === "Interviewing"){
                updatedJobPost.data.metric.interviewing += 1;
            } else if (label === "Hired"){
                updatedJobPost.data.metric.hired += 1;
            }
            const oldLabel = updates["oldLabel"];
            if (oldLabel === "Interviewing"){
                updatedJobPost.data.metric.interviewing -= 1;
            } else if (oldLabel === "New"){
                updatedJobPost.data.metric.new -= 1;
            }
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

