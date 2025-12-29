import { CandidateRepository } from "./candidateRepository.js";
import { JobRepository } from "./jobRepository.js";
import Application from "../model/application.js";
import { application } from "express";

export class ApplicationRepository {
    static async createApplication(candidateID, jobId) {
        const newApplication = new Application({ candidateID, jobId, appliedDate: Date.now() });
        await newApplication.save();
        const applicationCandidate = await CandidateRepository.getCandidateByID(candidateID);
        if (applicationCandidate.success) {
            applicationCandidate.data.appliedJobs.push(jobId);
            await applicationCandidate.data.save();
        }
        
        const applicationJobPost = await JobRepository.getJobPost(jobId);
        if (applicationJobPost.success) {
            applicationJobPost.data.applicants.push(candidateID)
            applicationJobPost.data.metric.newed += 1;
            await applicationJobPost.data.save();
        }
        return {
            success: true,
            data: newApplication,
            message: "Application created successfully"
        };
    }

    static async getApplication(applicationId) {
        const application = await Application.findOne({ _id: applicationId });
        if (!application) {
            return { success: false, message: "Application not found" };
        }
        return { success: true, data: application, message: "Application fetched successfully" };
    }

    static async updateApplication(applicationId, jobId, label) {
        const updatedJobPost = await JobRepository.getJobPost(jobId);
        if (!updatedJobPost.success){
            return {
                success: false,
                message: 'JobId not valid'
            }
        }
        const updatedApplication = await Application.getApplication(applicationId);
        if (!updatedApplication.success){
            return {
                success: false,
                message: 'Application id not valid'
            }
        }
        const oldLabel = updatedApplication.data.label;
        if (oldLabel == 'New'){
            updatedJobPost.data.metric.newed -= 1;
        } else if (oldLabel == 'Pass'){
            updatedJobPost.data.metric.pass -= 1;
        } else if (oldLabel == 'Interviewed'){
            updatedJobPost.data.metric.interviewed -= 1;
        }
        if (label == 'New'){
            updatedJobPost.data.metric.newed += 1;
        } else if (label == 'Pass'){
            updatedJobPost.data.metric.pass += 1;
        } else if (label == 'Interviewed'){
            updatedJobPost.data.metric.interviewed += 1;
        }
        const result = await Application.findByIdAndUpdate(applicationId, { label: label }, { new: true });
        if (result){
            return {
                success: true, 
                message: "Application updated successfully"
            };
        } else {
            return {
                success: false,
                message: 'Update failed'
            }
        }
    }

    static async deleteApplication(applicationId) {
        const application = await this.getApplication(applicationId);
        if (!application.success) {
            return { success: false, message: "Application not found or could not be deleted" };
        }
        const jobPostId = application.data.jobId;
        const candidateID = application.data.candidateID;

        const applicationCandidate = await Candidate.findById(candidateID);
        if (applicationCandidate) {
            applicationCandidate.appliedJobs = applicationCandidate.appliedJobs.filter(job => job.toString() !== jobPostId.toString());
            await applicationCandidate.save();
        }

        const applicationJobPost = await JobPost.findById(jobPostId);
        if (applicationJobPost) {
            applicationJobPost.applicants = applicationJobPost.applicants.filter(applicant => applicant.toString() !== candidateID.toString());
            await applicationJobPost.save();
        }

        const deletedApplication = await Application.findByIdAndDelete(applicationId);
        if (!deletedApplication) {
            return { success: false, message: "Application not found or could not be deleted" };
        }
        return {
            success: true, data: deletedApplication, message: "Application deleted successfully"
        };
    }
}
