import { JobRepository } from "../../repository/jobRepository.js";
import { EmployerRepository } from "../../repository/employerRepository.js";
import mongoose from "mongoose";

export const deletePostJob = async (req, res) => {
    const id = req.query.jobId;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({
            success: false,
            message: "Invalid jobId"
        });
    }
    const email = req.query.email;
    const jobId = new mongoose.Types.ObjectId(id);
    try {
        const result = await JobRepository.deleteJobPost(jobId);
        if (!result.success) {
          return res.status(404).json({
            success: false, 
            message: "Job post not found"
          });
        }
        console.log("Job post deleted:", jobId);
        const employer = await EmployerRepository.removeJobPostFromEmployer(email, jobId);
        if (!employer.success) {
            return res.status(404).json({
                success: false,
                message: employer.message
            });
        }
        console.log("Job post removed from employer:", email, jobId);
        res.status(200).json({ 
            success: true, 
            message: "Job post deleted successfully" 
        });
    } catch (error) {
        console.error("Error deleting job post:", error);
        res.status(500).json({ 
          success: false, 
          message: "Internal server error" 
        });
    }
};
