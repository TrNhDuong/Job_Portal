import { JobPost } from "../../model/jobPost.js";
import { JobRepository } from "../../repository/jobRepository.js";
import { CandidateRepository } from "../../repository/candidateRepository.js";
import { EmployerRepository } from "../../repository/employerRepository.js"
import { ApplicationRepository } from "../../repository/applicationRepository.js";
import mongoose from "mongoose";

export const updatePostJob = async (req, res) => {
  const id = req.query.jobId;
  const jobId = new mongoose.Types.ObjectId(id);
  const {title, company, position, location, detailedAddress, maxSalary, minSalary, currency,
        jobType, major, customMajor, degree, experience, state, description, expiredDay, postedAt } = req.body;

  try {
    const updateData = {
      "title":title,
      "company": company,
      "postion": position,
      "location": location,
      "detailedAddress": detailedAddress,
      "salary": {
        "minSalary": minSalary,
        "maxSalary": maxSalary,
        "currency": currency
      },
      "jobType": jobType,
      "major": major,
      "customMajor": customMajor,
      "degree": degree,
      "experience": experience,
      "state": state,
      "description": description,
      "postedAt": postedAt,
      "expiredDay": expiredDay
    }
    console.log(updateData);
    const result = await JobRepository.updateJobPost(jobId, updateData);

    if (!result.success) {
        return res.status(404).json({ 
            success: false,
            message: "Job post not found" 
        });
    }

    res.status(200).json({ 
        success: true,
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
    const id = req.query.jobId;
    const jobId = new mongoose.Types.ObjectId(id);
    const { email } = req.body;
    try {
        const candidate = await CandidateRepository.getCandidate(email);
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
    const id = req.query.jobId;
    const jobId = new mongoose.Types.ObjectId(id);
    const { email } = req.body;
    try {
        const candidate = await CandidateRepository.getCandidate(email);
        if (!candidate.success) {
          return res.status(404).json({ message: "Candidate not found" });
        }
        const application = await ApplicationRepository.deleteApplication(jobId, candidate.data._id);
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
    const id = req.query.jobId;
    
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({
            success: false,
            message: 'Invalid Job ID provided.'
        });
    }
    
    const jobId = new mongoose.Types.ObjectId(id);
    const { email, expireDay, point } = req.body;
    
    try {
        const jobPost = await JobRepository.findById(jobId);
        if (!jobPost.success) {
            return res.status(404).json({
                success: false,
                message: `Job post not found.`
            });
        }
        
        const employer = await EmployerRepository.getEmployer(email);
        if (!employer.success) {
            return res.status(404).json({
                success: false,
                message: `Employer not found.`
            });
        }
        
        if (point > employer.data.point) {
            return res.status(400).json({
                success: false,
                message: `Point not valid: Insufficient points available.`
            });
        }

    } catch (error) {
        console.error("Error during initial data validation:", error);
        return res.status(500).json({ message: "Internal server error during validation." });
    }

    // 3. Thực hiện giao dịch (Transaction) để đảm bảo tính nguyên tử (Atomicity)
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const employerData = (await EmployerRepository.getEmployer(email)).data;
        const newPoint = employerData.point - point;
        const updateEmployerResult = await EmployerRepository.updateEmployer(
            { "email": email },
            { "point": newPoint },
            { session } // Truyền session vào để thao tác nằm trong transaction
        );
        
        if (!updateEmployerResult.success) {
            // Nếu repo logic trả về lỗi (không phải throw exception), chủ động throw để rollback
            throw new Error(`Failed to deduct points from employer.`);
        }
        
        // BƯỚC 2: Cập nhật ngày hết hạn của bài đăng
        const updateJobResult = await JobRepository.updateJobPost(
            jobId, 
            { "expireDay": expireDay },
            { session } // Truyền session vào để thao tác nằm trong transaction
        );
        
        if (!updateJobResult.success) {
            // Nếu repo logic trả về lỗi, chủ động throw để rollback
            throw new Error(`Failed to update job post expiry date.`);
        }
        
        // BƯỚC 3: Commit Transaction (Cả hai thao tác đều thành công)
        await session.commitTransaction();
        
        // Trả về HTTP Status Code 200 cho thao tác thành công
        return res.status(200).json({
            success: true,
            message: `Job expiry extended successfully. Employer's new point balance: ${newPoint}.`
        });
    } catch (error) {
        // Rollback Transaction (Hủy bỏ tất cả thay đổi nếu có bất kỳ lỗi nào xảy ra)
        await session.abortTransaction();      
        console.error("Error extending job post expiry date (Transaction rolled back):", error.message);  
        // Xử lý lỗi logic (ví dụ: lỗi từ updateEmployerResult.success == false)
        if (error.message.includes('Failed to')) {
            return res.status(400).json({
                success: false,
                message: error.message
            });
        }
        // Xử lý lỗi server (ví dụ: lỗi kết nối DB, timeout)
        return res.status(500).json({ 
            success: false,
            message: "Internal server error. Transaction rolled back." 
        });    
    } finally {
        // Kết thúc session sau khi commit hoặc abort
        session.endSession();
    }
};

export const updateState = async (req, res) => {
    const id = req.query.jobId;
    const state = req.query.state;
    const jobId = new mongoose.Types.ObjectId(id);

    try {
      console.log(jobId, state)
      const findJobResult = await JobRepository.getJobPost(jobId);
      if (findJobResult.success){
        findJobResult.data.state = state;
        if (state === 'Closed'){
          console.log(findJobResult.data.expireDay)
          const today = new Date()
          today.setHours(0,0,0,0);
          const dif = findJobResult.data.expireDay - today;
          const daysLeft = Math.ceil(dif / (1000 * 60 * 60 * 24))
          findJobResult.data.daysLeft = daysLeft;
        }
        console.log("Before save");
        await findJobResult.data.save();
        console.log("Save successfully")
      } else {
        res.status(404).json({
          success: false,
          message: 'Job post not found'
        })
      }
    } catch ( err ){
      res.status(500).json({ message: "Internal server error" });
    }
}