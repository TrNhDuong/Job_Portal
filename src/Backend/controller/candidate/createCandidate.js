import { CandidateRepository } from "../../repository/candidateRepository.js";

export const createCandidate = async (req, res) => {
    const {email, password, name} = req.body;
    try {
        const existingCandidate = await CandidateRepository.getCandidateByEmail(email);
        if (existingCandidate.success) {
            return res.status(400).json({ message: "Candidate already exists" });
        }

        const savedCandidate = await CandidateRepository.candidateCreate({ email, password, name });
        res.status(201).json(savedCandidate);
    } catch (error) {
        res.status(500).json({ message: "Error creating candidate" });
    }
};

