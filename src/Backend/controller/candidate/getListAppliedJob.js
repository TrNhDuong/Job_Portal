import Candidate from "../../model/candidate.js";


// Just return list id of applied jobs of candidate
export const getListAppliedJob = async (req, res) => {
    const { email } = req.params;
    try {
        const candidate = await Candidate.findOne({ email });
        if (!candidate) {
            return res.status(404).json({ message: "Candidate not found" });
        }
        return res.status(200).json(candidate.appliedJobs);
    } catch (error) {
        console.error("Error fetching applied jobs:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};
