import client from "../api/client";

// Bật true để dùng dữ liệu giả, tắt false khi Backend đã có API /admin/users
const USE_MOCK_DATA = true;

const MOCK_USERS = [
  { _id: "1", name: "Nguyễn Văn A", email: "a@gmail.com", role: "candidate", status: "online", createdAt: "2024-01-12" },
  { _id: "2", name: "Công ty Tech", email: "hr@tech.com", role: "employer", status: "offline", createdAt: "2023-11-02" },
  { _id: "3", name: "Trần B", email: "b@yahoo.com", role: "candidate", status: "online", createdAt: "2024-02-05" },
];

export const userService = {
  getAllUsers: async () => {
    if (USE_MOCK_DATA) {
      return new Promise((resolve) => {
        setTimeout(() => resolve({ success: true, data: MOCK_USERS }), 500);
      });
    }
    // API dự kiến: GET /api/admin/users
    const response = await client.get("/api/admin/users");
    return response.data;
  },

  blockUser: async (userId, status) => {
    if (USE_MOCK_DATA) {
      console.log(`[Mock] Đổi trạng thái user ${userId} thành ${status}`);
      return { success: true };
    }
    // API dự kiến: PUT /api/admin/users/:id/status
    const response = await client.put(`/api/admin/users/${userId}/status`, { status });
    return response.data;
  }
};