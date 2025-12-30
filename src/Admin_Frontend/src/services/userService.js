import client from "../api/client";

export const userService = {
  // Lấy danh sách users
  getAllUsers: async () => {
    try {
      const response = await client.get("/api/admin/users");
      return response.data;
    } catch (error) {
      console.error("Lỗi API Get Users:", error);
      throw error;
    }
  },

  // Xóa user (để sẵn cho nút 🗑️)
  deleteUser: async (userId) => {
    try {
      const response = await client.delete(`/api/admin/users/${userId}`);
      return response.data;
    } catch (error) {
      console.error("Lỗi API Delete User:", error);
      throw error;
    }
  }
};
