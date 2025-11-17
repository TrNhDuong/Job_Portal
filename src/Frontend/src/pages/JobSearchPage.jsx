// src/pages/JobSearchPage.jsx
import React, { useState } from 'react';
import SearchFilters from '../components/SearchFilters';
import JobListings from '../components/JobListings';
import JobDetailPanel from '../components/JobDetailPanel';

export default function JobSearchPage() {
  // State 1: Lưu trữ job đang được chọn
  const [selectedJob, setSelectedJob] = useState(null);

  // State 2: Lưu trữ các filter (khớp với Backend của bạn)
  const [filters, setFilters] = useState({
  	keyword: "", // 'keyword' sẽ được lọc ở Frontend (giống code mẫu)
  	location: "",
  	major: "", // (Backend của bạn dùng 'major')
  	jobType: "",
    salaryMin: "", // (Backend của bạn dùng 'salaryMin')
    salaryMax: "", // (Backend của bạn dùng 'salaryMax')
    experience: "",
    degree: "",
    page: 1, // Bắt đầu ở trang 1
  });

  return (
    // Dùng 'max-h-[calc(100vh-80px)]' (100vh trừ đi chiều cao Navbar ~80px)
    <main className="flex max-h-[calc(100vh-80px)] bg-gray-50">
      
      {/* Sidebar Trái (Lọc) */}
      <aside className="w-full md:w-80 bg-white border-r border-gray-200 overflow-y-auto p-4">
        <SearchFilters filters={filters} setFilters={setFilters} />
      </aside>

      {/* Cột Giữa (Danh sách) */}
      <div className="flex-1 border-r border-gray-200 overflow-y-auto">
        <JobListings 
          selectedJob={selectedJob} 
          onSelectJob={setSelectedJob} 
          filters={filters}
          setFilters={setFilters}
        />
      </div>

      {/* Cột Phải (Chi tiết) - Chỉ hiện khi có selectedJob */}
      {selectedJob && (
        <div className="hidden lg:block w-96 bg-white border-l border-gray-200 overflow-y-auto">
          <JobDetailPanel 
            job={selectedJob} 
            onClose={() => setSelectedJob(null)} 
          />
        </div>
      )}
    </main>
  );
}