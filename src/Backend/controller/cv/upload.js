import multer from "multer";
import { createCVStorage } from "../../middleware/upload.js";
import { CandidateRepository } from "../../repository/candidateRepository.js";
import { destroyCloudData } from "../../service/cloudinary.js";

export const uploadCandidateCV = async (req, res) => {
    const storage = createCVStorage("jobportal/cv");
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
        message: "Missing email or zpublic_id",
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
    });

    if (!updateResult.success) {
      return res.status(500).json({
        success: false,
        message: "Failed to update candidate CV list",
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
};
