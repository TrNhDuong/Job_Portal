import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const MAIL_HOST = "smtp-relay.brevo.com";
const MAIL_PORT = 587;

const Transporter = nodemailer.createTransport({
    host: MAIL_HOST,
    port: MAIL_PORT,
    secure: 'false',
    auth: {
        user: process.env.MAIL_USER,
        pass: process.env.SMTP_KEY,
    },
});

export async function sendMail(to, subject, htmlContent) {
    const mailOptions = {
        from: '"Job Portal" <nhatduong01012005@gmail.com>',
        to,
        subject,
        html: htmlContent,
    };
    try {
        const info = await Transporter.sendMail(mailOptions);
        console.log('Email sent:', info.response);
    } catch (error) {
        console.error('Error sending email:', error);
    }
}
