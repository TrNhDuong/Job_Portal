import AdminUserRepository from "../../repository/adminUserRepository.js";

// 🟢 Lấy tất cả user (employer + employee)
export const getAllAdminUsers = async (req, res) => {
    try {
        const result = await AdminUserRepository.getAll();

        if (!result.success) {
            return res.status(500).json({
                success: false,
                message: result.message || "Failed to fetch users"
            });
        }

        return res.status(200).json({
            success: true,
            data: result.data
        });
    } catch (error) {
        console.error("getAllAdminUsers error:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};

// 🟢 Lấy user theo id + role
export const getAdminUserById = async (req, res) => {
    try {
        const { id } = req.params;
        const { role } = req.query; // employer | employee

        const result = await AdminUserRepository.get(id, role);

        if (!result.success) {
            return res.status(400).json(result);
        }

        return res.status(200).json({
            success: true,
            data: result.data
        });
    } catch (error) {
        console.error("getAdminUserById error:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};

// 🟢 Xoá user (admin)
export const deleteAdminUser = async (req, res) => {
    try {
        const { id } = req.params;
        const { role } = req.query;

        const result = await AdminUserRepository.delete(id, role);

        if (!result.success) {
            return res.status(400).json(result);
        }

        return res.status(200).json({
            success: true,
            message: result.message
        });
    } catch (error) {
        console.error("deleteAdminUser error:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};

// 🟡 Update user (admin)
export const updateAdminUser = async (req, res) => {
    try {
        const { id } = req.params;
        const { role } = req.query;
        const updateData = req.body;

        const result = await AdminUserRepository.update(id, role, updateData);

        if (!result.success) {
            return res.status(400).json(result);
        }

        return res.status(200).json({
            success: true,
            data: result.data
        });
    } catch (error) {
        console.error("updateAdminUser error:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};
