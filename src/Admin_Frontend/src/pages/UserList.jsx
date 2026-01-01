import React, { useState, useEffect } from "react";
import "../styles/UserList.css";
import { userService } from "../services/userService";
import { exportToExcel } from "../utils/exportExcel";
import {
  HiDownload,
  HiTrash,
  HiEye,
  HiSearch,
  HiX,
  HiMail,
  HiPhone,
  HiLocationMarker,
  HiCalendar,
  HiUser
} from "react-icons/hi";
import { toast } from "react-toastify";

export default function UserList() {
  const [search, setSearch] = useState("");
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    document.body.style.overflow = selectedUser ? "hidden" : "unset";
    return () => (document.body.style.overflow = "unset");
  }, [selectedUser]);

  // 🟢 Load users
  const loadData = async () => {
    setLoading(true);
    try {
      const res = await userService.getAllUsers();
      if (res?.success && Array.isArray(res.data)) {
        setUsers(res.data);
      } else {
        setUsers([]); // fallback an toàn
      // }else {
      //   toast.error("Không tải được danh sách người dùng.");
      }
    } catch (error) {
      toast.error("Lỗi kết nối máy chủ!");
    } finally {
      setLoading(false);
    }
  };

  // 🗑️ Delete user (có role)
  const handleDelete = async (id, role) => {
    if (!role) {
      toast.error("Không xác định được vai trò người dùng!");
      return;
    }

    if (window.confirm("Bạn có chắc chắn muốn xóa tài khoản này?")) {
      try {
        const res = await userService.deleteUser(id, role);
        if (res.success) {
          toast.success("Đã xóa người dùng thành công!");
          setUsers(prev => prev.filter(u => u._id !== id));
          if (selectedUser?._id === id) setSelectedUser(null);
        } else {
          toast.error(res.message || "Không thể xóa người dùng.");
        }
      } catch (error) {
        toast.error("Lỗi khi thực hiện xóa.");
      }
    }
  };

  // 📤 Export Excel
  const handleExport = () => {
    if (users.length === 0) {
      toast.warn("Không có dữ liệu để xuất!");
      return;
    }

    const dataToExport = users.map(u => ({
      ID: u._id,
      "Tên / Công ty": u.name || u.company || "Chưa cập nhật",
      Email: u.email,
      "Vai trò": u.role,
      "Trạng thái": u.state || "unknown",
      "Ngày tham gia": u.createdAt
        ? new Date(u.createdAt).toLocaleDateString("vi-VN")
        : ""
    }));

    exportToExcel(dataToExport, "Danh_sach_nguoi_dung");
    toast.success("Đang tải xuống file Excel...");
  };

  // 🔍 Search
  const filteredUsers = Array.isArray(users)
    ? users.filter(u =>
        (
          u.name ||
          u.company ||
          ""
        ).toLowerCase().includes(search.toLowerCase()) ||
        (u.email || "").toLowerCase().includes(search.toLowerCase())
      )
    : [];


  return (
    <>
      <div className="userlist-container fade-in">
        {/* HEADER */}
        <div className="userlist-header-group">
          <h2 className="userlist-title">Danh sách người dùng</h2>

          <div className="header-actions">
            <div className="user-search-wrapper">
              <HiSearch className="search-icon" />
              <input
                type="text"
                className="userlist-search"
                placeholder="Tìm kiếm theo tên hoặc email..."
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>

            <button onClick={handleExport} className="btn-excel">
              <HiDownload size={18} /> Xuất Excel
            </button>
          </div>
        </div>

        {/* TABLE */}
        <div className="userlist-table-card">
          {loading ? (
            <div className="loading-container">
              <div className="spinner"></div>
            </div>
          ) : (
            <table className="userlist-table">
              <thead>
                <tr>
                  <th style={{ width: "35%" }}>Thông tin người dùng</th>
                  <th style={{ width: "15%", textAlign: "center" }}>Vai trò</th>
                  <th style={{ width: "15%", textAlign: "center" }}>Trạng thái</th>
                  <th style={{ width: "20%" }}>Ngày tham gia</th>
                  <th style={{ width: "15%", textAlign: "center" }}>Hành động</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.length > 0 ? (
                  filteredUsers.map(u => (
                    <tr key={u._id}>
                      <td>
                        <div className="user-info-cell">
                          <div className="user-avatar-placeholder">
                            {u.avatar ? (
                              <img src={u.avatar} alt="avatar" className="user-avatar-img" />
                            ) : (
                              (u.name || u.company || "U").charAt(0).toUpperCase()
                            )}
                          </div>
                          <div className="user-text-info">
                            <span className="user-name">
                              {u.name || u.company || "Chưa cập nhật"}
                            </span>
                            <span className="user-email">{u.email}</span>
                          </div>
                        </div>
                      </td>

                      <td style={{ textAlign: "center" }}>
                        <span className={`role-badge ${u.role}`}>
                          {u.role === "candidate" ? "Ứng viên" : "Tuyển dụng"}
                        </span>
                      </td>

                      <td style={{ textAlign: "center" }}>
                        <span
                          className={`status-badge ${
                            u.state === "active" ? "online" : "offline"
                          }`}
                        >
                          {u.state || "offline"}
                        </span>
                      </td>

                      <td>
                        {u.createdAt
                          ? new Date(u.createdAt).toLocaleDateString("vi-VN")
                          : ""}
                      </td>

                      <td style={{ textAlign: "center" }}>
                        <div className="action-buttons">
                          <button
                            className="btn-icon btn-view"
                            onClick={() => setSelectedUser(u)}
                            title="Xem chi tiết"
                          >
                            <HiEye />
                          </button>
                          <button
                            className="btn-icon btn-delete"
                            onClick={() => handleDelete(u._id, u.role)}
                            title="Xóa"
                          >
                            <HiTrash />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="userlist-empty">
                      Không tìm thấy người dùng nào phù hợp
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* USER DETAIL MODAL */}
      {selectedUser && (
        <div
          className="user-modal-overlay"
          onClick={() => setSelectedUser(null)}
        >
          <div
            className="user-modal"
            onClick={e => e.stopPropagation()}
          >
            <div className="user-modal-header">
              <button
                className="btn-close-abs"
                onClick={() => setSelectedUser(null)}
              >
                <HiX />
              </button>

              <div className="user-modal-avatar-large">
                {selectedUser.avatar ? (
                  <img
                    src={selectedUser.avatar}
                    alt="avatar"
                    className="user-avatar-img-large"
                  />
                ) : (
                  (selectedUser.name || selectedUser.company || "U")
                    .charAt(0)
                    .toUpperCase()
                )}
              </div>


              <div className="user-modal-title">
                <h3>
                  {selectedUser.name ||
                    selectedUser.company ||
                    "Chưa cập nhật"}
                </h3>

                <div className="modal-badges">
                  <span className={`role-badge ${selectedUser.role}`}>
                    {selectedUser.role}
                  </span>
                  <span
                    className={`status-badge ${
                      selectedUser.state === "active"
                        ? "online"
                        : "offline"
                    }`}
                  >
                    {selectedUser.state || "offline"}
                  </span>
                </div>
              </div>
            </div>

            <div className="user-modal-body">
              <div className="info-grid">
                <div className="info-item">
                  <span className="info-label">Email</span>
                  <div className="info-value">
                    <HiMail /> {selectedUser.email}
                  </div>
                </div>

                <div className="info-item">
                  <span className="info-label">Số điện thoại</span>
                  <div className="info-value">
                    <HiPhone /> {selectedUser.phone || "Chưa cập nhật"}
                  </div>
                </div>

                <div className="info-item">
                  <span className="info-label">Địa chỉ</span>
                  <div className="info-value">
                    <HiLocationMarker />{" "}
                    {selectedUser.address || "Chưa cập nhật"}
                  </div>
                </div>

                <div className="info-item">
                  <span className="info-label">Ngày tham gia</span>
                  <div className="info-value">
                    <HiCalendar />{" "}
                    {selectedUser.createdAt
                      ? new Date(
                          selectedUser.createdAt
                        ).toLocaleDateString("vi-VN")
                      : ""}
                  </div>
                </div>
              </div>
            </div>

            <div className="user-modal-footer">
              <button
                className="btn-modal-action btn-secondary"
                onClick={() => setSelectedUser(null)}
              >
                Đóng
              </button>
              <button
                className="btn-modal-action btn-danger"
                onClick={() =>
                  handleDelete(selectedUser._id, selectedUser.role)
                }
              >
                Xóa tài khoản
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
