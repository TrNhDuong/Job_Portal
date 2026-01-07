import express from "express";
import { getAllAdminJobs } from "../controller/adminJob/getJob.js";
import { getAdminJobById } from "../controller/adminJob/getJob.js";

const router = express.Router();

router.get("/admin/job/all", getAllAdminJobs);
router.get("/admin/job", getAdminJobById);

export default router;