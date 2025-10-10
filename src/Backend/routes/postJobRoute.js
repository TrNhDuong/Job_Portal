import express from "express";

const router = express.Router();

import { getEmployerPostJob } from "../controller/jobPost/getPostJob.js";
import { createPostJob } from "../controller/jobPost/createPostJob.js";
import { updatePostJob, extendJobExpiry, addApplicant } from "../controller/jobPost/updatePostJob.js";
import { deletePostJob } from "../controller/jobPost/deletePostJob.js";
import { getListApplications } from "../controller/jobPost/getPostJob.js";

router.get("/post-job/:email", getEmployerPostJob); //get list jobpost id by email
router.get("/post-job", getListApplications);
router.post("/post-job", createPostJob); //
router.patch("/post-job/:id", updatePostJob);
router.patch("/post-job/extend/:id", extendJobExpiry);
router.patch("/post-job/apply/:id", addApplicant);
router.delete("/post-job/:id", deletePostJob);

export default router;