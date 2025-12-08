import { JobRepository } from "../../repository/jobRepository.js";
import mongoose from "mongoose";

export const getJobPostByID = async (req, res) => {
    const id = req.query.jobId;  // lấy từ query param
    try {
        const jobId = new mongoose.Types.ObjectId(id); // Chuyển đổi chuỗi ID thành ObjectId
        const jobPost = await JobRepository.getJobPost(jobId);
        if (jobPost.success) {
            res.status(200).json({
                success: true,
                data: jobPost.data,
                message: "Employer's job posts fetched successfully"
            });
        } else {
            res.status(404).json({
                success: false,
                message: jobPost.message
            });
        }
    } catch (error) {
        console.error("Error fetching job post:", error);
        res.status(500).json({ 
          success: false,
          message: "Internal server error"
        });
    }
};

export const getPostJobPerPage = async (req, res) => {
    const { page, location, jobType, salaryMin, salaryMax, major, experience, degree } = req.query;
    console.log(page)
    try {
        const result = await JobRepository.getFilterJob({
            page: parseInt(page) || 1,
            location,
            jobType,
            salaryMin,
            salaryMax,
            major,
            experience,
            degree
        });
        if (result.success) {
            return res.status(200).json({
                success: true,
                data: result.data,
                message: "Job posts fetched successfully"
            });
        } else {
            return res.status(404).json({
                success: false,
                message: result.message
            });
        }
    } catch (error) {

    }
}

