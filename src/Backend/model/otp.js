import mongoose from "mongoose";

const otpSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
    },
    otp: {
        type: String,
        required: true,
    },
    expireAt: {
        type: Date,
        default: () => Date.now() + 120 * 1000, // Hết hạn sau 2 phút (120 giây)
    }
});

// Tạo TTL Index để xóa tài liệu sau 2 phút
otpSchema.index({ expireAt: 1 }, { expireAfterSeconds: 0 });

export const OTP = mongoose.model("OTP", otpSchema);
