import JobPost from "../../model/jobPost.js";

// employer post a job with the initial state is "closed", if employer want to open
// they have to pay to open the job post in time period
export const createPostJob = async (req, res) => {
    const {title, company, position, location, salary, 
        jobType, major, degree, expiredDay, experience, description } = req.body;
    try {
        const newJobPost = new JobPost({
            title,
            company,
            position,
            location,
            salary,
            jobType,
            major,
            degree,
            experience,
            state: "closed",
            applicants: [],
            description,
        });
        const savedJobPost = await newJobPost.save();
        res.status(201).json(savedJobPost);
    } catch (error) {
        res.status(500).json({ message: "Error creating job post" });
    }
};
