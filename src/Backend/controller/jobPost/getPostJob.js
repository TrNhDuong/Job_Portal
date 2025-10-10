import JobPost from "../../model/jobPost.js";
import { getAllApplications } from "../../repository/jobRepository.js";

export const getEmployerPostJob = async (req, res) => {
    const { emailEmployer } = req.params;

    try {
        const jobPost = await JobPost.findOne({ emailEmployer });

        if (!jobPost) {
          return res.status(404).json({ 
            success: false,
            message: "Job post not found"
          });
        }

        res.status(200).json({
          success: true,
          data: jobPost,
          message: "Job post fetched successfully"
        });
    } catch (error) {
        console.error("Error fetching job post:", error);
        res.status(500).json({ 
          success: false,
          message: "Internal server error"
        });
    }
};

export const getPostJobById = async (req, res) => {
    const { jobId } = req.params;
    try {
        const jobPost = await JobPost.findById(jobId);
        if (!jobPost) {
            return res.status(404).json({ 
              success: false,
              message: "Job post not found"
            });
        }
        res.status(200).json({
            success: true,
            data: jobPost,
            message: "Job post fetched successfully"
        });
    } catch (error) {
        console.error("Error fetching job post by ID:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};

export const getListApplications = async (req, res) => {
    const { jobId } = req.params;
    try {
        const result = await getAllApplications(jobId);
        if (!result.success) {
            return res.status(404).json({
                success: false,
                message: result.message
            });
        }
        return res.status(200).json({
            success: true,
            data: result.data,
            message: result.message
        });
    } catch (error) {
        console.error("Error fetching job posts:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};

