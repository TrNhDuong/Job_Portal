import express from "express";

const router = express.Router();

import { createPostJob } from "../controller/jobPost/createPostJob.js";
import { updatePostJob, extendJobExpiry, applyJob, removeApplyJob } from "../controller/jobPost/updatePostJob.js";
import { deletePostJob } from "../controller/jobPost/deletePostJob.js";


router.post("/post-job", createPostJob); //
router.patch("/post-job/:id", updatePostJob);
router.patch("/post-job/extend/:id", extendJobExpiry);
router.patch("/post-job/applyJob/:id", applyJob);
router.patch("/post-job/removeApplyJob/:id", removeApplyJob);
router.delete("/post-job/:id", deletePostJob);

export default router;