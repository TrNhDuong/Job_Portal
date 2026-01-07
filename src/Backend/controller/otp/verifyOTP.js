import { OTP } from "../../model/otp.js";
import jwt from "jsonwebtoken";

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

export const verifyOTPEmployerForgot = async (req, res) => {
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
        const token = jwt.sign(
            {email, role: "Employer"},
            process.env.JWT_SECRET,
            {expiresIn: "5m"}
        )
        return res.status(200).json({
            success: true,
            message: "OTP verified successfully",
            data: token
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Error verifying OTP",
        });
    }
}

export const verifyOTPCandidateForgot = async (req, res) => {
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
        const token = jwt.sign(
            {email, role: "Candidate"},
            process.env.JWT_SECRET,
            {expiresIn: "5m"}
        )
        return res.status(200).json({
            success: true,
            message: "OTP verified successfully",
            data: token
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Error verifying OTP",
        });
    }
}