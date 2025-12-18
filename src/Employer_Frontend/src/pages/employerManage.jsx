import React, { useState, useMemo, useEffect } from "react";
import "../styles/employerDashboard.css"
import client from "../api/client";
import { ArrowLeft, User, FileWarning, ExternalLink, Ban, Check, Mail, Flame, X, Send, FileText, Clock, AlertTriangle } from 'lucide-react';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css'; // Import style của bản new
import {Paperclip, Minimize2, Maximize2, Trash2 } from 'lucide-react';
import "../styles/emailModal.css"; // File CSS ở bước 2
// ==========================================
// 1. EmailComposeModal (Giữ nguyên)
// ==========================================
const EmailComposeModal = ({ recipients, labelType, onClose, onSend }) => {
  const [subject, setSubject] = useState("");
  const [content, setContent] = useState("");
  const [isExpanded, setIsExpanded] = useState(false); // Chế độ toàn màn hình

  // Cấu hình Toolbar cho Editor (Gọn gàng, đủ dùng)
  const modules = {
    toolbar: [
      [{ 'header': [1, 2, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{'list': 'ordered'}, {'list': 'bullet'}],
      ['link', 'clean']
    ],
  };

  const formats = [
    'header',
    'bold', 'italic', 'underline', 'strike',
    'list', 'bullet',
    'link'
  ];

  // Load mẫu email thông minh (HTML)
  useEffect(() => {
    if (labelType === 'Hired') {
        setSubject("THÔNG BÁO TRÚNG TUYỂN & MỜI NHẬN VIỆC");
        setContent(`<p>Chào bạn,</p><p>Chúng tôi rất vui mừng thông báo bạn đã <strong>trúng tuyển</strong> vào vị trí...</p><p>Mời bạn phản hồi email này để xác nhận.</p><p><br></p><p>Trân trọng,</p>`);
    } else if (labelType === 'Rejected') {
        setSubject("THƯ CẢM ƠN VÀ THÔNG BÁO KẾT QUẢ");
        setContent(`<p>Chào bạn,</p><p>Cảm ơn bạn đã dành thời gian tham gia phỏng vấn. Tuy nhiên, sau khi cân nhắc kỹ lưỡng...</p><p>Chúc bạn sớm tìm được công việc phù hợp.</p><p><br></p><p>Trân trọng,</p>`);
    } else if (labelType === 'Interviewing') {
        setSubject("THƯ MỜI PHỎNG VẤN");
        setContent(`<p>Chào bạn,</p><p>Chúng tôi rất ấn tượng với hồ sơ của bạn và muốn mời bạn tham gia <strong>phỏng vấn</strong> trao đổi chi tiết...</p><p>Vui lòng xác nhận thời gian tham gia.</p><p><br></p><p>Trân trọng,</p>`);
    }
  }, [labelType]);

  return (
    <div className="email-modal-overlay" onClick={onClose}>
      <div 
        className={`email-modal-container ${isExpanded ? 'expanded' : ''} animate-pop`} 
        onClick={e => e.stopPropagation()}
      >
        {/* --- 1. HEADER --- */}
        <div className="email-header">
            <h3 className="email-title">
               {labelType ? `Soạn thư: ${labelType}` : 'Thư mới'}
            </h3>
            <div className="window-controls">
                <button className="control-btn" onClick={() => setIsExpanded(!isExpanded)} title={isExpanded ? "Thu nhỏ" : "Phóng to"}>
                    {isExpanded ? <Minimize2 size={16}/> : <Maximize2 size={16}/>}
                </button>
                <button className="control-btn close" onClick={onClose} title="Đóng">
                    <X size={18}/>
                </button>
            </div>
        </div>

        {/* --- 2. BODY (Inputs & Editor) --- */}
        <div className="email-body">
            {/* Dòng người nhận (Hiển thị dạng Tag đẹp mắt) */}
            <div className="field-row recipients-row">
                <span className="field-label">Đến:</span>
                <div className="tags-container">
                    {recipients.map((r, index) => (
                        <div key={index} className="recipient-tag">
                            <span className="tag-name">{r.name}</span>
                            <span className="tag-email">&lt;{r.email}&gt;</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Dòng tiêu đề */}
            <div className="field-row">
                <input 
                    type="text" 
                    className="subject-input" 
                    placeholder="Chủ đề" 
                    value={subject} 
                    onChange={e => setSubject(e.target.value)} 
                />
            </div>

            {/* Rich Text Editor */}
            <div className="editor-container">
                <ReactQuill 
                    theme="snow" 
                    value={content} 
                    onChange={setContent} 
                    modules={modules}
                    formats={formats}
                    placeholder="Soạn nội dung tại đây..."
                    className="custom-quill"
                />
            </div>
        </div>

        {/* --- 3. FOOTER --- */}
        <div className="email-footer">
            <div className="footer-left">
                <button className="btn-send" onClick={() => onSend(subject, content)}>
                   Gửi <Send size={14} style={{marginLeft: '6px'}}/> 
                </button>
                <button className="btn-icon" title="Đính kèm file">
                    <Paperclip size={18} />
                </button>
            </div>
            
            <div className="footer-right">
               <button className="btn-icon delete" onClick={onClose} title="Hủy bỏ">
                   <Trash2 size={16} />
               </button>
            </div>
        </div>
      </div>
    </div>
  );
};

// ==========================================
// 2. CVDetailModal (Giữ nguyên logic Confirm & Loading)
// ==========================================
const CVDetailModal = ({ cv, onClose, onStatusUpdate }) => {
  if (!cv) return null;

  const [isLoading, setIsLoading] = useState(false);
  const [confirmDialog, setConfirmDialog] = useState({
    show: false,
    type: '', // 'reject' | 'next'
    targetStatus: '',
    title: '',
    message: ''
  });

  const statusLabel = cv.application?.label;
  const fileUrl = cv.application?.CV_url;
  const candidateName = cv.candidate?.name;
  const avatarUrl = cv.candidate?.avata?.url;

  const getPreviewUrl = (url) => {
    if (!url) return null;
    return `https://docs.google.com/viewer?url=${encodeURIComponent(url)}&embedded=true`;
  };

  const getNextStepInfo = (status) => {
    switch (status) {
      case 'New':
      case 'Viewed': return { text: 'Duyệt hồ sơ', next: 'Shortlisted' };
      case 'Shortlisted': return { text: 'Mời phỏng vấn', next: 'Interviewing' };
      case 'Interviewing': return { text: 'Gửi Offer', next: 'Offered' };
      case 'Offered': return { text: 'Xác nhận thuê', next: 'Hired' };
      default: return { text: 'Hoàn tất', next: null };
    }
  };

  const nextStep = getNextStepInfo(statusLabel);
  const isFinalStatus = ['Rejected', 'Hired'].includes(statusLabel);

  const initiateAction = (type, targetStatus) => {
    if (type === 'reject') {
        setConfirmDialog({
            show: true,
            type: 'reject',
            targetStatus: 'Rejected',
            title: 'Từ chối ứng viên?',
            message: `Bạn có chắc chắn muốn từ chối hồ sơ của ${candidateName}?`
        });
    } else {
        setConfirmDialog({
            show: true,
            type: 'next',
            targetStatus: targetStatus,
            title: `Xác nhận: ${nextStep.text}?`,
            message: `Chuyển trạng thái hồ sơ sang "${targetStatus}"?`
        });
    }
  };

  const handleConfirmAction = async () => {
    setIsLoading(true);
    const success = await onStatusUpdate(cv.application._id, confirmDialog.targetStatus);
    setIsLoading(false);

    if (success) {
        setConfirmDialog({ ...confirmDialog, show: false });
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content-premium" onClick={e => e.stopPropagation()}>
        
        {/* Header */}
        <div className="modal-header">
          <div className="header-identity">
            <div className="avatar-large">
              {avatarUrl ? (
                <img src={avatarUrl} alt={candidateName} />
              ) : (
                <div className="avatar-placeholder-large"><User size={20} /></div>
              )}
            </div>
            <div className="identity-text">
              <h3 className="modal-title">{candidateName}</h3>
            </div>
          </div>
          
          <div className="header-actions">
            {fileUrl && (
              <a href={fileUrl} target="_blank" rel="noreferrer" className="btn-icon-text">
                <ExternalLink size={16} /> <span>Tải xuống bản gốc</span>
              </a>
            )}
            <button className="close-btn" onClick={onClose}><X size={24}/></button>
          </div>
        </div>

        {/* Body Viewer */}
        <div className="modal-body-viewer">
          {fileUrl ? (
            <iframe 
              src={getPreviewUrl(fileUrl)} 
              className="pdf-frame" 
              title="CV Viewer" 
              width="100%" 
              height="100%" 
              frameBorder="0"
            />
          ) : (
            <div className="empty-cv-state">
              <FileWarning size={64} strokeWidth={1} />
              <h4>Chưa có tài liệu CV</h4>
              <p>Ứng viên chưa tải lên tài liệu hoặc tệp tin bị lỗi.</p>
            </div>
          )}
        </div>
        
        {/* Footer Actions */}
        <div className="modal-footer">
          <div className="footer-right-group">
            <div className="status-badge-group">
              <span className="text-muted">Trạng thái:</span>
              <span className={`premium-badge ${statusLabel?.toLowerCase()}`}>{statusLabel}</span>
            </div>

            <div className="action-divider"></div>

            <div className="footer-actions">
              {!isFinalStatus && (
                <button 
                  className="btn btn-outline-danger" 
                  onClick={() => initiateAction('reject')}
                  disabled={isLoading}
                >
                  <Ban size={18} /> Từ chối
                </button>
              )}

              {nextStep.next && (
                <button 
                  className="btn btn-primary" 
                  onClick={() => initiateAction('next', nextStep.next)}
                  disabled={isLoading}
                >
                  <Check size={18} /> {nextStep.text}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* --- CONFIRMATION OVERLAY --- */}
        {confirmDialog.show && (
            <div className="confirmation-overlay" style={{
                position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
                background: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(2px)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, borderRadius: '12px'
            }}>
                <div className="confirmation-box animate-pop-in" style={{
                    background: 'white', padding: '25px', borderRadius: '12px',
                    boxShadow: '0 10px 30px rgba(0,0,0,0.15)', width: '320px', textAlign: 'center', border: '1px solid #eee'
                }}>
                    <div style={{marginBottom: '15px', display: 'inline-flex', padding: '12px', borderRadius: '50%', background: confirmDialog.type === 'reject' ? '#ffebeb' : '#e6fffa'}}>
                        {confirmDialog.type === 'reject' ? <AlertTriangle size={32} color="#dc3545"/> : <Check size={32} color="#00b894"/>}
                    </div>
                    <h4 style={{margin: '0 0 10px 0', color: '#333'}}>{confirmDialog.title}</h4>
                    <p style={{color: '#666', fontSize: '14px', marginBottom: '20px', lineHeight: '1.5'}}>{confirmDialog.message}</p>
                    
                    <div style={{display: 'flex', gap: '10px', justifyContent: 'center'}}>
                        <button 
                            className="btn btn-secondary btn-sm" 
                            onClick={() => setConfirmDialog({...confirmDialog, show: false})}
                            disabled={isLoading}
                        >
                            Hủy bỏ
                        </button>
                        <button 
                            className={`btn btn-sm ${confirmDialog.type === 'reject' ? 'btn-danger' : 'btn-primary'}`}
                            onClick={handleConfirmAction}
                            disabled={isLoading}
                        >
                            {isLoading ? 'Đang xử lý...' : 'Xác nhận'}
                        </button>
                    </div>
                </div>
            </div>
        )}

      </div>
    </div>
  );
};

// ==========================================
// 3. JobListView (Giữ nguyên)
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
                <p className="job-label">{job.label}</p>
              </div>
            </div>
            
            <div className="job-metrics">
              <div 
                className="metric-box new" 
                onClick={(e) => { e.stopPropagation(); onSelectJob(job, 'new'); }}
              >
                <span className={`metric-number ${(job.metric?.new || 0) === 0 ? 'zero' : ''}`}>
                  {job.metric?.new || 0}
                </span>
                <span className="metric-label">Mới</span>
              </div>

              <div 
                className="metric-box potential"
                onClick={(e) => { e.stopPropagation(); onSelectJob(job, 'pass'); }}
              >
                <span className={`metric-number ${(job.metric?.interviewing || 0) === 0 ? 'zero' : ''}`}>
                  {job.metric?.interviewing || 0}
                </span>
                <span className="metric-label">Phỏng vấn</span>
              </div>

              <div 
                className="metric-box interview"
                onClick={(e) => { e.stopPropagation(); onSelectJob(job, 'interviewing'); }}
              >
                 <span className={`metric-number ${(job.metric?.hired || job.metric?.interviewing || 0) === 0 ? 'zero' : ''}`}>
                  {job.metric?.hired || 0}
                </span>
                <span className="metric-label">Tuyển</span>
              </div>
            </div>
          </div>
        )) : <div className="no-data-msg">Không tìm thấy tin tuyển dụng nào.</div>}
      </div>
    </div>
  );
};


// ==========================================
// 4. CVManager (CẬP NHẬT LOGIC EMAIL)
// ==========================================
const CVManager = ({ job, initiallabel, onBack }) => {
  const [cvList, setCvList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState(initiallabel || 'all');
  const [selectedCv, setSelectedCv] = useState(null);

  // Modal Email state
  const [showOptionModal, setShowOptionModal] = useState(false);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [targetGroup, setTargetGroup] = useState(null);
  const [targetRecipients, setTargetRecipients] = useState([]);

  useEffect(() => {
    let isMounted = true;
    
    const fetchApplicants = async () => {
        setLoading(true);
        try {
            const response = await client.get(`api/application/applicantinfo?jobId=${job._id}`);
            if (response.data.success) {
              const applicantsInfo = response.data.data;
              if (isMounted) {
                setCvList(applicantsInfo);
            }
            }
        } catch (error) {
            console.error("Failed to fetch applicants", error);
        } finally {
            if (isMounted) setLoading(false);
        }
    };

    if (job) {
        fetchApplicants();
    }

    return () => { isMounted = false; };
  }, [job]);

  const stats = useMemo(() => {
    return {
      all: cvList.length,
      new: (cvList.filter(c => c.application.label === 'New')).length,
      viewed: cvList.filter(c => c.application.label === 'Viewed').length,
      shortlisted: cvList.filter(c => c.application.label === 'Shortlisted').length,
      interviewing: cvList.filter(c => c.application.label === 'Interviewing').length,
      offered: cvList.filter(c => c.application.label === 'Offered').length,
      hired: cvList.filter(c => c.application.label === 'Hired').length,
      rejected: cvList.filter(c => c.application.label === 'Rejected').length
    };
  }, [cvList]);

  const displayedCVs = useMemo(() => {
    if (activeTab === 'all') return cvList;
    return cvList.filter(cv => cv.application.label === activeTab);
  }, [cvList, activeTab]);

  const handleViewCv = (cv) => {
    setSelectedCv(cv);
    // Tự động mark 'Viewed' nếu là 'New'
    if(cv.application.label === 'New') {
        setCvList(prev => prev.map(p => p.application._id === cv.application._id ? {...p, application: {...p.application, label: 'Viewed'}} : p));
        client.patch(`api/application/label`, 
          { 
            applicationId: cv.application._id,
            jobId: job._id,
            label: 'Viewed'
          }
        ).then(res => {
            if(res.data.success) console.log("Auto-marked as Viewed");
        });
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN');
  };

  // --- HÀM MỚI: Xử lý khi click vào icon Email ---
  const handleSingleEmail = (cv) => {
    if (!cv.candidate) return;
    setTargetRecipients([cv.candidate]); // Gửi cho 1 người
    setTargetGroup(cv.application.label); // Để lấy template tương ứng
    setShowEmailModal(true);
  };

  const handleStatusUpdateApi = async (applicationId, newStatus) => {
    try {
        const response = await client.patch(`api/application/label`, {
            applicationId: applicationId,
            jobId: job._id,
            label: newStatus
        });

        if (response.data.success) {
            setCvList(prevList => 
                prevList.map(item => 
                    item.application._id === applicationId 
                    ? { ...item, application: { ...item.application, label: newStatus } }
                    : item
                )
            );
            if (selectedCv && selectedCv.application._id === applicationId) {
                setSelectedCv(prev => ({
                    ...prev,
                    application: { ...prev.application, label: newStatus }
                }));
            }
            return true;
        } else {
            alert("Không thể cập nhật: " + response.data.message);
            return false;
        }
    } catch (error) {
        console.error("API Update Error:", error);
        alert("Lỗi kết nối Server!");
        return false;
    }
  };

  const handleSendEmail = (subject, content) => {
      alert(`Đã gửi email thành công tới ${targetRecipients.length} ứng viên!`);
      setShowEmailModal(false);
  };

  return (
    <div className="animate-slide-in">
      
      {/* Header Row */}
      <div className="back-btn-row" style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
        <button onClick={onBack} className="btn-back">
          <ArrowLeft size={16} /> Quay lại danh sách tin
        </button>
      </div>
  
      <h2 style={{ marginBottom: "20px" }}>Ứng viên cho: {job.title}</h2>
  
      {/* Pipeline Tabs */}
      <div className="pipeline-tabs">
        {['all', 'New', 'Viewed', 'Shortlisted', 'Interviewing', 'Offered', 'Hired', 'Rejected'].map(tab => (
           <button 
             key={tab}
             className={`pipeline-tab ${activeTab === tab ? 'active' : ''} ${tab === 'Hired' ? 'dau' : ''} ${tab === 'Rejected' ? 'rot' : ''}`} 
             onClick={() => setActiveTab(tab)}
           >
             {tab === 'all' ? 'Tất cả' : tab} <span className="count-badge">{stats[tab.toLowerCase()] || 0}</span>
           </button>
        ))}
      </div>
  
      {/* Main Content */}
      {loading ? (
        <div className="loading-state">
          <div className="spinner"></div> Đang tải danh sách...
        </div>
      ) : (
        <div className="cv-list-container">
          {displayedCVs.length > 0 ? displayedCVs.map(cv => (
            <div 
              key={cv.id} 
              className={`cv-card-premium ${cv.application?.label === 'New' ? 'is-unread' : ''}`}
              onClick={() => handleViewCv(cv)}
            >
              <div className="card-left">
                  <div className="avatar-group">
                      <div className="avatar-box">
                          {cv.candidate?.avata ? (
                              <img src={cv.candidate.avata.url} alt="avatar" /> 
                          ) : (
                              <div className="avatar-placeholder">{(cv.candidate?.name || 'U').charAt(0)}</div>
                          )}
                          {cv.priority === 'high' && <div className="badge-flame"><Flame size={10} fill="white" /></div>}
                      </div>
                      
                      <div className="info-stack">
                          <div className="primary-row">
                              <span className="candidate-name">{cv.candidate?.name}</span>
                              <span className={`status-tag ${cv.application?.label?.toLowerCase()}`}>{cv.application?.label}</span>
                          </div>
                          
                          <div className="secondary-row">
                              <span className="meta-item email" title={cv.candidate?.email}>
                                  <Mail size={12} className="meta-icon"/> {cv.candidate?.email}
                              </span>
                              <span className="divider">•</span>
                              <span className="meta-item date">
                                  <Clock size={12} className="meta-icon"/> {formatDate(cv.application.appliedDate)}
                              </span>
                          </div>
                      </div>
                  </div>
              </div>
  
              <div className="card-right" onClick={(e) => e.stopPropagation()}>
                  <div className="action-group">
                      {/* --- NÚT EMAIL ĐƯỢC CẬP NHẬT --- */}
                      <button 
                        className="action-btn" 
                        title="Gửi Email"
                        onClick={(e) => {
                            e.stopPropagation(); // Ngăn mở modal CV
                            handleSingleEmail(cv); // Mở modal Email
                        }}
                      >
                        <Mail size={16} />
                      </button>

                      <button className="action-btn" title="Xem CV" onClick={() => handleViewCv(cv)}>
                        <FileText size={16} />
                      </button>
                  </div>
                  <div className="arrow-cue"></div>
              </div>
            </div>
          )) : (
            <div className="empty-state-premium">
                <div className="empty-icon-box"></div>
                <p>Chưa có ứng viên nào</p>
            </div>
          )}
        </div>
      )}
  
      {/* Modals */}
      {selectedCv && (
         <CVDetailModal 
           cv={selectedCv}
           onClose={() => setSelectedCv(null)}
           onStatusUpdate={handleStatusUpdateApi}
         />
      )}
  
      {showEmailModal && (
          <EmailComposeModal 
            recipients={targetRecipients}
            labelType={targetGroup}
            onClose={() => setShowEmailModal(false)}
            onSend={handleSendEmail}
          />
      )}
  
    </div>
  );
};

// ==========================================
// 5. Main Dashboard (Giữ nguyên)
// ==========================================
export default function EmployerDashboard({ jobPosts = [] }) { 
  const [selectedJob, setSelectedJob] = useState(null);
  const [initialTab, setInitialTab] = useState('all');

  const jobsData = jobPosts;

  const handleSelectJob = (job, labelFilter = 'all') => {
    setSelectedJob(job);
    setInitialTab(labelFilter); 
  };

  return (
    <div className="dashboard-container">
      {!selectedJob ? (
        <JobListView 
          jobs={jobsData} 
          onSelectJob={handleSelectJob} 
        />
      ) : (
        <CVManager 
          job={selectedJob} 
          initiallabel={initialTab}
          onBack={() => setSelectedJob(null)} 
        />
      )}
    </div>
  );
}