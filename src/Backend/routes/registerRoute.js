import express from "express";
import bcrypt from "bcryptjs";
import {CandidateRepository } from "../repository/candidateRepository.js";
import {EmployerRepository } from "../repository/employerRepository.js";


const router = express.Router();

router.post("/candidateRegister", async (req, res) => {
    const { email, password, name } = req.body;
    
    const existingCandidate = await CandidateRepository.getCandidate(email);
    if (existingCandidate.success) {
        return res.status(409).json({
            success: false,
            message: "Email already exists" });
    }
    
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const result = await CandidateRepository.createCandidate({
        email: email,
        password: hashedPassword,
        name: name,
        description: "",
        appliedJobs: [],
        listSaveJobs: [],
        CV: []
    });
    if (result.success) {
        res.status(201).json({ 
            success: true,
            message: "Candidate registered successfully" });
    } else {
        res.status(500).json({ 
            success: false,
            message: "Error registering candidate" });
    }
});

router.post("/employerRegister", async (req, res) => {
    const { email, password, phone, company, address } = req.body;

    const existingEmployer = await EmployerRepository.getEmployer(email);
    if (existingEmployer.success) {
        return res.status(409).json({ 
            success: false,
            message: "Email already exists" });
    }
    
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    console.log({
        email: email,
        password: hashedPassword,
        company: company,
        address: address,
        phone: phone
    });
    const result = await EmployerRepository.createEmployer({
        email: email,
        password: hashedPassword,
        company: company,
        address: address,
        phone: phone
    });
    if (result.success) {
        res.status(201).json({ 
            success: true,
            message: "Employer registered successfully"
         });
    } else {
        res.status(500).json({
            success: false,
            message: "Error registering employer" });
    }
});

export default router;