import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { MapPin, Briefcase, DollarSign, Clock, X, Heart, Building2 } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

export default function JobDetailModal({ job, onClose, onSave, isSaved }) {
  const { user } = useAuth();
  const safeJob = job || {};
  const jobId = safeJob._id;

  // Khóa cuộn trang nền khi Modal mở (UX tốt hơn)
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

  // Logic Logo & Salary
  const companyInitial = (safeJob.company && safeJob.company.charAt(0)) || "?";
  const placeholderLogo = `https://ui-avatars.com/api/?name=${companyInitial}&background=f1f5f9&color=1e293b`;
  const logoSrc = safeJob.logo?.url || placeholderLogo;

  const formatSalary = (salary) => {
    if (!salary) return "Thỏa thuận";
    if (typeof salary === "string") return salary;
    if (salary.minSalary !== undefined && salary.maxSalary !== undefined) {
      const currency = salary.currency || "VND";
      if (currency === "VND") {
        const min = (salary.minSalary / 1000000).toLocaleString('vi-VN');
        const max = (salary.maxSalary / 1000000).toLocaleString('vi-VN');
        return `${min} - ${max} triệu`;
      }
      return `${salary.minSalary} - ${salary.maxSalary} ${currency}`;
    }
    return "Thỏa thuận";
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Không thời hạn";
    return new Date(dateString).toLocaleDateString("vi-VN");
  };

  return (
    <div className="home-modal-backdrop" onClick={handleBackdropClick}>
      {/* Animation xuất hiện từ dưới lên nhẹ nhàng */}
      <div className="home-job-modal" onClick={(e) => e.stopPropagation()}>
        
        <button className="home-modal-close" onClick={onClose}>
          <X size={20} />
        </button>

        {/* HEADER */}
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

        {/* GRID INFO */}
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
              <span className="home-job-modal-value">{safeJob.location || "Toàn quốc"}</span>
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

        {/* BODY (Scrollable) */}
        <div className="home-job-modal-body">
          <h3 className="home-job-modal-subtitle">Mô tả công việc</h3>
          {/* Hiển thị HTML an toàn */}
          <div 
            className="home-job-modal-html"
            dangerouslySetInnerHTML={{ __html: safeJob.description || "<p>Chưa có mô tả chi tiết.</p>" }} 
          />
          
          {/* Tags bổ sung */}
          <div className="home-job-modal-tags">
             {safeJob.jobType && <span className="home-job-modal-tag">{safeJob.jobType}</span>}
             {safeJob.degree && <span className="home-job-modal-tag">{safeJob.degree}</span>}
             {safeJob.major && <span className="home-job-modal-tag">{safeJob.major}</span>}
          </div>
        </div>

        {/* FOOTER (Fixed at bottom of card) */}
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