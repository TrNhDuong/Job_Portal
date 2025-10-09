import JobPost from "../../model/jobPost.js";
import { addJobToSavedListOfCandidate, removeJobFromSavedListOfCandidate } from "../../repository/candidateRepository.js";
import { getListSaveJob } from "./getListSaveJob.js";

export const RemoveJobFromSavedList = async (req, res) => {
    const { email, jobId } = req.params;
    try {
        const result = await removeJobFromSavedListOfCandidate(email, jobId);
        if (result.success) {
            res.status(200).json({ message: "Job removed from saved list" });
        } else {
            res.status(404).json({ message: result.message });
        }
    } catch (error) {
        console.error("Error removing job from saved list:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};


export const AddNewJobToSavedList = async (req, res) => {
    const { email, jobId } = req.params;
    try {
        const result = await addJobToSavedListOfCandidate(email, jobId);
        if (result.success) {
            res.status(200).json({ message: "Job added to saved list" });
        } else {
            res.status(404).json({ message: result.message });
        }
    } catch (error) {
        console.error("Error adding job to saved list:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// In case: a post job is deleted, all users's save job will not be deleted instantly,
// so when user get list job, we need to check if the job is exist or not
// and remove it from their saved list if not exist

export const cleanSavedList = async (req, res) => {
    const { email } = req.params;
    try {
        const savedJobs = await getListSavedJob(email);
        // Check if each saved job still exists
        for (const job of savedJobs) {
            const exists = await JobPost.exists({ _id: job._id });
            if (!exists) {
                // If the job doesn't exist, remove it from the saved list
                await JobPost.findOneAndUpdate(
                    { _id: job._id },
                    { $pull: { savedBy: userId } }
                );
            }
        }
        res.status(200).json({ message: "Saved list cleaned" });
    } catch (error) {
        console.error("Error cleaning saved list:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};
