// src/components/JobDetailPanel.jsx
import React, { useEffect, useMemo, useState } from "react";
import {
  X,
  MapPin,
  DollarSign,
  Briefcase,
  Heart,
  Building2,
  ExternalLink,
  Clock,
  AlertTriangle // Icon báo cáo
} from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import "../styles/job-search.css";

import { useAuth } from "../context/AuthContext";
import {
  saveJob as apiSaveJob,
  removeSaveJob as apiRemoveSaveJob,
} from "../api/candidate";

// Import Modal Báo Cáo
import ReportJobModal from "./ReportJobModal";

// --- HELPERS ---

// 1. Format Lương
const formatSalary = (salary) => {
  if (!salary) return "Thỏa thuận";
  if (typeof salary === "string") return salary;

  // Xử lý object lương { minSalary, maxSalary, currency }
  if (typeof salary === "object") {
    const { minSalary, maxSalary, currency } = salary || {};
    
    // Nếu là VND hoặc không có currency -> Quy đổi ra "Triệu"
    if (!currency || currency === "VND") {
      const toMillion = (num) => {
        if (!num) return 0;
        // Chia 1 triệu, giữ tối đa 1 số thập phân
        return (num / 1000000).toLocaleString('vi-VN', { maximumFractionDigits: 1 });
      };

      if (minSalary && maxSalary) return `${toMillion(minSalary)} - ${toMillion(maxSalary)} triệu`;
      if (minSalary) return `Từ ${toMillion(minSalary)} triệu`;
      if (maxSalary) return `Tối đa ${toMillion(maxSalary)} triệu`;
    } 
    // Nếu là ngoại tệ -> Giữ nguyên số và đơn vị
    else {
      const formatNum = (num) => num.toLocaleString('en-US');
      if (minSalary && maxSalary) return `${formatNum(minSalary)} - ${formatNum(maxSalary)} ${currency}`;
      if (minSalary) return `Từ ${formatNum(minSalary)} ${currency}`;
      if (maxSalary) return `Tối đa ${formatNum(maxSalary)} ${currency}`;
    }
  }
  
  // Fallback nếu database lưu số thường (VND)
  if (typeof salary === "number") {
     return (salary / 1000000).toLocaleString('vi-VN', { maximumFractionDigits: 1 }) + " triệu";
  }

  return "Thỏa thuận";
};

// 2. Format Ngày
const formatDate = (dateString) => {
  if (!dateString) return "Không thời hạn";
  return new Date(dateString).toLocaleDateString("vi-VN");
};

// --- COMPONENT CHÍNH ---

