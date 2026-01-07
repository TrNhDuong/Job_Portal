import client from "../api/client";

export const statsService = {
  // Gọi API lấy thống kê theo tháng
  // Ví dụ: /api/statistic/monthly?year=2026&month=1
  getMonthlyStats: async (year, month) => {
    try {
      const res = await client.get(`/api/statistic/monthly`, {
        params: { year, month }
      });
      return res.data;
    } catch (error) {
      console.error("Get Monthly Stats Error:", error);
      return { success: false, data: null };
    }
  }
};