import express from "express";
import bcrypt from "bcryptjs";
import { getCandidateByEmail, candidateCreate } from "../repository/candidateRepository.js";
import { getEmployerByEmail, employerCreate } from "../repository/employerRepository.js";


const router = express.Router();

router.post("/candidateRegister", async (req, res) => {
    const { email, password, name } = req.body;
    
    const existingCandidate = await getCandidateByEmail(email);
    const existingEmployer = await getEmployerByEmail(email);
    if (existingCandidate.success || existingEmployer.success) {
        return res.status(409).json({ message: "Email already exists" });
    }
    
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const newCandidate = await candidateCreate({
        email: email,
        password: hashedPassword,
        name: name,
        appliedJobs: [],
        listSaveJobs: [],
        CV: ""
    });
    res.status(201).json({ message: "Candidate registered successfully" });
});

router.post("/employerRegister", async (req, res) => {
    const { email, password, company, address, phone } = req.body;

    const existingEmployer = await getEmployerByEmail(email);
    const existingCandidate = await getCandidateByEmail(email);
    if (existingEmployer.success || existingCandidate.success) {
        return res.status(409).json({ message: "Email already exists" });
    }
    
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const newEmployer = await employerCreate({ 
        email: mail, 
        password: hashedPassword, 
        company: companyName, 
        address: address, 
        phone: phoneNumber,
        jobPosted: []
    });
    res.status(201).json({ message: "Employer registered successfully" });
});

export default router;