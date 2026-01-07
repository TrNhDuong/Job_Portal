import mongoose from "mongoose";
import { Statistic } from "../model/statistic.js";
import {connectDB} from "../config/connectDB.js"


const MONGO_URI = process.env.MONGO_URI;
connectDB();

(async () => {
    try {
        await mongoose.connect(MONGO_URI);
        console.log("🚀 Reconcile monthly_total from daily_stats...");

        const cursor = Statistic.find().cursor();

        for await (const doc of cursor) {
            const total = {
                candidateRegister: 0,
                employerRegister: 0,
                jobPost: 0
            };

            const daily = doc.daily_stats || {};

            for (const day of Object.values(daily)) {
                if (!day) continue;
                
                total.candidateRegister += day.candidateRegister || 0;
                total.employerRegister += day.employerRegister || 0;
                total.jobPost += day.jobPost || 0;
            }

            await Statistic.updateOne(
                { _id: doc._id },
                {
                    $set: {
                        monthly_total: total,
                        last_updated: new Date()
                    }
                }
            );

            console.log(`✅ Reconciled ${doc._id}`, total);
        }

        console.log("🎉 RECONCILE DONE");
        await mongoose.disconnect();
        process.exit(0);
    } catch (err) {
        console.error("❌ Reconcile failed", err);
        process.exit(1);
    }
})();
