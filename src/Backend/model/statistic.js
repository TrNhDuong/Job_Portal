import mongoose from "mongoose";

const DayStatsSchema = new mongoose.Schema({
    candidateRegister: { type: Number, default: 0 },
    employerRegister: { type: Number, default: 0 },
    jobPost: { type: Number, default: 0 }
}, { _id: false }); 

const StatisticSchema = new mongoose.Schema({
    _id: { type: String, required: true },
    daily_stats: {
        type: Map,
        of: DayStatsSchema,
        default: {} 
    },

    monthly_total: {
        candidateRegister: { type: Number, default: 0 },
        employerRegister: { type: Number, default: 0 },
        jobPost: { type: Number, default: 0 }
    },
    
    last_updated: { type: Date, default: Date.now }
}, { 
    collection: 'dashboard',
    minimize: false // Quan trọng: Giữ lại object rỗng nếu cần
});


export const Statistic = mongoose.model('Dashboard', StatisticSchema);