// src/components/JobListings.jsx
import React from 'react';
import useJobs from '../hooks/useJobs'; // Hook data thật
import { Bookmark, MapPin, DollarSign, Briefcase } from "lucide-react";

// --- BƯỚC 1: SỬA COMPONENT CON "JobCard" ---
function JobCard({ job, onSelectJob, isSelected }) {
  
  // SỬA LỖI 1: 'charAt'
  // Thêm kiểm tra an toàn: Nếu 'job.company' không tồn tại, dùng '?'
  const companyInitial = (job.company && job.company.charAt(0)) || '?';
  const placeholderLogo = `https://ui-avatars.com/api/?name=${companyInitial}&background=random&color=fff`;

  // Hàm xử lý khi bấm Bookmark (Ngăn không cho 'onSelectJob' chạy)
  const handleBookmark = (e) => {
    e.stopPropagation(); // Ngăn sự kiện "nổi bọt" (để không click vào card cha)
    console.log("Đã lưu job:", job._id);
    // (Thêm logic gọi API lưu job ở đây)
  };

  return (
    <button
      onClick={() => onSelectJob(job)}
      className={`w-full text-left p-4 rounded-lg border transition-all ${
        isSelected
          ? "bg-blue-50 border-blue-600 shadow-md"
          : "bg-white border-gray-200 hover:border-blue-400"
      }`}
    >
      <div className="flex items-start justify-between gap-3">
         <img 
          // Thêm kiểm tra an toàn 'job.logoUrl'
          src={job.logoUrl || placeholderLogo} 
          alt={job.company || 'Company Logo'}
          className="w-10 h-10 rounded-md object-contain bg-gray-100"
        />
        <div className="flex-1 min-w-0">
          {/* Thêm kiểm tra an toàn cho tất cả dữ liệu */}
          <h3 className="font-semibold text-gray-800 truncate">{job.title || 'Không có tiêu đề'}</h3>
          <p className="text-sm text-gray-500">{job.company || 'Không rõ công ty'}</p>
          <div className="flex items-center gap-3 mt-3 text-xs text-gray-500">
            <div className="flex items-center gap-1">
              <MapPin className="h-3 w-3" />
              {job.location || 'N/A'}
            </div>
            <div className="flex items-center gap-1">
              <DollarSign className="h-3 w-3" />
              {job.salary || 'Thỏa thuận'}
            </div>
          </div>
          <div className="flex gap-2 mt-3 flex-wrap">
            <span className="text-xs px-2 py-0.5 bg-gray-100 text-gray-700 rounded-full font-medium">
              {job.jobType || 'N/A'}
            </span>
            <span className="text-xs px-2 py-0.5 bg-gray-100 text-gray-700 rounded-full font-medium capitalize">
              {job.major || 'N/A'}
            </span>
          </div>
        </div>
        
        {/* SỬA LỖI 2: Đổi <button> thành <div> (vẫn có 'onClick') */}
        <div 
          onClick={handleBookmark}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors flex-shrink-0 cursor-pointer"
          title="Lưu công việc"
        >
          <Bookmark className="h-4 w-4 text-gray-400" />
        </div>
      </div>
    </button>
  );
}

// --- BƯỚC 2: COMPONENT CHA (Giữ nguyên) ---
export default function JobListings({ selectedJob, onSelectJob, filters, setFilters }) {
  
  // GỌI HOOK LẤY DATA THẬT
  const { jobs, loading, error, totalPages } = useJobs(filters);

  // Lọc Frontend (cho 'keyword', giống code mẫu)
  const filteredJobs = jobs.filter((job) => {
    return (
      filters.keyword === "" ||
      (job.title && job.title.toLowerCase().includes(filters.keyword.toLowerCase())) ||
      (job.company && job.company.toLowerCase().includes(filters.keyword.toLowerCase()))
    )
  });

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setFilters({ ...filters, page: newPage });
    }
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-gray-200 sticky top-0 bg-white/95 backdrop-blur">
        <h2 className="text-lg font-semibold text-gray-800">
          Jobs <span className="text-gray-500">({filteredJobs.length})</span>
        </h2>
      </div>

      {/* Danh sách */}
      <div className="flex-1 overflow-y-auto">
        {loading && (
          <div className="p-4 space-y-2">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-100 rounded-lg animate-pulse" />
            ))}
          </div>
        )}

        {!loading && error && (
          <div className="p-6 text-center text-red-500">{error}</div>
        )}

        {!loading && !error && filteredJobs.length === 0 && (
          <div className="p-6 text-center text-gray-500">
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
      <div className="p-4 border-t border-gray-200 sticky bottom-0 bg-white">
        <div className="flex justify-between items-center">
          <button
            onClick={() => handlePageChange(filters.page - 1)}
            disabled={filters.page <= 1}
            className="px-4 py-2 text-sm font-medium rounded-md border bg-white disabled:opacity-50"
          >
            Previous
          </button>
          <span className="text-sm text-gray-600">
            Page {filters.page} of {totalPages}
          </span>
          <button
            onClick={() => handlePageChange(filters.page + 1)}
            disabled={filters.page >= totalPages}
            className="px-4 py-2 text-sm font-medium rounded-md border bg-white disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}