import Employer from "../model/employer.js";
import bcrypt from "bcryptjs";
import { destroyCloudData } from "../service/cloudinary.js";

export class EmployerRepository {
    static async getEmployer(email) {
        try {
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
    static async createEmployer(employerData) {
            const newEmployer = new Employer(employerData);
            await newEmployer.save();
            return {
                success: true,
                data: newEmployer,
                message: "Employer created successfully"
            };
    }
    static async updateEmployer(email, updatesEmployer) {
        const employerAttributes = ["company", "email", "password", "phone", "address", "description", "logo", "wallpaper", "website", "jobPosted", "point"];
        let employer = await this.getEmployer(email);
        if (!employer.success) {
            return {
                success: false,
                message: "Employer not found",
                data: null
            };
        }


        if (updatesEmployer["password"]) {
            employer.data["password"] = bcrypt.hashSync(updatesEmployer["password"], 10);
        }

        if (updatesEmployer["logo"]){
            if (employer.data.logo.public_id){
                const result = await destroyCloudData(employer.data.logo.public_id);
                if (result){
                    console.log('Deleted image')
                } else {
                    console.log('Failed to deleted image')
                }
            }
        }

        if (updatesEmployer["wallpaper"]){
            if (employer.data.wallpaper.public_id){
                const result = await destroyCloudData(employer.data.wallpaper.public_id);
                if (result){
                    console.log('Deleted image wallpaper')
                } else {
                    console.log('Failed to deleted image')
                }
            }
        }

        for (const attribute of employerAttributes) {
            employer.data[attribute] = updatesEmployer[attribute] || employer.data[attribute];
        }

        const updatedEmployer = await Employer.findOneAndUpdate({ email }, employer.data, { new: true });
        return {
            success: true,
            data: updatedEmployer
        };
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
    static async addJobPostToEmployer(email, jobPostId) {
    
        // 1. Kiểm tra sự tồn tại (giữ nguyên, nhưng không cần lấy toàn bộ dữ liệu)
        const employer = await Employer.findOne({ email });
        if (!employer) { // Kiểm tra trực tiếp object Mongoose
            return {
                success: false,
                message: "Employer not found",
                data: null
            };
        }
        console.log("Employer tìm thấy để thêm job post:", employer);
        try {
            // 2. SỬ DỤNG $push ĐỂ CẬP NHẬT NGUYÊN TỬ (ATOMIC UPDATE)
            console.log("Thêm job post ID:", jobPostId, "vào employer với email:", email);
            const updatedEmployer = await Employer.findOneAndUpdate(
                { email: email }, // Query: Tìm theo email
                { $push: { jobPosted: jobPostId } }, // Update: Thêm jobPostId vào mảng jobPosted
                { new: true } // Options: Trả về tài liệu đã cập nhật
            );
            console.log("Cập nhật employer thành công:", updatedEmployer);
            // 3. Trả về kết quả
            return {
                success: true,
                data: updatedEmployer
            };
            
        } catch (error) {
            // Nên thêm khối try...catch ở đây để bắt lỗi database/validation
            console.error("Lỗi khi thêm Job Post vào Employer:", error);
            return {
                success: false,
                message: "Database update error",
                data: null
            };
        }
    }
    static async removeJobPostFromEmployer(email, jobPostId) {
        try {
            const updatedEmployer = await Employer.findOneAndUpdate(
                { email: email },
                { $pull: { jobPosted: jobPostId } },
                { new: true }
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
    // Return top 10 branch hot
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
                        _id: 0,         // Loại bỏ trường _id
                        email: 1        // CHỈ giữ lại trường email
                    }
                }
            ]);
            const emailList = topEmployerEmails.map(employer => employer.email);

            return {
                success: true,
                data: emailList // Trả về mảng chỉ chứa các chuỗi email
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
};

export default EmployerRepository;
