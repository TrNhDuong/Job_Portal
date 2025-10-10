import express from "express";


const router = express.Router();
import { getEmployer } from "../controller/employer/getEmployer.js";
import { createEmployer } from "../controller/employer/createEmployer.js";
import { updateEmployer } from "../controller/employer/updateEmployer.js";
import { getListPostJob } from "../controller/employer/getListPostJob.js";
import { getListAppliedCVinJob } from "../controller/employer/getListAppliedCVinJob.js";

router.get("/employer/:email", getEmployer);
router.post("/employer", createEmployer);
router.patch("/employer/:email", updateEmployer);

router.get("/employer/:email/posted-jobs", getListPostJob);



export default router;