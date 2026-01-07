import React from "react";
import useJobs from "../hooks/useJobs";
import { Bookmark, MapPin, DollarSign, Briefcase } from "lucide-react";

// --- HÀM FORMAT LƯƠNG (ĐÃ SỬA: Đơn vị Triệu) ---
function formatSalary(salary) {
  if (!salary) return "Thỏa thuận";
  if (typeof salary === "string") return salary;

  // Nếu salary là object { minSalary, maxSalary, currency }
  if (typeof salary === "object") {
    const { minSalary, maxSalary, currency } = salary || {};
    
    // Nếu là VND hoặc không có currency -> Quy đổi ra Triệu
    if (!currency || currency === "VND") {
      const toMillion = (num) => {
        if (!num) return 0;
        // Chia cho 1 triệu và format số (ví dụ: 10.5)
        return (num / 1000000).toLocaleString('vi-VN', { maximumFractionDigits: 1 });
      };

      if (minSalary && maxSalary) return `${toMillion(minSalary)} - ${toMillion(maxSalary)} triệu`;
      if (minSalary) return `Từ ${toMillion(minSalary)} triệu`;
      if (maxSalary) return `Tối đa ${toMillion(maxSalary)} triệu`;
    } 
    // Nếu là ngoại tệ (USD...) -> Giữ nguyên số và thêm đơn vị tiền tệ
    else {
      const formatNum = (num) => num.toLocaleString('en-US');
      if (minSalary && maxSalary) return `${formatNum(minSalary)} - ${formatNum(maxSalary)} ${currency}`;
      if (minSalary) return `Từ ${formatNum(minSalary)} ${currency}`;
      if (maxSalary) return `Tối đa ${formatNum(maxSalary)} ${currency}`;
    }
  }

  // Fallback: Nếu salary là số đơn thuần (giả định là VND)
  if (typeof salary === "number") {
    return (salary / 1000000).toLocaleString('vi-VN', { maximumFractionDigits: 1 }) + " triệu";
  }

  return "Thỏa thuận";
}

function JobCard({ job, onSelectJob, isSelected }) {
  const companyInitial = (job.company && job.company.charAt(0)) || "?";
  const placeholderLogo = `https://ui-avatars.com/api/?name=${companyInitial}&background=random&color=fff`;

  const handleBookmark = (e) => {
    e.stopPropagation();
    // TODO: gọi API saveJob nếu bạn muốn
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
            onError={(e) => e.target.src = placeholderLogo}
          />
        </div>

        <div className="job-card-main">
          <h3 className="job-card-title">{job.title || "Không có tiêu đề"}</h3>
          <p className="job-card-company">{job.company || "Không rõ công ty"}</p>

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
            <span className="job-card-pill">{job.jobType || "N/A"}</span>
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

export default function JobListings({ selectedJob, onSelectJob, filters, setFilters }) {
  // ✅ Luôn ép limit = 10 (không phụ thuộc nơi khác)
  const effectiveFilters = React.useMemo(() => {
    return {
      ...filters,
      page: Number(filters?.page || 1),
      limit: 10,
    };
  }, [filters]);

  const { jobs, loading, error, totalPages, total } = useJobs(effectiveFilters);

  const currentPage = Number(effectiveFilters.page || 1);
  const maxPage = Number(totalPages || 1);

  const handlePageChange = (newPage) => {
    const next = Math.max(1, Math.min(maxPage, Number(newPage || 1)));
    if (next === currentPage) return;

    // ✅ luôn giữ limit=10 khi đổi trang
    setFilters({ ...filters, page: next, limit: 10 });
  };

  // ✅ input riêng để người dùng gõ số trang
  const [pageInput, setPageInput] = React.useState(String(currentPage));

  React.useEffect(() => {
    setPageInput(String(currentPage));
  }, [currentPage]);

  const handlePageInputChange = (e) => {
    // ✅ chỉ cho số, cho phép rỗng để xoá rồi nhập lại
    const onlyDigits = e.target.value.replace(/[^\d]/g, "");
    setPageInput(onlyDigits);
  };

  // Hàm xử lý khi nhấn phím trong input
  const handleKeyDown = (e) => {
    // Cho phép các phím điều hướng và xóa
    const allowed = [
      "Backspace",
      "Delete",
      "ArrowLeft",
      "ArrowRight",
      "Home",
      "End",
      "Tab",
      "Enter",
    ];

    if (allowed.includes(e.key)) {
      if (e.key === "Enter") {
        // Logic chuyển trang khi nhấn Enter
        if (!pageInput) return;

        const num = Number(pageInput);
        if (!Number.isFinite(num)) return;

        // ✅ Kiểm tra giới hạn trang hợp lệ
        if (num >= 1 && num <= maxPage) {
           handlePageChange(num);
        } else {
           // Nếu không hợp lệ, reset về trang hiện tại
           setPageInput(String(currentPage));
        }
      }
      return;
    }

    // ✅ chặn mọi ký tự không phải số
    if (!/^\d$/.test(e.key)) e.preventDefault();
  };
  
  // Xử lý sự kiện onBlur (khi input mất focus) để reset về trang hiện tại nếu input rỗng hoặc không hợp lệ
  const handleBlur = () => {
       if (!pageInput) {
          setPageInput(String(currentPage));
          return;
       }
       
       const num = Number(pageInput);
       if (num < 1 || num > maxPage) {
            setPageInput(String(currentPage));
       }
  }

  const handlePaste = (e) => {
    const text = e.clipboardData.getData("text");
    if (!/^\d+$/.test(text)) e.preventDefault();
  };

  return (
    <div className="job-listings">
      {/* Header */}
      <div className="job-listings-header">
        <h2 className="job-listings-title">
          Việc làm
          <span className="job-listings-count">{total || jobs.length}</span>
        </h2>
      </div>

      {/* Body */}
      <div className="job-listings-body">
        {loading && (
          <div className="job-listings-skeleton">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="job-skeleton-item" />
            ))}
          </div>
        )}

        {!loading && error && <div className="job-listings-error">{error}</div>}

        {!loading && !error && jobs.length === 0 && (
          <div className="job-listings-empty">
            <Briefcase className="job-empty-icon" />
            <p className="job-empty-title">Không tìm thấy công việc phù hợp</p>
            <p className="job-empty-subtitle">
              Hãy thử thay đổi từ khóa hoặc bộ lọc tìm kiếm.
            </p>
          </div>
        )}

        {!loading && !error && jobs.length > 0 && (
          <div className="job-list">
            {jobs.map((job) => (
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
        <div className="job-pagination job-pagination--single-row">
          {/* Trang trước */}
          <button
            type="button"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage <= 1}
            className="job-page-btn"
          >
            Trang trước
          </button>

          {/* Đi tới trang (ở GIỮA) */}
          <div className="job-page-jump">
            <span className="job-page-info">Trang</span>

            <input
              value={pageInput}
              onChange={handlePageInputChange}
              onKeyDown={handleKeyDown}
              onBlur={handleBlur}
              onPaste={handlePaste}
              inputMode="numeric"
              pattern="[0-9]*"
              className="job-page-input"
            />

            <span className="job-page-info">
              / {maxPage}
            </span>
          </div>

          {/* Trang sau */}
          <button
            type="button"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage >= maxPage}
            className="job-page-btn"
          >
            Trang sau
          </button>
        </div>
      </div>
    </div>
  );
}