import { generateOTP } from "../../service/otp.js";
import { OTP } from "../../model/otp.js";
import { sendMail } from "../../service/mail.js";

export const sendOTP = async (req, res) => {
    const { email } = req.body;
    const otp = generateOTP();

    try {
        const otpEntry = new OTP({ email, otp });
        await otpEntry.save();

        const htmlContent = `
            <div style="font-family: Arial, sans-serif; padding: 20px;">
                <h2 style="color: #4CAF50;">Your OTP Code</h2>
                <p>Hello,</p>
                <p>We received a request to verify your email address.</p>
                <p style="font-size: 20px; font-weight: bold; color: #333;">
                    🔒 OTP: <span style="color: #4CAF50;">${otp}</span>
                </p>
                <p>This OTP will expire in <strong>2 minutes</strong>.</p>
                <p>If you didn’t request this, please ignore this email.</p>
                <hr />
                <p style="font-size: 12px; color: gray;">© ${new Date().getFullYear()} YourApp. All rights reserved.</p>
            </div>
        `;

        await sendMail(
            [email],
            "Your OTP Code - Verification",
            htmlContent
        );

        return res.status(200).json({
            success: true,
            message: "OTP sent successfully",
        });
    } catch (error) {
        console.error("Error sending OTP:", error);
        res.status(500).json({
            success: false,
            message: "Error sending OTP",
        });
    }
};
