import { Statistic } from "../model/statistic.js"; // Giả sử path đúng

export default class StatisticRepository {
    
    // Helper: Lấy key thời gian theo múi giờ VN
    static getVNTimeKeys() {
        const now = new Date();
        const vnDateString = now.toLocaleDateString("en-CA", {
            timeZone: "Asia/Ho_Chi_Minh"
        }); // Result: "YYYY-MM-DD"
        
        const [year, month, day] = vnDateString.split("-");

        return {
            monthKey: `${year}-${month}`, // Key cho Document: "2023-10"
            dayKey: String(parseInt(day)) // Key cho Map: "4" (bỏ số 0 ở đầu)
        };
    }

    /**
     * Hàm cập nhật chung cho tất cả các loại register.
     * Thay vì viết 3 hàm, ta chỉ cần 1 hàm nhận vào field name.
     */
    static async update(type) {
        const allowedTypes = ['candidateRegister', 'employerRegister', 'jobPost'];
        
        if (!allowedTypes.includes(type)) {
            console.error(`[Statistic] Invalid type: ${type}`);
            return null;
        }

        const { monthKey, dayKey } = this.getVNTimeKeys();

        try {
            // Sử dụng Dynamic Key trong MongoDB update
            const updateQuery = {
                $inc: {
                    [`monthly_total.${type}`]: 1,      // Tăng tổng tháng
                    [`daily_stats.${dayKey}.${type}`]: 1 // Tăng ngày cụ thể
                },
                $set: { last_updated: new Date() }
            };

            const result = await Statistic.updateOne(
                { _id: monthKey },
                updateQuery,
                { upsert: true } // Tự tạo document tháng mới nếu chưa có
            );
            
            return result;
        } catch (error) {
            console.error("[Statistic] Update failed:", error);
            throw error; // Ném lỗi để tầng trên xử lý
        }
    }

    // Lấy thống kê theo tháng
    static async getStatisticByMonth(year, month) {
        // Đảm bảo month có 2 chữ số (ví dụ: 1 -> 01)
        const formattedMonth = String(month).padStart(2, '0');
        const _id = `${year}-${formattedMonth}`;
        
        try {
            const result = await Statistic.findById(_id).lean(); // .lean() giúp query nhanh hơn nếu chỉ đọc
            return {
                success: true,
                data: result || null // Trả về null nếu không tìm thấy thay vì undefined
            };
        } catch (error) {
            return { success: false, message: error.message };
        }
    }

    // Lấy thống kê theo năm (Tổng hợp từ 12 tháng)
    static async getStatisticByYear(year) {
        try {
            // Regex để tìm tất cả các tháng bắt đầu bằng "YYYY-"
            const regex = new RegExp(`^${year}-`);
            
            const stats = await Statistic.aggregate([
                { 
                    $match: { _id: regex } // Lọc các document thuộc năm đó
                },
                {
                    $group: {
                        _id: null, // Gom tất cả lại thành 1 cục
                        totalCandidate: { $sum: "$monthly_total.candidateRegister" },
                        totalEmployer: { $sum: "$monthly_total.employerRegister" },
                        totalJobPost: { $sum: "$monthly_total.jobPost" },
                        months_count: { $sum: 1 } // Đếm xem có dữ liệu của bao nhiêu tháng
                    }
                },
                {
                    $project: {
                        _id: 0,
                        year: { $literal: year },
                        candidateRegister: "$totalCandidate",
                        employerRegister: "$totalEmployer",
                        jobPost: "$totalJobPost",
                        months_tracked: "$months_count"
                    }
                }
            ]);

            return {
                success: true,
                data: stats.length > 0 ? stats[0] : { year, candidateRegister: 0, employerRegister: 0, jobPost: 0 }
            };

        } catch (error) {
            console.error("[Statistic] Get Year failed:", error);
            return { success: false, message: error.message };
        }
    }
}