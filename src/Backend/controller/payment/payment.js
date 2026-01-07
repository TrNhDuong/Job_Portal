import { generateVietQRUrl } from "../../service/qrUrl.js";

export const payment = async (req, res) => {
    const { amount, email, point } = req.body;
    console.log(amount, email, point);
    try {
        if (!amount || !point){
            return res.status(403).json({
                success: false,
                message: `Request must contain amount`
            })
        }
        const url = generateVietQRUrl(amount);
        res.status(201).json({
            success: true,
            message: `Created QR successfully`,
            data: url
        })
    } catch ( err ){
        return res.status(500).json({
            success: false,
            message: `Internal server error`
        })
    }
}