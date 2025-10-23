import { JobRepository } from "../../repository/jobRepository.js";

export const deletePostJob = async (req, res) => {
    const { idJob } = req.params;

    try {
        const result = await JobRepository.deleteJobPost(idJob);
        if (!result.success) {
          return res.status(404).json({
            success: false, 
            message: "Job post not found"
          });
        }

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
