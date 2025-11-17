import { OTP } from "../../model/otp.js";

export const verifyOTP = async (req, res) => {
    const { email, otp } = req.body;
    try {
        const otpEntry = await OTP.findOne({ email, otp });
        if (!otpEntry) {
            return res.status(400).json({
                success: false,
                message: "Invalid or expired OTP",
            });
        }
        await OTP.deleteOne({ _id: otpEntry._id });
        return res.status(200).json({
            success: true,
            message: "OTP verified successfully",
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Error verifying OTP",
        });
    }
}