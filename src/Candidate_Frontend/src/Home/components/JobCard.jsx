import React from "react";
import { Heart, Sparkles } from "lucide-react"; // Import thêm icon Sparkles cho badge
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
    <article className="home-job-card" onClick={handleCardClick}>
      {/* --- TOP: Logo & Info --- */}
      <div className="home-job-card-top">
        <div className="home-job-card-logo-wrap">
          <img
            src={logoSrc}
            alt={job.company || "Logo công ty"}
            className="home-job-card-logo"
            onError={(e) => {
              e.target.src = placeholderLogo;
            }}
          />
        </div>

        <div className="home-job-card-info">
          {/* Title Row + Badge */}
          <div className="home-job-card-title-row">
             {/* Giả sử có trường isHot hoặc nổi bật, nếu không có thì bỏ qua */}
            {job.isHot && (
              <span className="home-job-card-badge">
                <Sparkles size={10} fill="currentColor" /> NỔI BẬT
              </span>
            )}
            <h3 className="home-job-card-title">{job.title || "Không có tiêu đề"}</h3>
          </div>

          {/* Company Name */}
          <button
            className="home-job-card-company"
            onClick={(e) => {
              e.stopPropagation();
              navigate(
                `/employer/${encodeURIComponent(job.companyEmail || job.company)}`
              );
            }}
          >
            {job.company || "Không rõ công ty"}
          </button>
        </div>
      </div>

      {/* --- BOTTOM: Salary, Location & Save Icon --- */}
      <div className="home-job-card-bottom">
        <div className="home-job-card-pills">
          <span className="home-job-pill">
            {formatSalary(job.salary)}
          </span>
          <span className="home-job-pill">
            {job.location || "Toàn quốc"}
          </span>
        </div>

        <button
          type="button"
          className={`home-job-card-save ${isSaved ? "saved" : ""}`}
          onClick={handleSaveClick}
          title={isSaved ? "Bỏ lưu" : "Lưu tin"}
        >
          <Heart fill={isSaved ? "currentColor" : "none"} />
        </button>
      </div>
    </article>
  );
}