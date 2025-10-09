import express from "express";
import { getCandidate } from "../controller/candidate/getCandidate.js";
import { createCandidate } from "../controller/candidate/createCandidate.js";
import { getEmployer} from "../controller/employer/getEmployer.js";
import { createEmployer} from "../controller/employer/createEmployer.js";


const router = express.Router();

router.post("/candidateRegister", async (req, res) => {
    const { email, password } = req.body;
    // Handle registration logic here
    const existingCandidate = await getCandidate(email);
    const existingEmployer = await getEmployer(email);
    if (existingCandidate || existingEmployer) {
        return res.status(409).json({ message: "Email already exists" });
    }
    // Create new candidate
    const newCandidate = await createCandidate({ email, password });
    res.status(201).json({ message: "Candidate registered successfully", candidate: newCandidate });
});

router.post("/employerRegister", async (req, res) => {
    const { email, password } = req.body;
    // Handle registration logic here
    const existingEmployer = await getEmployer(email);
    const existingCandidate = await getCandidate(email);
    if (existingEmployer || existingCandidate) {
        return res.status(409).json({ message: "Email already exists" });
    }
    // Create new employer
    const newEmployer = await createEmployer({ email, password });
    res.status(201).json({ message: "Employer registered successfully", employer: newEmployer });
});

export default router;