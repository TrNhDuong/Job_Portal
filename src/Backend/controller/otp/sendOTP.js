import { generateOTP } from "../../service/otp.js";
import { OTP } from "../../model/otp.js";

export const sendOTP = (req, res) => {
    const { email } = req.body;
    const otp = generateOTP();
    try {
        const otpEntry = new OTP({ email, otp });
        otpEntry.save();
        return res.status(200).json({
            success: true,
            message: "OTP sent successfully",
            otp: otp
        })
    } catch (error) {
        res.status(500).json({ 
            success: false,
            message: "Error sending OTP",
        });
    }
}