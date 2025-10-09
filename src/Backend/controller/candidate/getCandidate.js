import { getCandidateByEmail } from "../../repository/candidateRepository.js";

export const getCandidate = async (req, res) => {
    const { email } = req.params;
    try {
        const result = await getCandidateByEmail(email);
        if (result.success) {
            return res.status(404).json({ message: "Candidate not found" });
        }
        res.status(200).json(result.data);
    } catch (error) {
        res.status(500).json({ message: "Error fetching candidates" });
    }
};