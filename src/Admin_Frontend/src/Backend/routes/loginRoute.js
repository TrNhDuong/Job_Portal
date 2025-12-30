import express from "express";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import {CandidateRepository } from "../repository/candidateRepository.js";
import {EmployerRepository } from "../repository/employerRepository.js";

dotenv.config();

const router = express.Router();

router.post("/loginCandidate", async (req, res) => {
    const { email, password } = req.body;

    // Handle login logic here
    const candidatePass = await CandidateRepository.getHashedPassword(email);
    

    // For demonstration, we'll just return a success message
    if (!candidatePass.success) {
        return res.status(404).json({ 
            success: false,
            message: "User not found"
        });
    }
    const isMatchPassword = bcrypt.compareSync(password, candidatePass.data);

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

router.post("/loginEmployer", async (req, res) => {
    const { email, password } = req.body;
    // Handle login logic here
    const employerPass = await EmployerRepository.getHashedPassword(email);

    // For demonstration, we'll just return a success message
    if (!employerPass.success) {
        return res.status(404).json({ 
            success: false,
            message: "User not found"
        });
    }
    const isMatchPassword = bcrypt.compareSync(password, employerPass.data);
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
