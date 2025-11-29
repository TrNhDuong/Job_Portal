// src/components/JobListings.jsx
import React from "react";
import useJobs from "../hooks/useJobs";
import { Bookmark, MapPin, DollarSign, Briefcase } from "lucide-react";
import "../styles/job-search.css";

// HÀM FORMAT LƯƠNG – giống các file khác
function formatSalary(salary) {
  if (!salary) return "Thỏa thuận";

  if (typeof salary === "string") return salary;

  if (typeof salary === "number") return salary.toString();

  if (typeof salary === "object") {
    const { minSalary, maxSalary, currency } = salary || {};
    const curr = currency || "";

    if (minSalary && maxSalary) {
      return `${minSalary} - ${maxSalary} ${curr}`.trim();
    }
    if (minSalary) {
      return `Từ ${minSalary} ${curr}`.trim();
    }
    if (maxSalary) {
      return `Tối đa ${maxSalary} ${curr}`.trim();
    }
  }

  return "Thỏa thuận";
}

// ----- CARD 1 JOB -----
function JobCard({ job, onSelectJob, isSelected }) {
  const companyInitial = (job.company && job.company.charAt(0)) || "?";
  const placeholderLogo = `https://ui-avatars.com/api/?name=${companyInitial}&background=random&color=fff`;

  const handleBookmark = (e) => {
    e.stopPropagation();
    console.log("Đã lưu job:", job._id);
  };

  return (
    <article
      className={`job-card ${isSelected ? "job-card--selected" : ""}`}
      onClick={() => onSelectJob(job)}
      role="button"
      tabIndex={0}
    >
      <div className="job-card-inner">
        <div className="job-card-logo-wrap">
          <img
            src={job.logoUrl || placeholderLogo}
            alt={job.company || "Company Logo"}
            className="job-card-logo"
          />
        </div>

        <div className="job-card-main">
          <h3 className="job-card-title">
            {job.title || "Không có tiêu đề"}
          </h3>
          <p className="job-card-company">
            {job.company || "Không rõ công ty"}
          </p>

          <div className="job-card-meta-row">
            <div className="job-card-meta">
              <MapPin className="job-card-meta-icon" />
              <span>{job.location || "N/A"}</span>
            </div>
            <div className="job-card-meta">
              <DollarSign className="job-card-meta-icon" />
              <span>{formatSalary(job.salary)}</span>
            </div>
          </div>

          <div className="job-card-pill-row">
            <span className="job-card-pill">
              {job.jobType || "N/A"}
            </span>
            <span className="job-card-pill job-card-pill--outline">
              {job.major || "N/A"}
            </span>
          </div>
        </div>

        <button
          type="button"
          onClick={handleBookmark}
          className="job-card-bookmark"
          title="Lưu công việc"
        >
          <Bookmark className="job-card-bookmark-icon" />
        </button>
      </div>
    </article>
  );
}

// ----- DANH SÁCH JOB -----
export default function JobListings({
  selectedJob,
  onSelectJob,
  filters,
  setFilters,
}) {
  const { jobs, loading, error, totalPages } = useJobs(filters);

  const filteredJobs = jobs.filter((job) => {
    if (!filters.keyword) return true;
    const kw = filters.keyword.toLowerCase();
    return (
      (job.title && job.title.toLowerCase().includes(kw)) ||
      (job.company && job.company.toLowerCase().includes(kw))
    );
  });

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setFilters({ ...filters, page: newPage });
    }
  };

  return (
    <div className="job-listings">
      {/* Header */}
      <div className="job-listings-header">
        <h2 className="job-listings-title">
          Việc làm
          <span className="job-listings-count">
            ({filteredJobs.length})
          </span>
        </h2>
      </div>

      {/* Danh sách */}
      <div className="job-listings-body">
        {loading && (
          <div className="job-listings-skeleton">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="job-skeleton-item" />
            ))}
          </div>
        )}

        {!loading && error && (
          <div className="job-listings-error">{error}</div>
        )}

        {!loading && !error && filteredJobs.length === 0 && (
          <div className="job-listings-empty">
            <Briefcase className="job-empty-icon" />
            <p className="job-empty-title">
              Không tìm thấy công việc phù hợp
            </p>
            <p className="job-empty-subtitle">
              Hãy thử thay đổi từ khóa hoặc bộ lọc tìm kiếm.
            </p>
          </div>
        )}

        {!loading && !error && filteredJobs.length > 0 && (
          <div className="job-list">
            {filteredJobs.map((job) => (
              <JobCard
                key={job._id}
                job={job}
                onSelectJob={onSelectJob}
                isSelected={selectedJob?._id === job._id}
              />
            ))}
          </div>
        )}
      </div>

      {/* Pagination */}
      <div className="job-listings-footer">
        <div className="job-pagination">
          <button
            type="button"
            onClick={() => handlePageChange(filters.page - 1)}
            disabled={filters.page <= 1}
            className="job-page-btn"
          >
            Trang trước
          </button>

          <span className="job-page-info">
            Trang {filters.page} / {totalPages || 1}
          </span>

          <button
            type="button"
            onClick={() => handlePageChange(filters.page + 1)}
            disabled={filters.page >= totalPages}
            className="job-page-btn"
          >
            Trang sau
          </button>
        </div>
      </div>
    </div>
  );
}
