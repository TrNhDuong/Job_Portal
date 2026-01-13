import client from "../api/client";

export const statsService = {
  // Gọi API lấy thống kê theo tháng
  getMonthlyStats: async (year, month) => {
    try {
      const res = await client.get(`/api/statistic/monthly-with-daily`, {
        params: { year, month }
      });

      if (!res.data.success || !res.data.data) return { success: true, data: [] };

      const dailyObj = res.data.data.daily_stats;

      // Chuyển object { "1": {...} } thành array sorted
      const dailyArray = Object.keys(dailyObj)
        .map(key => {
          const d = dailyObj[key];
          return {
            day: parseInt(key),
            date: `${year}-${String(month).padStart(2, '0')}-${String(key).padStart(2, '0')}`,
            candidateRegister: d.candidateRegister || 0,
            employerRegister: d.employerRegister || 0,
            jobPost: d.jobPost || 0
          };
        })
        .sort((a, b) => a.day - b.day);

      return { success: true, data: { ...res.data.data, daily_stats: dailyArray } };
    } catch (error) {
      console.error("Get Monthly Stats Error:", error);
      return { success: false, data: null };
    }
  }
};
