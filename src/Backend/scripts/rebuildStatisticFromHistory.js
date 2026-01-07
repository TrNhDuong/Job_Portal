import mongoose from "mongoose";
import { Statistic } from "../model/statistic.js";
import Candidate from "../model/candidate.js";
import Employer from "../model/employer.js";
import { JobPost } from "../model/jobPost.js";
import { connectDB } from "../config/connectDB.js";

const MONGO_URI = process.env.MONGO_URI;
connectDB();

(async () => {
    try {
        await mongoose.connect(MONGO_URI);

        const cursor = await Statistic.find().lean();

        for (const stat of cursor) {
            const daily_stats = {};

            // Lấy tất cả user/jobpost/employer trong tháng
            const [year, month] = stat._id.split("-");
            const start = new Date(`${year}-${month}-01T00:00:00+07:00`);
            const end = new Date(start);
            end.setMonth(end.getMonth() + 1);

            const candidates = await Candidate.find({ timeStamp: { $gte: start, $lt: end } }).lean();
            const employers = await Employer.find({ timeStamp: { $gte: start, $lt: end } }).lean();
            const jobs = await JobPost.find({ postedAt: { $gte: start, $lt: end } }).lean();

            for (const c of candidates) {
                const d = c.timeStamp.getDate();
                daily_stats[d] = daily_stats[d] || { candidateRegister: 0, employerRegister: 0, jobPost: 0 };
                daily_stats[d].candidateRegister++;
            }
            for (const e of employers) {
                const d = e.timeStamp.getDate();
                daily_stats[d] = daily_stats[d] || { candidateRegister: 0, employerRegister: 0, jobPost: 0 };
                daily_stats[d].employerRegister++;
            }
            for (const j of jobs) {
                const d = j.postedAt.getDate();
                daily_stats[d] = daily_stats[d] || { candidateRegister: 0, employerRegister: 0, jobPost: 0 };
                daily_stats[d].jobPost++;
            }

            await Statistic.updateOne({ _id: stat._id }, { $set: { daily_stats } });
            console.log(`✅ Reconciled daily_stats for ${stat._id}`);
        }

        console.log("🎉 Reconcile DONE");
        await mongoose.disconnect();
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
})();
