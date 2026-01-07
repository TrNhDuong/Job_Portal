import React, { useState, useEffect, useRef } from "react";
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
  HiUser,
  HiChevronDown,
  HiCheck,
  HiFilter
} from "react-icons/hi";
import { toast } from "react-toastify";
import { showDeleteConfirm } from "../utils/alertUtils";

export default function UserList() {
  const [search, setSearch] = useState("");
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);
  const [filterRole, setFilterRole] = useState("all");
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);  

  const roles = [
    { value: "all", label: "Tất cả vai trò" },
    { value: "candidate", label: "Ứng viên" },
    { value: "employer", label: "Tuyển dụng" },
  ];

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Tìm label của option đang được chọn
  const currentLabel = roles.find(r => r.value === filterRole)?.label;

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

  //  Delete user (có role)
  const handleDelete = async (id, role) => {
    if (!role) {
      toast.error("Không xác định được vai trò người dùng!");
      return;
    }

    const isConfirmed = await showDeleteConfirm(
    "Bạn muốn xóa người dùng này?", 
    );
    
    if (isConfirmed) {
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

    const dataToExport = users.map(u => {
      // Logic lấy ngày tham gia (Hỗ trợ cả createdAt và timeStamp)
      const dateRaw = u.createdAt || u.timeStamp;
      const dateFormatted = dateRaw ? new Date(dateRaw).toLocaleDateString("vi-VN") : "Không xác định";

      // Logic lấy trạng thái tiếng Việt
      const statusRaw = u.state || 'active'; // Mặc định là active nếu thiếu
      const statusFormatted = statusRaw === 'active' ? 'Hoạt động' : 'Vô hiệu';

      return {
        ID: u._id,
        "Tên / Công ty": u.name || u.company || "Chưa cập nhật",
        Email: u.email,
        "Vai trò": u.role === 'candidate' ? 'Ứng viên' : 'Nhà tuyển dụng', // Dịch luôn role cho đẹp
        "Trạng thái": statusFormatted, // Hiện tiếng Việt
        "Ngày tham gia": dateFormatted // Đã fix lỗi trống ngày
      };
    });

    exportToExcel(dataToExport, "Danh_sach_nguoi_dung");
    toast.success("Đang tải xuống file Excel");
  };

  // 🔍 Search
  const filteredUsers = Array.isArray(users)
    ? users.filter(u => {
        const matchesSearch = 
          (u.name || u.company || "").toLowerCase().includes(search.toLowerCase()) ||
          (u.email || "").toLowerCase().includes(search.toLowerCase());
        
        const matchesRole = filterRole === "all" || u.role === filterRole;
        
        return matchesSearch && matchesRole;
      })
    : [];


  return (
    <>
      <div className="userlist-container fade-in">
        <div className="userlist-header-group">
          <h2 className="userlist-title">Danh sách người dùng</h2>

          <div className="header-actions">
            {/* 🟢 Bộ lọc vai trò */}
            <div className="custom-dropdown" ref={dropdownRef}>
              <button 
                className={`dropdown-btn ${isOpen ? "active" : ""}`}
                onClick={() => setIsOpen(!isOpen)}
                type="button"
              >
                <div className="dropdown-label-group">
                  <HiFilter className="icon-left" />
                  <span>{currentLabel}</span>
                </div>
                <HiChevronDown className={`arrow-icon ${isOpen ? "rotate" : ""}`} />
              </button>

              {isOpen && (
                <ul className="dropdown-menu">
                  {roles.map((role) => (
                    <li 
                      key={role.value}
                      className={`dropdown-item ${filterRole === role.value ? "selected" : ""}`}
                      onClick={() => {
                        setFilterRole(role.value);
                        setIsOpen(false);
                      }}
                    >
                      <span>{role.label}</span>
                      {filterRole === role.value && <HiCheck className="check-icon" />}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Ô Search */}
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

            {/* Nút Xuất Excel */}
            <button onClick={handleExport} className="btn-excel">
              <HiDownload size={18} /> Xuất Excel
            </button>
          </div>
        </div>

        <div className="userlist-table-card">
          {loading ? (
            <div className="loading-container"><div className="spinner"></div></div>
          ) : (
            <table className="userlist-table">
              <thead>
                <tr>
                  <th style={{ width: "35%" }}>Thông tin người dùng</th>
                  <th style={{ width: "15%", textAlign: "center" }}>Vai trò</th>
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
                            {u.avatar ? <img src={u.avatar} alt="avatar" className="user-avatar-img" /> : (u.name || u.company || "U").charAt(0).toUpperCase()}
                          </div>
                          <div className="user-text-info">
                            <span className="user-name">{u.name || u.company || "Chưa cập nhật"}</span>
                            <span className="user-email">{u.email}</span>
                          </div>
                        </div>
                      </td>
                      <td style={{ textAlign: "center" }}>
                        <span className={`role-badge ${u.role}`}>
                          {u.role === "candidate" ? "Ứng viên" : "Tuyển dụng"}
                        </span>
                      </td>

                      <td>{u.createdAt ? new Date(u.createdAt).toLocaleDateString("vi-VN") : ""}</td>
                      <td style={{ textAlign: "center" }}>
                        <div className="action-buttons">
                          <button className="btn-icon btn-view" onClick={() => setSelectedUser(u)} title="Xem chi tiết"><HiEye /></button>
                          <button className="btn-icon btn-delete" onClick={() => handleDelete(u._id, u.role)} title="Xóa"><HiTrash /></button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="userlist-empty">Không tìm thấy người dùng nào phù hợp</td>
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
              <button className="btn-close-abs" onClick={() => setSelectedUser(null)}>
                <HiX />
              </button>
            </div>

          {/* Avatar được kéo lên nhờ CSS margin-top âm */}
            <div className="user-modal-avatar-large">
              {selectedUser.avatar ? (
                <img
                  src={selectedUser.avatar}
                  alt="avatar"
                  className="user-avatar-img-large"
                  // Xử lý lỗi ảnh
                  onError={(e) => {
                    e.target.style.display = 'none';
                    // Fallback về chữ cái nếu ảnh lỗi
                    e.target.parentNode.innerText = (selectedUser.name || selectedUser.company || "U").charAt(0).toUpperCase();
                    e.target.parentNode.style.fontSize = "2.5rem";
                    e.target.parentNode.style.fontWeight = "800";
                    e.target.parentNode.style.color = "#6366f1";
                  }}
                />
              ) : (
                // Fallback khi không có avatar
                <span style={{ fontSize: "2.5rem", fontWeight: 800, color: "#6366f1" }}>
                  {(selectedUser.name || selectedUser.company || "U").charAt(0).toUpperCase()}
                </span>
              )}
            </div>

            {/* 2. BODY (Chứa Avatar + Title + Grid Info) */}
            <div className="user-modal-body">
              {/* Tên và Badges */}
              <div className="user-modal-title">
                <h3>{selectedUser.name || selectedUser.company || "Chưa cập nhật"}</h3>
                <div className="modal-badges">
                  <span className={`role-badge ${selectedUser.role}`}>
                    {selectedUser.role === "candidate" ? "Ứng viên" : "Tuyển dụng"}
                  </span>
                  <span className={`status-badge ${selectedUser.state === "active" ? "online" : "offline"}`}>
                    {selectedUser.state || "offline"}
                  </span>
                </div>
              </div>

              {/* Lưới thông tin chi tiết */}
              <div className="info-grid">
                {/* 1. Email: Cho Full dòng để không bị rớt chữ */}
                <div className="info-item full-width">
                    <span className="info-label">Email</span>
                    <div className="info-value">
                        <HiMail /> 
                        {selectedUser.email}
                    </div>
                </div>
                
                {/* 2. Số điện thoại: 1/2 dòng */}
                <div className="info-item">
                    <span className="info-label">Số điện thoại</span>
                    <div className="info-value">
                        <HiPhone /> 
                        {selectedUser.phone || "Chưa cập nhật"}
                    </div>
                </div>

                {/* 3. Ngày tham gia: 1/2 dòng (Ghép với SĐT cho cân) */}
                <div className="info-item">
                    <span className="info-label">Ngày tham gia</span>
                    <div className="info-value">
                      <HiCalendar /> 
                      {(selectedUser.createdAt || selectedUser.timeStamp) 
                        ? new Date(selectedUser.createdAt || selectedUser.timeStamp).toLocaleDateString("vi-VN") 
                        : "N/A"}
                    </div>
                </div>

                {/* 4. Địa chỉ: Full dòng */}
                <div className="info-item full-width"> 
                    <span className="info-label">Địa chỉ</span>
                    <div className="info-value">
                        <HiLocationMarker /> 
                        {selectedUser.address || "Chưa cập nhật"}
                    </div>
                </div>
              </div>

            </div>

            {/* 3. FOOTER */}
            <div className="user-modal-footer">
              <button className="btn-modal-action btn-secondary" onClick={() => setSelectedUser(null)}>Đóng</button>
              <button className="btn-modal-action btn-danger" onClick={() => handleDelete(selectedUser._id, selectedUser.role)}>Xóa tài khoản</button>
            </div>

          </div>
        </div>
      )}
    </>
  );
}
