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
      if (res.success) setJobs(res.data);
    } catch (err) { console.error(err); } 
    finally { setLoading(false); }
  };

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
    j.location?.toLowerCase().includes(search.toLowerCase())
  );

  const formatSalary = (salaryObj) => {
    if (!salaryObj) return "Thỏa thuận";
    const { minSalary, maxSalary, currency } = salaryObj;
    if (minSalary && maxSalary) return `${minSalary} - ${maxSalary} ${currency || 'VND'}`;
    return "Thỏa thuận";
  };

  return (
    <>
    <div className="joblist-container fade-in">
      <div className="joblist-header-group">
        <h2 className="joblist-title">Quản lý tin tuyển dụng</h2>
        <div className="search-wrapper">
          <HiSearch className="search-icon" />
          <input type="text" className="joblist-search" placeholder="Tìm kiếm công việc, công ty..."
            value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
      </div>

      <div className="joblist-table-card">
        {loading ? <div className="loading-container"><div className="spinner"></div></div> : (
          <table className="joblist-table">
            <thead>
              <tr>
                <th style={{width: '35%'}}>Công việc & Công ty</th>
                <th style={{width: '20%'}}>Chi tiết</th>
                <th style={{width: '15%'}}>Ngày đăng</th>
                <th style={{width: '15%', textAlign: 'center'}}>Trạng thái</th>
                <th style={{width: '15%', textAlign: 'center'}}>Hành động</th>
              </tr>
            </thead>
            <tbody>
              {filteredJobs.map(j => (
                <tr key={j._id}>
                  <td>
                    <div className="job-info-cell">
                      <div className="company-logo-placeholder">{j.company?.charAt(0).toUpperCase() || <HiOfficeBuilding />}</div>
                      <div className="job-details">
                        <span className="job-title">{j.title}</span>
                        <span className="company-name"><HiOfficeBuilding size={14} /> {j.company}</span>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className="meta-cell">
                      <div className="meta-item"><HiLocationMarker /> {j.location}</div>
                      <div className="meta-item salary-text"><HiCurrencyDollar /> {formatSalary(j.salary)}</div>
                    </div>
                  </td>
                  <td>{new Date(j.postedAt).toLocaleDateString('vi-VN')}</td>
                  <td style={{textAlign: 'center'}}>
                    <span className={`status-badge ${j.status?.toLowerCase() || 'pending'}`}>{j.status || 'Pending'}</span>
                  </td>
                  <td style={{textAlign: 'center'}}>
                    <div className="action-buttons">
                      <button className="btn-icon btn-view" onClick={() => setSelectedJob(j)}><HiEye /></button>
                      <button className="btn-icon btn-delete" onClick={() => handleDelete(j._id)}><HiTrash /></button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredJobs.length === 0 && (
                <tr><td colSpan="5" className="joblist-empty"><HiDocumentText size={24} /> Không tìm thấy bài đăng nào.</td></tr>
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
              <div className="company-logo-large">{selectedJob.company?.charAt(0).toUpperCase() || "C"}</div>
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
              <span className="job-tag tag-location"><HiLocationMarker size={18}/> {selectedJob.location}</span>
              <span className="job-tag tag-type"><HiBriefcase size={18}/> {selectedJob.jobType}</span>
              <span className={`job-tag tag-status ${selectedJob.status?.toLowerCase() || 'pending'}`}>{selectedJob.status || 'Pending'}</span>
            </div>
          </div>

          <div className="job-modal-body-modern">
            <div className="quick-stats-grid">
              <div className="stat-item-col">
                <span className="stat-label-tiny">Kinh nghiệm</span>
                <span className="stat-value-bold">{selectedJob.experience || 0} năm</span>
              </div>
              <div className="stat-item-col">
                <span className="stat-label-tiny">Cấp bậc</span>
                <span className="stat-value-bold">{selectedJob.position || "Nhân viên"}</span>
              </div>
              <div className="stat-item-col">
                <span className="stat-label-tiny">Bằng cấp</span>
                <span className="stat-value-bold">{selectedJob.degree || "Chưa yêu cầu"}</span>
              </div>
            </div>

            <div className="detail-section">
              <h4>Mô tả công việc</h4>
              <div className="detail-text">{selectedJob.description || "Không có mô tả"}</div>
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
