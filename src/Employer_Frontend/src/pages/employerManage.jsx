
import React, { useState, useMemo, useEffect } from "react";
import "../styles/employerManage.css"
import client from "../api/client";
import { ArrowLeft, User, FileWarning, ExternalLink, Ban, Check, Mail, Flame, X, Send, FileText, Clock, AlertTriangle, SearchX, Briefcase } from 'lucide-react';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import {Paperclip, Minimize2, Maximize2, Trash2, MapPin } from 'lucide-react';
import toast from 'react-hot-toast';
import "../styles/emailModal.css"; 

// ==========================================
// 1. EmailComposeModal (GIỮ NGUYÊN)
// ==========================================
const EmailComposeModal = ({ recipients, labelType, onClose, onSend }) => {
  const [subject, setSubject] = useState("");
  const [content, setContent] = useState("");
  const [isExpanded, setIsExpanded] = useState(false);

  const modules = {
    toolbar: [
      [{ 'header': [1, 2, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{'list': 'ordered'}, {'list': 'bullet'}],
      ['link', 'clean']
    ],
  };

  const formats = ['header', 'bold', 'italic', 'underline', 'strike', 'list', 'bullet', 'link'];

  useEffect(() => {
    if (labelType === 'Hired') {
        setSubject("THÔNG BÁO TRÚNG TUYỂN & MỜI NHẬN VIỆC");
        setContent(`<p>Chào bạn,</p><p>Chúng tôi rất vui mừng thông báo bạn đã <strong>trúng tuyển</strong>...</p>`);
    } else if (labelType === 'Rejected') {
        setSubject("THƯ CẢM ƠN VÀ THÔNG BÁO KẾT QUẢ");
        setContent(`<p>Chào bạn,</p><p>Cảm ơn bạn đã tham gia phỏng vấn. Tuy nhiên...</p>`);
    } else if (labelType === 'Interviewing') {
        setSubject("THƯ MỜI PHỎNG VẤN");
        setContent(`<p>Chào bạn,</p><p>Chúng tôi muốn mời bạn tham gia <strong>phỏng vấn</strong>...</p>`);
    }
  }, [labelType]);

  return (
    <div className="email-modal-overlay" onClick={onClose}>
      <div 
        className={`email-modal-container ${isExpanded ? 'expanded' : ''} animate-pop`} 
        onClick={e => e.stopPropagation()}
      >
        <div className="email-header">
            <h3 className="email-title">{labelType ? `Soạn thư: ${labelType}` : 'Thư mới'}</h3>
            <div className="window-controls">
                <button className="control-btn" onClick={() => setIsExpanded(!isExpanded)}>
                    {isExpanded ? <Minimize2 size={16}/> : <Maximize2 size={16}/>}
                </button>
                <button className="control-btn close" onClick={onClose}><X size={18}/></button>
            </div>
        </div>
        <div className="email-body">
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
            <div className="field-row">
                <input type="text" className="subject-input" placeholder="Chủ đề" value={subject} onChange={e => setSubject(e.target.value)} />
            </div>
            <div className="editor-container">
                <ReactQuill theme="snow" value={content} onChange={setContent} modules={modules} formats={formats} placeholder="Soạn nội dung..." className="custom-quill"/>
            </div>
        </div>
        <div className="email-footer">
            <div className="footer-left">
                <button className="btn-send" onClick={() => onSend(subject, content)}>Gửi <Send size={14} style={{marginLeft: '6px'}}/></button>
                <button className="btn-icon"><Paperclip size={18} /></button>
            </div>
            <div className="footer-right">
               <button className="btn-icon delete" onClick={onClose}><Trash2 size={16} /></button>
            </div>
        </div>
      </div>
    </div>
  );
};

// ==========================================
// 2. CandidateDetailView (THAY THẾ MODAL CŨ)
// ==========================================
const CandidateDetailView = ({ cv, onBack, onStatusUpdate, onEmail }) => {
  if (!cv) return null;

  const [isLoading, setIsLoading] = useState(false);
  const [confirmDialog, setConfirmDialog] = useState({ show: false, type: '', targetStatus: '', title: '', message: '' });

  const statusLabel = cv.application?.label;
  const fileUrl = cv.application?.CV_url;
  const candidateName = cv.candidate?.name;
  const avatarUrl = cv.candidate?.avata?.url;

  // Logic xác định bước tiếp theo
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
            show: true, type: 'reject', targetStatus: 'Rejected',
            title: 'Từ chối ứng viên?', message: `Bạn có chắc chắn muốn từ chối hồ sơ của ${candidateName}?`
        });
    } else {
        setConfirmDialog({
            show: true, type: 'next', targetStatus: targetStatus,
            title: `Xác nhận: ${nextStep.text}?`, message: `Chuyển trạng thái hồ sơ sang "${targetStatus}"?`
        });
    }
  };

  const handleConfirmAction = async () => {
    setIsLoading(true);
    const success = await onStatusUpdate(cv.application._id, confirmDialog.targetStatus);
    setIsLoading(false);
    if (success) setConfirmDialog({ ...confirmDialog, show: false });
  };

  const getPreviewUrl = (url) => {
    if (!url) return null;
    return `https://docs.google.com/viewer?url=${encodeURIComponent(url)}&embedded=true`;
  };

  const downloadFile = async () => {
    if (!fileUrl) return;

    try {
      const res = await fetch(fileUrl);
      if (!res.ok) throw new Error("Download failed");

      const blob = await res.blob();

      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;

      // Optional: lấy tên file từ url nếu có
      a.download = fileUrl.split("/").pop() || "cv.pdf";

      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
      toast.error("Không thể tải CV");
    }
  };


  return (
    <div className="split-view-wrapper">
        {/* Header nút Back */}
        <div className="split-view-header">
             <button onClick={onBack} className="btn-back-split">
                <ArrowLeft size={18} /> Quay lại danh sách
            </button>
        </div>

        {/* Nội dung chia đôi */}
        <div className="split-container">
            {/* --- Cột TRÁI: Thông tin & Hành động --- */}
            <div className="info-panel">
                <div className="info-header">
                    <div className="avatar-large" style={{width: '80px', height: '80px', margin: '0 auto 15px'}}>
                        {avatarUrl ? <img src={avatarUrl} alt={candidateName} /> : <div className="avatar-placeholder-large"><User size={32} /></div>}
                    </div>
                    <h3 style={{fontSize: '18px', fontWeight: 'bold', marginBottom: '8px'}}>{candidateName}</h3>
                    <span className={`premium-badge ${statusLabel?.toLowerCase()}`}>{statusLabel}</span>
                </div>

                <div className="info-body">
                    <div className="detail-section-title">Thông tin liên hệ</div>
                    <div className="detail-row">
                        <Mail size={18} color="#666" style={{minWidth:'20px'}}/>
                        <span style={{wordBreak: 'break-all'}}>{cv.candidate?.email || 'Chưa cập nhật'}</span>
                    </div>
                    <div className="detail-row">
                        <Clock size={18} color="#666" style={{minWidth:'20px'}}/>
                        <span>Ngày nộp: {new Date(cv.application.appliedDate).toLocaleDateString('vi-VN')}</span>
                    </div>

                    <div style={{marginTop: '30px'}}>
                        <div className="detail-section-title">Tác vụ nhanh</div>
                        <button className="btn btn-outline-secondary w-100 mb-2" onClick={() => onEmail(cv)} style={{display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px'}}>
                            <Mail size={16}/> Gửi Email
                        </button>
                    </div>
                </div>

                <div className="info-footer">
                     {!isFinalStatus && (
                         <div style={{display: 'flex', flexDirection: 'column', gap: '10px'}}>
                             {nextStep.next && (
                                <button className="btn btn-primary w-100" onClick={() => initiateAction('next', nextStep.next)} disabled={isLoading}>
                                    <Check size={18} style={{marginRight: '8px'}}/> {nextStep.text}
                                </button>
                             )}
                             <button className="btn btn-outline-danger w-100" onClick={() => initiateAction('reject')} disabled={isLoading}>
                                <Ban size={18} style={{marginRight: '8px'}}/> Từ chối
                             </button>
                         </div>
                     )}
                     {isFinalStatus && <div className="text-center text-muted">Quy trình đã hoàn tất.</div>}
                </div>
            </div>

            {/* --- Cột PHẢI: Xem CV --- */}
            <div className="cv-panel">
                <div className="cv-toolbar">
                    <span style={{fontWeight: '600', color: '#333'}}>Tài liệu đính kèm</span>
                    {fileUrl && (
                      <button onClick={downloadFile} className="btn-download">
                        <ExternalLink size={14} /> Tải xuống bản gốc
                      </button>
                    )}
                </div>
                <div style={{flex: 1, position: 'relative', background: '#333'}}>
                     {fileUrl ? (
                        <iframe 
                          src={getPreviewUrl(fileUrl)} 
                          className="pdf-frame" 
                          title="CV Viewer" 
                        />
                      ) : (
                        <div className="empty-cv-state" style={{height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#fff'}}>
                          <FileWarning size={48} strokeWidth={1} />
                          <p style={{marginTop: '10px'}}>Không tìm thấy tài liệu CV</p>
                        </div>
                      )}
                </div>
            </div>
        </div>

        {/* --- Popup Xác nhận --- */}
        {confirmDialog.show && (
            <div className="confirmation-overlay" style={{position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999}}>
                 <div className="confirmation-box animate-pop-in" style={{background: 'white', padding: '25px', borderRadius: '12px', boxShadow: '0 10px 30px rgba(0,0,0,0.2)', width: '320px', textAlign: 'center'}}>
                    <div style={{marginBottom: '15px', display: 'inline-flex', padding: '12px', borderRadius: '50%', background: confirmDialog.type === 'reject' ? '#ffebeb' : '#e6fffa'}}>
                        {confirmDialog.type === 'reject' ? <AlertTriangle size={32} color="#dc3545"/> : <Check size={32} color="#00b894"/>}
                    </div>
                    <h4 style={{margin: '0 0 10px 0', color: '#333'}}>{confirmDialog.title}</h4>
                    <p style={{color: '#666', fontSize: '14px', marginBottom: '20px'}}>{confirmDialog.message}</p>
                    <div style={{display: 'flex', gap: '10px', justifyContent: 'center'}}>
                        <button className="btn btn-secondary btn-sm" onClick={() => setConfirmDialog({...confirmDialog, show: false})} disabled={isLoading}>Hủy bỏ</button>
                        <button className={`btn btn-sm ${confirmDialog.type === 'reject' ? 'btn-danger' : 'btn-primary'}`} onClick={handleConfirmAction} disabled={isLoading}>
                            {isLoading ? 'Đang xử lý...' : 'Xác nhận'}
                        </button>
                    </div>
                </div>
            </div>
        )}
    </div>
  );
};

// ==========================================
// 3. JobListView (GIỮ NGUYÊN)
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
            type="text" placeholder="Tìm tin tuyển dụng..." className="filter-input"
            value={filterText} onChange={e => setFilterText(e.target.value)}
          />
          <div className="select-wrapper">
            <MapPin size={18} className="select-icon-overlay" fill="#9ca3af" color="#ffffff"/> {/* Icon nằm đè lên */}
            <select className="filter-select" onChange={e => setFilterLoc(e.target.value)}>
              <option value="">Tất cả địa điểm</option>
              {locations.map(loc => <option key={loc} value={loc}>{loc}</option>)}
            </select>
          </div>
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
                <p className="job-label">{}</p>
              </div>
            </div>
            
            <div className="job-metrics">
              <div className="metric-box new" onClick={(e) => { e.stopPropagation(); onSelectJob(job, 'new'); }}>
                <span className={`metric-number ${(job.metric?.new || 0) === 0 ? 'zero' : ''}`}>{job.metric?.new || 0}</span>
                <span className="metric-label">Mới</span>
              </div>
              <div className="metric-box potential" onClick={(e) => { e.stopPropagation(); onSelectJob(job, 'pass'); }}>
                <span className={`metric-number ${(job.metric?.interviewing || 0) === 0 ? 'zero' : ''}`}>{job.metric?.interviewing || 0}</span>
                <span className="metric-label">Phỏng vấn</span>
              </div>
              <div className="metric-box interview" onClick={(e) => { e.stopPropagation(); onSelectJob(job, 'interviewing'); }}>
                  <span className={`metric-number ${(job.metric?.hired || job.metric?.interviewing || 0) === 0 ? 'zero' : ''}`}>{job.metric?.hired || 0}</span>
                <span className="metric-label">Tuyển</span>
              </div>
            </div>
          </div>
        )) : (
              <div className="empty-state-dashed">
                  <div className="empty-icon-wrapper-dashed">
                      <Briefcase size={25} />
                  </div>
                  <p>Không tìm thấy tin tuyển dụng nào phù hợp.</p>
              </div>
            )}
      </div>
    </div>
  );
};

