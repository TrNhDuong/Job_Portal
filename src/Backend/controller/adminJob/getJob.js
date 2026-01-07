import AdminJobRepository from "../../repository/adminJobRepository.js";

export const getAllAdminJobs = async (req, res) => {
  try {
    const result = await AdminJobRepository.getAll();

    if (!result.success) {
      return res.status(500).json({
        success: false,
        message: result.message,
      });
    }

    return res.status(200).json({
      success: true,
      jobs: result.data,
    });
  } catch (error) {
    console.error("getAllAdminJobs error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const getAdminJobById = async (req, res) => {
  const { jobId } = req.query;

  try {
    const result = await AdminJobRepository.getById(jobId);

    if (!result.success) {
      return res.status(404).json({
        success: false,
        message: result.message,
      });
    }

    return res.status(200).json({
      success: true,
      job: result.data,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};