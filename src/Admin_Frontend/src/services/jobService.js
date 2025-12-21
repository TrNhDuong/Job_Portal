import client from "../api/client";

const USE_MOCK_DATA = true;

const MOCK_JOBS = [
  { _id: "101", title: "Frontend Dev", company: "FPT Software", location: "Hà Nội", status: "active", postedAt: "2024-03-01" },
  { _id: "102", title: "Backend Java", company: "Viettel", location: "HCM", status: "pending", postedAt: "2024-02-20" },
];

export const jobService = {
  getAllJobs: async () => {
    if (USE_MOCK_DATA) {
      return new Promise((resolve) => setTimeout(() => resolve({ success: true, data: MOCK_JOBS }), 500));
    }
    // API dự kiến: GET /api/admin/jobs
    const response = await client.get("/api/admin/jobs");
    return response.data;
  },

  deleteJob: async (jobId) => {
    if (USE_MOCK_DATA) {
      console.log(`[Mock] Đã xóa job ${jobId}`);
      return { success: true };
    }
    // API dự kiến: DELETE /api/admin/jobs/:id
    const response = await client.delete(`/api/admin/jobs/${jobId}`);
    return response.data;
  }
};