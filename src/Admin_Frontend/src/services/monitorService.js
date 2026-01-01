import client from "../api/client";

export const monitorService = {
  // Lấy danh sách report (GET /report/all)
  getReports: async () => {
    const res = await client.get("/api/report/all");
    return {
      success: res.data.success,
      data: res.data.reports,
    };
  },

  // Lấy chi tiết 1 report (GET /report?reportId=)
  getReportById: async (reportId) => {
    const res = await client.get("/api/report", {
      params: { reportId },
    });
    return res.data;
  },

  updateReport: async (reportId, updateData) => {
    const res = await client.patch("/api/report", updateData, {
      params: { reportId },
    });
    return res.data;
  },

  deleteReport: async (reportId) => {
    const res = await client.delete("/api/report", {
      params: { reportId },
    });
    return res.data;
  },

};
