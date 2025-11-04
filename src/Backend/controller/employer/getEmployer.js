import { getEmployerByEmail, getFeaturedBrands } from "../../repository/employerRepository.js";

export const getEmployer = async (req, res) => {
    const { email } = req.params;
    try {
        const result = await getEmployerByEmail(email);
        if (result.success) {
            return res.status(200).json(result.data);
        }
        return res.status(404).json({ message: "Employer not found" });
    } catch (error) {
        res.status(500).json({ message: "Error fetching employers" });
    }
};

export const getFeaturedBrandsController = async (req, res) => {
  try {
    const result = await getFeaturedBrands();
    if (result.success) {
      return res.status(200).json({
        success: true,
        data: result.data, // Mảng các "brands"
        message: result.message
      });
    }
    return res.status(404).json({ success: false, message: result.message });
  } catch (error) {
    console.error("Error in getFeaturedBrandsController:", error);
    res.status(500).json({ success: false, message: "Lỗi server" });
  }
};
