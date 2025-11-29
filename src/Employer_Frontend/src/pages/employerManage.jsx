import React, { useState, useMemo, useEffect } from "react";
import { ArrowLeft, Flame, X, Check, Mail } from "lucide-react";
import "../styles/employerDashboard.css"


const CVDetailModal = ({ cv, onClose }) => {
  if (!cv) return null;
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h3 className="modal-title">Hồ sơ ứng viên</h3>
          <button className="close-btn" onClick={onClose}><X size={20}/></button>
        </div>
        <div className="modal-body">
          <p><strong>Họ tên:</strong> {cv.name}</p>
          <p><strong>Vị trí:</strong> {cv.position}</p>
          <p><strong>Email:</strong> example@email.com (Mock Data)</p>
          <p><strong>Kinh nghiệm:</strong> 3 năm kinh nghiệm làm việc với ReactJS, NodeJS...</p>
          <p><strong>Giới thiệu:</strong> Ứng viên này rất tiềm năng, có thái độ tốt và kỹ năng phù hợp.</p>
        </div>
        <div className="modal-actions">
           <button className="btn btn-danger">Từ chối</button>
           <button className="btn btn-primary">Mời phỏng vấn</button>
           <button className="btn btn-secondary" onClick={onClose}>Đóng</button>
        </div>
      </div>
    </div>
  );
};

// ==========================================
// COMPONENT 1: JOB LIST VIEW
// ==========================================
const JobListView = ({ jobs, onSelectJob }) => {
  const [filterText, setFilterText] = useState("");
  const [filterLoc, setFilterLoc] = useState("");

  const filteredJobs = useMemo(() => {
    return jobs.filter(job => {
      const matchText = job.title.toLowerCase().includes(filterText.toLowerCase());
      const matchLoc = filterLoc ? job.location === filterLoc : true;
      return matchText && matchLoc;
    });
  }, [jobs, filterText, filterLoc]);

  const locations = [...new Set(jobs.map(j => j.location))];

  return (
    <div className="animate-fade-in">
      <div className="dashboard-filter-bar">
        <div className="filter-row">
          <input 
            type="text" 
            placeholder="Tìm tin tuyển dụng..." 
            className="filter-input"
            value={filterText}
            onChange={e => setFilterText(e.target.value)}
          />
          <select className="filter-select" onChange={e => setFilterLoc(e.target.value)}>
            <option value="">Tất cả địa điểm</option>
            {locations.map(loc => <option key={loc} value={loc}>{loc}</option>)}
          </select>
        </div>
      </div>

      <div className="job-list-grid">
        {filteredJobs.length > 0 ? filteredJobs.map(job => (
          <div key={job._id} className="job-card" onClick={() => onSelectJob(job, 'all')}>
            <div className="job-summary">
              <div className="job-left">
                <h3>{job.title}</h3>
                <p className="job-position">{job.position}</p>
                <p className="job-location">{job.location}</p>
              </div>

              <div className="job-right">
                <p className="job-status">{job.status}</p>
                {/*<p className="job-len">{job?.applicants.length}</p>*/}
              </div>
            </div>
            
            <div className="job-metrics">
              <div 
                className="metric-box new" 
                onClick={(e) => { e.stopPropagation(); onSelectJob(job, 'new'); }}
              >
                <span className={`metric-number ${(job.metric.newed || 0) === 0 ? 'zero' : ''}`}>
                  {job.metric.newed || 0}
                </span>
                <span className="metric-label">Mới</span>
              </div>

              <div 
                className="metric-box potential"
                onClick={(e) => { e.stopPropagation(); onSelectJob(job, 'pass'); }}
              >
                <span className={`metric-number ${(job.metric.pass || 0) === 0 ? 'zero' : ''}`}>
                  {job.metric.pass || 0}
                </span>
                <span className="metric-label">Tiềm năng</span>
              </div>

              <div 
                className="metric-box interview"
                onClick={(e) => { e.stopPropagation(); onSelectJob(job, 'viewed'); }}
              >
                 <span className={`metric-number ${(job.metric.interviewed || 0) === 0 ? 'zero' : ''}`}>
                  {job.metric.interviewed || 0}
                </span>
                <span className="metric-label">Đã xem</span>
              </div>
            </div>
          </div>
        )) : <div className="no-data-msg">Không tìm thấy tin tuyển dụng nào.</div>}
      </div>
    </div>
  );
};

