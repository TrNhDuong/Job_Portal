import express from "express";
import bcrypt from "bcryptjs";
import { CandidateRepository } from "../repository/candidateRepository.js";
import { EmployerRepository } from "../repository/employerRepository.js";
import { resetCandidatePassword, resetEmployerPassword } from "../controller/password/resetPassword.js";

const Router = express.Router();

Router.post("/password/candidate", async (req, res) => {
    const {email, password, newpassword} = req.body;
    const account = await CandidateRepository.getCandidate(email);
    if (!account){
        res.json({
            success: false,
            message: "Account not exists"
        })
    }
    const hashPass = account.data.password
    const isMatch = await bcrypt.compare(password, hashPass);

    if (isMatch){
        const result = await CandidateRepository.updateCandidate(email, {password: newpassword})
        if (result.success){
            res.json({
                success: true,
                message: "Password update successfully"
            })
        } else {
            res.json({
                success: false,
                message: "Password update unsuccessfully"
            })
        }
    } else {
        res.json({
            success: false,
            message: "Old password incorrect"
        })
    }
})

Router.post("/password/employer", async (req, res) => {
    const {email, password, newpassword} = req.body;
    console.log(email, password, newpassword);
    const account = await EmployerRepository.getEmployer(email);
    if (!account){
        res.json({
            success: false,
            message: "Account not exists"
        })
    }
    const hashPass = account.data.password
    console.log(hashPass)
    const isMatch = await bcrypt.compare(password, hashPass);

    if (isMatch){
        const result = await EmployerRepository.updateEmployer(email, {password: newpassword})
        if (result.success){
            res.json({
                success: true,
                message: "Password update successfully"
            })
        } else {
            res.json({
                success: false,
                message: "Password update unsuccessfully"
            })
        }
    } else {
        res.json({
            success: false,
            message: "Old password incorrect"
        })
    }
})

Router.post("/password/reset/candidate", resetCandidatePassword);
Router.post("/password/reset/employer", resetEmployerPassword);


export default Router;