import { CandidateRepository } from "../../repository/candidateRepository.js";

export const updateCandidate = async (req, res) => {
    const email = req.query.email;
    const updates = req.body;
    try {
        console.log(email, updates);
        const result = await CandidateRepository.updateCandidate(email, updates);
        if (result.success) {
            return res.status(200).json(result.message);
        } else {
            return res.status(404).json({ message: result.message });
        }
    } catch (error) {
        res.status(500).json({ message: "Error updating candidate" });
    }
};
