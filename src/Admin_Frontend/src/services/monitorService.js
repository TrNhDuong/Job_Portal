import client from "../api/client";

// Bật true để test giao diện, tắt false khi có API thật
const USE_MOCK_DATA = true;

const MOCK_REPORTS = [
  {
    id: 1,
    targetType: "Job Post", // Loại đối tượng bị báo cáo
    targetName: "Tuyển dụng việc nhẹ lương cao", // Tên bài đăng/user
    targetId: "job_123",
    reportedBy: "nguyenvana@gmail.com",
    reason: "Lừa đảo, yêu cầu nộp phí",
    date: "2024-03-01",
    status: "Pending", // Pending, Approved, Resolved, ...
  },
  {
    id: 2,
    targetType: "User Account",
    targetName: "spam_user_99",
    targetId: "user_456",
    reportedBy: "recruiter_b@company.com",
    reason: "Spam tin nhắn ứng viên",
    date: "2024-03-02",
    status: "Pending",
  },
  {
    id: 3,
    targetType: "Job Post",
    targetName: "Tuyển nhân viên nhập liệu",
    targetId: "job_789",
    reportedBy: "candidate_c@gmail.com",
    reason: "Nội dung không đúng sự thật",
    date: "2024-03-05",
    status: "Warning",
  },
];

export const monitorService = {
  // 1. Lấy danh sách báo cáo
  getReports: async () => {
    if (USE_MOCK_DATA) {
      return new Promise((resolve) => {
        setTimeout(() => resolve({ success: true, data: MOCK_REPORTS }), 600);
      });
    }
    // API dự kiến: GET /api/admin/reports
    const response = await client.get("/api/admin/reports");
    return response.data;
  },

  // 2. Gửi hành động xử lý (Duyệt, Khóa, Xóa...)
  resolveReport: async (reportId, action) => {
    // action: 'Approve' | 'Warning' | 'Suspend' | 'Remove'
    if (USE_MOCK_DATA) {
      console.log(`[Mock] Report #${reportId} đã xử lý: ${action}`);
      return { success: true };
    }
    
    // API dự kiến: PUT /api/admin/reports/:id/resolve
    const response = await client.put(`/api/admin/reports/${reportId}/resolve`, { action });
    return response.data;
  }
};