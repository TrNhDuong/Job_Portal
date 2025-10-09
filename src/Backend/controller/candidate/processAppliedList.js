import { addJobToAppliedListOfCandidate, 
    removeJobFromAppliedListOfCandidate } from "../../repository/candidateRepository.js";
import { getListAppliedJob } from "./getListAppliedJob.js";

export const RemoveJobFromAppliedList = async (req, res) => {
    const { email, jobId } = req.params;
    try {
        const result = await removeJobFromAppliedListOfCandidate(email, jobId);
        if (result.success) {
            res.status(200).json({ message: "Job removed from applied list" });
        } else {
            res.status(404).json({ message: result.message });
        }
    } catch (error) {
        console.error("Error removing job from applied list:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};


export const AddNewJobToAppliedList = async (req, res) => {
    const { email, jobId } = req.params;
    try {
        const result = await addJobToAppliedListOfCandidate(email, jobId);
        if (result.success) {
            res.status(200).json({ message: "Job added to applied list" });
        } else {
            res.status(404).json({ message: result.message });
        }
    } catch (error) {
        console.error("Error adding job to applied list:", error);
        res.status(500).json({ message: "Internal server error" });
    }   
};

// In case: a applied job is deleted, all users's applied job will not be deleted instantly,
// so when user get list job, we need to check if the job is exist or not
// and remove it from their saved list if not exist

export const cleanAppliedList = async (req, res) => {
    const { email } = req.params;
    try {
        const appliedJobs = await getListAppliedJob(email);
        // Check if each applied job still exists
        for (const job of appliedJobs) {
            const exists = await JobPost.exists({ _id: job._id });
            if (!exists) {
                // If the job doesn't exist, remove it from the applied list
                await JobPost.findOneAndUpdate(
                    { _id: job._id },
                    { $pull: { appliedBy: email } }
                );
            }
        }
        res.status(200).json({ message: "Applied list cleaned" });
    } catch (error) {
        console.error("Error cleaning applied list:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

