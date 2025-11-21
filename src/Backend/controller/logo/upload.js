import multer from "multer";
import { createStorage } from "../../middleware/upload.js";
import { EmployerRepository } from "../../repository/employerRepository.js";
import { CandidateRepository } from "../../repository/candidateRepository.js";

export const uploadEmployerLogo = async (req, res) => {
    const storage = createStorage("jobportal/employers");
    const email = req.query.email;
    const upload = multer({ storage }).single("image");
    console.log(email + ' dang cap nhat logo');
    upload(req, res, async (err) => {
        if (err) return res.status(500).json({
            success: false,
            message: "Failed to upload logo"
        })
        const employerUpdateData = await EmployerRepository.updateEmployer(email, {
            logo: {
                url: req.file.path,
                public_id: req.file.filename
            }
        })
        if (employerUpdateData.success){
            console.log('Cap nhat thanh cong');
            console.log(req.file.path);
            res.status(200).json({
                success: true,
                message: "Upload successfully",
                data: req.file.path
            })
        } else {
            console.log('Cap nhat that bai')
            res.status(400).json({
                success: false,
                message: "Failed to upload"
            })
        }
    })
}

export const uploadCandidateLogo = async (req, res) => {
    const storage = createStorage("jobportal/candidates");
    const email = req.query.email;
    const upload = multer({ storage }).single("image");
    upload(req, res, async (err) => {
        if (err) return res.status(500).json({
            success: false,
            message: "Failed to upload logo"
        })
        const candidateUpdataData = await CandidateRepository.updateCandidate(email, {
            logo: {
                url: req.file.path,
                public_id: req.file.filename
            }
        })
        if (candidateUpdataData.success){
            res.status(200).json({
                success: true,
                message: "Upload successfully",
                data: {
                    url: req.file.path,
                    public_id: req.file.filename
                }
            })
        } else {
            res.status(400).json({
                success: false,
                message: "Failed to upload"
            })
        }
    })
}

export const uploadEmployerWallpaper = async (req, res) => {
    const storage = createStorage("jobportal/wallpaper");
    const email = req.query.email;
    const upload = multer({ storage }).single("image");
    upload(req, res, async (err) => {
        if (err) return res.status(500).json({
            success: false,
            message: "Failed to upload logo"
        })
        const employerUpdateData = await EmployerRepository.updateEmployer(email, {
            wallpaper: {
                url: req.file.path,
                public_id: req.file.filename
            }
        })
        if (employerUpdateData.success){
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