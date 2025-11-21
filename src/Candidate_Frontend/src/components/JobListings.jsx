// src/components/JobListings.jsx
import React from "react";
import useJobs from "../hooks/useJobs";
import { Bookmark, MapPin, DollarSign, Briefcase } from "lucide-react";

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

// Component con (Render UI)
function JobCard({ job, onSelectJob, isSelected }) {
  // Sửa lỗi 'charAt': Thêm kiểm tra an toàn
  const companyInitial = (job.company && job.company.charAt(0)) || "?";
  const placeholderLogo = `https://ui-avatars.com/api/?name=${companyInitial}&background=random&color=fff`;

  const handleBookmark = (e) => {
    e.stopPropagation();
    console.log("Đã lưu job:", job._id);
  };

  return (
    // Thẻ 'button' cha
    <button
      onClick={() => onSelectJob(job)}
      className={`w-full text-left p-4 rounded-lg border transition-all ${
        isSelected
          ? "bg-accent/10 border-accent" // (Style khi được chọn)
          : "bg-card border-border hover:border-accent/50" // (Style mặc định)
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <img
          src={job.logoUrl || placeholderLogo}
          alt={job.company || "Company Logo"}
          className="w-10 h-10 rounded-md object-contain bg-gray-100"
        />
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-foreground truncate">
            {job.title || "Không có tiêu đề"}
          </h3>
          <p className="text-sm text-muted-foreground">
            {job.company || "Không rõ công ty"}
          </p>
          <div className="flex items-center gap-3 mt-3 text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <MapPin className="h-3 w-3" />
              {job.location || "N/A"}
            </div>
            <div className="flex items-center gap-1">
              <DollarSign className="h-3 w-3" />
              {formatSalary(job.salary)}
            </div>
          </div>
          <div className="flex gap-2 mt-3 flex-wrap">
            <span className="text-xs px-2 py-0.5 bg-secondary text-secondary-foreground rounded-full font-medium">
              {job.jobType || "N/A"}
            </span>
            <span className="text-xs px-2 py-0.5 border border-border text-muted-foreground rounded-full font-medium capitalize">
              {job.major || "N/A"}
            </span>
          </div>
        </div>

        {/* Đổi button thành div để tránh nested button */}
        <div
          onClick={handleBookmark}
          className="p-2 hover:bg-secondary/50 rounded-lg transition-colors shrink-0 cursor-pointer"
          title="Lưu công việc"
        >
          <Bookmark className="h-4 w-4 text-muted-foreground" />
        </div>
      </div>
    </button>
  );
}

// Component chính (Quản lý Data)
export default function JobListings({
  selectedJob,
  onSelectJob,
  filters,
  setFilters,
}) {
  const { jobs, loading, error, totalPages } = useJobs(filters);

  // Lọc Frontend (cho 'keyword')
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
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-border sticky top-0 bg-background/95 backdrop-blur">
        <h2 className="text-lg font-semibold text-foreground">
          Jobs{" "}
          <span className="text-muted-foreground">
            ({filteredJobs.length})
          </span>
        </h2>
      </div>

      {/* Danh sách */}
      <div className="flex-1 overflow-y-auto">
        {loading && (
          <div className="p-4 space-y-2">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="h-32 bg-gray-100 rounded-lg animate-pulse"
              />
            ))}
          </div>
        )}

        {!loading && error && (
          <div className="p-6 text-center text-red-500">{error}</div>
        )}

        {!loading && !error && filteredJobs.length === 0 && (
          <div className="p-6 text-center text-muted-foreground">
            <Briefcase className="h-12 w-12 mx-auto mb-4 opacity-30" />
            <p>No jobs found matching your criteria</p>
          </div>
        )}

        {!loading && !error && filteredJobs.length > 0 && (
          <div className="space-y-2 p-4">
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

      {/* Phân trang (Pagination) */}
      <div className="p-4 border-t border-border sticky bottom-0 bg-background">
        <div className="flex justify-between items-center">
          <button
            onClick={() => handlePageChange(filters.page - 1)}
            disabled={filters.page <= 1}
            className="px-4 py-2 text-sm font-medium rounded-md border bg-card text-foreground disabled:opacity-50"
          >
            Previous
          </button>
          <span className="text-sm text-muted-foreground">
            Page {filters.page} of {totalPages}
          </span>
          <button
            onClick={() => handlePageChange(filters.page + 1)}
            disabled={filters.page >= totalPages}
            className="px-4 py-2 text-sm font-medium rounded-md border bg-card text-foreground disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
