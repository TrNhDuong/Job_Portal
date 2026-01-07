import mongoose from 'mongoose';
import dotevn from 'dotenv';
dotevn.config();

export async function connectDB(){
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log(`Connected to MongoDB cluster`);
    } catch (err){
        console.error(`❌ MongoDB connection error:`, err.message);
    }
}