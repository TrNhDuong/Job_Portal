import Employer from "../model/employer.js";
import bcrypt from "bcryptjs";
import { destroyCloudData } from "../service/cloudinary.js";
import mongoose from 'mongoose'; // Cần thiết để đảm bảo môi trường Mongoose

export class EmployerRepository {
    static async getEmployer(email) {
        try {
            // Sử dụng .lean() để trả về plain JS object, tối ưu cho read-only
            const employer = await Employer.findOne({ email }).lean();
            if (!employer) {
                return {
                    success: false,
                    message: "Employer not found",
                    data: null
                };
            }
            return {
                success: true,
                data: employer
            };
        } catch (error) {
            console.error(`Error fetching employer by email:`, error);
            return { success: false, message: "Error fetching employer" };
        }
    }

    static async getHashedPassword(email) {
        const employer = await this.getEmployer(email);
        if (!employer.success) {
            return {
                success: false,
                message: "Employer not found",
                data: null
            };
        }
        return {
            success: true,
            data: employer.data.password
        };
    }

    static async createEmployer(employerData) {
        try {
            const newEmployer = new Employer(employerData);
            await newEmployer.save();
            return {
                success: true,
                data: newEmployer,
                message: "Employer created successfully"
            };
        } catch (error) {
            console.error(`Error creating employer:`, error);
            return { success: false, message: "Error creating employer" };
        }
    }

    // --- HÀM CẬP NHẬT DỮ LIỆU (Đã sửa lỗi Read-Modify-Write và thêm Session) ---
    static async updateEmployer(email, updatesEmployer, options = {}) {
        // Lấy session từ options (Mongoose sẽ bỏ qua nếu options.session là undefined)
        const { session } = options; 
        
        // 1. Tìm employer để kiểm tra sự tồn tại và lấy dữ liệu cũ (cần cho logo/wallpaper)
        const employerResult = await this.getEmployer(email);
        if (!employerResult.success) {
            return {
                success: false,
                message: "Employer not found",
                data: null
            };
        }
        const employer = employerResult.data;
        
        // 2. Chuẩn bị Payload cho $set (Cập nhật nguyên tử)
        let updatePayload = {};
        
        // 2a. Xử lý Mật khẩu
        if (updatesEmployer["password"]) {
            updatePayload["password"] = bcrypt.hashSync(updatesEmployer["password"], 10);
        }

        // 2b. Xử lý Logo (Nếu có logo mới, xóa logo cũ trên Cloud)
        if (updatesEmployer["logo"]){
            if (employer?.logo?.public_id){
                console.log('Đang xóa logo cũ...');
                await destroyCloudData(employer.logo.public_id);
            }
            updatePayload["logo"] = updatesEmployer["logo"];
        }

        // 2c. Xử lý Wallpaper (Nếu có wallpaper mới, xóa wallpaper cũ trên Cloud)
        if (updatesEmployer["wallpaper"]){
            if (employer?.wallpaper?.public_id){
                console.log('Đang xóa wallpaper cũ...');
                await destroyCloudData(employer.wallpaper.public_id);
            }
            updatePayload["wallpaper"] = updatesEmployer["wallpaper"];
        }

        // 2d. Xử lý các fields thông thường (bao gồm cả 'point' nếu được truyền)
        const employerAttributes = ["company", "email", "phone", "address", "description", "website", "contact", "point", "scale"];
        for (const attribute of employerAttributes) {
             if (updatesEmployer[attribute] !== undefined) {
                 updatePayload[attribute] = updatesEmployer[attribute];
             }
        }
        
        // 3. Thực hiện cập nhật nguyên tử bằng findOneAndUpdate
        try {
            const updatedEmployer = await Employer.findOneAndUpdate(
                { email }, 
                { $set: updatePayload }, // Chỉ cập nhật các trường trong updatePayload
                { new: true, session } // Thêm options.session
            );
            
            if (!updatedEmployer) {
                 return { success: false, message: "Employer not found during update." };
            }

            return {
                success: true,
                data: updatedEmployer
            };
        } catch (error) {
            console.error(`Error updating employer ${email}:`, error);
            return { success: false, message: "Database update error" };
        }
    }
    
    // --- HÀM THÊM JOB VÀO EMPLOYER (Hỗ trợ Session) ---
    static async addJobPostToEmployer(email, jobPostId, options = {}) {
        const { session } = options;
        try {
            const updatedEmployer = await Employer.findOneAndUpdate(
                { email: email }, 
                { $push: { jobPosted: jobPostId } }, 
                { new: true, session } // Thêm options.session
            );

            if (!updatedEmployer) {
                return {
                    success: false,
                    message: "Employer not found",
                    data: null
                };
            }
            
            return {
                success: true,
                data: updatedEmployer
            };
            
        } catch (error) {
            console.error("Lỗi khi thêm Job Post vào Employer:", error);
            return {
                success: false,
                message: "Database update error",
                data: null
            };
        }
    }
    
    // --- HÀM XÓA JOB KHỎI EMPLOYER (Hỗ trợ Session) ---
    static async removeJobPostFromEmployer(email, jobPostId, options = {}) {
        const { session } = options;
        try {
            const updatedEmployer = await Employer.findOneAndUpdate(
                { email: email },
                { $pull: { jobPosted: jobPostId } },
                { new: true, session } // Thêm options.session
            );

            if (!updatedEmployer) {
                return {
                    success: false,
                    message: "Employer not found",
                    data: null
                };
            }

            return {
                success: true,
                data: updatedEmployer
            };

        } catch (error) {
            console.error("Error removing job post from employer:", error);
            return {
                success: false,
                message: "Database update error",
                data: null
            };
        }
    }
    
    // --- HÀM ĐỌC DỮ LIỆU (Giữ nguyên) ---
    static async getTopFeature() {
        try {
            const topEmployerEmails = await Employer.aggregate([
                {
                    $addFields: {
                        jobCount: { $size: "$jobPosted" } 
                    }
                },
                {
                    $sort: {
                        jobCount: -1
                    }
                },
                {
                    $limit: 10
                },
                {
                    $project: {
                        _id: 0, 
                        email: 1 
                    }
                }
            ]);
            const emailList = topEmployerEmails.map(employer => employer.email);

            return {
                success: true,
                data: emailList 
            };
        } catch (error) {
            console.error(`Error fetching top feature employer emails:`, error);
            return {
                success: false,
                message: "Error fetching top feature employer emails",
                data: null
            };
        }
    }
}

export default EmployerRepository;