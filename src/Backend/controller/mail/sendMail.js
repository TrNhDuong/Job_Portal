import { sendMail } from "../../service/mail.js";

export const sendMailTo = async (req, res) => {
    const { to, subject, htmlContent } = req.body;
    if (!to || !subject || !htmlContent) {
        return res.status(400).json({ 
            success: false,
            message: "Missing required fields: to, subject, htmlContent" 
        });
    }
    try {
        const result = await sendMail(to, subject, htmlContent);
        res.status(200).json({ 
            success: true,
            message: "Email sent successfully", 
            data: result });
    } catch (error) {
        res.status(500).json({ 
            success: false,
            message: "Error sending email", error 
        });
    }
};