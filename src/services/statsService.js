import client from "../api/client";

const USE_MOCK_DATA = true;

/* ================= MOCK DASHBOARD DATA ================= */

const MOCK_STATS = {
  summary: {
    totalRevenue: 125000000,
    newUsers: 1214,
    totalJobs: 856
  },
  revenue: [
    { name: 'Jan', revenue: 4000 },
    { name: 'Feb', revenue: 3000 },
    { name: 'Mar', revenue: 5000 },
    { name: 'Apr', revenue: 2780 },
    { name: 'May', revenue: 1890 },
    { name: 'Jun', revenue: 2390 },
    { name: 'Jul', revenue: 3490 },
  ],
  traffic: [
    { name: 'Mon', visits: 120, registers: 5, employer: 2, candidate: 3 },
    { name: 'Tue', visits: 150, registers: 10, employer: 4, candidate: 6 },
    { name: 'Wed', visits: 200, registers: 12, employer: 5, candidate: 7 },
    { name: 'Thu', visits: 180, registers: 8, employer: 3, candidate: 5 },
    { name: 'Fri', visits: 250, registers: 15, employer: 7, candidate: 8 },
    { name: 'Sat', visits: 300, registers: 25, employer: 10, candidate: 15 },
    { name: 'Sun', visits: 280, registers: 20, employer: 8, candidate: 12 },
  ]
};

const WEEKLY_BY_MONTH = {
  Jan: [
    { name: 'Tuần 1', value: 8000 },
    { name: 'Tuần 2', value: 12000 },
    { name: 'Tuần 3', value: 9000 },
    { name: 'Tuần 4', value: 11000 }
  ],
  Feb: [
    { name: 'Tuần 1', value: 7000 },
    { name: 'Tuần 2', value: 10000 },
    { name: 'Tuần 3', value: 6000 },
    { name: 'Tuần 4', value: 8000 }
  ],
  Mar: [
    { name: 'Tuần 1', value: 15000 },
    { name: 'Tuần 2', value: 14000 },
    { name: 'Tuần 3', value: 11000 },
    { name: 'Tuần 4', value: 10000 }
  ]
};

/* ================= MOCK WEEKLY USERS & JOBS ================= */
// Mock monthly data cho users
const MONTHLY_USERS = [
  { name: 'Jan', value: 120 },
  { name: 'Feb', value: 150 },
  { name: 'Mar', value: 200 },
  { name: 'Apr', value: 180 },
  { name: 'May', value: 160 },
  { name: 'Jun', value: 140 },
  { name: 'Jul', value: 170 },
];

// Mock monthly data cho jobs
const MONTHLY_JOBS = [
  { name: 'Jan', value: 80 },
  { name: 'Feb', value: 90 },
  { name: 'Mar', value: 100 },
  { name: 'Apr', value: 95 },
  { name: 'May', value: 85 },
  { name: 'Jun', value: 110 },
  { name: 'Jul', value: 120 },
];

const WEEKLY_USERS = [
  { name: 'Tuần 1', value: 50 },
  { name: 'Tuần 2', value: 70 },
  { name: 'Tuần 3', value: 60 },
  { name: 'Tuần 4', value: 80 }
];

const WEEKLY_JOBS = [
  { name: 'Tuần 1', value: 30 },
  { name: 'Tuần 2', value: 40 },
  { name: 'Tuần 3', value: 25 },
  { name: 'Tuần 4', value: 35 }
];

/* ================= SERVICE ================= */

export const statsService = {
  getDashboardStats: async () => {
    if (USE_MOCK_DATA) {
      return new Promise((resolve) =>
        setTimeout(() => resolve({ success: true, data: MOCK_STATS }), 800)
      );
    }
    const response = await client.get("/api/admin/stats");
    return response.data;
  },

  getWeeklyRevenueByMonth: async (month) => {
    if (USE_MOCK_DATA) {
      return WEEKLY_BY_MONTH[month] || [];
    }
    // API tương lai: GET /api/admin/stats/revenue?month=Jan
  },
  getWeeklyUsersByMonth: async (month) => {
  if (USE_MOCK_DATA) {
    // Giả lập dữ liệu tuần tùy tháng, có thể dùng cùng WEEKLY_USERS
    return new Promise(resolve => setTimeout(() => resolve(WEEKLY_USERS), 500));
  }
  // API tương lai: GET /api/admin/stats/users/weekly?month=Jan
},

  getWeeklyJobsByMonth: async (month) => {
    if (USE_MOCK_DATA) {
      return new Promise(resolve => setTimeout(() => resolve(WEEKLY_JOBS), 500));
    }
    // API tương lai: GET /api/admin/stats/jobs/weekly?month=Jan
  },


  getWeeklyUsers: async () => {
    if (USE_MOCK_DATA) {
      return new Promise(resolve => setTimeout(() => resolve(WEEKLY_USERS), 500));
    }
    // API tương lai: GET /api/admin/stats/users/weekly
  },

  getWeeklyJobs: async () => {
    if (USE_MOCK_DATA) {
      return new Promise(resolve => setTimeout(() => resolve(WEEKLY_JOBS), 500));
    }
    // API tương lai: GET /api/admin/stats/jobs/weekly
  },

  getMonthlyUsers: async () => {
  if (USE_MOCK_DATA) {
    return new Promise(resolve => setTimeout(() => resolve(MONTHLY_USERS), 500));
  }
  // API tương lai: GET /api/admin/stats/users/monthly
},

  getMonthlyJobs: async () => {
    if (USE_MOCK_DATA) {
      return new Promise(resolve => setTimeout(() => resolve(MONTHLY_JOBS), 500));
    }
    // API tương lai: GET /api/admin/stats/jobs/monthly
  },
};
