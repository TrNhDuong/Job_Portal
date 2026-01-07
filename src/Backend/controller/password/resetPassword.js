import { CandidateRepository } from "../../repository/candidateRepository.js"
import { EmployerRepository } from "../../repository/employerRepository.js"
import jwt from "jsonwebtoken";

export const resetCandidatePassword = async (req, res) => {
    const { email, password } = req.body;
    const header = req.headers.authorization;
    if (!header){
        return res.status(401).json({
            success: false,
            message: `Missing token`
        })
    }

    const token = header.split(" ")[1];
    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET);
        if (payload.email !== email){
            return res.status(403).json({
                success: false,
                message: `Email not true`
            })
        }
        if (payload.role !== `Candidate`){
            return res.status(403).json({
                success: false,
                message: `Role not true`
            })
        }
        const result = await CandidateRepository.updateCandidate(email, {password: password});
        if (!result.success){
            return res.status(403).json({
                success: false,
                message: `Update candidate password in CandidateRepo failed`
            })
        }
        return res.status(201).json({
            success: true,
            message: `Reset password successfully`
        })
    } catch ( error ){
        if (error.name === "TokenExpiredError") {
            return res.status(401).json({
                success: false,
                message: "Token expired. Please verify OTP again."
            });
        }
        res.status(500).json({
            success: false,
            message: `Server error`
        })
    }
}

export const resetEmployerPassword = async (req, res) => {
    const { email, password } = req.body;
    console.log(email, password)
    const header = req.headers.authorization;
    if (!header){
        return res.status(401).json({
            success: false,
            message: `Missing token`
        })
    }

    const token = header.split(" ")[1];
    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET);
        if (payload.email !== email){
            return res.status(403).json({
                success: false,
                message: `Email not true`
            })
        }
        if (payload.role !== `Employer`){
            return res.status(403).json({
                success: false,
                message: `Role not true`
            })
        }
        const result = await EmployerRepository.updateEmployer(email, {password: password});
        if (!result.success){
            return res.status(403).json({
                success: false,
                message: `Update candidate password in EmployerRepo failed`
            })
        }
        return res.status(201).json({
            success: true,
            message: `Reset password successfully`
        })
    } catch ( error ){
        console.log(error)
        if (error.name === "TokenExpiredError") {
            return res.status(401).json({
                success: false,
                message: "Token expired. Please verify OTP again."
            });
        }
        res.status(500).json({
            success: false,
            message: `Server error`
        })
    }
}

