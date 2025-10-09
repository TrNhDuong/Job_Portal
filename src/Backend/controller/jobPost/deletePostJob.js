import JobPost from "../../model/jobPost.js";

export const deletePostJob = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedJobPost = await JobPost.findByIdAndDelete(id);

    if (!deletedJobPost) {
      return res.status(404).json({ message: "Job post not found" });
    }

    res.status(200).json({ message: "Job post deleted successfully" });
  } catch (error) {
    console.error("Error deleting job post:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
