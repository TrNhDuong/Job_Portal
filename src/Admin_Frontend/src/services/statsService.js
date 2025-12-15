// src/services/statsService.js
import client from "../api/client";

const USE_MOCK_DATA = true;

const MOCK_STATS = {
  // Dữ liệu Card tổng quan
  summary: {
    totalRevenue: 125000000,
    newUsers: 1204,
    totalJobs: 856
  },
  // Dữ liệu Biểu đồ doanh thu (AreaChart)
  revenue: [
    { name: 'T1', revenue: 4000 }, { name: 'T2', revenue: 3000 },
    { name: 'T3', revenue: 5000 }, { name: 'T4', revenue: 2780 },
    { name: 'T5', revenue: 1890 }, { name: 'T6', revenue: 2390 },
    { name: 'T7', revenue: 3490 },
  ],
  // Dữ liệu Biểu đồ Traffic (BarChart)
  traffic: [
    { name: 'T2', visits: 120, registers: 5 },
    { name: 'T3', visits: 150, registers: 10 },
    { name: 'T4', visits: 200, registers: 12 },
    { name: 'T5', visits: 180, registers: 8 },
    { name: 'T6', visits: 250, registers: 15 },
    { name: 'T7', visits: 300, registers: 25 },
    { name: 'CN', visits: 280, registers: 20 },
  ]
};

export const statsService = {
  getDashboardStats: async () => {
    if (USE_MOCK_DATA) {
      return new Promise((resolve) => setTimeout(() => resolve({ success: true, data: MOCK_STATS }), 800));
    }
    // API dự kiến: GET /api/admin/stats
    const response = await client.get("/api/admin/stats");
    return response.data;
  }
};