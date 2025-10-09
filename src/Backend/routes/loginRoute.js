import { getCandidatePassword} from "../repository/candidateRepository.js";
import { getEmployerPassword } from "../repository/employerRepository.js";
import express from "express";
import dotenv from "dotenv";

dotenv.config();

const router = express.Router();

router.post("/login", (req, res) => {
    const { email, password } = req.body;

    // Handle login logic here
    const candidatePass = getCandidatePassword(email);
    const employerPass = getEmployerPassword(email);

    // For demonstration, we'll just return a success message
    if (!candidatePass && !employerPass) {
        return res.status(404).json({ message: "User not found" });
    }

    if (candidatePass !== password && employerPass !== password) {
        return res.status(401).json({ message: "Invalid credentials" });
    }

    res.json({ message: "Login successful" });
});

export default router;
