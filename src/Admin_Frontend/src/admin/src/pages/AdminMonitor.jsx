import React, { useState } from "react";
import "../styles/AdminMonitor.css";

export default function PlatformMonitor() {
  const [search, setSearch] = useState("");
  const [actionLog, setActionLog] = useState([]);

  // Dummy flagged items
  const flaggedItems = [
    {
      id: 1,
      type: "Job Post",
      title: "Đăng tin giả",
      reportedBy: "user123",
      reason: "Scam",
      date: "2024-03-01",
      status: "Pending",
    },
    {
      id: 2,
      type: "User Account",
      name: "spamuser99",
      reportedBy: "user456",
      reason: "Tin gây xúc phạm",
      date: "2024-03-02",
      status: "Pending",
    },
  ];

  const [items, setItems] = useState(flaggedItems);

  const handleAction = (id, action) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, status: action } : item
      )
    );

    setActionLog((prev) => [
      ...prev,
      `Bài đăng #${id} -> ${action} (${new Date().toLocaleString()})`,
    ]);
  };

  const filteredItems = items.filter((item) =>
    item.title?.toLowerCase().includes(search.toLowerCase()) ||
    item.name?.toLowerCase().includes(search.toLowerCase()) ||
    item.type.toLowerCase().includes(search.toLowerCase()) ||
    item.reportedBy.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="monitor-container">
      <h2 className="monitor-title">Platform Monitor</h2>

      {/* Search bar */}
      <input
        type="text"
        className="monitor-search"
        placeholder="Tìm theo tiêu đề, tên người dùng, loại, hoặc báo cáo..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {/* Table */}
      <table className="monitor-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Loại</th>
            <th>Tiêu đề / Username</th>
            <th>Người báo cáo</th>
            <th>Lý do</th>
            <th>Ngày</th>
            <th>Trạng thái</th>
            <th>Hành động</th>
          </tr>
        </thead>

        <tbody>
          {filteredItems.map((item) => (
            <tr key={item.id}>
              <td>{item.id}</td>
              <td className="cap">{item.type}</td>
              <td>{item.title || item.name}</td>
              <td>{item.reportedBy}</td>
              <td>{item.reason}</td>
              <td>{item.date}</td>
              <td className={`status-${item.status.toLowerCase()}`}>{item.status}</td>
              <td className="action-buttons">
                <button onClick={() => handleAction(item.id, "Approved")}>A</button>
                <button onClick={() => handleAction(item.id, "Warning")}>B</button>
                <button onClick={() => handleAction(item.id, "Suspended")}>C</button>
                {item.type === "Job Post" && (
                  <button onClick={() => handleAction(item.id, "Removed")}>D</button>
                )}
              </td>
            </tr>
          ))}

          {filteredItems.length === 0 && (
            <tr>
              <td colSpan="8" className="monitor-empty">Không tìm thấy báo cáo</td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Action log */}
      <div className="monitor-log">
        <h3>Bảng hoạt động</h3>
        <ul>
          {actionLog.map((log, idx) => (
            <li key={idx}>{log}</li>
          ))}
          {actionLog.length === 0 && <li>Chưa có hoạt động</li>}
        </ul>
      </div>
    </div>
  );
}
