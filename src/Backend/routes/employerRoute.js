import express from "express";


const router = express.Router();
import { getEmployer, getFeaturedBrandsController } from "../controller/employer/getEmployer.js";
import { createEmployer } from "../controller/employer/createEmployer.js";
import { updateEmployer } from "../controller/employer/updateEmployer.js";
import { getListPostJob } from "../controller/employer/getListPostJob.js";
import { getListAppliedCVinJob } from "../controller/employer/getListAppliedCVinJob.js";

router.get("/employer/:id", getEmployer);
router.post("/employer", createEmployer);
router.patch("/employer/:id", updateEmployer);

router.get("/employer/:id/posted-jobs", getListPostJob);
router.get("/brands/featured", getFeaturedBrandsController);


export default router;