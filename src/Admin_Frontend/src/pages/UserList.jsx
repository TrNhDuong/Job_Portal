import React, { useState, useEffect } from "react";
import "../styles/UserList.css";
import { userService } from "../services/userService";
import { exportToExcel } from "../utils/exportExcel";
import { 
    HiDownload, HiTrash, HiEye, HiSearch, HiX, 
    HiMail, HiPhone, HiLocationMarker, HiCalendar, HiUser
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
    if (selectedUser) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "unset";
    return () => { document.body.style.overflow = "unset"; }
  }, [selectedUser]);

  const loadData = async () => {
    setLoading(true);
    try {
      const res = await userService.getAllUsers();
      if (res && res.success) setUsers(res.data);
      else toast.error("Không tải được danh sách người dùng.");
    } catch (error) { toast.error("Lỗi kết nối máy chủ!"); } 
    finally { setLoading(false); }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa tài khoản này?")) {
      try {
        const res = await userService.deleteUser(id);
        if (res.success) {
          toast.success("Đã xóa người dùng thành công!");
          setUsers(prev => prev.filter(u => u._id !== id));
          if(selectedUser && selectedUser._id === id) setSelectedUser(null);
        } else toast.error("Không thể xóa người dùng này.");
      } catch (error) { toast.error("Lỗi khi thực hiện xóa."); }
    }
  };

  const handleExport = () => {
    if (users.length === 0) {
      toast.warn("Không có dữ liệu để xuất!");
      return;
    }
    const dataToExport = users.map(u => ({
        "ID": u._id,
        "Họ và Tên": u.name,
        "Email": u.email,
        "Vai trò": u.role,
        "Trạng thái": u.status,
        "Ngày tham gia": u.createdAt
    }));
    exportToExcel(dataToExport, "Danh_sach_nguoi_dung");
    toast.success("Đang tải xuống file Excel...");
  };

  const filteredUsers = users.filter((u) =>
    (u.name?.toLowerCase() || "").includes(search.toLowerCase()) ||
    (u.email?.toLowerCase() || "").includes(search.toLowerCase())
  );

  return (
    <>
    <div className="userlist-container fade-in">
      {/* HEADER */}
      <div className="userlist-header-group">
        <h2 className="userlist-title">Danh sách người dùng</h2>
        <div className="header-actions">
            <div className="user-search-wrapper">
                <HiSearch className="search-icon" />
                <input type="text" className="userlist-search" placeholder="Tìm kiếm theo tên hoặc email..."
                    value={search} onChange={(e) => setSearch(e.target.value)} />
            </div>
            <button onClick={handleExport} className="btn-excel"><HiDownload size={18} /> Xuất Excel</button>
        </div>
      </div>

      {/* TABLE */}
      <div className="userlist-table-card">
        {loading ? <div className="loading-container"><div className="spinner"></div></div> : (
            <table className="userlist-table">
            <thead>
                <tr>
                <th style={{width: '35%'}}>Thông tin người dùng</th>
                <th style={{width: '15%', textAlign:'center'}}>Vai trò</th>
                <th style={{width: '15%', textAlign:'center'}}>Trạng thái</th>
                <th style={{width: '20%'}}>Ngày tham gia</th>
                <th style={{width: '15%', textAlign:'center'}}>Hành động</th>
                </tr>
            </thead>
            <tbody>
                {filteredUsers.length > 0 ? (
                filteredUsers.map((u) => (
                    <tr key={u._id}>
                    <td>
                        <div className="user-info-cell">
                            <div className="user-avatar-placeholder">{u.name ? u.name.charAt(0).toUpperCase() : <HiUser />}</div>
                            <div className="user-text-info">
                                <span className="user-name">{u.name}</span>
                                <span className="user-email">{u.email}</span>
                            </div>
                        </div>
                    </td>
                    <td style={{textAlign:'center'}}>
                        <span className={`role-badge ${u.role}`}>{u.role === 'candidate' ? 'Ứng viên' : 'Tuyển dụng'}</span>
                    </td>
                    
                    {/* ✅ CẬP NHẬT: Status Badge không còn dấu chấm */}
                    <td style={{textAlign:'center'}}>
                        <span className={`status-badge ${u.status === 'online' ? 'online' : 'offline'}`}>
                            {u.status}
                        </span>
                    </td>

                    <td>{new Date(u.createdAt).toLocaleDateString('vi-VN')}</td>
                    <td style={{textAlign:'center'}}>
                        <div className="action-buttons">
                            <button className="btn-icon btn-view" onClick={() => setSelectedUser(u)} title="Xem chi tiết"><HiEye /></button>
                            <button className="btn-icon btn-delete" onClick={() => handleDelete(u._id)} title="Xóa"><HiTrash /></button>
                        </div>
                    </td>
                    </tr>
                ))
                ) : (
                <tr><td colSpan="5" className="userlist-empty">Không tìm thấy người dùng nào phù hợp</td></tr>
                )}
            </tbody>
            </table>
        )}
      </div>
    </div>

    {/* USER DETAIL MODAL */}
    {selectedUser && (
        <div className="user-modal-overlay" onClick={() => setSelectedUser(null)}>
            <div className="user-modal" onClick={(e) => e.stopPropagation()}>
                <div className="user-modal-header">
                    <button className="btn-close-abs" onClick={() => setSelectedUser(null)}><HiX /></button>
                    <div className="user-modal-avatar-large">{selectedUser.name ? selectedUser.name.charAt(0).toUpperCase() : "U"}</div>
                    <div className="user-modal-title" style={{textAlign:'center'}}>
                        <h3>{selectedUser.name}</h3>
                        <div style={{display:'flex', gap:'10px', justifyContent:'center', marginTop:'8px'}}>
                            <span className={`role-badge ${selectedUser.role}`}>{selectedUser.role}</span>
                            
                            {/* ✅ CẬP NHẬT: Status Badge trong Modal cũng không còn dấu chấm */}
                            <span className={`status-badge ${selectedUser.status === 'online' ? 'online' : 'offline'}`}>
                                {selectedUser.status}
                            </span>
                        </div>
                    </div>
                </div>
                <div className="user-modal-body">
                    <div className="info-grid">
                        <div className="info-item">
                            <span className="info-label">Email liên hệ</span>
                            <div className="info-value"><HiMail color="var(--primary-color)"/> {selectedUser.email}</div>
                        </div>
                        <div className="info-item">
                            <span className="info-label">Số điện thoại</span>
                            <div className="info-value"><HiPhone color="var(--primary-color)"/> {selectedUser.phone || "Chưa cập nhật"}</div>
                        </div>
                        <div className="info-item">
                            <span className="info-label">Địa chỉ</span>
                            <div className="info-value"><HiLocationMarker color="var(--primary-color)"/> {selectedUser.address || "Chưa cập nhật"}</div>
                        </div>
                        <div className="info-item">
                            <span className="info-label">Ngày tham gia</span>
                            <div className="info-value"><HiCalendar color="var(--primary-color)"/> {new Date(selectedUser.createdAt).toLocaleDateString('vi-VN')}</div>
                        </div>
                    </div>
                    <div className="info-item">
                        <span className="info-label">Giới thiệu bản thân</span>
                        <div className="info-value" style={{display:'block', lineHeight:'1.5', minHeight:'80px'}}>
                            {selectedUser.bio || "Người dùng này chưa viết giới thiệu về bản thân."}
                        </div>
                    </div>
                </div>
                <div className="user-modal-footer">
                    <button className="btn-modal-action btn-secondary" onClick={() => setSelectedUser(null)}>Đóng</button>
                    <button className="btn-modal-action btn-danger" onClick={() => handleDelete(selectedUser._id)}>Xóa tài khoản</button>
                </div>
            </div>
        </div>
    )}
    </>
  );
}