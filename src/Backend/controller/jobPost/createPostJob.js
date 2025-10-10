import JobPost from "../../model/jobPost.js";

// employer post a job with the initial state is "closed", if employer want to open
// they have to pay to open the job post in time period
export const createPostJob = async (req, res) => {
    const {title, company, position, location, salary, 
        jobType, major, degree, expiredDay, experience, description } = req.body;
    try {
        const newJobPost = new JobPost({
            title: title,
            company: company,
            position: position,
            location: location,
            salary: salary,
            jobType: jobType,
            major: major,
            degree: degree,
            experience: experience,
            state: "closed",
            applicants: [],
            description,
        });
        const savedJobPost = await newJobPost.save();
        if (savedJobPost.success) {
            res.status(201).json({ 
                success: true,
                message: "Create job post successfully",
                id: savedJobPost.data._id
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
