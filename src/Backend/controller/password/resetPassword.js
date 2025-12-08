import { CandidateRepository } from "../../repository/candidateRepository.js"
import { EmployerRepository } from "../../repository/employerRepository.js"
import { generatePassword } from "../../service/password.js";
import { sendMail } from "../../service/mail.js";

export const forgotCandidatePassword = async (req, res) => {
    try {
        const email = req.query.email;
        if (!email) {
            return res.status(400).json({
                success: false,
                message: "Email is required"
            });
        }

        const candidateResult = await CandidateRepository.getCandidate(email);
        if (!candidateResult.success) {
            return res.status(404).json({
                success: false,
                message: "Candidate not found"
            });
        }

        // New password
        const newPassword = generatePassword();

        // Build HTML Email
        const html = `
        <div style="font-family:Arial,sans-serif;max-width:600px;margin:auto;border:1px solid #ddd;padding:20px;">
            <h2 style="color:#0a6cff;">Password Reset Successful</h2>
            <p>Hi <strong>${candidateResult.data.fullname}</strong>,</p>
            <p>Your password has been reset. Below is your new password:</p>

            <div style="background:#f2f2f2;padding:12px;border-radius:6px;
                        font-size:18px;margin:15px 0;text-align:center;
                        border:1px dashed #aaa;">
                <strong>${newPassword}</strong>
            </div>

            <p>Please change this password once you log in to maintain security.</p>

            <p style="margin-top:30px;">Thanks,<br>
            <b>Recruitment Platform Support Team</b></p>

            <div style="margin-top:35px;font-size:12px;color:#666;text-align:center;">
                <hr style="border:none;border-top:1px solid #ddd;">
                This is an automated message. Do not reply to this email.
            </div>
        </div>
        `;

        await sendMail(email, "Your reset password from JobPortal Server", html);
        const result = await CandidateRepository.updateCandidate(email, {password: newPassword})
        if (result.success){
            return res.status(200).json({
                success: true,
                message: "New password sent to your email"
            });
        } else {
            return res.status(400).json({
                success: false,
                message: "Failed to update password"
            })
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
}
