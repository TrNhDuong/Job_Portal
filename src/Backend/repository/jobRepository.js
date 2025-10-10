import JobPost from "../model/jobPost.js";
import { getEmployerByEmail } from "./employerRepository.js";

export const createPostJob = async (jobData) => {
    try {
        const newJobPost = new JobPost(jobData);
        await newJobPost.save();
        return { success: true, data: newJobPost, message: "Job post created successfully" };
    } catch (error) {
        console.error(`Error creating job post:`, error);
        return { success: false, message: "Error creating job post" };
    }
};

export const getPostJobById = async (jobId) => {
    try {
        const jobPost = await JobPost.findById(jobId);
        if (!jobPost) {
            return { success: false, message: "Job post not found" };
        }
        return { success: true, data: jobPost, message: "Job post fetched successfully" };
    } catch (error) {
        console.error(`Error fetching job post by ID:`, error);
        return { success: false, message: "Error fetching job post" };
    }
};

// Update info include title, description, position, salary, degree, experience, jobType
export const updatePostJob = async (jobId, updates) => {
    try {
        const updatedJobPost = await JobPost.findByIdAndUpdate(jobId, updates, { new: true });
        if (!updatedJobPost) {
            return { success: false, message: "Job post not found" };
        }
        return { success: true, data: updatedJobPost, message: "Job post updated successfully" };
    } catch (error) {
        console.error(`Error updating job post:`, error);
        return { success: false, message: "Error updating job post" };
    }
};

export const getEmployerPostJob = async (emailEmployer) => {
    try {
        const employer = await getEmployerByEmail(emailEmployer);
        if (!employer.success) {
            return { success: false, message: "Employer not found" };
        }
        
        const jobPostID = employer.data.postedJobs;
        var listJobPost = [];
        for (id of jobPostID) {
            const jobPost = await getPostJobById(id);
            if (jobPost.success) {
                listJobPost.push(jobPost.data);
            }
        }
        return { success: true, data: listJobPost, message: "Employer's job posts fetched successfully" };
    } catch (error) {
        console.error(`Error fetching employer's job posts:`, error);
        return { success: false, message: "Error fetching employer's job posts" };
    }
};

export const getAllApplications = async (jobId) => {
    try {
        const jobPost = await JobPost.findById(jobId);
        if (!jobPost) {
            return { success: false, message: "Job post not found" };
        }
        return { success: true, data: jobPost.applicants, message: "Applicants fetched successfully" };
    } catch (error) {
        console.error(`Error fetching applicants:`, error);
        return { success: false, message: "Error fetching applicants" };
    }
};

export const addApplicant = async (jobId, email) => {
    try {
        const jobPost = await JobPost.findById(jobId);
        if (!jobPost) {
            return { success: false, message: "Job post not found" };
        }
        jobPost.applicants.push(email);
        await jobPost.save();
        return { success: true, message: "Applicant added successfully" };
    } catch (error) {
        console.error(`Error adding applicant:`, error);
        return { success: false, message: "Error adding applicant" };
    }
};

export const updateJobState = async (jobId, state) => {
    try {
        const jobPost = await JobPost.findById(jobId);
        if (!jobPost) {
            return { success: false, message: "Job post not found" };
        }
        jobPost.state = state;
        await jobPost.save();
        return { success: true, message: "Job post state updated successfully" };
    } catch (error) {
        console.error(`Error updating job post state:`, error);
        return { success: false, message: "Error updating job post state" };
    }
};

export const extendJobExpiry = async (jobId, expireDay) => {
    try {
        const jobPost = await JobPost.findById(jobId);
        if (!jobPost) {
            return { success: false, message: "Job post not found" };
        }
        jobPost.expireDay = expireDay;
        await jobPost.save();
        return { success: true, message: "Job post expiry date extended successfully" };
    } catch (error) {
        console.error(`Error extending job post expiry date:`, error);
        return { success: false, message: "Error extending job post expiry date" };
    }
};


