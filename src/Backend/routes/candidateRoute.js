import express from "express";

const router = express.Router();

import { getCandidate } from "../controller/candidate/getCandidate.js";
import { createCandidate } from "../controller/candidate/createCandidate.js";
import { updateCandidate } from "../controller/candidate/updateCandidate.js";
import { getListAppliedJob } from "../controller/candidate/getListAppliedJob.js";
import { getListSaveJob } from "../controller/candidate/getListSaveJob.js";
import { AddNewJobToAppliedList, RemoveJobFromAppliedList, cleanAppliedList } from "../controller/candidate/processAppliedList.js";
import { AddNewJobToSavedList, RemoveJobFromSavedList, cleanSavedList } from "../controller/candidate/processSavedList.js";

router.get("/candidate/:id", getCandidate);
router.post("/candidate", createCandidate);
router.patch("/candidate/:id", updateCandidate);
router.get("/candidate/:id/applied-jobs", getListAppliedJob);
router.get("/candidate/:id/saved-jobs", getListSaveJob);
router.patch("/candidate/:id/applied-jobs", cleanAppliedList);
router.patch("/candidate/:id/saved-jobs", cleanSavedList);
router.patch("/candidate/:email/applied-jobs/:jobId", AddNewJobToAppliedList);
router.patch("/candidate/:email/applied-jobs/:jobId", RemoveJobFromAppliedList);
router.patch("/candidate/:email/saved-jobs/:jobId", AddNewJobToSavedList);
router.patch("/candidate/:email/saved-jobs/:jobId", RemoveJobFromSavedList);

export default router;
