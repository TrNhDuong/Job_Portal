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

  let cvList = [];
  if (Array.isArray(candidate.CV)) cvList = candidate.CV;
  else if (candidate.CV) cvList = [candidate.CV];

  const updatedCVs = cvList.filter((cv) => cv.public_id !== cvPublicId);
  await destroyCloudData(cvPublicId);
  if (updatedCVs.length === cvList.length) {
    // không tìm thấy CV có public_id trùng
    return res.status(404).json({
      success: false,
      message: "CV not found",
    });
  }

  const result = await destroyCloudData(cvPublicId);

  if (!result) {
    return res.status(400).json({
      success: false,
      message: "Failed to remove CV from cloud",
    });
  }

  const updateResult = await CandidateRepository.updateCandidate(email, {
    CV: updatedCVs,
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
};