// ==========================================
// 4. CVManager (LOGIC CHÍNH ĐÃ CẬP NHẬT)
// ==========================================
const CVManager = ({ job, initiallabel, onBack }) => {
  const [cvList, setCvList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState(initiallabel || 'all');
  
  // State quản lý View: Nếu selectedCv có data -> Render Detail View
  const [selectedCv, setSelectedCv] = useState(null); 

  // Modal Email
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [targetGroup, setTargetGroup] = useState(null);
  const [targetRecipients, setTargetRecipients] = useState([]);

  useEffect(() => {
    let isMounted = true;
    const fetchApplicants = async () => {
        setLoading(true);
        try {
            const response = await client.get(`api/application/applicantinfo?jobId=${job._id}`);
            if (response.data.success && isMounted) setCvList(response.data.data);
        } catch (error) { console.error("Failed to fetch", error); toast.error("Không thể tải danh sách ứng viên"); } 
        finally { if (isMounted) setLoading(false); }
    };
    if (job) fetchApplicants();
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

  // Handle click vào CV -> Chuyển sang Detail View
  const handleViewCv = (cv) => {
    setSelectedCv(cv); 
    // Auto mark viewed
    if(cv.application.label === 'New') {
        const updatedCv = {...cv, application: {...cv.application, label: 'Viewed'}};
        setSelectedCv(updatedCv); // Update UI Detail ngay lập tức
        setCvList(prev => prev.map(p => p.application._id === cv.application._id ? updatedCv : p)); // Update List
        
        client.patch(`api/application/label`, { 
            applicationId: cv.application._id, jobId: job._id, label: 'Viewed' 
        }).catch(err => console.log("Auto-view error", err));
    }
  };

  const handleSingleEmail = (cv) => {
    if (!cv.candidate) return;
    setTargetRecipients([cv.candidate]);
    setTargetGroup(cv.application.label);
    setShowEmailModal(true);
  };

  const handleStatusUpdateApi = async (applicationId, newStatus) => {
    try {
        const response = await client.patch(`api/application/label`, { applicationId, jobId: job._id, label: newStatus });
        if (response.data.success) {
            // Update List
            setCvList(prevList => prevList.map(item => item.application._id === applicationId ? { ...item, application: { ...item.application, label: newStatus } } : item));
            // Update Selected View
            if (selectedCv && selectedCv.application._id === applicationId) {
                setSelectedCv(prev => ({ ...prev, application: { ...prev.application, label: newStatus } }));
            }
            toast.success(`Đã cập nhật trạng thái: ${newStatus}`);
            return true;
        } else {
            toast.error("Cập nhật thất bại");
            return false;
        }
    } catch (error) { console.error("API Error", error); toast.error("Lỗi kết nối server"); return false; }
  };

  const handleSendEmail = (subject, content) => {
      toast.success(`Đã gửi email thành công tới ${targetRecipients.length} ứng viên!`);
      setShowEmailModal(false);
  };

  // --- RENDER CONDITION: SPLIT VIEW vs LIST VIEW ---

  // 1. Nếu đang chọn CV => Render CandidateDetailView
  if (selectedCv) {
      return (
          <>
            <CandidateDetailView 
                cv={selectedCv}
                onBack={() => setSelectedCv(null)} // Quay lại list
                onStatusUpdate={handleStatusUpdateApi}
                onEmail={handleSingleEmail}
            />
            {/* Modal Email render đè lên Detail View nếu cần */}
            {showEmailModal && (
                <EmailComposeModal 
                  recipients={targetRecipients} labelType={targetGroup}
                  onClose={() => setShowEmailModal(false)} onSend={handleSendEmail}
                />
            )}
          </>
      );
  }

  // 2. Nếu không chọn CV => Render List View
  return (
    <div className="animate-slide-in">
      <div className="back-btn-row" style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
        <button onClick={onBack} className="btn-back">
          <ArrowLeft size={16} /> Quay lại danh sách tin
        </button>
      </div>
  
      <h2 style={{ marginBottom: "20px" }}>Ứng viên cho: {job.title}</h2>
  
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
  
      {loading ? (
        <div className="loading-state"><div className="spinner"></div> Đang tải danh sách...</div>
      ) : (
        <div className="cv-list-container">
          {displayedCVs.length > 0 ? displayedCVs.map(cv => (
            <div 
              key={cv.application._id} 
              className={`cv-card-premium ${cv.application?.label === 'New' ? 'is-unread' : ''}`}
              onClick={() => handleViewCv(cv)}
            >
              <div className="card-left">
                  <div className="avatar-group">
                      <div className="avatar-box">
                          {cv.candidate?.avata ? <img src={cv.candidate.avata.url} alt="avt" /> : <div className="avatar-placeholder">{(cv.candidate?.name || 'U').charAt(0)}</div>}
                          {cv.priority === 'high' && <div className="badge-flame"><Flame size={10} fill="white" /></div>}
                      </div>
                      <div className="info-stack">
                          <div className="primary-row">
                              <span className="candidate-name">{cv.candidate?.name}</span>
                              <span className={`status-tag ${cv.application?.label?.toLowerCase()}`}>{cv.application?.label}</span>
                          </div>
                          <div className="secondary-row">
                             <span className="meta-item"><Mail size={12} className="meta-icon"/> {cv.candidate?.email}</span>
                             <span className="divider">•</span>
                             <span className="meta-item">{new Date(cv.application.appliedDate).toLocaleDateString('vi-VN')}</span>
                          </div>
                      </div>
                  </div>
              </div>
              <div className="card-right">
                   <button className="action-btn" onClick={(e) => { e.stopPropagation(); handleSingleEmail(cv); }}>
                      <Mail size={16} />
                   </button>
                   <button className="action-btn" title="Xem CV"><FileText size={16} /></button>
              </div>
            </div>
          )) : (
                <div className="empty-state-dashed">
                    <div className="empty-icon-wrapper-dashed">
                        <SearchX size={25} />
                    </div>
                    <p>Chưa có ứng viên nào trong danh sách này.</p>
                </div>
              )}
        </div>
      )}

      {showEmailModal && (
          <EmailComposeModal 
            recipients={targetRecipients} labelType={targetGroup}
            onClose={() => setShowEmailModal(false)} onSend={handleSendEmail}
          />
      )}
    </div>
  );
};

// ==========================================
// 5. Main Export (GIỮ NGUYÊN)
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
        <JobListView jobs={jobsData} onSelectJob={handleSelectJob} />
      ) : (
        <CVManager job={selectedJob} initiallabel={initialTab} onBack={() => setSelectedJob(null)} />
      )}
    </div>
  );
}
