import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
    },
    point: {
        type: String,
        required: true,
    },
    note: {
        type: String
    },
    createdAt: {
        type: Date,
        default: Date.now()
    },
    state: {
        type: String
    }
});


export const Payment = mongoose.model("Payment", paymentSchema);
