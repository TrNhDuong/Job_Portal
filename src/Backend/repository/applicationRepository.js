import { CandidateRepository } from "./candidateRepository.js";
import { JobRepository } from "./jobRepository.js";
import Application from "../model/application.js";
import Candidate from "../model/candidate.js";
import { JobPost } from "../model/jobPost.js";
export class ApplicationRepository {
    static async createApplication(candidateID, contactEmail, jobId, CV_url) {
        const newApplication = new Application({ candidateId: candidateID, contactEmail, jobId, CV_url, appliedDate: Date.now() });
        await newApplication.save();

        const candidateAppy = await CandidateRepository.getCandidateByID(candidateID);
        if (candidateAppy.success) {
            const result = await CandidateRepository.updateCandidate(candidateAppy.data.email, { apply: jobId });
            if (!result.success){
                console.error("Failed to update candidate with new applied job");
                return { success: false, message: "Failed to update candidate with new applied job" };
            }
        }
        const applicationJobPost = await JobRepository.getJobPost(jobId);
        if (applicationJobPost.success) {
            const result = await JobRepository.updateJobPost(jobId, { addApplicants: newApplication._id });
            if (!result.success){
                console.error("Failed to update job post with new applicant");
                return { success: false, message: "Failed to update job post with new applicant" };
            }
        }
        return {
            success: true,
            data: newApplication,
            message: "Application created successfully"
        };
    }

    static async isApplicationExists(candidateId, jobId) {
        try {
            const exists = await Application.exists({
                candidateId,
                jobId
            });

            return {
                success: true,
                exists: !!exists
            };
        } catch (error) {
            return {
                success: false,
                message: error.message
            };
        }
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
        console.log('Updated Job Post in updateApplication:');
        if (!updatedJobPost.success){
            return {
                success: false,
                message: 'JobId not valid'
            }
        }
        console.log('--------------------------------');
        const updatedApplication = await Application.findById(applicationId);
        if (!updatedApplication){
            return {
                success: false,
                message: 'Application id not valid'
            }
        }
        console.log('--------------------------------');
        const oldLabel = updatedApplication.label;
        console.log('Old Label:', oldLabel);
        console.log('New Label:', label);
        console.log('--------------------------------');
        const updateJobResult = await JobRepository.updateJobPost(jobId, {"newLabel": label, "oldLabel": oldLabel });
        if (!updateJobResult.success){
            return {
                success: false,
                message: 'Failed to update job post metrics'
            }
        }
        console.log('--------------------------------');
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
        console.log(application)
        const jobPostId = application.data.jobId;
        const candidateID = application.data.candidateId;
        console.log(jobPostId, candidateID);
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
    static async getByCandidateJob(candidateId, jobId) {
        try {
            const app = await Application.findOne({ candidateId, jobId });
            if (!app) return { success: false, message: "Application not found" };
            return { success: true, data: app };
        } catch (e) {
            return { success: false, message: "Repository error" };
        }
    }
}
