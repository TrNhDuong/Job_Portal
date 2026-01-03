import ReportRepository from "../../repository/reportRepository.js";

export const updateReport = async (req, res) => {
    const reportId = req.query.reportId;
    const updateData = req.body;
    try {
        const result = await ReportRepository.update(reportId, updateData);

        if (!result.success) {
            return res.status(404).json({ 
                success: false,
                message: result.message || "Report not found" 
            });
        }
        res.status(200).json({ 
            success: true,
            message: "Report updated successfully",
            report: result.data
        });
    } catch (error) {
        console.error("Error updating report:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};