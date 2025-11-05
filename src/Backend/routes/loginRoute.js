import express from "express";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import {CandidateRepository } from "../repository/candidateRepository.js";
import {EmployerRepository } from "../repository/employerRepository.js";

dotenv.config();

const router = express.Router();

router.post("/login", async (req, res) => {
    const { email, password } = req.body;

    // Handle login logic here
    const candidatePass = await CandidateRepository.getHashedPassword(email);
    const employerPass = await EmployerRepository.getHashedPassword(email);

    // For demonstration, we'll just return a success message
    if (!candidatePass.success && !employerPass.success) {
        return res.status(404).json({ 
            success: false,
            message: "User not found"
        });
    }
    console.log(candidatePass, employerPass, password);
    const type = candidatePass.success ? "candidate" : "employer";
    const isMatchPassword = type === "candidate" ? bcrypt.compareSync(password, candidatePass.data) : bcrypt.compareSync(password, employerPass.data);

    if (!isMatchPassword) {
        return res.status(401).json({ 
            success: false,
            message: "Invalid credentials"
        });
    }
    // const token = jwt.sign(
    //     {role: type},
    //     process.env.JWT_SECRET,
    //     {expiresIn: `30m`}
    // )

    res.json({ 
        success: true,
        message: "Login successful"
    });
});

export default router;
