import { JobRepository } from "../../repository/jobRepository.js";
import { EmployerRepository } from "../../repository/employerRepository.js";
import StatisticRepository from "../../repository/statisticRepository.js";

import Employer from "../../model/employer.js";
import mongoose from "mongoose";
// employer post a job with the initial state is "closed", if employer want to open
// they have to pay to open the job post in time period
export const createPostJob = async (req, res) => {
    const email = req.query.email;
    console.log("Email of employer creating job post:", email);
    const {title, company, companyEmail, position, location, detailedAddress, minSalary, maxSalary, currency, logo,
        jobType, major, degree, customMajor, experience, state, description, expiredDay } = req.body;
    console.log(companyEmail,minSalary, maxSalary, currency);    
    try {
        const result = await JobRepository.createJobPost({
            title: title,
            companyEmail: companyEmail,
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
        console.log("Result of creating job post:", result);
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
    // 1. Khai báo và Validate dữ liệu đầu vào cơ bản
    const email = req.query.email;
    const { 
        point,
        title, company, companyEmail, position, location, detailedAddress, minSalary, maxSalary, currency, 
        logo, jobType, major, degree, customMajor, experience, description, requirement, welfare
    } = req.body;
    
    // Khởi tạo biến expire ở scope lớn hơn để dùng cho jobData
    let expire; 

    // 2. Tính toán ngày hết hạn (Bước này nên đặt lên đầu để gán giá trị cho jobData)
    // Dùng try/catch riêng cho validation/read-only ops
    try {
        const date = new Date();
        date.setHours(0, 0, 0, 0);
        // Công thức tính: Thêm số ngày = floor(point / 10)
        expire = new Date(date.setDate(date.getDate() + Math.floor(point / 10))); 
        
        // --- BƯỚC 1: LẤY EMPLOYER (Read-only, có thể ngoài Transaction) ---
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
                message: `Insufficient points (Required: ${point}, Available: ${employer.point})`
            });
        }
    } catch (error) {
        console.error("Error during initial validation or expiry calculation:", error);
        return res.status(500).json({ message: "Internal server error during validation." });
    }

    // 3. Chuẩn bị dữ liệu Job (Sử dụng 'expire' đã tính)
    const jobData = {
        title, company, companyEmail, position, location, detailedAddress, jobType, major, degree, 
        customMajor, logo, experience, description, requirement, welfare,
        state: "Open",
        // Gán giá trị 'expire' đã tính
        expireDay: expire, 
        applicants: [],
        salary: { minSalary, maxSalary, currency }
    };
    
    // --- BƯỚC 4: THỰC HIỆN GIAO DỊCH (TRANSACTION) ---
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        let newJobPostId;
        
        // BƯỚC A: TRỪ ĐIỂM (Cập nhật 1: Employer)
        const updatePointResult = await Employer.updateOne(
            { email: email },
            { $inc: { point: -point } },
            { session } // Bắt buộc phải có session
        );

        if (updatePointResult.modifiedCount === 0) {
            // Trường hợp cập nhật thất bại (ví dụ: email không còn tồn tại)
            throw new Error("Failed to deduct points, employer data integrity issue.");
        }

        // BƯỚC B: TẠO JOB MỚI (Cập nhật 2: Job)
        // Chúng ta cần sử dụng Repository của bạn. Giả định Repo có thể nhận session.
        const result = await JobRepository.createJobPost(jobData, { session });
        
        if (!result.success || !result.data._id) {
            throw new Error("Failed to create job post in database.");
        }
        newJobPostId = result.data._id;
        
        // BƯỚC C: THÊM JOB ID VÀO EMPLOYER (Cập nhật 3: Employer)
        const addJobResult = await EmployerRepository.addJobPostToEmployer(email, newJobPostId, { session });
        
        if (!addJobResult.success) {
            throw new Error("Failed to link job post to employer profile.");
        }

        // BƯỚC D: LẤY ĐIỂM SỐ CẬP NHẬT CUỐI CÙNG CHO RESPONSE
        // Phải dùng session cho query này nếu muốn đọc dữ liệu vừa được update trong transaction
        const updatedEmployer = await Employer.findOne({ email }).session(session);

        // COMMIT TRANSACTION (Thành công)
        await session.commitTransaction();

        await StatisticRepository.update('jobPost')
        
        return res.status(201).json({ // Dùng 201 Created cho thao tác tạo tài nguyên
            success: true,
            message: "New job post created successfully and points deducted.",
            data: result.data,
            remainingPoint: updatedEmployer ? updatedEmployer.point : 'N/A'
        });

    } catch (error) {
        // ROLLBACK TRANSACTION (Thất bại)
        await session.abortTransaction();
        
        console.error("Transaction Error: Creating job post failed and rolled back.", error.message);
        
        // Xử lý lỗi logic/DB
        const isClientError = error.message.includes("Failed to");
        
        return res.status(isClientError ? 400 : 500).json({ 
            success: false,
            message: isClientError 
                ? `Transaction failed: ${error.message}. All changes were rolled back.` 
                : "Internal server error. Job post creation failed and points were refunded."
        });

    } finally {
        session.endSession();
    }
};