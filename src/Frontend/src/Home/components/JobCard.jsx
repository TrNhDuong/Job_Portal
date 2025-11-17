// src/home/components/JobCard.jsx

import { MapPin } from "lucide-react";
import { Link } from "react-router-dom";

export default function JobCard({ job, onViewDetails }) {
  
  const handleClick = () => {
    onViewDetails(job); 
  };

  // 1. Kiểm tra xem 'job.company' có tồn tại không. 
  // 2. Nếu có, lấy chữ cái đầu. Nếu không, dùng dấu "?".
  const companyInitial = (job.company && job.company.charAt(0)) || '?';
  const placeholderLogo = `https://ui-avatars.com/api/?name=${companyInitial}&background=random&color=fff`;

  return (
    <div
      className="rounded-xl border bg-white shadow-sm p-4 
                 transition-all duration-200 hover:shadow-lg hover:scale-[1.02] cursor-pointer"
      onClick={handleClick}
    >
      <div className="flex gap-3">
        <img
          src={job.logoUrl || placeholderLogo}
          alt={job.company || 'Logo công ty'} // Thêm '||' để phòng lỗi
          className="w-10 h-10 rounded-md object-contain bg-gray-100"
        />
        <div className="flex-1 overflow-hidden">
          <div className="font-semibold line-clamp-1">{job.title || 'Không có tiêu đề'}</div>
          {/* Thêm kiểm tra 'job.company' ở đây */}
          <div className="text-sm text-gray-600 line-clamp-1">{job.company || 'Không rõ công ty'}</div>
          <div className="text-sm text-gray-600">{job.salary || 'N/A'}</div>
          <div className="text-sm text-gray-500 flex items-center gap-1">
            <MapPin className="w-3 h-3" /> {job.location || 'N/A'}
          </div>
        </div>
      </div>
    </div>
  );
}