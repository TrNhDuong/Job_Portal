import client from "../api/client";

// ==========================================
// CỜ CẤU HÌNH (CONFIG FLAGS)
// ==========================================
// Bật true: Dùng dữ liệu giả để test giao diện
// Bật false: Gọi API thật từ Backend
const USE_MOCK_DATA = true; 

// ==========================================
// MOCK DATA (Dữ liệu giả)
// ==========================================
const MOCK_USERS = [
  { _id: "1", name: "Alex Nguyen", email: "alex@example.com", role: "candidate", status: "online", createdAt: "2024-01-12" },
  { _id: "2", name: "Tech Corp", email: "hr@techcorp.com", role: "employer", status: "offline", createdAt: "2023-11-02" },
  { _id: "3", name: "John Doe", email: "john@example.com", role: "candidate", status: "online", createdAt: "2024-02-05" },
];

// ==========================================
// SERVICE FUNCTIONS
// ==========================================
export const userService = {
  
  // 1. Lấy danh sách người dùng
  getAllUsers: async (params = {}) => {
    if (USE_MOCK_DATA) {
      console.log("⚠️ Đang dùng Mock Data cho UserList");
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({
            success: true,
            data: MOCK_USERS, // Giả lập cấu trúc trả về chuẩn
          });
        }, 500); // Giả lập mạng chậm 0.5s
      });
    } 
    
    // --- KẾT NỐI API THẬT ---
    try {
      // Endpoint này tôi sẽ update chính xác khi bạn gửi file adminRoute.js
      const response = await client.get("/api/admin/users", { params });
      return response.data;
    } catch (error) {
      console.error("API Error - Get Users:", error);
      throw error;
    }
  },

  // 2. Xóa/Khóa người dùng (Ví dụ)
  deleteUser: async (userId) => {
    if (USE_MOCK_DATA) {
      console.log(`[MOCK] Đã xóa user ${userId}`);
      return { success: true, message: "Xóa thành công (Mock)" };
    }

    try {
      const response = await client.delete(`/api/admin/users/${userId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};