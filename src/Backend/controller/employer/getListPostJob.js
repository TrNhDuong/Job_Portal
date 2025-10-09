import {getEmployerPostJob} from "../../repository/jobRepository.js";

export const getListPostJob = async (req, res) => {
    const { employerEmail } = req.params;
    try {
        const result = await getEmployerPostJob(employerEmail);
        if (result.success) {
            return res.status(200).json(result.data);
        }
        return res.status(404).json({ message: "Jobs not found" });
    } catch (error) {
        console.error("Error fetching posted jobs:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};
