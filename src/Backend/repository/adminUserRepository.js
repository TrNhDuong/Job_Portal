import Candidate from "../model/candidate.js";
import Employer from "../model/employer.js";
import mongoose from "mongoose";

export default class AdminUserRepository {

    // 🟢 Lấy tất cả user (employer + employee)
    static async getAll() {
        try {
            const [employers, candidates] = await Promise.all([
                Employer.find().select("-password").lean(),
                Candidate.find().select("-password").lean()
            ]);

            return {
                success: true,
                data: {
                    employers,
                    candidates
                }
            };
        } catch (error) {
            console.error("Error getting admin users:", error);
            return {
                success: false,
                message: error.message
            };
        }
    }

    // 🟢 Lấy user theo ID + role
    static async get(userId, role) {
        try {
            if (!mongoose.Types.ObjectId.isValid(userId)) {
                return {
                    success: false,
                    message: "Invalid user ID"
                };
            }

            let user = null;

            if (role === "employer") {
                user = await Employer.findById(userId).select("-password").lean();
            } else if (role === "candidate") {
                user = await Candidate.findById(userId).select("-password").lean();
            } else {
                return {
                    success: false,
                    message: "Invalid role"
                };
            }

            if (!user) {
                return {
                    success: false,
                    message: "User not found"
                };
            }

            return {
                success: true,
                data: user
            };
        } catch (error) {
            console.error("Error getting admin user:", error);
            return {
                success: false,
                message: error.message
            };
        }
    }

    // 🟢 Xoá user (admin)
    static async delete(userId, role) {
        try {
            if (!mongoose.Types.ObjectId.isValid(userId)) {
                return {
                    success: false,
                    message: "Invalid user ID"
                };
            }

            let deletedUser = null;

            if (role === "employer") {
                deletedUser = await Employer.findByIdAndDelete(userId);
            } else if (role === "candidate") {
                deletedUser = await Candidate.findByIdAndDelete(userId);
            } else {
                return {
                    success: false,
                    message: "Invalid role"
                };
            }

            if (!deletedUser) {
                return {
                    success: false,
                    message: "User not found"
                };
            }

            return {
                success: true,
                message: "User deleted successfully"
            };
        } catch (error) {
            console.error("Error deleting admin user:", error);
            return {
                success: false,
                message: error.message
            };
        }
    }

    // 🟡 Admin update user (ví dụ: state, point)
    static async update(userId, role, updateData) {
        try {
            if (!mongoose.Types.ObjectId.isValid(userId)) {
                return {
                    success: false,
                    message: "Invalid user ID"
                };
            }

            const allowedFields = ["state", "point"];
            const filteredData = Object.fromEntries(
                Object.entries(updateData).filter(([key]) =>
                    allowedFields.includes(key)
                )
            );

            if (Object.keys(filteredData).length === 0) {
                return {
                    success: false,
                    message: "No valid fields to update"
                };
            }

            let updatedUser = null;

            if (role === "employer") {
                updatedUser = await Employer.findByIdAndUpdate(
                    userId,
                    filteredData,
                    { new: true }
                ).select("-password").lean();
            } else if (role === "candidate") {
                updatedUser = await Candidate.findByIdAndUpdate(
                    userId,
                    filteredData,
                    { new: true }
                ).select("-password").lean();
            } else {
                return {
                    success: false,
                    message: "Invalid role"
                };
            }

            if (!updatedUser) {
                return {
                    success: false,
                    message: "User not found"
                };
            }

            return {
                success: true,
                data: updatedUser
            };
        } catch (error) {
            console.error("Error updating admin user:", error);
            return {
                success: false,
                message: error.message
            };
        }
    }
}