import { CandidateRepository } from "../../repository/candidateRepository";

export const saveJob = async (req, res) => {
    const { candidateEmail } = req.params;
    const { jobId } = req.body;

    try {
        const result = await CandidateRepository.saveJob(candidateEmail, jobId);
        if (!result.success) {
            return res.status(404).json({ message: result.message });
        }
        res.status(200).json({ message: result.message });
    } catch (error) {
        console.error("Error saving job:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};