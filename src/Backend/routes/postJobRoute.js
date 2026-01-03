import express from "express";

const router = express.Router();

import { createPostJob, createNewPostJob } from "../controller/jobPost/createPostJob.js";
import { updatePostJob, extendJobExpiry, applyJob, removeApplyJob, updateState } from "../controller/jobPost/updatePostJob.js";
import { deletePostJob } from "../controller/jobPost/deletePostJob.js";
import { getJobPostByID, getPostJobPerPage, getAllEmployerJobPost } from "../controller/jobPost/getPostJob.js";
import { saveJob, removeSaveJob } from "../controller/jobPost/saveJob.js";
//router.get("/post-job/employer", getJobPostEmployer);
// Không cần endpoint này nữa vì chỉ cần lấy data của employer là xong
router.get("/post-job/id", getJobPostByID);
router.get("/post-job/employer", getAllEmployerJobPost);
router.get("/post-job/filter", getPostJobPerPage);
router.post("/post-job", createNewPostJob); //
router.patch("/post-job", updatePostJob);
router.patch("/post-job/extend", extendJobExpiry);
router.patch("/post-job/applyJob", applyJob);
router.patch("/post-job/removeApplyJob", removeApplyJob);
router.patch("/post-job/saveJob", saveJob);
router.patch("/post-job/removeSaveJob", removeSaveJob);
router.patch("/post-job/state", updateState);
router.delete("/post-job", deletePostJob);


export default router;