// ==========================================
// COMPONENT 2: CV MANAGER
// ==========================================
const CVManager = ({ job, initialStatus, onBack }) => {
  const [cvList, setCvList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState(initialStatus || 'all');
  const [selectedCv, setSelectedCv] = useState(null);

  useEffect(() => {
    setLoading(true);
    const mockFetchCVs = () => {
      const dummyData = [
        { id: 1, name: "Nguyễn Văn A", position: job.position, status: "new", date: "2025-11-28", location: "Hồ Chí Minh", priority: "high" },
        { id: 2, name: "Trần Thị B", position: job.position, status: "viewed", date: "2025-11-27", location: "Hà Nội", priority: "low" },
        { id: 3, name: "Lê Văn C", position: job.position, status: "pass", date: "2025-11-25", location: "Đà Nẵng", priority: "high" },
        { id: 4, name: "Phạm Văn D", position: job.position, status: "rejected", date: "2025-11-20", location: "Hồ Chí Minh" },
        { id: 5, name: "Hoàng E", position: job.position, status: "new", date: "2025-11-28", location: "Hồ Chí Minh" },
      ];
      setCvList(dummyData);
      setLoading(false);
    };
    setTimeout(mockFetchCVs, 500); 
  }, [job]);

  const stats = useMemo(() => {
    return {
      all: cvList.length,
      new: cvList.filter(c => c.status === 'new').length,
      viewed: cvList.filter(c => c.status === 'viewed').length,
      pass: cvList.filter(c => c.status === 'pass').length,
      rejected: cvList.filter(c => c.status === 'rejected').length
    };
  }, [cvList]);

  const displayedCVs = useMemo(() => {
    if (activeTab === 'all') return cvList;
    return cvList.filter(cv => cv.status === activeTab);
  }, [cvList, activeTab]);

  const handleViewCv = (cv) => {
    setSelectedCv(cv);
    if(cv.status === 'new') {
        setCvList(prev => prev.map(p => p.id === cv.id ? {...p, status: 'viewed'} : p));
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN');
  };

  return (
    <div className="animate-slide-in">
      <div className="back-btn-row">
        <button onClick={onBack} className="btn-back">
          <ArrowLeft size={16} /> Quay lại danh sách tin
        </button>
      </div>

      <h2 style={{ marginBottom: "20px" }}>Ứng viên cho: {job.title}</h2>

      <div className="pipeline-tabs">
        <button className={`pipeline-tab ${activeTab === 'all' ? 'active' : ''}`} onClick={() => setActiveTab('all')}>
          Tất cả <span className="count-badge">{stats.all}</span>
        </button>
        <button className={`pipeline-tab ${activeTab === 'new' ? 'active' : ''}`} onClick={() => setActiveTab('new')}>
          Mới <span className="count-badge">{stats.new}</span>
        </button>
        <button className={`pipeline-tab ${activeTab === 'viewed' ? 'active' : ''}`} onClick={() => setActiveTab('viewed')}>
          Đang xem xét <span className="count-badge">{stats.viewed}</span>
        </button>
        <button className={`pipeline-tab dau ${activeTab === 'pass' ? 'active' : ''}`} onClick={() => setActiveTab('pass')}>
          Đậu <span className="count-badge">{stats.pass}</span>
        </button>
        <button className={`pipeline-tab rot ${activeTab === 'rejected' ? 'active' : ''}`} onClick={() => setActiveTab('rejected')}>
          Từ chối <span className="count-badge">{stats.rejected}</span>
        </button>
      </div>

      {loading ? (
        <div className="loading-state">Đang tải danh sách ứng viên...</div>
      ) : (
        <div className="cv-list">
          {displayedCVs.length > 0 ? displayedCVs.map(cv => (
            <div key={cv.id} className={`cv-item ${cv.status !== 'new' ? 'read-item' : ''}`}>
              <input type="checkbox" className="cv-checkbox" />
              
              <div className="cv-main-info">
                <div className="cv-header-row">
                    <span className="cv-name">{cv.name}</span>
                    
                    {cv.priority === 'high' && (
                        <span title="Ứng viên tiềm năng/Gấp"><Flame className="priority-icon" /></span>
                    )}

                    {cv.status === 'pass' && <span className="status-pill pass">Đậu</span>}
                    {cv.status === 'rejected' && <span className="status-pill rejected">Từ chối</span>}
                    {cv.status === 'viewed' && <span className="status-pill viewed">Đang xem</span>}
                    {cv.status === 'new' && <span className="status-pill new">Mới</span>}
                </div>
                
                <div className="cv-sub">
                    {cv.position} • {cv.location} • Nộp ngày: {formatDate(cv.date)}
                </div>
              </div>
              
              <div className="cv-actions">
                <button className="view-btn-outline" onClick={() => handleViewCv(cv)}>
                    Xem chi tiết
                </button>
              </div>
            </div>
          )) : (
            <div className="no-results">Chưa có ứng viên nào ở trạng thái này.</div>
          )}
        </div>
      )}

      {selectedCv && (
         <CVDetailModal 
           cv={selectedCv}
           onClose={() => setSelectedCv(null)}
         />
      )}
    </div>
  );
};

// ==========================================
// MAIN DASHBOARD
// ==========================================
export default function EmployerDashboard({ jobPosts = [] }) { // Default props
  const [selectedJob, setSelectedJob] = useState(null);
  const [initialTab, setInitialTab] = useState('all');

  // Dummy data nếu không có props truyền vào (Để preview hoạt động)
  const dummyJobs = [
    { 
      _id: 1, 
      title: "Senior React Developer", 
      position: "Developer", 
      location: "Hồ Chí Minh", 
      metric: { newed: 2, pass: 1, interviewed: 3 } 
    },
    { 
      _id: 2, 
      title: "Marketing Manager", 
      position: "Marketing", 
      location: "Hà Nội", 
      metric: { newed: 0, pass: 0, interviewed: 1 } 
    }
  ];

  const jobsData = jobPosts.length > 0 ? jobPosts : dummyJobs;

  const handleSelectJob = (job, statusFilter = 'all') => {
    setSelectedJob(job);
    setInitialTab(statusFilter); 
  };

  return (
    <div className="dashboard-container">
      {/* <style>{styles}</style> */}
      {!selectedJob ? (
        <JobListView 
          jobs={jobsData} 
          onSelectJob={handleSelectJob} 
        />
      ) : (
        <CVManager 
          job={selectedJob} 
          initialStatus={initialTab}
          onBack={() => setSelectedJob(null)} 
        />
      )}
    </div>
  );
}