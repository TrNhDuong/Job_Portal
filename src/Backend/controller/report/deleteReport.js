import ReportRepository from "../../repository/reportRepository.js";

export const deleteReport = async (req, res) => {
    const reportId = req.query.reportId;
    try {
        const result = await ReportRepository.delete(reportId);
        if (!result.success) {
            return res.status(404).json({ 
                success: false,
                message: result.message || "Report not found" 
            });
        }
        res.status(200).json({ 
            success: true,
            message: "Report deleted successfully"
        });
    } catch (error) {
        console.error("Error deleting report:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};