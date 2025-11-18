import express from 'express';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import { authenticateJWT } from "../middleware/authenticateJWT.js";

dotenv.config();
const router = express.Router();

router.post('/admin/login', (req, res) => {
    const { email, password } = req.body;
    if (email === process.env.ADMINMAIL && password === process.env.ADMINPASS) {
        const token = jwt.sign(
            {role: "admin"},
            process.env.JWT_SECRET,
            {expiresIn: `30m`}
        )
        res.status(200).json({ 
            success: true,
            message: "Login successful",
            data: {
                token: token
            }
        });
    } else {
        res.status(401).json({ 
            success: false,
            message: "Invalid credentials" 
        });
    }
});

export default router;