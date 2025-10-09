import JobPost from "../../model/jobPost.js";

export const updatePostJob = async (req, res) => {
  const { jobId } = req.params;
  const { title, description, salary, degree, experience, jobType } = req.body;

  try {
    const updatedJobPost = await JobPost.findByIdAndUpdate(
      jobId,
      { title, description, salary, degree, experience, jobType },
      { new: true }
    );

    if (!updatedJobPost) {
      return res.status(404).json({ message: "Job post not found" });
    }

    res.status(200).json(updatedJobPost);
  } catch (error) {
    console.error("Error updating job post:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const addApplicant = async (req, res) => {
    const { id } = req.params;
    const { email } = req.body;
    try {
      const jobPost = await JobPost.findById(id);
      if (!jobPost) {
        return res.status(404).json({ message: "Job post not found" });
      }
      jobPost.applicants.push(email);
      await jobPost.save();
      res.status(200).json({ message: "Applicant added successfully" });
    } catch (error) {
      console.error("Error adding applicant:", error);
      res.status(500).json({ message: "Internal server error" });
    }
};

export const updateJobState = async (req, res) => {
    const { id } = req.params;
    const { state } = req.body;
    try {
      const jobPost = await JobPost.findById(id);
      if (!jobPost) {
        return res.status(404).json({ message: "Job post not found" });
      }
      jobPost.state = state;
      await jobPost.save();
      res.status(200).json({ message: "Job post state updated successfully" });
    } catch (error) {
      console.error("Error updating job post state:", error);
      res.status(500).json({ message: "Internal server error" });
    }
};

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
