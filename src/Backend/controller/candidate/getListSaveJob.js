import Candidate from "../../model/candidate.js";

export const getListSaveJob = async (req, res) => {
    const { email } = req.params;
    try {
        const candidate = await Candidate.findOne({ email });
        if (!candidate) {
            return res.status(404).json({ message: "Candidate not found" });
        }
        return res.status(200).json(candidate.savedJobs);
    } catch (error) {
        console.error("Error fetching saved jobs:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};


