import ReportRepository from "../../repository/reportRepository.js";

export const getReport = async (req, res) => {
    const reportId = req.query.reportId;
    try {
        const result = await ReportRepository.get(reportId);
        if (!result.success) {
            return res.status(404).json({ 
                success: false,
                message: result.message || "Error getting report"
            });
        }
        res.status(200).json({ 
            success: true,
            report: result.data
        });
    } catch (error) {
        console.error("Error getting report:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};

export const getAllReports = async (req, res) => {
    try {
        const result = await ReportRepository.getAll();
        if (!result.success) {
            return res.status(500).json({ 
                success: false,
                message: "Error getting reports"
            });
        }
        res.status(200).json({ 
            success: true,
            reports: result.data
        });
    } catch (error) {
        console.error("Error getting reports:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};

export const isCandidateReport = async (req, res) => {
    const { email, jobId } = req.body;
    try {

    } catch (error){
        
    }
}