import React, { useState } from "react";
import "../styles/UserList.css";

export default function UserList() {
  const [search, setSearch] = useState("");

  // Dummy data — bạn replace sau nha
  const users = [
    { name: "Alex Nguyen", email: "alex@example.com", type: "candidate", status: "online", joined: "2024-01-12" },
    { name: "Linh Tran", email: "linh@company.com", type: "employer", status: "offline", joined: "2023-11-02" },
    { name: "John Doe", email: "john@example.com", type: "candidate", status: "online", joined: "2024-02-05" },
    { name: "Maria Vu", email: "maria@corp.co", type: "employer", status: "offline", joined: "2023-10-20" },
  ];

  const filteredUsers = users.filter((u) =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="userlist-container">
      <h2 className="userlist-title">Danh sách tài khoản</h2>

      {/* Search Bar */}
      <input
        type="text"
        className="userlist-search"
        placeholder="Tìm tên hoặc email..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {/* Table */}
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
          {filteredUsers.map((u, idx) => (
            <tr key={idx}>
              <td>{u.name}</td>
              <td>{u.email}</td>
              <td className="cap">{u.type}</td>
              <td className={u.status === "online" ? "status-online" : "status-offline"}>
                {u.status}
              </td>
              <td>{u.joined}</td>
            </tr>
          ))}

          {filteredUsers.length === 0 && (
            <tr>
              <td colSpan="5" className="userlist-empty">
                Không tìm thấy người dùng
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
