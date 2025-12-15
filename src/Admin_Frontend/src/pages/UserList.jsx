import React, { useState, useEffect } from "react";
import "../styles/UserList.css";
import { userService } from "../services/userService";
import { exportToExcel } from "../utils/exportExcel";
import { HiDownload } from "react-icons/hi";

export default function UserList() {
  const [search, setSearch] = useState("");
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  // 👇 Lấy dữ liệu khi vào trang
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const res = await userService.getAllUsers();
      if (res.success) {
        setUsers(res.data);
      }
    } catch (error) {
      console.error("Lỗi tải user:", error);
    } finally {
      setLoading(false);
    }
  };

  // Logic lọc tìm kiếm
  const filteredUsers = users.filter((u) =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase())
  );

  const handleExport = () => {
    if (users.length === 0) {
      alert("Không có dữ liệu để xuất!");
      return;
    }

    // Format lại dữ liệu cho đẹp trước khi xuất (nếu cần)
    const dataToExport = users.map(u => ({
        "ID": u._id || u.id,
        "Họ và Tên": u.name,
        "Email": u.email,
        "Vai trò": u.role === 'candidate' ? 'Ứng viên' : 'Nhà tuyển dụng',
        "Trạng thái": u.status,
        "Ngày tham gia": u.createdAt || u.joined
    }));

    exportToExcel(dataToExport, "Danh_sach_nguoi_dung");
  };

  return (
    <div className="userlist-container">
      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px'}}>
        <h2 className="userlist-title" style={{margin: 0}}>Danh sách tài khoản</h2>
        
        {/* 👇 3. NÚT XUẤT EXCEL */}
        <button 
            onClick={handleExport}
            style={{
                display: 'flex', alignItems: 'center', gap: '8px',
                background: '#10b981', color: 'white', border: 'none',
                padding: '10px 16px', borderRadius: '8px', cursor: 'pointer',
                fontWeight: '600', fontSize: '0.9rem'
            }}
        >
            <HiDownload size={18} /> Xuất Excel
        </button>
      </div>

      <input
        type="text"
        className="userlist-search"
        placeholder="Tìm tên hoặc email..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {/* Table */}
      {loading ? (
        <p>Đang tải dữ liệu...</p>
      ) : (
        <table className="userlist-table">
          <thead>
            <tr>
              <th>Tên</th>
              <th>Email</th>
              <th>Loại tài khoản</th>
              <th>Trạng thái</th>
              <th>Ngày tham gia</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((u) => (
              <tr key={u._id || u.id}>
                <td>{u.name}</td>
                <td>{u.email}</td>
                <td className="cap">{u.role}</td>
                <td className={u.status === "online" ? "status-online" : "status-offline"}>
                  {u.status}
                </td>
                <td>{u.createdAt || u.joined}</td>
              </tr>
            ))}
             {filteredUsers.length === 0 && (
                <tr><td colSpan="5" className="userlist-empty">Không tìm thấy người dùng</td></tr>
             )}
          </tbody>
        </table>
      )}
    </div>
  );
}