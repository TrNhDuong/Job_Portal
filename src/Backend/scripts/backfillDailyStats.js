import mongoose from "mongoose";
import Candidate from "../model/candidate.js";
import Employer from "../model/employer.js";
import { JobPost } from "../model/jobPost.js";
import { Statistic } from "../model/statistic.js";
import {connectDB} from "../config/connectDB.js"

const MONGO_URI = process.env.MONGO_URI;

connectDB();
const padMonth = (m) => String(m).padStart(2, "0");

const backfill = async (Model, dateField, type, match = {}) => {
    const data = await Model.aggregate([
        { $match: match },
        {
            $group: {
                _id: {
                    year: { $year: `$${dateField}` },
                    month: { $month: `$${dateField}` },
                    day: { $dayOfMonth: `$${dateField}` }
                },
                count: { $sum: 1 }
            }
        }
    ]);

    for (const item of data) {
        const { year, month, day } = item._id;
        const monthKey = `${year}-${padMonth(month)}`;
        const dayKey = String(day);

        await Statistic.updateOne(
            { _id: monthKey },
            {
                $inc: {
                    [`daily_stats.${dayKey}.${type}`]: item.count
                },
                $set: { last_updated: new Date() }
            },
            { upsert: true }
        );
    }
};

(async () => {
    try {
        await mongoose.connect(MONGO_URI);
        console.log("🚀 Backfill DAILY stats...");

        await backfill(
            Candidate,
            "timeStamp",
            "candidateRegister",
            { role: "candidate" }
        );

        await backfill(
            Employer,
            "timeStamp",
            "employerRegister",
            { role: "employer" }
        );

        await backfill(
            JobPost,
            "postedAt",
            "jobPost"
        );

        console.log("🎉 DAILY backfill DONE");
        await mongoose.disconnect();
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
})();

