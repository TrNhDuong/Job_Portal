import React from "react";
import { Heart, Sparkles, MapPin, DollarSign } from "lucide-react"; // Import thêm icon Sparkles cho badge
import { useNavigate } from "react-router-dom";

export default function JobCard({ job, onViewDetails, onSave, isSaved }) {
  const navigate = useNavigate();

  const handleCardClick = () => {
    if (onViewDetails) onViewDetails(job);
  };

  const handleSaveClick = (e) => {
    e.stopPropagation();
    if (onSave) {
      onSave(job);
    }
  };

  // Logic hiển thị logo
  const companyInitial = (job.company && job.company.charAt(0)) || "?";
  const placeholderLogo = `https://ui-avatars.com/api/?name=${companyInitial}&background=random&color=fff`;
  const logoSrc = job.logoUrl || placeholderLogo;

  // Logic format lương giống ảnh mẫu (triệu)
  const formatSalary = (salaryData) => {
    if (!salaryData) return "Thỏa thuận";
    if (typeof salaryData === "string") return salaryData;
    
    if (salaryData.minSalary || salaryData.maxSalary) {
      const min = salaryData.minSalary ? salaryData.minSalary / 1000000 : null;
      const max = salaryData.maxSalary ? salaryData.maxSalary / 1000000 : null;
      const currency = salaryData.currency === "USD" ? "$" : "triệu";

      if (min && max) return `${min} - ${max} ${currency}`;
      if (min) return `Từ ${min} ${currency}`;
      if (max) return `Đến ${max} ${currency}`;
    }
    return "Thỏa thuận";
  };

return (
    <article className="job-card-pro-style" onClick={handleCardClick}>
      <div className="job-card-left-content">
        <div className="job-card-logo-box">
          <img 
            src={logoSrc} 
            alt={job.company} 
            onError={(e) => { e.target.src = placeholderLogo; }}
          />
        </div>
        <div className="job-card-info-box">
          <div className="job-title-row">
            {job.isHot && (
              <span className="job-badge-hot">
                <Sparkles size={10} fill="currentColor" /> HOT
              </span>
            )}
            <h3 className="job-pro-title" title={job.title}>{job.title || "Không tiêu đề"}</h3>
          </div>
          
          <button
            className="job-pro-company-link"
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/employer/${encodeURIComponent(job.companyEmail || job.company)}`);
            }}
          >
            {job.company || "Không rõ công ty"}
          </button>

          <div className="job-pro-meta">
            <span className="meta-salary"><DollarSign size={14} /> {formatSalary(job.salary)}</span>
            <span className="meta-location"><MapPin size={14} /> {job.location || "Toàn quốc"}</span>
          </div>
        </div>
      </div>

      <button
        type="button"
        className={`job-pro-save-btn ${isSaved ? "active" : ""}`}
        onClick={handleSaveClick}
      >
        <Heart size={20} fill={isSaved ? "currentColor" : "none"} />
      </button>
    </article>
  );
}