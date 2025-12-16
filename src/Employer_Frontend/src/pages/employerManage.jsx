import React, { useState, useMemo, useEffect } from "react";
import { ArrowLeft, Flame, X, Check, Mail, Send, Users } from "lucide-react"; // Đã thêm icon Send, Users
import "../styles/employerDashboard.css"

// ==========================================
// [NEW] COMPONENT: MODAL CHỌN NHÓM ĐỐI TƯỢNG
// ==========================================
const BulkOptionModal = ({ stats, onClose, onSelectGroup }) => {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()} style={{maxWidth: '450px'}}>
        <div className="modal-header">
          <h3 className="modal-title">Chọn nhóm nhận email</h3>
          <button className="close-btn" onClick={onClose}><X size={20}/></button>
        </div>
        <div className="modal-body">
            <p style={{marginBottom: '15px', color: '#555'}}>Bạn muốn gửi thông báo cho nhóm nào?</p>
            <div style={{display: 'flex', flexDirection: 'column', gap: '10px'}}>
                {/* Nút gửi cho nhóm Đậu */}
                <button 
                    className="btn" 
                    style={{justifyContent: 'space-between', padding: '15px', border: '1px solid #e0e0e0', background: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center'}}
                    onClick={() => onSelectGroup('hired')}
                    disabled={stats.hired === 0}
                >
                    <div style={{display:'flex', alignItems:'center', gap: '10px'}}>
                        <span style={{width:'10px', height:'10px', borderRadius:'50%', background:'#28a745'}}></span>
                        <span>Gửi Offer (Nhóm Đậu)</span>
                    </div>
                    <strong>{stats.hired} người</strong>
                </button>

                {/* Nút gửi cho nhóm Từ chối */}
                <button 
                    className="btn" 
                    style={{justifyContent: 'space-between', padding: '15px', border: '1px solid #e0e0e0', background: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center'}}
                    onClick={() => onSelectGroup('rejected')}
                    disabled={stats.rejected === 0}
                >
                     <div style={{display:'flex', alignItems:'center', gap: '10px'}}>
                        <span style={{width:'10px', height:'10px', borderRadius:'50%', background:'#dc3545'}}></span>
                        <span>Gửi thư Cảm ơn (Nhóm Từ chối)</span>
                    </div>
                    <strong>{stats.rejected} người</strong>
                </button>

                 {/* Nút gửi cho nhóm Đang xem/Phỏng vấn */}
                 <button 
                    className="btn" 
                    style={{justifyContent: 'space-between', padding: '15px', border: '1px solid #e0e0e0', background: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center'}}
                    onClick={() => onSelectGroup('interviewing')}
                    disabled={stats.interviewing === 0}
                >
                     <div style={{display:'flex', alignItems:'center', gap: '10px'}}>
                        <span style={{width:'10px', height:'10px', borderRadius:'50%', background:'#ffc107'}}></span>
                        <span>Mời Phỏng Vấn (Nhóm Đang xem)</span>
                    </div>
                    <strong>{stats.interviewing} người</strong>
                </button>
            </div>
        </div>
      </div>
    </div>
  );
};

// ==========================================
// [NEW] COMPONENT: MODAL SOẠN EMAIL
// ==========================================
const EmailComposeModal = ({ recipients, statusType, onClose, onSend }) => {
  const [subject, setSubject] = useState("");
  const [content, setContent] = useState("");

  // Logic tự động điền mẫu (Template)
  useEffect(() => {
    if (statusType === 'hired') {
        setSubject("THÔNG BÁO TRÚNG TUYỂN & MỜI NHẬN VIỆC");
        setContent(`Chào bạn,\n\nChúng tôi rất vui mừng thông báo bạn đã trúng tuyển...\n\nTrân trọng,`);
    } else if (statusType === 'rejected') {
        setSubject("THƯ CẢM ƠN VÀ THÔNG BÁO KẾT QUẢ");
        setContent(`Chào bạn,\n\nCảm ơn bạn đã dành thời gian tham gia phỏng vấn. Tuy nhiên...\n\nTrân trọng,`);
    } else if (statusType === 'interviewing') {
        setSubject("THƯ MỜI PHỎNG VẤN");
        setContent(`Chào bạn,\n\nChúng tôi rất ấn tượng với hồ sơ của bạn và muốn mời bạn tham gia phỏng vấn...\n\nTrân trọng,`);
    }
  }, [statusType]);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()} style={{maxWidth: '600px'}}>
        <div className="modal-header">
            <h3 className="modal-title">Soạn Email Gửi Hàng Loạt</h3>
            <button className="close-btn" onClick={onClose}><X size={20}/></button>
        </div>
        <div className="modal-body">
            <div style={{background: '#f8f9fa', padding: '10px', borderRadius: '5px', marginBottom: '15px', fontSize: '13px'}}>
                <strong>Gửi đến ({recipients.length} người): </strong> 
                {recipients.map(r => r.name).join(", ")}
            </div>
            <div style={{marginBottom: '10px'}}>
                <label style={{display:'block', marginBottom:'5px', fontWeight:'500'}}>Tiêu đề:</label>
                <input type="text" className="filter-input" style={{width:'100%'}} value={subject} onChange={e => setSubject(e.target.value)} />
            </div>
            <div>
                <label style={{display:'block', marginBottom:'5px', fontWeight:'500'}}>Nội dung:</label>
                <textarea className="filter-input" rows={8} style={{width:'100%'}} value={content} onChange={e => setContent(e.target.value)} />
            </div>
        </div>
        <div className="modal-actions">
           <button className="btn btn-secondary" onClick={onClose}>Hủy</button>
           <button className="btn btn-primary" onClick={() => onSend(subject, content)}>
               <Send size={16} style={{marginRight: '5px'}}/> Gửi ngay
           </button>
        </div>
      </div>
    </div>
  );
};

// ==========================================
// EXISTING COMPONENT: CV DETAIL MODAL (Giữ nguyên)
// ==========================================
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
// EXISTING COMPONENT: JOB LIST VIEW (Giữ nguyên)
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
              </div>
            </div>
            
            <div className="job-metrics">
              <div 
                className="metric-box new" 
                onClick={(e) => { e.stopPropagation(); onSelectJob(job, 'new'); }}
              >
                <span className={`metric-number ${(job.metric?.newed || 0) === 0 ? 'zero' : ''}`}>
                  {job.metric?.newed || 0}
                </span>
                <span className="metric-label">Mới</span>
              </div>

              <div 
                className="metric-box potential"
                onClick={(e) => { e.stopPropagation(); onSelectJob(job, 'hired'); }}
              >
                <span className={`metric-number ${(job.metric.hired || 0) === 0 ? 'zero' : ''}`}>
                  {job.metric.hired || 0}
                </span>
                <span className="metric-label">Tiềm năng</span>
              </div>

              <div 
                className="metric-box interview"
                onClick={(e) => { e.stopPropagation(); onSelectJob(job, 'interviewing'); }}
              >
                 <span className={`metric-number ${(job.metric.interinterviewing || 0) === 0 ? 'zero' : ''}`}>
                  {job.metric.interinterviewing || 0}
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
// COMPONENT 2: CV MANAGER (UPDATE: THÊM NÚT GỬI MAIL VÀ LOGIC MODAL)
// ==========================================
const CVManager = ({ job, initialStatus, onBack }) => {
  const [cvList, setCvList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState(initialStatus || 'all');
  const [selectedCv, setSelectedCv] = useState(null);

  // --- [NEW STATE] Quản lý Modal gửi mail ---
  const [showOptionModal, setShowOptionModal] = useState(false);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [targetGroup, setTargetGroup] = useState(null); // 'hired', 'rejected', 'interviewing'
  const [targetRecipients, setTargetRecipients] = useState([]);

  useEffect(() => {
    setLoading(true);
    // const mockFetchCVs = () => {
    //   const dummyData = [
    //     { id: 1, name: "Nguyễn Văn A", position: job.position, status: "new", date: "2025-11-28", location: "Hồ Chí Minh", priority: "high" },
    //     { id: 2, name: "Trần Thị B", position: job.position, status: "interviewing", date: "2025-11-27", location: "Hà Nội", priority: "low" },
    //     { id: 3, name: "Lê Văn C", position: job.position, status: "hired", date: "2025-11-25", location: "Đà Nẵng", priority: "high" },
    //     { id: 4, name: "Phạm Văn D", position: job.position, status: "rejected", date: "2025-11-20", location: "Hồ Chí Minh" },
    //     { id: 5, name: "Hoàng E", position: job.position, status: "new", date: "2025-11-28", location: "Hồ Chí Minh" },
    //     // Thêm dữ liệu giả để test gửi mail
    //     { id: 6, name: "Vũ Văn F", position: job.position, status: "hired", date: "2025-11-29", location: "Hồ Chí Minh" },
    //   ];
    //   setCvList(dummyData);
    //   setLoading(false);
    // };
    // setTimeout(mockFetchCVs, 500); 
    const applicantList = job.applicants || []; // Giả sử job có trường applicants
    setCvList(applicantList);
    setLoading(false);
  }, [job]);

  const stats = useMemo(() => {
    return {
      all: cvList.length,
      new: cvList.filter(c => c.label === 'New').length,
      interviewing: cvList.filter(c => c.label === 'Interviewing').length,
      hired: cvList.filter(c => c.label === 'Hired').length,
      rejected: cvList.filter(c => c.label === 'Rejected').length
    };
  }, [cvList]);

  const displayedCVs = useMemo(() => {
    if (activeTab === 'all') return cvList;
    return cvList.filter(cv => cv.status === activeTab);
  }, [cvList, activeTab]);

  const handleViewCv = (cv) => {
    setSelectedCv(cv);
    if(cv.status === 'new') {
        setCvList(prev => prev.map(p => p.id === cv.id ? {...p, status: 'interviewing'} : p));
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN');
  };

  // --- [NEW HANDLERS] Logic xử lý nút gửi mail ---
  
  // 1. Khi chọn nhóm từ modal option
  const handleSelectGroup = (group) => {
      const recipients = cvList.filter(c => c.status === group);
      setTargetGroup(group);
      setTargetRecipients(recipients);
      setShowOptionModal(false); // Đóng modal chọn
      setShowEmailModal(true);   // Mở modal soạn mail
  };

  // 2. Khi ấn nút Gửi trong form
  const handleSendEmail = (subject, content) => {
      // API Call giả lập
      alert(`Đã gửi email thành công tới ${targetRecipients.length} ứng viên!`);
      setShowEmailModal(false);
  };

  return (
    <div className="animate-slide-in">
      
      {/* [UPDATE] Sửa header để chứa cả nút Back và nút Gửi Mail */}
      <div className="back-btn-row" style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
        <button onClick={onBack} className="btn-back">
          <ArrowLeft size={16} /> Quay lại danh sách tin
        </button>

        {/* [NEW BUTTON] Nút kích hoạt gửi mail */}
        <button 
            className="btn btn-primary" 
            style={{display:'flex', alignItems:'center', gap:'8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)'}}
            onClick={() => setShowOptionModal(true)}
        >
            <Mail size={16} /> Gửi Email Thông Báo
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
        <button className={`pipeline-tab ${activeTab === 'interviewing' ? 'active' : ''}`} onClick={() => setActiveTab('interviewing')}>
          Đang xem xét <span className="count-badge">{stats.interviewing}</span>
        </button>
        <button className={`pipeline-tab dau ${activeTab === 'hired' ? 'active' : ''}`} onClick={() => setActiveTab('hired')}>
          Đậu <span className="count-badge">{stats.hired}</span>
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

                    {cv.status === 'hired' && <span className="status-pill hired">Đậu</span>}
                    {cv.status === 'rejected' && <span className="status-pill rejected">Từ chối</span>}
                    {cv.status === 'interviewing' && <span className="status-pill interviewing">Đang xem</span>}
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

      {/* [NEW] RENDER MODALS */}
      {showOptionModal && (
          <BulkOptionModal 
            stats={stats} 
            onClose={() => setShowOptionModal(false)} 
            onSelectGroup={handleSelectGroup}
          />
      )}

      {showEmailModal && (
          <EmailComposeModal 
            recipients={targetRecipients}
            statusType={targetGroup}
            onClose={() => setShowEmailModal(false)}
            onSend={handleSendEmail}
          />
      )}

    </div>
  );
};

// ==========================================
// MAIN DASHBOARD (Giữ nguyên)
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
      metric: { newed: 2, hired: 1, interinterviewing: 3 } 
    },
    { 
      _id: 2, 
      title: "Marketing Manager", 
      position: "Marketing", 
      location: "Hà Nội", 
      metric: { newed: 0, hired: 0, interinterviewing: 1 } 
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