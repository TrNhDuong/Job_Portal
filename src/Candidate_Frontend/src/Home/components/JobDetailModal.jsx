// src/Home/components/JobDetailModal.jsx
import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { MapPin, Briefcase, DollarSign, Clock, X, Heart, Building2 } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

export default function JobDetailModal({ job, onClose, onSave, isSaved }) {
  const { user } = useAuth();
  const safeJob = job || {};
  const jobId = safeJob._id;

  // 1. Khóa cuộn trang nền
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  const handleSaveClick = () => {
    if (onSave) onSave(safeJob);
  };

  // --- LOGIC XỬ LÝ DỮ LIỆU ---

  // Logo
  const companyInitial = (safeJob.company && safeJob.company.charAt(0)) || "?";
  const placeholderLogo = `https://ui-avatars.com/api/?name=${encodeURIComponent(companyInitial)}&background=f1f5f9&color=1e293b`;
  const logoSrc = safeJob.logo?.url || placeholderLogo;

  // Salary
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

  // Date
  const formatDate = (dateString) => {
    if (!dateString) return "Không thời hạn";
    return new Date(dateString).toLocaleDateString("vi-VN");
  };

  // Address
  const fullAddress = safeJob.detailedAddress 
    ? `${safeJob.detailedAddress}, ${safeJob.location}`
    : safeJob.location || "Chưa cập nhật";

  // Major
  const displayMajor = safeJob.major === 'Other' && safeJob.customMajor 
    ? safeJob.customMajor 
    : safeJob.major;

  return (
    <div className="home-modal-backdrop" onClick={handleBackdropClick}>
      <div className="home-job-modal" onClick={(e) => e.stopPropagation()}>
        
        {/* Close Button */}
        <button className="home-modal-close" onClick={onClose}>
          <X size={20} />
        </button>

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

        {/* --- GRID INFO (Đã bỏ Số lượng ứng tuyển) --- */}
        <div className="home-job-modal-grid">
          {/* Mức lương */}
          <div className="home-job-modal-item">
            <div className="home-job-modal-icon"><DollarSign size={18}/></div>
            <div>
              <span className="home-job-modal-label">Mức lương</span>
              <span className="home-job-modal-value highlight">{formatSalary(safeJob.salary)}</span>
            </div>
          </div>

          {/* Địa điểm */}
          <div className="home-job-modal-item">
            <div className="home-job-modal-icon"><MapPin size={18}/></div>
            <div>
              <span className="home-job-modal-label">Địa điểm</span>
              <span className="home-job-modal-value truncate-text" title={fullAddress}>
                {safeJob.location || "Toàn quốc"}
              </span>
            </div>
          </div>

          {/* Kinh nghiệm */}
          <div className="home-job-modal-item">
            <div className="home-job-modal-icon"><Briefcase size={18}/></div>
            <div>
              <span className="home-job-modal-label">Kinh nghiệm</span>
              <span className="home-job-modal-value">
                {safeJob.experience ? `${safeJob.experience} năm` : "Không yêu cầu"}
              </span>
            </div>
          </div>

          {/* Hạn nộp */}
          <div className="home-job-modal-item">
            <div className="home-job-modal-icon"><Clock size={18}/></div>
            <div>
              <span className="home-job-modal-label">Hạn nộp</span>
              <span className="home-job-modal-value">{formatDate(safeJob.expireDay)}</span>
            </div>
          </div>
        </div>

        {/* --- BODY (Scrollable) --- */}
        <div className="home-job-modal-body">
          
          {/* 1. Mô tả công việc */}
          <div className="home-job-modal-section">
            <h3 className="home-job-modal-subtitle">Mô tả công việc</h3>
            <div 
              className="home-job-modal-html"
              dangerouslySetInnerHTML={{ __html: safeJob.description || "<p>Chưa cập nhật thông tin.</p>" }} 
            />
          </div>

          {/* 2. Yêu cầu ứng viên (LUÔN HIỆN) */}
          <div className="home-job-modal-section">
            <h3 className="home-job-modal-subtitle">Yêu cầu ứng viên</h3>
            <div 
              className="home-job-modal-html"
              dangerouslySetInnerHTML={{ 
                __html: safeJob.requirement || "<p>Chưa cập nhật thông tin yêu cầu.</p>" 
              }} 
            />
          </div>

          {/* 3. Quyền lợi (LUÔN HIỆN) */}
          <div className="home-job-modal-section">
            <h3 className="home-job-modal-subtitle">Quyền lợi & Chế độ</h3>
            <div 
              className="home-job-modal-html"
              dangerouslySetInnerHTML={{ 
                __html: safeJob.welfare || "<p>Chưa cập nhật thông tin quyền lợi.</p>" 
              }} 
            />
          </div>
          
          <hr className="home-job-modal-divider" />

          {/* Tags bổ sung */}
          <div className="home-job-modal-tags">
              {safeJob.jobType && <span className="home-job-modal-tag">{safeJob.jobType}</span>}
              {safeJob.degree && <span className="home-job-modal-tag">{safeJob.degree}</span>}
              {displayMajor && <span className="home-job-modal-tag">{displayMajor}</span>}
          </div>

          {/* Hiển thị địa chỉ chi tiết ở cuối */}
          {safeJob.detailedAddress && (
             <p className="home-job-modal-detail-addr">
                <strong>Địa chỉ cụ thể:</strong> {safeJob.detailedAddress}
             </p>
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
               <Link to={`/apply/${jobId}`} className="home-job-modal-btn primary">
                 Ứng tuyển ngay
               </Link>
             </>
          )}
        </div>

      </div>
    </div>
  );
}