import React, { useState } from "react";
import "../styles/JobList.css";

export default function JobList() {
  const [search, setSearch] = useState("");

  // Dummy data
  const jobs = [
    { title: "Frontend Developer", company: "Tech Corp", location: "Hanoi", status: "active", posted: "2024-03-01" },
    { title: "Backend Engineer", company: "InspireLeader", location: "Ho Chi Minh", status: "inactive", posted: "2024-02-20" },
    { title: "UI/UX Designer", company: "Creative Co", location: "Da Nang", status: "active", posted: "2024-01-15" },
    { title: "Fullstack Developer", company: "DevStudio", location: "Hanoi", status: "active", posted: "2024-03-05" },
  ];

  const filteredJobs = jobs.filter((j) =>
    j.title.toLowerCase().includes(search.toLowerCase()) ||
    j.company.toLowerCase().includes(search.toLowerCase()) ||
    j.location.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="joblist-container">
      <h2 className="joblist-title">Danh sách bài đăng</h2>

      {/* Search Bar */}
      <input
        type="text"
        className="joblist-search"
        placeholder="Tìm theo tiêu đề, công ty hoặc địa điểm..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {/* Table */}
      <table className="joblist-table">
        <thead>
          <tr>
            <th>Tiêu đề công việc</th>
            <th>Công ty</th>
            <th>Địa điểm</th>
            <th>Trạng thái</th>
            <th>Ngày đăng</th>
          </tr>
        </thead>

        <tbody>
          {filteredJobs.map((j, idx) => (
            <tr key={idx}>
              <td>{j.title}</td>
              <td>{j.company}</td>
              <td>{j.location}</td>
              <td className={j.status === "active" ? "status-active" : "status-inactive"}>
                {j.status}
              </td>
              <td>{j.posted}</td>
            </tr>
          ))}

          {filteredJobs.length === 0 && (
            <tr>
              <td colSpan="5" className="joblist-empty">
                Không tìm thấy bài đăng
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
