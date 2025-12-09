import express from "express";
import crypto from "crypto";
import bcrypt from "bcryptjs";

import { CandidateRepository } from "../repository/candidateRepository.js";
import { EmployerRepository } from "../repository/employerRepository.js";

const Router = express.Router();

// ========== CANDIDATE ==========
Router.post("/forgot-password/candidate", async (req, res) => {
    const { email } = req.body;

    const account = await CandidateRepository.getCandidate(email);
    if (!account) {
        return res.json({
            success: false,
            message: "Account not exists"
        });
    }

    const resetToken = crypto.randomBytes(32).toString("hex");

    const result = await CandidateRepository.updateCandidate(email, { resetToken });

    if (!result.success) {
        return res.json({
            success: false,
            message: "Failed to create reset token"
        });
    }

    return res.json({
        success: true,
        message: "Reset token generated",
        token: resetToken // remove in production
    });
});

// ========== EMPLOYER ==========
Router.post("/forgot-password/employer", async (req, res) => {
  const { email, newpassword } = req.body;

  if (!email || !newpassword) {
    return res.json({ success: false, message: "Email and new password are required" });
  }

  const account = await EmployerRepository.getEmployer(email);
  if (!account || !account.data) {
    return res.json({ success: false, message: "Account not exists" });
  }

  try {
    const result = await EmployerRepository.updateEmployer(email, { password: newpassword });

    if (result.success) {
      return res.json({ success: true, message: "Password updated successfully" });
    } else {
      return res.json({ success: false, message: "Password update failed" });
    }
  } catch (err) {
    return res.json({ success: false, message: "Error updating password" });
  }
});



export default Router;
