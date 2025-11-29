import { JobRepository } from "../../repository/jobRepository.js";
import { EmployerRepository } from "../../repository/employerRepository.js";
// employer post a job with the initial state is "closed", if employer want to open
// they have to pay to open the job post in time period
export const createPostJob = async (req, res) => {
    const email = req.query.email;
    console.log("Email of employer creating job post:", email);
    const {title, company, position, location, detailedAddress, minSalary, maxSalary, currency, logo,
        jobType, major, degree, customMajor, experience, state, description, expiredDay } = req.body;
    console.log(minSalary, maxSalary, currency);    
    try {
        const result = await JobRepository.createJobPost({
            title: title,
            company: company,
            position: position,
            location: location,
            detailedAddress: detailedAddress,
            jobType: jobType,
            major: major,
            degree: degree,
            customMajor: customMajor,
            logo: logo,
            experience: experience,
            state: state || "Closed",
            expiredDay: expiredDay || null,
            applicants: [],
            description: description,
            salary: {
                minSalary: minSalary,
                maxSalary: maxSalary,
                currency: currency
            }
        });
        if (result.success) {
            console.log("Tao bai dang thanh cong");
            const addJobResult = await EmployerRepository.addJobPostToEmployer(email, result.data._id);
            if (!addJobResult.success) {
                console.log("Failed to add job post to employer:", addJobResult.message);
            } else {
                console.log("Added job post to employer successfully");
            }
            res.status(201).json({
                success: true,
                message: "Create job post successfully",
                id: result.data._id
            });
        } else {
            console.log("HuHu");
            res.status(400).json({
                success: false,
                message: "Error creating job post"
            });
        }
    } catch (error) {
        console.error("Lỗi khi tạo bài đăng công việc:", error);
        res.status(500).json({ message: "Error creating job post" });
    }
};
