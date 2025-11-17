import express from "express";

const router = express.Router();

import { getCandidate } from "../controller/candidate/getCandidate.js";
import { createCandidate } from "../controller/candidate/createCandidate.js";
import { updateCandidate } from "../controller/candidate/updateCandidate.js";

router.get("/candidate", getCandidate);
router.post("/candidate", createCandidate);
router.patch("/candidate", updateCandidate);


export default router;
