import multer from "multer";
import { createStorage } from "../../middleware/upload.js";
import { CandidateRepository } from "../../repository/candidateRepository.js";
import { destroyCloudData } from "../../service/cloudinary.js";

export const uploadCandidateCV = async (req, res) => {
    const storage = createStorage("jobportal/cv");
    const email = req.query.email;
    const upload = multer({ storage }).single("cv");
    upload(req, res, async (err) => {
        if (err) {
            console.log("Upload CV Error:", err);
            return res.status(500).json({
            success: false,
            message: "Failed to upload CV"
        })}
        const candidateUpdateData = await CandidateRepository.updateCandidate(email, {
            CV: {
                url: req.file.path,
                public_id: req.file.filename,
                name: req.file.originalname,
                uploadedAt: new Date()
            }
        })
        console.log("Candidate Update Data:", candidateUpdateData);
        if (candidateUpdateData.success){
            console.log("CV uploaded and candidate updated successfully");
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
  try {
    const email = req.query.email;
    const cvPublicId = req.query.public_id;

    if (!email || !cvPublicId) {
      return res.status(400).json({
        success: false,
        message: "Missing email or public_id",
      });
    }

    const candidateData = await CandidateRepository.getCandidate(email);
    if (!candidateData.success || !candidateData.data) {
      return res.status(404).json({
        success: false,
        message: "Candidate not found",
      });
    }

    const candidate = candidateData.data;

<<<<<<< HEAD
<<<<<<< HEAD
=======
>>>>>>> 11cc5f79bcb2c8eccfb8e514009b8690f20590ea
    // FIX FILTER
    let cvList = candidate.CV || [];
    const newCvList = cvList.filter(cv => cv.public_id !== cvPublicId);

    // Kiểm tra có tồn tại không
    if (newCvList.length === cvList.length) {
      return res.status(400).json({
        success: false,
        message: "CV not found in candidate list",
      });
    }

    // Update database first
    const updateResult = await CandidateRepository.updateCandidate(email, {
      CV: newCvList,
<<<<<<< HEAD
=======
    // Chuẩn hóa về mảng
    let cvList = candidate.CV || [];
    cvList = cvList.filter(cv => cv.public_id !== cvPublicId)
    // Xóa trên Cloudinary CHỈ 1 LẦN
    const result = await destroyCloudData(cvPublicId);

    if (!result) {
      return res.status(400).json({
        success: false,
        message: "Failed to remove CV from cloud",
      });
    }

    // Cập nhật lên DB
    const updateResult = await CandidateRepository.updateCandidate(email, {
      rmCV: cvList,
>>>>>>> 18506f42bf43e854b49acc17c296bc928c6c9b00
=======
>>>>>>> 11cc5f79bcb2c8eccfb8e514009b8690f20590ea
    });

    if (!updateResult.success) {
      return res.status(500).json({
        success: false,
<<<<<<< HEAD
<<<<<<< HEAD
=======
>>>>>>> 11cc5f79bcb2c8eccfb8e514009b8690f20590ea
        message: "Failed to update CV list",
      });
    }

    // Remove from cloud
    const result = await destroyCloudData(cvPublicId);

    if (!result) {
      return res.status(400).json({
        success: false,
        message: "Failed to remove CV from cloud",
<<<<<<< HEAD
=======
        message: "Failed to update candidate CV list",
>>>>>>> 18506f42bf43e854b49acc17c296bc928c6c9b00
=======
>>>>>>> 11cc5f79bcb2c8eccfb8e514009b8690f20590ea
      });
    }

    return res.status(200).json({
      success: true,
      message: "CV removed successfully",
    });
  } catch (error) {
    console.error("Error removing CV:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
<<<<<<< HEAD
<<<<<<< HEAD
};
=======
};
>>>>>>> 18506f42bf43e854b49acc17c296bc928c6c9b00
=======
};
>>>>>>> 11cc5f79bcb2c8eccfb8e514009b8690f20590ea
