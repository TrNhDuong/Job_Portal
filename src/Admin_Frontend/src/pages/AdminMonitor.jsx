import React, { useState, useEffect } from "react";
import "../styles/AdminMonitor.css";
import { monitorService } from "../services/monitorService";

export default function AdminMonitor() {
  const [search, setSearch] = useState("");
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLog, setActionLog] = useState([]); // Log phiên làm việc hiện tại

  // 1. Fetch dữ liệu khi vào trang
  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    setLoading(true);
    try {
      const res = await monitorService.getReports();
      if (res.success) {
        setReports(res.data);
      }
    } catch (error) {
      console.error("Lỗi tải báo cáo:", error);
    } finally {
      setLoading(false);
    }
  };

  // 2. Xử lý hành động
  const handleAction = async (id, actionLabel, newStatus) => {
    try {
      // Gọi service
      const res = await monitorService.resolveReport(id, actionLabel);
      
      if (res.success) {
        // Cập nhật state danh sách (đổi status của item đó)
        setReports((prev) =>
          prev.map((item) =>
            item.id === id ? { ...item, status: newStatus } : item
          )
        );

        // Thêm vào Log bên dưới
        const timestamp = new Date().toLocaleTimeString('vi-VN');
        setActionLog((prev) => [
          `[${timestamp}] Báo cáo #${id} -> Đã chuyển thành: ${newStatus}`,
          ...prev,
        ]);
      }
    } catch (error) {
      alert("Có lỗi xảy ra khi xử lý báo cáo.");
    }
  };

  // 3. Filter tìm kiếm
  const filteredReports = reports.filter((item) =>
    item.targetName?.toLowerCase().includes(search.toLowerCase()) ||
    item.targetType?.toLowerCase().includes(search.toLowerCase()) ||
    item.reportedBy?.toLowerCase().includes(search.toLowerCase()) ||
    item.reason?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="monitor-container">
      <h2 className="monitor-title">Quản lý nền tảng & Báo cáo vi phạm</h2>

      {/* Search bar */}
      <input
        type="text"
        className="monitor-search"
        placeholder="Tìm theo tên, loại, người báo cáo hoặc lý do..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {loading ? (
        <p style={{textAlign: "center"}}>Đang tải dữ liệu giám sát...</p>
      ) : (
        <table className="monitor-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Loại</th>
              <th>Đối tượng (Tên/User)</th>
              <th>Người báo cáo</th>
              <th>Lý do</th>
              <th>Ngày</th>
              <th>Trạng thái</th>
              <th>Hành động</th>
            </tr>
          </thead>

          <tbody>
            {filteredReports.map((item) => (
              <tr key={item.id}>
                <td>#{item.id}</td>
                
                {/* Badge loại đối tượng */}
                <td>
                    <span style={{
                        padding: '4px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: 'bold',
                        backgroundColor: item.targetType === 'Job Post' ? '#e0f2fe' : '#fce7f3',
                        color: item.targetType === 'Job Post' ? '#0284c7' : '#db2777'
                    }}>
                        {item.targetType === 'Job Post' ? 'Tin tuyển dụng' : 'Tài khoản'}
                    </span>
                </td>
                
                <td style={{maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'}}>
                    {item.targetName}
                </td>
                <td>{item.reportedBy}</td>
                <td style={{color: '#ef4444'}}>{item.reason}</td>
                <td>{item.date}</td>
                
                {/* Trạng thái có màu */}
                <td className={`status-${item.status.toLowerCase()}`}>
                    {item.status === 'Pending' ? 'Chờ xử lý' : item.status}
                </td>

                {/* Các nút hành động */}
                <td className="action-buttons">
                  {/* Nút 1: Giữ nguyên (Bỏ qua báo cáo) -> Status: Approved (An toàn) */}
                  <button onClick={() => handleAction(item.id, "Approve", "Safe")} title="Bỏ qua / An toàn">
                    Duyệt
                  </button>

                  {/* Nút 2: Cảnh báo -> Status: Warning */}
                  <button onClick={() => handleAction(item.id, "Warning", "Warning")} title="Gửi cảnh báo">
                    Cảnh báo
                  </button>

                  {/* Nút 3: Tạm khóa -> Status: Suspended */}
                  <button onClick={() => handleAction(item.id, "Suspend", "Suspended")} title="Tạm khóa">
                    Khóa
                  </button>

                  {/* Nút 4: Xóa -> Status: Removed (Chỉ hiện nếu là Job Post) */}
                  {item.targetType === "Job Post" && (
                    <button onClick={() => handleAction(item.id, "Remove", "Removed")} title="Gỡ bỏ bài đăng">
                      Gỡ
                    </button>
                  )}
                </td>
              </tr>
            ))}

            {filteredReports.length === 0 && (
              <tr>
                <td colSpan="8" className="monitor-empty">Hiện không có báo cáo nào cần xử lý.</td>
              </tr>
            )}
          </tbody>
        </table>
      )}

      {/* Action log - Nhật ký hoạt động phiên làm việc */}
      <div className="monitor-log">
        <h3>📄 Nhật ký hoạt động (Phiên này)</h3>
        <ul>
          {actionLog.map((log, idx) => (
            <li key={idx} style={{marginBottom: '5px', color: '#555'}}>{log}</li>
          ))}
          {actionLog.length === 0 && <li style={{color: '#999'}}>Chưa có hoạt động nào vừa thực hiện.</li>}
        </ul>
      </div>
    </div>
  );
}