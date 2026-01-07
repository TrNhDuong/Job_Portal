import { JobRepository } from "../../repository/jobRepository.js";
import { EmployerRepository } from "../../repository/employerRepository.js";
import { ApplicationRepository } from "../../repository/applicationRepository.js";
import mongoose from "mongoose";
import { JobPost } from "../../model/jobPost.js";
export const getJobPostByID = async (req, res) => {
    const id = req.query.jobId;  // lấy từ query param
    try {
        const jobId = new mongoose.Types.ObjectId(id); // Chuyển đổi chuỗi ID thành ObjectId
        const jobPost = await JobRepository.getJobPost(jobId);
        if (jobPost.success) {
            res.status(200).json({
                success: true,
                data: jobPost.data,
                message: "Employer's job posts fetched successfully"
            });
        } else {
            res.status(404).json({
                success: false,
                message: jobPost.message
            });
        }
    } catch (error) {
        console.error("Error fetching job post:", error);
        res.status(500).json({ 
          success: false,
          message: "Internal server error"
        });
    }
};

export const getPostJobPerPage = async (req, res) => {
  try {
    // 1. Lấy params từ query (Logic của code dưới)
    const {
      page = 1,
      limit = 10,
      keyword,
      location,
      jobType,
      salaryMin,
      salaryMax,
      currency,
      major,
      experience,
      degree,
    } = req.query;

    // 2. Xây dựng bộ lọc (Logic của code dưới)
    const filter = {
      state: "Open",
    };

    /* ---------- KEYWORD ---------- */
    if (keyword) {
      filter.$or = [
        { title: { $regex: keyword, $options: "i" } },
        { company: { $regex: keyword, $options: "i" } }, // Tìm theo tên cty lưu trong JobPost
      ];
    }

    /* ---------- LOCATION ---------- */
    if (location) {
      filter.location = { $regex: location, $options: "i" };
    }

    /* ---------- BASIC FILTERS ---------- */
    if (jobType) filter.jobType = jobType;
    if (major) filter.major = major;
    if (degree) filter.degree = degree;

    if (experience !== undefined && experience !== "") {
      filter.experience = { $lte: Number(experience) };
    }

    /* ---------- SALARY LOGIC ---------- */
    // Logic: Tìm các job có khoảng lương giao thoa với khoảng user tìm kiếm
    if (salaryMin || salaryMax) {
      filter.$and = filter.$and || [];

      if (salaryMin) {
        // Max lương của job phải lớn hơn hoặc bằng Min user tìm
        filter.$and.push({
          "salary.maxSalary": { $gte: Number(salaryMin) },
        });
      }

      if (salaryMax) {
        // Min lương của job phải nhỏ hơn hoặc bằng Max user tìm
        filter.$and.push({
          "salary.minSalary": { $lte: Number(salaryMax) },
        });
      }
    }

    if (currency) {
      filter["salary.currency"] = currency;
    }

    // 3. Phân trang
    const skip = (Number(page) - 1) * Number(limit);

    // 4. Query Database (Lấy danh sách Job thô)
    const [rawJobs, total] = await Promise.all([
      JobPost.find(filter)
        .sort({ postedAt: -1 })
        .skip(skip)
        .limit(Number(limit))
        .lean(), // .lean() giúp convert Mongoose Doc sang Object thường ngay lập tức (Tối ưu hơn .toObject)
      JobPost.countDocuments(filter),
    ]);

    // 5. Gộp thông tin Company & Logo (Logic của code trên)
    // Dùng Promise.all để map qua từng job và fetch thông tin employer song song
    const jobsWithCompany = await Promise.all(
      rawJobs.map(async (job) => {
        // Vì đã dùng .lean() ở trên nên job là object thường, có thể gán trực tiếp
        const jobPlain = { ...job };

        try {
          // Lấy thông tin employer dựa vào email lưu trong job
          if (jobPlain.companyEmail) {
            const companyData = await EmployerRepository.getEmployer(
              jobPlain.companyEmail
            );

            if (companyData && companyData.data) {
              // Gán đè hoặc thêm thông tin chi tiết công ty và logo
              jobPlain.companyInfo = companyData.data.company; // Lưu vào field mới hoặc đè lên field cũ tùy nhu cầu
              jobPlain.logoUrl = companyData.data.logo?.url || null;
            } else {
              jobPlain.logoUrl = null;
            }
          }
        } catch (err) {
          console.error(
            `Error fetching company for job ${jobPlain._id}:`,
            err
          );
          jobPlain.logoUrl = null;
        }

        return jobPlain;
      })
    );

    // 6. Trả về response (Cấu trúc của code dưới)
    return res.status(200).json({
      success: true,
      data: {
        jobs: jobsWithCompany, // Danh sách đã có logoUrl
        total,
        totalPages: Math.ceil(total / limit),
        page: Number(page),
      },
      message: "Job posts fetched successfully",
    });

  } catch (error) {
    console.error("getPostJobPerPage error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

export const getAllEmployerJobPost = async (req, res) => {
    const email = req.query.email;
    try {
        const employerData = await EmployerRepository.getEmployer(email);
        if (!employerData.success){
            return res.status(404).json({
                success: false,
                message: `Employer not found`
            })
        }
        const jobListId = employerData.data.jobPosted;
        const jobList = [];
        for (const jobId of jobListId){
            const jobData = await JobRepository.getJobPost(jobId);
            if (jobData.success){
                jobList.push(jobData.data);
            }
        }
        return res.status(200).json({
            success: true,
            data: jobList
        })
    } catch ( error){
        res.status(500).json({ 
            success: false,
            message: "Internal server error"
        });
    }
}


export const getAppliedJobsByCandidate = async (req, res) => {
  const { candidateId, jobId } = req.query;
	console.log('Received candidateId and jobId:', { candidateId, jobId });
	  try {
	    if (!candidateId || !jobId) {
	      return res.status(400).json({
	        success: false,
	        message: "candidateId và jobId là bắt buộc",
	      });
	    }
	
	    // validate ObjectId
	    if (
	      !mongoose.Types.ObjectId.isValid(candidateId) ||
	      !mongoose.Types.ObjectId.isValid(jobId)
	    ) {
	      return res.status(400).json({
	        success: false,
	        message: "candidateId hoặc jobId không hợp lệ",
	      });
	    }
	
	    const result = await ApplicationRepository.getByCandidateJob(candidateId, jobId);
	
	    if (!result.success) {
	      return res.status(404).json({
	        success: false,
	        message: result.message || "Application not found",
	      });
	    }
	
	    return res.status(200).json({
	      success: true,
	      data: result.data,
	    });
	  } catch (error) {
	    console.error(error);
	    return res.status(500).json({
	      success: false,
	      message: "Error internal server",
	    });
	  }
	;
}

