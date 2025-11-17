import { CandidateRepository } from "../../repository/candidateRepository.js";

export const getCandidate = async (req, res) => {
    const email = req.query.email;
    try {
        console.log(email);
        const result = await CandidateRepository.getCandidate(email);
        console.log(result);
        if (!result.success) {
            return res.status(404).json({ message: "Candidate not found" });
        }
        res.status(200).json(result.data);
    } catch (error) {
        res.status(500).json({ message: "Error fetching candidates" });
    }
};