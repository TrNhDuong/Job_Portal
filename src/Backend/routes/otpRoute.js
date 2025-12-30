import express from "express";
import { sendOTP } from "../controller/otp/sendOTP.js";
import { verifyOTP, verifyOTPCandidateForgot, verifyOTPEmployerForgot } from "../controller/otp/verifyOTP.js";

const router = express.Router();

router.post("/send-otp", sendOTP);
router.post("/verify-otp", verifyOTP);
router.post("/verify-otp/forgot/candidate", verifyOTPCandidateForgot);
router.post("/verify-otp/forgot/employer", verifyOTPEmployerForgot);

export default router;