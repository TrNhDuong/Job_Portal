import JobPost from "../../model/jobPost.js";
import { JobRepository } from "../../repository/jobRepository.js";
import { CandidateRepository } from "../../repository/candidateRepository.js";
import { ApplicationRepository } from "../../repository/applicationRepository.js";

export const updatePostJob = async (req, res) => {
  const { id } = req.params;
  const {title, company, position, location, salary, 
        jobType, major, degree, experience, state, description, expiredDay } = req.body;

  try {
    const result = await JobRepository.updateJobPost(id, {
        title,
        company,
        position,
        location,
        salary,
        jobType,
        major,
        degree,
        experience,
        state,
        description,
        expiredDay
    });

    if (!result.success) {
        return res.status(404).json({ 
            success: false,
            message: "Job post not found" 
        });
    }

    res.status(200).json({ 
        success: true,
        data: updatedJobPost,
        message: "Job post updated successfully"
    });
  } catch (error) {
      console.error("Error updating job post:", error);
      res.status(500).json({ 
          success: false,
          message: "Internal server error"
      });
  }
};

export const applyJob = async (req, res) => {
    const { jobId } = req.params;
    const { applicantEmail } = req.body;
    try {
        const candidate = await CandidateRepository.getCandidate(applicantEmail);
        if (!candidate.success) {
          return res.status(404).json({ message: "Candidate not found" });
        }
        const jobPost = await JobPost.findById(jobId);
        if (!jobPost) {
          return res.status(404).json({ message: "Job post not found" });
        }
        const result = await ApplicationRepository.createApplication(candidate.data._id, jobId);
        if (!result.success) {
          return res.status(500).json({ 
            success: false,
            message: "Error applying for job" 
          });
        }
        res.status(200).json({ 
          success: true,
          message: "Applicant added successfully"
        });
    } catch (error) {
        console.error("Error adding applicant:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const removeApplyJob = async (req, res) => {
    const { jobId } = req.params;
    const { applicantEmail } = req.body;
    try {
        const candidate = await CandidateRepository.getCandidate(applicantEmail);
        if (!candidate.success) {
          return res.status(404).json({ message: "Candidate not found" });
        }
        const application = await ApplicationRepository.getApplication(jobId, candidate.data._id);
        if (!application.success) {
          return res.status(404).json({ message: "Application not found" });
        }
        return res.status(200).json({ 
          success: true,
          message: "Applicant removed successfully"
        });
    } catch (error) {
        console.error("Error removing applicant:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

export const extendJobExpiry = async (req, res) => {
    const { id } = req.params;
    const { expireDay } = req.body;
    try {
      const jobPost = await JobPost.findById(id);
      if (!jobPost) {
        return res.status(404).json({ message: "Job post not found" });
      }
      jobPost.expireDay = expireDay;
      await jobPost.save();
      res.status(200).json({ message: "Job post expiry date extended successfully" });
    }
    catch (error) {
      console.error("Error extending job post expiry date:", error);
      res.status(500).json({ message: "Internal server error" });
    }
};
