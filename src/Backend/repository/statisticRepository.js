import { Statistic } from "../model/statistic.js";
import Candidate from "../model/candidate.js";
import Employer from "../model/employer.js";
import { JobPost } from "../model/jobPost.js";

export default class StatisticRepository {
    
    // Helper: Lấy key thời gian theo múi giờ VN
    static getVNTimeKeys() {
        const now = new Date();
        const vnDateString = now.toLocaleDateString("en-CA", {
            timeZone: "Asia/Ho_Chi_Minh"
        }); // YYYY-MM-DD
        
        const [year, month, day] = vnDateString.split("-");

        return {
            year,
            month,
            monthKey: `${year}-${month}`,
            dayKey: String(parseInt(day))
        };
    }

    /**
     * 🟢 INIT STATISTIC (CHẠY 1 LẦN)
     * Đếm dữ liệu có sẵn trong DB và set làm số liệu nền
     */
    static async initMonthlyStatistic() {
        const { monthKey } = this.getVNTimeKeys();

        try {
            // Nếu tháng này đã có statistic → bỏ qua
            const existed = await Statistic.findById(monthKey);
            if (existed) return;

            const candidateCount = await Candidate.countDocuments({ role: "candidate" });
            const employerCount = await Employer.countDocuments({ role: "employer" });
            const jobPostCount = await JobPost.countDocuments();


            await Statistic.create({
                _id: monthKey,
                monthly_total: {
                    candidateRegister: candidateCount,
                    employerRegister: employerCount,
                    jobPost: jobPostCount
                },
                daily_stats: {},
                last_updated: new Date()
            });

            console.log(`[Statistic] Init success for ${monthKey}`);
        } catch (error) {
            console.error("[Statistic] Init failed:", error);
            throw error;
        }
    }

    /**
     * 🔥 Update statistic theo event
     */
    static async update(type) {
        const allowedTypes = ['candidateRegister', 'employerRegister', 'jobPost'];
        
        if (!allowedTypes.includes(type)) {
            console.error(`[Statistic] Invalid type: ${type}`);
            return null;
        }

        const { monthKey, dayKey } = this.getVNTimeKeys();

        try {
            const updateQuery = {
                $inc: {
                    [`monthly_total.${type}`]: 1,
                    [`daily_stats.${dayKey}.${type}`]: 1
                },
                $set: { last_updated: new Date() }
            };

            return await Statistic.updateOne(
                { _id: monthKey },
                updateQuery,
                { upsert: true }
            );
        } catch (error) {
            console.error("[Statistic] Update failed:", error);
            throw error;
        }
    }

    // Lấy thống kê theo tháng
    static async getStatisticByMonth(year, month) {
        const formattedMonth = String(month).padStart(2, '0');
        const _id = `${year}-${formattedMonth}`;
        
        try {
            const result = await Statistic.findById(_id).lean();
            return { success: true, data: result || null };
        } catch (error) {
            return { success: false, message: error.message };
        }
    }

    // Lấy thống kê theo năm
    static async getStatisticByYear(year) {
        try {
            const regex = new RegExp(`^${year}-`);
            
            const stats = await Statistic.aggregate([
                { $match: { _id: regex } },
                {
                    $group: {
                        _id: null,
                        totalCandidate: { $sum: "$monthly_total.candidateRegister" },
                        totalEmployer: { $sum: "$monthly_total.employerRegister" },
                        totalJobPost: { $sum: "$monthly_total.jobPost" },
                        months_count: { $sum: 1 }
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
                data: stats.length
                    ? stats[0]
                    : { year, candidateRegister: 0, employerRegister: 0, jobPost: 0 }
            };

        } catch (error) {
            console.error("[Statistic] Get Year failed:", error);
            return { success: false, message: error.message };
        }
    }
}
