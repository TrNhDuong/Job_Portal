import JobPost from "../../model/jobPost.js";

export const getEmployerPostJob = async (req, res) => {
    const { emailEmployer } = req.params;

    try {
      const jobPost = await JobPost.findOne({ emailEmployer });

      if (!jobPost) {
        return res.status(404).json({ message: "Job post not found" });
      }

      res.status(200).json(jobPost);
    } catch (error) {
      console.error("Error fetching job post:", error);
      res.status(500).json({ message: "Internal server error" });
    }
};

export const getPostJobById = async (req, res) => {
    const { jobId } = req.params;
    try {
        const jobPost = await JobPost.findById(jobId);
        if (!jobPost) {
            return res.status(404).json({ message: "Job post not found" });
        }
        res.status(200).json(jobPost);
    } catch (error) {
        console.error("Error fetching job post by ID:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