export default function JobDetailPanel({ job, onClose }) {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [isSaved, setIsSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  
  // State điều khiển modal báo cáo
  const [showReportModal, setShowReportModal] = useState(false);

  const jobId = useMemo(() => String(job?._id || ""), [job?._id]);

  // --- LOGIC DỮ LIỆU --- //

  // Logo: Ưu tiên logo job -> logo url -> placeholder
  const companyInitial = (job?.company && job.company.charAt(0)) || "?";
  const placeholderLogo = `https://ui-avatars.com/api/?name=${encodeURIComponent(companyInitial)}&background=f1f5f9&color=1e293b`;
  const logoSrc = (job?.logo && job.logo.url) || job?.logoUrl || placeholderLogo;

  // Link đến trang Employer
  const companyIdentifier = job?.companyEmail || job?.company || "";
  const companyLink = `/employer/${encodeURIComponent(companyIdentifier)}`;

  // Địa chỉ đầy đủ
  const fullAddress = job?.detailedAddress 
    ? `${job.detailedAddress}, ${job.location}`
    : job?.location || "Chưa cập nhật";

  // Ngành nghề hiển thị
  const displayMajor = job?.major === 'Other' && job?.customMajor 
    ? job.customMajor 
    : job?.major;

  // --- EFFECTS --- //
  useEffect(() => {
    // Kiểm tra job này đã được user lưu chưa
    if (user && Array.isArray(user.listSaveJobs) && jobId) {
      setIsSaved(user.listSaveJobs.map(String).includes(jobId));
    } else {
      setIsSaved(false);
    }
  }, [user, jobId]);

  // --- HANDLERS --- //

  const handleApply = () => {
    if (!user) {
      alert("Bạn cần đăng nhập để ứng tuyển.");
      navigate("/login");
      return;
    }
    navigate(`/jobs/${job._id}/apply`);
  };

  const handleSaveJob = async () => {
    if (!user) {
        alert("Bạn cần đăng nhập để lưu tin.");
        return navigate("/login");
    }
    if (!jobId) return;

    try {
      setSaving(true);
      if (isSaved) {
        await apiRemoveSaveJob(user.email, jobId);
        setIsSaved(false);
      } else {
        await apiSaveJob(user.email, jobId);
        setIsSaved(true);
      }
    } catch (err) {
      console.error("Lỗi khi lưu job:", err);
    } finally {
      setSaving(false);
    }
  };

  const handleReportClick = () => {
    if (!user) {
        alert("Vui lòng đăng nhập để báo cáo.");
        return navigate("/login");
    }
    setShowReportModal(true);
  };

  if (!job) return null;

  return (
    <div className="job-detail">
      {/* ================= HEADER ================= */}
      <div className="job-detail-header relative">
        
        {/* Cụm nút hành động góc phải */}
        <div className="absolute top-5 right-5 flex gap-2">
            {/* Nút Báo cáo */}
            <button 
                type="button"
                onClick={handleReportClick}
                className="job-detail-icon-btn report"
                title="Báo cáo tin này"
            >
                <AlertTriangle size={18} />
            </button>

            {/* Nút Đóng */}
            <button
                type="button"
                onClick={onClose}
                className="job-detail-icon-btn close"
                aria-label="Đóng"
            >
                <X size={20} />
            </button>
        </div>

        <div className="job-detail-header-content">
          <div className="job-detail-logo-wrap">
            <img 
              src={logoSrc} 
              alt="logo" 
              className="job-detail-logo"
              onError={(e) => e.target.src = placeholderLogo}
            />
          </div>
          <div>
            <h2 className="job-detail-title">{job.title}</h2>
            
            <Link to={companyLink} className="job-detail-company-link">
              <Building2 size={14} />
              {job.company}
              <ExternalLink size={12} className="opacity-50 ml-1" />
            </Link>
          </div>
        </div>
      </div>

      {/* ================= BODY ================= */}
      <div className="job-detail-body">
        
        {/* 1. Grid thông tin tóm tắt */}
        <div className="job-detail-grid">
          {/* Mức lương */}
          <div className="job-detail-info-card">
            <span className="label">
              <DollarSign size={14} /> Mức lương
            </span>
            <span className="value highlight">
              {formatSalary(job.salary)}
            </span>
          </div>

          {/* Địa điểm */}
          <div className="job-detail-info-card">
            <span className="label">
              <MapPin size={14} /> Địa điểm
            </span>
            <span className="value truncate-text" title={fullAddress}>
              {job.location || "Toàn quốc"}
            </span>
          </div>

          {/* Kinh nghiệm */}
          <div className="job-detail-info-card">
            <span className="label">
              <Briefcase size={14} /> Kinh nghiệm
            </span>
            <span className="value">
              {job.experience ? `${job.experience} năm` : "Không yêu cầu"}
            </span>
          </div>

          {/* Hạn nộp */}
          <div className="job-detail-info-card">
            <span className="label">
              <Clock size={14} /> Hạn nộp
            </span>
            <span className="value">
              {formatDate(job.expireDay)}
            </span>
          </div>
        </div>

        {/* 2. Nội dung chi tiết (HTML) */}
        
        {/* Mô tả */}
        <section className="job-detail-section">
          <h3 className="job-detail-section-title">Mô tả công việc</h3>
          <div
            className="job-detail-html-content"
            dangerouslySetInnerHTML={{ 
                __html: job.description || "<p>Chưa cập nhật thông tin.</p>" 
            }}
          />
        </section>

        {/* Yêu cầu */}
        <section className="job-detail-section">
          <h3 className="job-detail-section-title">Yêu cầu ứng viên</h3>
          <div
            className="job-detail-html-content"
            dangerouslySetInnerHTML={{ 
              __html: job.requirement || "<p>Chưa cập nhật thông tin yêu cầu.</p>" 
            }}
          />
        </section>

        {/* Quyền lợi */}
        <section className="job-detail-section">
          <h3 className="job-detail-section-title">Quyền lợi & Chế độ</h3>
          <div
            className="job-detail-html-content"
            dangerouslySetInnerHTML={{ 
              __html: job.welfare || "<p>Chưa cập nhật thông tin quyền lợi.</p>" 
            }}
          />
        </section>

        <hr className="job-detail-divider" />

        {/* Tags */}
        <div className="job-detail-tags">
           {job.jobType && <span className="job-detail-tag">{job.jobType}</span>}
           {job.degree && <span className="job-detail-tag">{job.degree}</span>}
           {displayMajor && <span className="job-detail-tag">{displayMajor}</span>}
        </div>

        {/* Địa chỉ chi tiết (nếu có) */}
        {job.detailedAddress && (
           <p className="job-detail-detail-addr">
             <strong>Địa chỉ cụ thể:</strong> {job.detailedAddress}
           </p>
        )}

      </div>

      {/* ================= FOOTER ================= */}
      <div className="job-detail-footer">
        <button
          type="button"
          onClick={handleApply}
          className="job-detail-btn primary"
        >
          Ứng tuyển ngay
        </button>

        <button
          type="button"
          onClick={handleSaveJob}
          disabled={saving}
          className={`job-detail-btn save ${isSaved ? "saved" : ""}`}
        >
          <Heart size={18} fill={isSaved ? "currentColor" : "none"} />
          {saving ? "..." : (isSaved ? "Đã lưu" : "Lưu tin")}
        </button>
      </div>

      {/* ================= REPORT MODAL ================= */}
      {/* Hiển thị đè lên trên Panel hiện tại */}
      {showReportModal && (
        <ReportJobModal 
            job={job} 
            onClose={() => setShowReportModal(false)} 
        />
      )}
    </div>
  );
}