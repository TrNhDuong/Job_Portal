import client from "../api/client";

// ==========================================
// 1. CẤU HÌNH (Bật true để test, false để chạy thật)
// ==========================================
const USE_MOCK_DATA = true; 

// ==========================================
// 2. MOCK DATA (Dữ liệu giả chuẩn cấu trúc)
// ==========================================
const MOCK_USERS = [
  { _id: "65f1a2b3c4d5e6f7a8b9c0d1", name: "Nguyễn Văn A", email: "a@gmail.com", role: "candidate", status: "online", createdAt: "2024-01-12" },
  { _id: "65f1a2b3c4d5e6f7a8b9c0d2", name: "Công ty Tech", email: "hr@tech.com", role: "employer", status: "offline", createdAt: "2023-11-02" },
];

export const userService = {
  // --- LẤY DANH SÁCH USER ---
  getAllUsers: async (params = {}) => {
    // A. Chế độ Mock Data
    if (USE_MOCK_DATA) {
      console.log("⚠️ [DEV] Đang dùng Mock Data Users");
      return new Promise((resolve) => {
        setTimeout(() => resolve({ success: true, data: MOCK_USERS }), 500);
      });
    }

    // B. Chế độ API thật (Đã comment chờ Backend)
    /*
    try {
      const response = await client.get("/api/admin/users", { params });
      return response.data;
    } catch (error) {
      console.error("Lỗi API Get Users:", error);
      throw error; // Ném lỗi ra để UI xử lý hiển thị
    }
    */
  },

  // --- XÓA USER ---
  deleteUser: async (userId) => {
    if (USE_MOCK_DATA) {
      console.log(`⚠️ [DEV] Mock Delete User ID: ${userId}`);
      return { success: true, message: "Xóa thành công (Mock)" };
    }

    /*
    try {
      const response = await client.delete(`/api/admin/users/${userId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
    */
  }
};