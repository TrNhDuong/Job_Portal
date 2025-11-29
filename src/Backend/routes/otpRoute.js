import express from "express";
import { sendOTP } from "../controller/otp/sendOTP.js";
import { verifyOTP } from "../controller/otp/verifyOTP.js";

const router = express.Router();

router.post("/send-otp", sendOTP);
router.post("/verify-otp", verifyOTP);

export default router;