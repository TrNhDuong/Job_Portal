import client from "../api/client";

// Nếu muốn test nhanh có thể bật true, deploy thì false
const USE_MOCK_DATA = false;

export const jobService = {
  getAllJobs: async () => {
    if (USE_MOCK_DATA) {
      const MOCK_JOBS = [
        { 
          _id: "101", 
          title: "Frontend Dev", 
          company: "FPT Software", 
          location: "Hà Nội", 
          status: "Open", 
          postedAt: "2024-03-01",
          salary: { minSalary: 10, maxSalary: 15, currency: "VND" },
          jobType: "Full-time",
          degree: "Bachelor",
          experience: 0,
          description: "Mô tả công việc frontend dev",
          position: "Nhân viên"
        },
        { 
          _id: "102", 
          title: "Backend Java", 
          company: "Viettel", 
          location: "HCM", 
          status: "Pending", 
          postedAt: "2024-02-20",
          salary: { minSalary: 15, maxSalary: 20, currency: "VND" },
          jobType: "Full-time",
          degree: "Master",
          experience: 2,
          description: "Mô tả công việc backend java",
          position: "Senior"
        },
      ];

      return new Promise((resolve) => setTimeout(() => resolve({ success: true, data: MOCK_JOBS }), 500));
    }

    try {
      const response = await client.get("/admin/jobs");
      return response.data;
    } catch (err) {
      console.error("Error fetching jobs:", err);
      return { success: false, data: [] };
    }
  },

  deleteJob: async (jobId) => {
    if (USE_MOCK_DATA) {
      console.log(`[Mock] Đã xóa job ${jobId}`);
      return { success: true };
    }

    try {
      const response = await client.delete(`/admin/jobs/${jobId}`);
      return response.data;
    } catch (err) {
      console.error(`Error deleting job ${jobId}:`, err);
      return { success: false };
    }
  },
};
