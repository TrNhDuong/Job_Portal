import AdminUserRepository from "../../repository/adminUserRepository.js";

export const getAllAdminUsers = async (req, res) => {
  try {
    const result = await AdminUserRepository.getAll();
    if (!result.success) {
      return res.status(500).json(result);
    }

    return res.status(200).json({
      success: true,
      data: result.data,
    });
  } catch (error) {
    console.error("getAllAdminUsers error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};