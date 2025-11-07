import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import axios from 'axios'

dotenv.config();

export async function sendMail(to, subject, htmlContent) {
    const emailData = {
        sender: {
        name: "Online recruitment platform - Job Portal",
        email: "nhatduong01012005@gmail.com", // 🔹 Phải được xác thực trong Brevo
        },
        to: to.map(email => ({ email })), // chuyển danh sách string → object
        subject,
        htmlContent,
    };

    try {
        const response = await axios.post(process.env.BREVO_URL, emailData, {
        headers: {
            "Content-Type": "application/json",
            "api-key": process.env.BREVO_API_KEY,
        },
        });
        console.log("✅ Email sent successfully:", response.data);
        return response.data;
    } catch (error) {
        console.error("❌ Error sending email:", error.response?.data || error.message);
        throw error.response?.data || error;
    }
}
