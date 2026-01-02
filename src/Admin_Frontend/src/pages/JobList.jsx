import React, { useState, useEffect } from "react";
import "../styles/JobList.css";
import { jobService } from "../services/jobService";
import { 
  HiSearch, HiTrash, HiEye, HiBriefcase, HiLocationMarker, 
  HiCurrencyDollar, HiOfficeBuilding, HiDocumentText, HiX, HiClock
} from "react-icons/hi";
import { toast } from "react-toastify";

export default function JobList() {
  const [search, setSearch] = useState("");
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedJob, setSelectedJob] = useState(null);

  useEffect(() => { fetchJobs(); }, []);

  useEffect(() => {
    document.body.style.overflow = selectedJob ? "hidden" : "unset";
    return () => { document.body.style.overflow = "unset"; };
  }, [selectedJob]);

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const res = await jobService.getAllJobs();
      if (res.success) setJobs(res.jobs || []);
    } finally {
      setLoading(false);
    }
  };

  const stripHtml = (html) =>
    html?.replace(/<[^>]*>?/gm, "") || "";

  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa bài đăng này không?")) return;

    try {
      const res = await jobService.deleteJob(id);
      if (res.success) {
        setJobs(prev => prev.filter(job => job._id !== id));
        toast.success("Đã xóa bài đăng thành công!");
        if(selectedJob && selectedJob._id === id) setSelectedJob(null);
      } else {
        toast.error("Xóa bài đăng thất bại.");
      }
    } catch {
      toast.error("Lỗi khi xóa bài đăng.");
    }
  };

  const filteredJobs = jobs.filter((j) =>
    j.title?.toLowerCase().includes(search.toLowerCase()) ||
    j.company?.toLowerCase().includes(search.toLowerCase()) ||
    j.location?.toLowerCase().includes(search.toLowerCase()) ||
    (j.address && j.address.toLowerCase().includes(search.toLowerCase()))
  );

  const formatSalary = (salaryObj) => {
    if (!salaryObj) return "Thỏa thuận";
    const { minSalary, maxSalary, currency } = salaryObj;
    if (minSalary !== undefined && maxSalary !== undefined) {
      const formattedMin = minSalary.toLocaleString('vi-VN');
      const formattedMax = maxSalary.toLocaleString('vi-VN');     
      return `${formattedMin} - ${formattedMax} ${currency || 'VND'}`;
    }
    return "Thỏa thuận";
  };

  // 1. Xử lý hiển thị Kinh nghiệm
  const formatExperience = (exp) => {
    if (exp === undefined || exp === null || exp === "") return "Không yêu cầu";
    if (exp === 0) return "Không yêu cầu"; // Nếu số 0 cũng là không yêu cầu
    return `${exp} năm`;
  };

  // Xử lý Bằng cấp & Cấp bậc (Nếu thiếu thì hiện "Chưa cập nhật")
  const formatDegree = (degree, fallback = "Không yêu cầu") => {
    if (!degree || degree.trim() === "") return fallback;
    
    // Map dịch tiếng Việt cho Bằng cấp
    const degreeMap = {
      'Bachelor': 'Cử nhân',
      'Master': 'Thạc sĩ',
      'Doctorate': 'Tiến sĩ',
      'Associate': 'Cao đẳng',
      'Diploma': 'Chứng chỉ',
      'High School': 'Tốt nghiệp THPT',
      'No Degree': 'Không yêu cầu'
    };
    return degreeMap[degree] || degree; 
  };

  return (
    <>
      <div className="joblist-container fade-in">
        <div className="joblist-header-group">
          <h2 className="joblist-title">Quản lý tin tuyển dụng</h2>
          <div className="search-wrapper">
            <HiSearch className="search-icon" />
            <input 
              type="text" 
              className="joblist-search" 
              placeholder="Tìm kiếm công việc, công ty, địa chỉ..."
              value={search} 
              onChange={(e) => setSearch(e.target.value)} 
            />
          </div>
        </div>

        <div className="joblist-table-card">
          {loading ? (
            <div className="loading-container"><div className="spinner"></div></div>
          ) : (
            <table className="joblist-table">
              <thead>
                <tr>
                  <th style={{width: '35%'}}>Công việc & Công ty</th>
                  <th style={{width: '25%'}}>Lương</th>
                  <th style={{width: '25%'}}>Địa chỉ</th>
                  <th style={{width: '15%', textAlign: 'center'}}>Hành động</th>
                </tr>
              </thead>
              <tbody>
                {filteredJobs.map(j => (
                  <tr key={j._id}>
                    <td>
                      <div className="job-info-cell">
                        <div className="company-logo-placeholder">
                          {j.logo && j.logo.url ? (
                            <img 
                              src={j.logo.url}  
                              alt={j.company} 
                              className="company-logo-img"
                              onError={(e) => {
                                e.target.style.display = 'none'; 
                                e.target.parentNode.innerText = j.company?.charAt(0).toUpperCase();
                              }}
                            />
                          ) : (
                            // Nếu không có logo thì hiển thị chữ cái đầu hoặc icon
                            j.company?.charAt(0).toUpperCase() || <HiOfficeBuilding />
                          )}
                        </div>
                        <div className="job-details">
                          <span className="job-title">{j.title}</span>
                          <span className="company-name"><HiOfficeBuilding size={14} /> {j.company}</span>
                        </div>
                      </div>
                    </td>
                    <td className="salary-cell">{formatSalary(j.salary)}</td>
                    <td className="location-cell"><HiLocationMarker /> {j.address || j.location}</td>
                    <td style={{textAlign: 'center'}}>
                      <div className="action-buttons">
                        <button className="btn-icon btn-view" onClick={() => setSelectedJob(j)}><HiEye /></button>
                        <button className="btn-icon btn-delete" onClick={() => handleDelete(j._id)}><HiTrash /></button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filteredJobs.length === 0 && (
                  <tr>
                    <td colSpan="4" className="joblist-empty">
                      <HiDocumentText size={24} /> Không tìm thấy bài đăng nào.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {selectedJob && (
        <div className="job-modal-overlay" onClick={() => setSelectedJob(null)}>
          <div className="job-modal" onClick={e => e.stopPropagation()}>
            <div className="job-modal-header-modern">
              <div className="header-top-row">
                <div className="company-logo-large">
                  {selectedJob.logo && selectedJob.logo.url ? (
                    <img 
                      src={selectedJob.logo.url} 
                      alt={selectedJob.company} 
                      className="company-logo-large-img" 
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.parentNode.innerText = selectedJob.company?.charAt(0).toUpperCase();
                      }}
                    />
                  ) : (
                    selectedJob.company?.charAt(0).toUpperCase() || "C"
                  )}
                </div>
                <button className="btn-close-modern" onClick={() => setSelectedJob(null)}><HiX /></button>
              </div>
              <div className="job-main-info">
                <h2>{selectedJob.title}</h2>
                <div className="company-meta">
                  <span style={{display:'flex', alignItems:'center', gap:5}}><HiOfficeBuilding /> {selectedJob.company}</span>
                  <span className="dot-sep"></span>
                  <span style={{display:'flex', alignItems:'center', gap:5}}><HiClock /> Đăng ngày {new Date(selectedJob.postedAt).toLocaleDateString('vi-VN')}</span>
                </div>
              </div>

              <div className="job-tags-row">
                <span className="job-tag tag-salary"><HiCurrencyDollar size={18}/> {formatSalary(selectedJob.salary)}</span>
                <span className="job-tag tag-location"><HiLocationMarker size={18}/> {selectedJob.address || selectedJob.location}</span>
                <span className="job-tag tag-type"><HiBriefcase size={18}/> {selectedJob.jobType}</span>
              </div>
            </div>

            <div className="job-modal-body-modern">
              <div className="quick-stats-grid">
                {/* Cột 1: Kinh nghiệm */}
                <div className="stat-item-col">
                  <span className="stat-label-tiny">Kinh nghiệm</span>
                  <span className="stat-value-bold">
                    {formatExperience(selectedJob.experience)}
                  </span>
                </div>

                {/* Cột 2: Cấp bậc */}
                <div className="stat-item-col">
                  <span className="stat-label-tiny">Vị trí tuyển dụng</span>
                  <span className="stat-value-bold">
                    {/* Fallback "Nhân viên" nếu không có dữ liệu */}
                    {selectedJob.position || "Nhân viên"}
                  </span>
                </div>

                {/* Cột 3: Bằng cấp */}
                <div className="stat-item-col">
                  <span className="stat-label-tiny">Bằng cấp</span>
                  <span className="stat-value-bold">
                    {/* Fallback "Không yêu cầu" nếu không có dữ liệu */}
                    {formatDegree(selectedJob.degree)}
                  </span>
                </div>
              </div>

              <div className="detail-section">
                <h4>Mô tả công việc</h4>
                <div
                  className="detail-text"
                  dangerouslySetInnerHTML={{
                    __html: selectedJob.description || "Không có mô tả",
                  }}
                />
              </div>
            </div>

            <div className="job-modal-footer">
              <button className="btn-modal-action btn-secondary" onClick={() => setSelectedJob(null)}>Đóng</button>
              <button className="btn-modal-action btn-danger" onClick={() => handleDelete(selectedJob._id)}>Xóa bài đăng</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
