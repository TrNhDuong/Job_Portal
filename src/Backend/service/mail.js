import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import axios from 'axios'

dotenv.config();

export async function sendMail(to, subject, htmlContent) {
    // 🔥 Chuẩn hoá to thành array
    const toArray = Array.isArray(to)
        ? to
        : typeof to === 'string'
            ? to.split(',').map(e => e.trim())
            : [];

    if (toArray.length === 0) {
        throw new Error("Invalid recipient email(s)");
    }

    const emailData = {
        sender: {
            name: "Online recruitment platform - Job Portal",
            email: "nhatduong01012005@gmail.com",
        },
        to: toArray.map(email => ({ email })),
        subject,
        htmlContent,
    };

    try {
        const response = await axios.post(
            process.env.BREVO_URL,
            emailData,
            {
                headers: {
                    "Content-Type": "application/json",
                    "api-key": process.env.BREVO_API_KEY,
                },
            }
        );

        console.log("✅ Email sent:", response.data);
        return response.data;
    } catch (error) {
        console.error("❌ Brevo error:", error.response?.data || error.message);
        throw error.response?.data || error;
    }
}
