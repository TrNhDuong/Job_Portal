import client from "../api/client";

export const jobService = {
  getAllJobs: async () => {
    try {
      const res = await client.get("/api/admin/job/all");
      return res.data;
    } catch (err) {
      console.error("Error fetching admin jobs:", err);
      return { success: false, data: [] };
    }
  },

  deleteJob: async (jobId) => {
    try {
      const res = await client.delete("/api/admin/job", {
        params: { jobId },
      });
      return res.data;
    } catch (err) {
      console.error("Error deleting job:", err);
      return { success: false };
    }
  },
};
