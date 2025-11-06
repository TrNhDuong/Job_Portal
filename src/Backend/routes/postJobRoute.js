import express from "express";

const router = express.Router();

import { createPostJob } from "../controller/jobPost/createPostJob.js";
import { updatePostJob, extendJobExpiry, applyJob, removeApplyJob } from "../controller/jobPost/updatePostJob.js";
import { deletePostJob } from "../controller/jobPost/deletePostJob.js";
import { getJobPost, getPostJobPerPage } from "../controller/jobPost/getPostJob.js";

router.get("/post-job/:email", getJobPost);
router.get("/post-job", getPostJobPerPage);
router.post("/post-job", createPostJob); //
router.patch("/post-job/:id", updatePostJob);
router.patch("/post-job/extend/:id", extendJobExpiry);
router.patch("/post-job/applyJob/:id", applyJob);
router.patch("/post-job/removeApplyJob/:id", removeApplyJob);
router.delete("/post-job/:id", deletePostJob);


export default router;