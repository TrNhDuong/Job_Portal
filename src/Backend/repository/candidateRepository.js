import { get } from "mongoose";
import Candidate from "../model/candidate.js";

export const getCandidateByEmail = async (email) => {
    try {
        const candidate = await Candidate.findOne({ email });
        if (candidate) {
            return { 
                success: true, 
                data: candidate, 
                message: "Candidate fetched successfully" 
            };
        }
        return { success: false, message: "Candidate not found", data: null };
    } catch (error) {
        throw new Error("Error fetching candidate");
    }
};

export const candidateCreate = async (candidateData) => {
    try {
        const newCandidate = new Candidate(candidateData);
        await newCandidate.save();
        return {
            success: true,
            data: newCandidate,
            message: "Candidate created successfully"
        };
    } catch (error) {
        throw new Error("Error creating candidate");
    }
};

export const updateCandidateDB = async (email, updatesCandidate) => {
    try {
        const candidateAtributes = ["name", "password", "listSaveJob", "appliedJobs", "CV" ];
        let uCandidate = await getCandidateByEmail(email);
        if (!uCandidate.success) {
            throw new Error("Candidate not found");
        }

        for (const attribute of candidateAtributes){
            uCandidate.data[attribute] = updatesCandidate[attribute] || uCandidate.data[attribute];
        }
        const updatedCandidate = await Candidate.findOneAndUpdate({ email }, uCandidate.data, { new: true });
        return updatedCandidate;
    } catch (error) {
        throw new Error("Error updating candidate");
    }
};

export const getCandidatePassword = async (email) => {
    try {
        const candidate = await Candidate.findOne({ email });
        return candidate ? candidate.password : null;
    } catch (error) {
        throw new Error("Error fetching candidate password");
    }
};

const modifyJobList = async (email, jobId, listType, action) => {
    const candidate = await Candidate.findOne({ email });
    if (!candidate) return { success: false, message: "Candidate not found" };

    const list = candidate[listType];

    if (action === "add") {
        if (!list.includes(jobId)) list.push(jobId);
    } else if (action === "remove") {
        candidate[listType] = list.filter((id) => id !== jobId);
    }

    await candidate.save();
    return {
        success: true,
        message: `Job ${action === "add" ? "added to" : "removed from"} ${listType}`,
        data: candidate,
    };
};

// Saved Jobs
export const addJobToSavedListOfCandidate = (email, jobId) =>
    modifyJobList(email, jobId, "savedJobs", "add");

export const removeJobFromSavedListOfCandidate = (email, jobId) =>
    modifyJobList(email, jobId, "savedJobs", "remove");

// Aped Jobspli
export const addJobToAppliedListOfCandidate = (email, jobId) =>
    modifyJobList(email, jobId, "appliedJobs", "add");

export const removeJobFromAppliedListOfCandidate = (email, jobId) =>
    modifyJobList(email, jobId, "appliedJobs", "remove");