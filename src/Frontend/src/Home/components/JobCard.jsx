// src/home/components/JobCard.jsx

import { MapPin } from "lucide-react";
// Bỏ import useState và Link

// BƯỚC 1: Nhận thêm prop "onViewDetails"
export default function JobCard({ job, onViewDetails }) {
  
  // BƯỚC 2: Tạo hàm xử lý click, gọi prop "onViewDetails"
  const handleClick = () => {
    onViewDetails(job); // Báo cho file cha biết job này đã được chọn
  };

  return (
    /* Thêm "onClick={handleClick}" và "cursor-pointer"
       Bỏ "relative" và các logic state
    */
    <div
      className="rounded-xl border bg-white shadow-sm p-4 flex gap-3 
                 transition-all duration-200 hover:shadow-lg hover:scale-[1.02] cursor-pointer"
      onClick={handleClick}
    >
      {/* Đây chỉ là MẶT TRƯỚC (Nội dung gốc) */}
      <img
        src={job.logoUrl}
        alt={job.company}
        className="w-10 h-10 rounded-md object-contain bg-gray-100"
      />
      <div className="flex-1 overflow-hidden">
        <div className="font-semibold line-clamp-1">{job.title}</div>
        <div className="text-sm text-gray-600 line-clamp-1">{job.company}</div>
        <div className="text-sm text-gray-600">{job.salary}</div>
        <div className="text-sm text-gray-500 flex items-center gap-1">
          <MapPin className="w-3 h-3" /> {job.location}
        </div>
      </div>
    </div>
  );
}