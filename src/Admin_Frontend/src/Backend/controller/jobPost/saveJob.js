import { CandidateRepository } from "../../repository/candidateRepository.js";

export const saveJob = async (req, res) => {
    const { email } = req.body;
    const jobId = req.query.jobId;
    try {
        const result = await CandidateRepository.saveJob(email, jobId);
        if (!result.success) {
            return res.status(404).json({ message: result.message });
        }
        res.status(200).json({ message: result.message });
    } catch (error) {
        console.error("Error saving job:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const removeSaveJob = async (req, res) => {
    const { email } = req.body;
    const jobId = req.query.jobId;

    try {
        const result = await CandidateRepository.removeSaveJob(email, jobId);
        if (!result.success) {
            return res.status(404).json({ 
                success: false,
                message: result.message });
        }
        res.status(200).json({ 
            success: true,
            message: result.message 
        });
    } catch (error) {
        console.error("Error saving job:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};