import React, { useState, useEffect } from "react";
import "../styles/JobList.css";
import { jobService } from "../services/jobService"; // Import Service

export default function JobList() {
  const [search, setSearch] = useState("");
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  // 1. Fetch dữ liệu khi vào trang
  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const res = await jobService.getAllJobs();
      if (res.success) {
        setJobs(res.data);
      }
    } catch (error) {
      console.error("Lỗi tải danh sách công việc:", error);
    } finally {
      setLoading(false);
    }
  };

  // 2. Xử lý xóa bài đăng
  const handleDelete = async (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa bài đăng này không?")) {
      try {
        const res = await jobService.deleteJob(id);
        if (res.success) {
          // Xóa thành công thì lọc bỏ item đó khỏi state ngay lập tức (UI mượt hơn)
          setJobs(prev => prev.filter(job => (job._id || job.id) !== id));
          alert("Đã xóa thành công!");
        }
      } catch (error) {
        alert("Lỗi khi xóa bài đăng.");
      }
    }
  };

  // 3. Logic lọc tìm kiếm
  const filteredJobs = jobs.filter((j) =>
    j.title?.toLowerCase().includes(search.toLowerCase()) ||
    j.company?.toLowerCase().includes(search.toLowerCase()) ||
    j.location?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="joblist-container">
      <h2 className="joblist-title">Danh sách bài đăng tuyển dụng</h2>

      {/* Search Bar */}
      <input
        type="text"
        className="joblist-search"
        placeholder="Tìm theo tiêu đề, công ty hoặc địa điểm..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {loading ? (
        <div style={{textAlign: "center", padding: "20px"}}>Đang tải dữ liệu...</div>
      ) : (
        <table className="joblist-table">
          <thead>
            <tr>
              <th>Tiêu đề công việc</th>
              <th>Công ty</th>
              <th>Địa điểm</th>
              <th>Trạng thái</th>
              <th>Ngày đăng</th>
              <th style={{textAlign: 'center'}}>Hành động</th>
            </tr>
          </thead>

          <tbody>
            {filteredJobs.map((j, idx) => {
              const jobId = j._id || j.id; // Xử lý id tùy theo Backend trả về
              return (
                <tr key={jobId}>
                  <td>{j.title}</td>
                  <td>{j.company}</td>
                  <td>{j.location}</td>
                  <td className={j.status === "active" ? "status-active" : "status-inactive"}>
                    {j.status}
                  </td>
                  <td>{j.postedAt || j.posted}</td>
                  <td style={{textAlign: 'center'}}>
                    <button 
                      onClick={() => handleDelete(jobId)}
                      style={{
                        background: '#ef4444', color: 'white', border: 'none', 
                        padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', fontSize: '13px'
                      }}
                    >
                      Xóa
                    </button>
                  </td>
                </tr>
              )
            })}

            {filteredJobs.length === 0 && (
              <tr>
                <td colSpan="6" className="joblist-empty">
                  Không tìm thấy bài đăng nào
                </td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
}