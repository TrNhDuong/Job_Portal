import { Report } from '../model/report.js';
import mongoose from 'mongoose';

export default class ReportRepository {

    static async create(reportedBy, reason, jobPostId) {
        try {
            if (!reportedBy || !reason || !jobPostId) {
                return { success: false, message: "Missing required fields" };
            }

            if (!mongoose.Types.ObjectId.isValid(jobPostId)) {
                return { success: false, message: "Invalid JobPost ID" };
            }

            const newReport = new Report({
                reportedBy,
                reason,
                JobPost: jobPostId,
            });

            await newReport.save();

            return { success: true, data: newReport };
        } catch (error) {
            console.error("Error creating report:", error);
            return { success: false, message: error.message };
        }
    }

    static async get(reportId) {
        try {
            if (!mongoose.Types.ObjectId.isValid(reportId)) {
                return { success: false, message: "Invalid report ID" };
            }

            const report = await Report
                .findById(reportId)
                .populate('JobPost');

            if (!report) {
                return { success: false, message: "Report not found" };
            }

            return { success: true, data: report };
        } catch (error) {
            console.error("Error getting report:", error);
            return { success: false, message: error.message };
        }
    }

    static async getAll(limit = 50) {
        try {
            const reports = await Report
                .find()
                .populate('JobPost')
                .sort({ timeStamp: -1 })
                .limit(limit);

            return { success: true, data: reports };
        } catch (error) {
            console.error("Error getting reports:", error);
            return { success: false, message: error.message };
        }
    }

    static async delete(reportId) {
        try {
            if (!mongoose.Types.ObjectId.isValid(reportId)) {
                return { success: false, message: "Invalid report ID" };
            }

            const result = await Report.findByIdAndDelete(reportId);

            if (!result) {
                return { success: false, message: "Report not found" };
            }

            return { success: true, message: "Report deleted successfully" };
        } catch (error) {
            console.error("Error deleting report:", error);
            return { success: false, message: error.message };
        }
    }

    static async update(reportId, updateData) {
        try {
            if (!mongoose.Types.ObjectId.isValid(reportId)) {
                return { success: false, message: "Invalid report ID" };
            }

            // Chỉ cho phép update các field hợp lệ
            const allowedFields = ['reason'];
            const filteredData = Object.fromEntries(
                Object.entries(updateData).filter(([key]) =>
                    allowedFields.includes(key)
                )
            );

            if (Object.keys(filteredData).length === 0) {
                return { success: false, message: "No valid fields to update" };
            }

            const report = await Report.findByIdAndUpdate(
                reportId,
                filteredData,
                { new: true }
            ).populate('JobPost');

            if (!report) {
                return { success: false, message: "Report not found" };
            }

            return { success: true, data: report };
        } catch (error) {
            console.error("Error updating report:", error);
            return { success: false, message: error.message };
        }
    }
}
