import { JobRepository } from "../../repository/jobRepository.js";

export const getJobPost = async (req, res) => {
    const { email } = req.params;

    try {
        const jobPost = await JobRepository.getJobPost(email);
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

