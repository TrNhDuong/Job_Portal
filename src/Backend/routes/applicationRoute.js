import express from "express";
import { ApplicationRepository } from "../repository/applicationRepository.js";
import { CandidateRepository } from "../repository/candidateRepository.js";
import { JobRepository } from "../repository/jobRepository.js";
import mongoose from "mongoose";

const Router = express.Router();

Router.get("/application", async (req, res) => {
    const applicationId = req.query.id;
    const id = new mongoose.Types.ObjectId(applicationId);
    try {
        const result = await ApplicationRepository.getApplication(id);
        if (result.success) {
            res.status(200).json({
                success: true,
                data: result.data
            })
        } else {
            res.status(404).json({
                success: false,
                message: result.message
            })
        }
    } catch (error){
        res.status(500).json({
            success: false,
            message: 'Error internal server'
        })
    }
})

Router.post("/application/exist", async (req, res) => {
    const { candidateId, jobId } = req.body;
    try {
        const result = await ApplicationRepository.isApplicationExists(candidateId, jobId);
        if (result.success) {
            res.status(200).json({
                success: true,
                exists: result.exists
            })
        } else {
            res.status(404).json({
                success: false,
                message: result.message
            })
        }
    } catch (error){
        res.status(500).json({
            success: false,
            message: 'Error internal server'
        })
    }
})

Router.patch("/application/label", async (req, res) => {
    const { applicationId, jobId, label } = req.body;
    console.log('Label update request received:', { applicationId, jobId, label });
    try {
        const result = await ApplicationRepository.updateApplication(applicationId, jobId, label);
        if (result.success) {
            res.status(200).json({
                success: true,
                message: "Label updated successfully"
            })
        } else {
            res.status(404).json({
                success: false,
                message: result.message
            })
        }
    } catch (error){
        res.status(500).json({
            success: false,
            message: 'Error internal server'
        })
    }
})

Router.get("/application/applicantinfo", async (req, res) => {
    const jobId = req.query.jobId;
    const id = new mongoose.Types.ObjectId(jobId);
    try {
        console.log('Job ID in route:', id);
        const result = await JobRepository.getJobPost(id);
        console.log('Job Repository result:', result);
        if (!result.success) {
            res.status(404).json({
                success: false,
                message: `Job not found`
            })
        }
        const jobInfo = result.data;
        let returnData = [];
        for (const applicationId of jobInfo.applicants){
            const appResult = await ApplicationRepository.getApplication(applicationId);
            console.log('Application fetch result:', appResult);
            if (appResult.success){
                const candidateInfo = await CandidateRepository.getCandidate(appResult.data.contactEmail);
                const candidateValue = {email: candidateInfo.data.email, name: candidateInfo.data.name, avata: candidateInfo.data.logo || null};
                returnData.push({
                    application: appResult.data,
                    candidate: candidateValue
                });
            }
        }
        res.status(200).json({
            success: true,
            data: returnData
        })
    } catch (error){
        res.status(500).json({
            success: false,
            message: 'Error internal server'
        })
    }
})

import { getAppliedJobsByCandidate } from "../controller/jobPost/getPostJob.js";

Router.get("/application/byCandidateJob", getAppliedJobsByCandidate);

export default Router;