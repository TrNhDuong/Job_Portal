import { JobRepository } from "../../repository/jobRepository.js";
import { EmployerRepository } from "../../repository/employerRepository.js";
import Employer from "../../model/employer.js";
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


export const createNewPostJob = async (req, res) => {
    const email = req.query.email;
    const { 
        point,
        title, company, position, location, detailedAddress, minSalary, maxSalary, currency, 
        logo, jobType, major, degree, customMajor, experience, state, description 
    } = req.body;

    try {
        // --- BƯỚC 1: LẤY EMPLOYER ---
        const employerData = await EmployerRepository.getEmployer(email);
        if (!employerData.success) {
            return res.status(404).json({
                success: false,
                message: "Employer not found"
            });
        }
        const employer = employerData.data;

        // --- BƯỚC 2: KIỂM TRA SỐ DƯ ---
        if (employer.point < point) {
            return res.status(400).json({
                success: false,
                message: `Số dư không đủ (Cần: ${point}, Hiện có: ${employer.point})`
            });
        }

        // --- BƯỚC 3: TRỪ ĐIỂM ---
        await Employer.updateOne(
            { email: employer.email },
            { $inc: { point: -point } }
        );

        // --- BƯỚC 4: TÍNH NGÀY HẾT HẠN ---
        const expire = new Date();
        expire.setHours(0, 0, 0, 0);
        expire.setDate(expire.getDate() + Math.floor(point / 10));
        const jobData = {
            title, company, position, location, detailedAddress, jobType, major, degree, 
            customMajor, logo, experience, description,
            state: "Open",
            expireDay: expire,
            applicants: [],
            salary: { minSalary, maxSalary, currency }
        }
        console.log('Job data o create newjobpost')
        console.log(jobData)
        // --- BƯỚC 5: TẠO JOB ---
        const result = await JobRepository.createJobPost(jobData);

        // --- BƯỚC 6: XỬ LÝ KẾT QUẢ ---
        if (result.success) {
            const addJobResult = await EmployerRepository.addJobPostToEmployer(email, result.data._id);

            const updatedEmployer = await Employer.findOne({ email });

            return res.status(200).json({
                success: true,
                message: "Post new job successfully",
                data: result.data,
                remainingPoint: updatedEmployer.point
            });
        } else {
            // Rollback nếu tạo job thất bại
            await Employer.updateOne(
                { email: employer.email },
                { $inc: { point: +point } }
            );

            return res.status(400).json({
                success: false,
                message: "Failed to create job post. Points have been refunded."
            });
        }

    } catch (error) {
        console.error("Lỗi khi tạo bài đăng công việc:", error);
        res.status(500).json({ message: "Error creating job post" });
    }
};