import {getEmployerPostJob} from "../../repository/jobRepository.js";

export const getListAppliedCVinJob = async (req, res) => {
    const { employerEmail } = req.params;
    try {
        const result = await getEmployerPostJob(employerEmail);
        if (result.success) {
            return res.status(404).json({ message: "Job not found" });
        }
        const appliedCVs = result.data.appliedCVs || [];
        res.status(200).json(appliedCVs);
    } catch (error) {
        console.error("Error fetching applied CVs:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// The future implementation of code is when click to see detail CV of candidate,
// front end will call API to get detail CV of candidate by candidate ID in appliedCVs array
