import { CandidateRepository } from "./candidateRepository.js";

export class ApplicationRepository {
    static async createApplication(candidateID, jobId) {
        const newApplication = new Application({ candidateID, jobId, appliedDate: Date.now() });
        await newApplication.save();
        const applicationCandidate = await CandidateRepository.getCandidateByID(candidateID);
        if (applicationCandidate.success) {
            applicationCandidate.data.appliedJobs.push(jobId);
            await applicationCandidate.data.save();
        }
        
        const applicationJobPost = await JobPost.findById(jobId);
        if (applicationJobPost) {
            applicationJobPost.applicants.push(candidateID);
            await applicationJobPost.save();
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

    static async getApplication(jobId, candidateID) {
        const application = await Application.findOne({ jobId, candidateID });
        if (!application) {
            return { success: false, message: "Application not found" };
        }
        return { success: true, data: application, message: "Application fetched successfully" };
    }

    static async updateApplication(applicationId, label) {
        const updatedApplication = await Application.findByIdAndUpdate(applicationId, { label: label }, { new: true });
        if (!updatedApplication) {
            return { success: false, message: "Application not found or could not be updated" };
        }
        return {
            success: true, data: updatedApplication, message: "Application updated successfully"
        };
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

