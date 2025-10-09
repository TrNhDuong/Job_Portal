import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

export const authenticateJWT = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token){
        return res.status(401).json({
            success: false,
            message: 'Access token required'
        });
    }
    try {
        const userDecoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = userDecoded;    
        next();
    } catch (err){
        if (err.name === 'TokenExpiredError'){
            return res.status(403).json({
                success: false,
                message: 'Access token expired'
            });
        }
        return res.status(403).json({
            success: false,
            message: 'Invalid access token'
        });
    }
}
