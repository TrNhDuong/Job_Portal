// src/home/components/JobCard.jsx
import { MapPin, DollarSign } from "lucide-react";
import { Link } from "react-router-dom";

export default function JobCard({ job, onViewDetails, onApply, onSave, isSaved }) {
  const handleCardClick = () => {
    if (onViewDetails) onViewDetails(job);
  };

  const handleApplyClick = (e) => {
    e.stopPropagation();
    if (onApply) {
      onApply(job);
    } else if (onViewDetails) {
      // Tạm thời: nếu chưa truyền onApply, dùng view details
      onViewDetails(job);
    }
  };

  const handleSaveClick = (e) => {
    e.stopPropagation();
    if (onSave) {
      onSave(job);
    }
    // sau này có thể thêm toast "Đã lưu job"
  };

  const companyInitial = (job.company && job.company.charAt(0)) || "?";
  const placeholderLogo = `https://ui-avatars.com/api/?name=${companyInitial}&background=random&color=fff`;

  const formatSalary = (salaryData) => {
    if (!salaryData) return "Thỏa thuận";

    if (typeof salaryData === "string") return salaryData;

    if (salaryData.minSalary && salaryData.maxSalary) {
      const min = salaryData.minSalary / 1_000_000 + "M";
      const max = salaryData.maxSalary / 1_000_000 + "M";
      return `${min} - ${max} ${salaryData.currency || "VND"}`;
    }

    return "Thỏa thuận";
  };

  return (
    <article className="home-job-card" onClick={handleCardClick}>
      <div className="home-job-card-header">
        <div className="home-job-card-logo-wrap">
          <img
            src={job.logoUrl || placeholderLogo}
            alt={job.company || "Logo công ty"}
            className="home-job-card-logo"
          />
        </div>
        <div className="home-job-card-main">
          <h3 className="home-job-card-title">
            {job.title || "Không có tiêu đề"}
          </h3>
          <p className="home-job-card-company">
            {job.company || "Không rõ công ty"}
          </p>

          <div className="home-job-card-tags">
            {job.jobType && (
              <span className="home-job-card-tag">
                {job.jobType}
              </span>
            )}
            {job.level && (
              <span className="home-job-card-tag home-job-card-tag-outline">
                {job.level}
              </span>
            )}
            {job.experience && (
              <span className="home-job-card-tag home-job-card-tag-outline">
                {job.experience}
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="home-job-card-body">
        <div className="home-job-card-salary">
          <DollarSign className="home-job-card-salary-icon" />
          <span>{formatSalary(job.salary)}</span>
        </div>
        <div className="home-job-card-location">
          <MapPin className="home-job-card-location-icon" />
          <span>{job.location || "N/A"}</span>
        </div>
      </div>

      <div className="home-job-card-footer">
        <button
          type="button"
          className="home-job-card-btn primary"
          onClick={handleApplyClick}
        >
          Ứng tuyển ngay
        </button>
        <button
          type="button"
          className={`home-job-card-btn ${isSaved ? "saved" : "ghost"}`}
          onClick={handleSaveClick}
        >
          {isSaved ? "Đã lưu" : "Lưu job"}
        </button>
      </div>
    </article>
  );
}
