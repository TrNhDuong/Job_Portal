import { JobPost } from "../model/jobPost.js";
import mongoose from "mongoose";

export default class AdminJobRepository {

    // 🟢 Lấy tất cả job (admin)
    static async getAll(limit = 50) {
        try {
            const jobs = await JobPost
                .find()
                .sort({ postedAt: -1 })
                .limit(limit)
                .lean();

            return {
                success: true,
                data: jobs,
            };
        } catch (error) {
            console.error("Error getting admin jobs:", error);
            return {
                success: false,
                message: error.message,
            };
        }
    }

    // 🟢 Lấy job theo ID
    static async get(jobId) {
        try {
            if (!mongoose.Types.ObjectId.isValid(jobId)) {
                return {
                    success: false,
                    message: "Invalid job ID",
                };
            }

            const job = await JobPost.findById(jobId).lean();

            if (!job) {
                return {
                    success: false,
                    message: "Job not found",
                };
            }

            return {
                success: true,
                data: job,
            };
        } catch (error) {
            console.error("Error getting admin job:", error);
            return {
                success: false,
                message: error.message,
            };
        }
    }

    // 🟢 Xoá job (admin)
    static async delete(jobId) {
        try {
            if (!mongoose.Types.ObjectId.isValid(jobId)) {
                return {
                    success: false,
                    message: "Invalid job ID",
                };
            }

            const deletedJob = await JobPost.findByIdAndDelete(jobId);

            if (!deletedJob) {
                return {
                    success: false,
                    message: "Job not found",
                };
            }

            return {
                success: true,
                message: "Job deleted successfully",
            };
        } catch (error) {
            console.error("Error deleting admin job:", error);
            return {
                success: false,
                message: error.message,
            };
        }
    }

    // 🟡 (OPTIONAL) Admin update job
    static async update(jobId, updateData) {
        try {
            if (!mongoose.Types.ObjectId.isValid(jobId)) {
                return {
                    success: false,
                    message: "Invalid job ID",
                };
            }

            const allowedFields = ["state", "expireDay"];
            const filteredData = Object.fromEntries(
                Object.entries(updateData).filter(([key]) =>
                    allowedFields.includes(key)
                )
            );

            if (Object.keys(filteredData).length === 0) {
                return {
                    success: false,
                    message: "No valid fields to update",
                };
            }

            const job = await JobPost.findByIdAndUpdate(
                jobId,
                filteredData,
                { new: true }
            ).lean();

            if (!job) {
                return {
                    success: false,
                    message: "Job not found",
                };
            }

            return {
                success: true,
                data: job,
            };
        } catch (error) {
            console.error("Error updating admin job:", error);
            return {
                success: false,
                message: error.message,
            };
        }
    }
}