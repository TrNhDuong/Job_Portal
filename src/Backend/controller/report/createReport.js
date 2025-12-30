import ReportRepository from "../../repository/reportRepository.js";

export const createReport = async (req, res) => {
    const { reportedBy, reason, jobPostId } = req.body; 
    try {
        const result = await ReportRepository.create(reportedBy, reason, jobPostId);
        if (!result.success) {
            return res.status(500).json({ 
                success: false,
                message: "Error creating report" 
            });
        }
        res.status(201).json({ 
            success: true,
            message: "Report created successfully",
            report: result.report
        });
    } catch (error) {
        console.error("Error creating report:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};