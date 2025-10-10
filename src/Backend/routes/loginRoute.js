import { getCandidatePassword} from "../repository/candidateRepository.js";
import { getEmployerPassword } from "../repository/employerRepository.js";
import express from "express";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";

dotenv.config();

const router = express.Router();

router.post("/login", async (req, res) => {
    const { email, password } = req.body;

    // Handle login logic here
    const candidatePass = await getCandidatePassword(email);
    const employerPass = await getEmployerPassword(email);

    // For demonstration, we'll just return a success message
    if (!candidatePass && !employerPass) {
        return res.status(404).json({ 
            success: false,
            message: "User not found"
        });
    }
    console.log(candidatePass, employerPass, password);
    const isMatchPassword = bcrypt.compareSync(password, candidatePass) || bcrypt.compareSync(password, employerPass);

    if (!isMatchPassword) {
        return res.status(401).json({ 
            success: false,
            message: "Invalid credentials"
        });
    }

    res.json({ 
        success: true,
        message: "Login successful"
    });
});

export default router;
