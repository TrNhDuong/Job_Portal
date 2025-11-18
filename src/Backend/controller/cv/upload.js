import multer from "multer";
import { createStorage } from "../../middleware/upload.js";
import { CandidateRepository } from "../../repository/candidateRepository.js";
import { destroyCloudData } from "../../service/cloudinary.js";

export const uploadCandidateCV = async (req, res) => {
    const storage = createStorage("jobportal/cv");
    const email = req.query.email;
    const upload = multer({ storage }).single("cv");
    upload(req, res, async (err) => {
        if (err) return res.status(500).json({
            success: false,
            message: "Failed to upload CV"
        })
        const candidateUpdateData = await CandidateRepository.updateCandidate(email, {
            CV: {
                url: req.file.path,
                public_id: req.file.filename,
                name: req.file.originalname,
                uploadedAt: new Date()
            }
        })
        if (candidateUpdateData.success){
            res.status(200).json({
                success: true,
                message: "Upload successfully"
            })
        } else {
            res.status(400).json({
                success: false,
                message: "Failed to upload"
            })
        }
    })
}

export const removeCandidateCV = async (req, res) => {
    const email = req.query.email;
    const cvPublicId = req.query.public_id;
    const candidateData = await CandidateRepository.getCandidate(email);
    if (!candidateData.success) {
        return res.status(404).json({
            success: false,
            message: "Candidate not found"
        });
    }
    const candidate = candidateData.data;
    const updatedCVs = candidate.CV.filter(cv => cv.public_id !== cvPublicId);
    if (updatedCVs.length === candidate.CV.length) {
        return res.status(404).json({
            success: false,
            message: "CV not found"
        });
    }
    const result = await destroyCloudData(cvPublicId);
    
    if (result) {
        res.status(200).json({
            success: true,
            message: "CV removed successfully"
        });
    } else {
        res.status(400).json({
            success: false,
            message: "Failed to remove CV"
        });
    }
}