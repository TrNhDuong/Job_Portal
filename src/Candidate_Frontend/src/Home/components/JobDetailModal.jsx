// src/Home/components/JobDetailModal.jsx
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { 
  MapPin, 
  Briefcase, 
  DollarSign, 
  Clock, 
  X, 
  Heart, 
  Building2, 
  AlertTriangle,
  CheckCircle // Import icon check
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import ReportJobModal from "../../components/ReportJobModal"; 

export default function JobDetailModal({ job, onClose, onSave, isSaved }) {
  const { user } = useAuth();
  const safeJob = job || {};
  const jobId = safeJob._id;

  const [showReportModal, setShowReportModal] = useState(false);
  
  // 1. State kiểm tra đã ứng tuyển chưa
  const [isApplied, setIsApplied] = useState(false);

  // 2. Effect kiểm tra trạng thái ứng tuyển từ context user
  useEffect(() => {
    if (user && user.appliedJobs) {
      // appliedJobs có thể là mảng ID string hoặc mảng object (nếu populate)
      const hasApplied = user.appliedJobs.some(item => {
         const id = typeof item === 'string' ? item : (item._id || item.job);
         return String(id) === String(jobId);
      });
      setIsApplied(hasApplied);
    }
  }, [user, jobId]);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget && !showReportModal) {
        onClose();
    }
  };

  const handleSaveClick = () => {
    if (onSave) onSave(safeJob);
  };

  const handleReportClick = () => {
    if (!user) {
        alert("Vui lòng đăng nhập để báo cáo.");
        return; 
    }
    setShowReportModal(true);
  };

  // --- Helpers ---
  const companyInitial = (safeJob.company && safeJob.company.charAt(0)) || "?";
  const placeholderLogo = `https://ui-avatars.com/api/?name=${encodeURIComponent(companyInitial)}&background=f1f5f9&color=1e293b`;
  const logoSrc = safeJob.logo?.url || placeholderLogo;

  const formatSalary = (salary) => {
    if (!salary) return "Thỏa thuận";
    if (salary.minSalary !== undefined && salary.maxSalary !== undefined) {
      const currency = salary.currency || "VND";
      if (currency === "VND") {
        const min = (salary.minSalary / 1000000).toLocaleString('vi-VN');
        const max = (salary.maxSalary / 1000000).toLocaleString('vi-VN');
        return `${min} - ${max} triệu`;
      }
      return `${salary.minSalary.toLocaleString()} - ${salary.maxSalary.toLocaleString()} ${currency}`;
    }
    return "Thỏa thuận";
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Không thời hạn";
    return new Date(dateString).toLocaleDateString("vi-VN");
  };

  const fullAddress = safeJob.detailedAddress 
    ? `${safeJob.detailedAddress}, ${safeJob.location}`
    : safeJob.location || "Chưa cập nhật";

  const displayMajor = safeJob.major === 'Other' && safeJob.customMajor 
    ? safeJob.customMajor 
    : safeJob.major;

  return (
    <div className="home-modal-backdrop" onClick={handleBackdropClick}>
      <div className="home-job-modal" onClick={(e) => e.stopPropagation()}>
        
        <div className="home-modal-actions">
            <button className="home-modal-icon-btn report" onClick={handleReportClick} title="Báo cáo tin này">
                <AlertTriangle size={18} />
            </button>
            <button className="home-modal-icon-btn close" onClick={onClose}>
                <X size={20} />
            </button>
        </div>

        {/* --- HEADER --- */}
        <div className="home-job-modal-header">
          <div className="home-job-modal-logo-wrap">
            <img 
              src={logoSrc} 
              alt="Logo" 
              className="home-job-modal-logo"
              onError={(e) => e.target.src = placeholderLogo} 
            />
          </div>
          <div style={{flex: 1}}>
            <h2 className="home-job-modal-title">{safeJob.title || "Chưa có tiêu đề"}</h2>
            <div 
              className="home-job-modal-company"
              onClick={() => window.location.href = `/employer/${encodeURIComponent(safeJob.companyEmail)}`}
            >
              <Building2 size={14} />
              {safeJob.company || "Công ty ẩn danh"}
            </div>
          </div>
        </div>

        {/* --- GRID INFO --- */}
        <div className="home-job-modal-grid">
          <div className="home-job-modal-item">
            <div className="home-job-modal-icon"><DollarSign size={18}/></div>
            <div>
              <span className="home-job-modal-label">Mức lương</span>
              <span className="home-job-modal-value highlight">{formatSalary(safeJob.salary)}</span>
            </div>
          </div>
          <div className="home-job-modal-item">
            <div className="home-job-modal-icon"><MapPin size={18}/></div>
            <div>
              <span className="home-job-modal-label">Địa điểm</span>
              <span className="home-job-modal-value truncate-text" title={fullAddress}>
                {safeJob.location || "Toàn quốc"}
              </span>
            </div>
          </div>
          <div className="home-job-modal-item">
            <div className="home-job-modal-icon"><Briefcase size={18}/></div>
            <div>
              <span className="home-job-modal-label">Kinh nghiệm</span>
              <span className="home-job-modal-value">{safeJob.experience ? `${safeJob.experience} năm` : "Không yêu cầu"}</span>
            </div>
          </div>
          <div className="home-job-modal-item">
            <div className="home-job-modal-icon"><Clock size={18}/></div>
            <div>
              <span className="home-job-modal-label">Hạn nộp</span>
              <span className="home-job-modal-value">{formatDate(safeJob.expireDay)}</span>
            </div>
          </div>
        </div>

        {/* --- BODY --- */}
        <div className="home-job-modal-body">
          <div className="home-job-modal-section">
            <h3 className="home-job-modal-subtitle">Mô tả công việc</h3>
            <div className="home-job-modal-html" dangerouslySetInnerHTML={{ __html: safeJob.description || "<p>Chưa cập nhật.</p>" }} />
          </div>
          <div className="home-job-modal-section">
            <h3 className="home-job-modal-subtitle">Yêu cầu ứng viên</h3>
            <div className="home-job-modal-html" dangerouslySetInnerHTML={{ __html: safeJob.requirement || "<p>Chưa cập nhật.</p>" }} />
          </div>
          <div className="home-job-modal-section">
            <h3 className="home-job-modal-subtitle">Quyền lợi & Chế độ</h3>
            <div className="home-job-modal-html" dangerouslySetInnerHTML={{ __html: safeJob.welfare || "<p>Chưa cập nhật.</p>" }} />
          </div>
          
          <hr className="home-job-modal-divider" />

          <div className="home-job-modal-tags">
              {safeJob.jobType && <span className="home-job-modal-tag">{safeJob.jobType}</span>}
              {safeJob.degree && <span className="home-job-modal-tag">{safeJob.degree}</span>}
              {displayMajor && <span className="home-job-modal-tag">{displayMajor}</span>}
          </div>

          {safeJob.detailedAddress && (
             <p className="home-job-modal-detail-addr"><strong>Địa chỉ cụ thể:</strong> {safeJob.detailedAddress}</p>
          )}
        </div>

        {/* --- FOOTER --- */}
        <div className="home-job-modal-footer">
          {!user ? (
             <Link to="/login" className="home-job-modal-btn primary full">
               Đăng nhập để ứng tuyển
             </Link>
          ) : (
             <>
               <button 
                 className={`home-job-modal-btn ${isSaved ? "saved" : "ghost"}`}
                 onClick={handleSaveClick}
               >
                 <Heart size={18} fill={isSaved ? "currentColor" : "none"} />
                 {isSaved ? "Đã lưu" : "Lưu tin"}
               </button>

               {/* 3. Logic hiển thị nút */}
               {isApplied ? (
                 <button 
                    type="button" 
                    className="home-job-modal-btn applied" // Cần style thêm class này
                    disabled 
                    style={{ 
                        backgroundColor: '#dcfce7', 
                        color: '#166534', 
                        border: '1px solid #bbf7d0',
                        cursor: 'default',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px'
                    }}
                 >
                    <CheckCircle size={18} /> Đã ứng tuyển
                 </button>
               ) : (
                 <Link to={`/apply/${jobId}`} className="home-job-modal-btn primary">
                   Ứng tuyển ngay
                 </Link>
               )}
             </>
          )}
        </div>

      </div>

      {showReportModal && (
        <ReportJobModal 
            job={safeJob} 
            onClose={() => setShowReportModal(false)} 
        />
      )}

    </div>
  );
}