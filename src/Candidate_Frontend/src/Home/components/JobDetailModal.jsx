// src/home/components/JobDetailModal.jsx
import React from "react";
import { Link } from "react-router-dom";
import { MapPin, Briefcase, DollarSign, Clock, X, Heart } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

// Format lương
function formatSalary(salary) {
  if (!salary) return "Thỏa thuận";

  if (typeof salary === "string") return salary;
  if (typeof salary === "number") return salary.toString();

  if (typeof salary === "object") {
    const { minSalary, maxSalary, currency } = salary || {};
    const curr = currency || "";
    if (minSalary && maxSalary) return `${minSalary} - ${maxSalary} ${curr}`.trim();
    if (minSalary) return `Từ ${minSalary} ${curr}`.trim();
    if (maxSalary) return `Tối đa ${maxSalary} ${curr}`.trim();
  }
  return "Thỏa thuận";
}

export default function JobDetailModal({ job, onClose, onSave, isSaved }) {
  const { user } = useAuth();

  const safeJob = job || {};
  const jobId = safeJob._id;

  const jobDetails = {
    title: safeJob.title || "Không có tiêu đề",
    company: safeJob.company || "Không rõ công ty",
    location: safeJob.location || "N/A",
    salary: formatSalary(safeJob.salary),
    about: safeJob.description || "Mô tả công việc không có sẵn.",
    state: safeJob.state || "Closed",
    level: "Senior",
    posted: "2 days ago",
    requirements: [
      "5+ years of frontend experience",
      "Strong knowledge of React and TypeScript",
      "Experience with modern CSS and Tailwind",
      "Excellent communication skills",
    ],
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  const handleSaveClick = () => {
    if (onSave) onSave(safeJob); // dùng chung logic với JobCard
  };

  return (
    <div className="home-modal-backdrop" onClick={handleBackdropClick}>
      <div className="home-job-modal" onClick={(e) => e.stopPropagation()}>
        {/* Nút đóng */}
        <button className="home-modal-close" onClick={onClose}>
          <X className="home-modal-close-icon" />
        </button>

        {/* HEADER */}
        <header className="home-job-modal-header">
          <div className="home-job-modal-header-main">
            <h1 className="home-job-modal-title">{jobDetails.title}</h1>
            <button
              className="home-job-modal-company-link"
              onClick={() => window.location.href = `/company/${safeJob.companyId || safeJob.company}`}
            >
              {jobDetails.company}
            </button>
          </div>
        </header>

        {/* GRID INFO */}
        <section className="home-job-modal-grid">
          <div className="home-job-modal-grid-item">
            <MapPin className="home-job-modal-grid-icon" />
            <div>
              <p className="home-job-modal-grid-label">Địa điểm</p>
              <p className="home-job-modal-grid-value">
                {jobDetails.location}
              </p>
            </div>
          </div>

          <div className="home-job-modal-grid-item">
            <Briefcase className="home-job-modal-grid-icon" />
            <div>
              <p className="home-job-modal-grid-label">Cấp bậc</p>
              <p className="home-job-modal-grid-value">
                {jobDetails.level}
              </p>
            </div>
          </div>

          <div className="home-job-modal-grid-item">
            <DollarSign className="home-job-modal-grid-icon" />
            <div>
              <p className="home-job-modal-grid-label">Mức lương</p>
              <p className="home-job-modal-grid-value">
                {jobDetails.salary}
              </p>
            </div>
          </div>

          <div className="home-job-modal-grid-item">
            <Clock className="home-job-modal-grid-icon" />
            <div>
              <p className="home-job-modal-grid-label">Ngày đăng</p>
              <p className="home-job-modal-grid-value">
                {jobDetails.posted}
              </p>
            </div>
          </div>
        </section>

        {/* BODY */}
        <section className="home-job-modal-body">
          <h3 className="home-job-modal-subtitle">Mô tả công việc</h3>
          <p className="home-job-modal-about">
            {jobDetails.about}
          </p>

          <h3 className="home-job-modal-subtitle home-job-modal-subtitle-gap">
            Yêu cầu (giả lập)
          </h3>
          <ul className="home-job-modal-req-list">
            {jobDetails.requirements.map((req, i) => (
              <li key={i}>{req}</li>
            ))}
          </ul>
        </section>

        {/* FOOTER */}
        <footer className="home-job-modal-footer">
          {!user && (
            <Link to="/login" className="home-job-modal-btn primary">
              Đăng nhập để ứng tuyển
            </Link>
          )}

          {user && jobId && (
            <>
              <Link
                to={`/apply/${jobId}`}
                className="home-job-modal-btn primary"
              >
                Ứng tuyển ngay
              </Link>

              <button
                type="button"
                onClick={handleSaveClick}
                className={`home-job-modal-btn ${
                  isSaved ? "saved" : "ghost"
                }`}
              >
                <Heart className="home-job-modal-btn-icon" />
                {isSaved ? "Đã lưu job" : "Lưu job"}
              </button>
            </>
          )}
        </footer>
      </div>
    </div>
  );
}
