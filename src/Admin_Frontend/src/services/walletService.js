// src/services/walletService.js
import client from "../api/client";

export const walletService = {
  // Gọi API nạp tiền (Cần Backend làm xong cái này mới chạy nhé)
  topUpUser: async (userId, amount) => {
    try {
      const res = await client.post("/api/admin/user/topup", { userId, amount });
      return res.data;
    } catch (err) {
      console.error("Topup error:", err);
      return { success: false, message: err.response?.data?.message || "Lỗi kết nối" };
    }
  }
};