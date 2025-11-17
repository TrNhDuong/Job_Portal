import { JobRepository } from "../../repository/jobRepository.js";
// employer post a job with the initial state is "closed", if employer want to open
// they have to pay to open the job post in time period
export const createPostJob = async (req, res) => {
    const {title, company, position, location, salary, 
        jobType, major, degree, experience, state, description, expiredDay } = req.body;
    try {
        const result = await JobRepository.createJobPost({
            title: title,
            company: company,
            position: position,
            location: location,
            salary: salary,
            jobType: jobType,
            major: major,
            degree: degree,
            experience: experience,
            state: state,
            expiredDay: expiredDay,
            applicants: [],
            description: description,
        });
        if (result.success) {
            res.status(201).json({
                success: true,
                message: "Create job post successfully",
                id: result.data._id
            });
        } else {
            res.status(400).json({
                success: false,
                message: "Error creating job post"
            });
        }
    } catch (error) {
        res.status(500).json({ message: "Error creating job post" });
    }
};
