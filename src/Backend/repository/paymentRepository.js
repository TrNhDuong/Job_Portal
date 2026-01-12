import mongoose from "mongoose";
import { Payment } from "../model/payment.js";

export class PaymentRepository {
    static async create(paymentData){
        const payment = new Payment(paymentData);
        await payment.save();
        return {
            success: true,
            message: 'Create payment successfully'
        }
    }
    static async get() {
        const paymentHistory = await Payment.find({})
                .sort({ createdAt: -1 });

        return {
            success: true,
            data: paymentHistory
        };
    }
}