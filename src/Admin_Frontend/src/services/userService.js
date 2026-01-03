import client from "../api/client";

export const userService = {

  // 🟢 Lấy danh sách users (employer + employee)
  getAllUsers: async () => {
    try {
      const response = await client.get("/api/admin/users");

      if (!response.data?.success) return response.data;

      const { employers = [], candidates = [] } = response.data.data;

      // 👉 normalize về 1 list chung cho UI
      const normalizedUsers = [
        ...employers.map(u => ({
          ...u,
          role: "employer",
          avatar: u.logo?.url || null
        })),
        ...candidates.map(u => ({
          ...u,
          role: "candidate",
          avatar: u.logo?.url || null
        }))
      ];
      return {
        success: true,
        data: normalizedUsers
      };

    } catch (error) {
      console.error("Lỗi API Get Users:", error);
      throw error;
    }
  },

  // 🟢 Xóa user (PHẢI có role)
  deleteUser: async (userId, role) => {
    try {
      const response = await client.delete(
        `/api/admin/users/${userId}?role=${role}`
      );
      return response.data;
    } catch (error) {
      console.error("Lỗi API Delete User:", error);
      throw error;
    }

  }
};
