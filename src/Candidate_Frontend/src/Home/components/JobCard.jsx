// src/home/components/JobCard.jsx

import { MapPin, DollarSign } from "lucide-react"; // (Thêm import DollarSign nếu cần)
import { Link } from "react-router-dom";

export default function JobCard({ job, onViewDetails }) {
  
  const handleClick = () => {
    onViewDetails(job); 
  };

  const companyInitial = (job.company && job.company.charAt(0)) || '?';
  const placeholderLogo = `https://ui-avatars.com/api/?name=${companyInitial}&background=random&color=fff`;

  // --- SỬA LỖI HIỂN THỊ LƯƠNG TẠI ĐÂY ---
  // Hàm helper để hiển thị lương đẹp
  const formatSalary = (salaryData) => {
    if (!salaryData) return "Thỏa thuận";
    
    // Nếu salary là chuỗi cũ (đề phòng)
    if (typeof salaryData === 'string') return salaryData;

    // Nếu salary là object mới (có min/max)
    if (salaryData.minSalary && salaryData.maxSalary) {
        // Chuyển số thành dạng "10M - 15M" hoặc hiển thị đầy đủ
        const min = (salaryData.minSalary / 1000000) + "M";
        const max = (salaryData.maxSalary / 1000000) + "M";
        return `${min} - ${max} ${salaryData.currency || "VND"}`;
    }
    
    return "Thỏa thuận";
  };

  return (
    <div
      className="rounded-xl border bg-white shadow-sm p-4 
                 transition-all duration-200 hover:shadow-lg hover:scale-[1.02] cursor-pointer"
      onClick={handleClick}
    >
      <div className="flex gap-3">
        <img
          src={job.logoUrl || placeholderLogo}
          alt={job.company || 'Logo công ty'}
          className="w-10 h-10 rounded-md object-contain bg-gray-100"
        />
        <div className="flex-1 overflow-hidden">
          <div className="font-semibold line-clamp-1">{job.title || 'Không có tiêu đề'}</div>
          <div className="text-sm text-gray-600 line-clamp-1">{job.company || 'Không rõ công ty'}</div>
          
          {/* GỌI HÀM formatSalary */}
          <div className="text-sm text-gray-600 font-medium">
            {formatSalary(job.salary)}
          </div>

          <div className="text-sm text-gray-500 flex items-center gap-1">
            <MapPin className="w-3 h-3" /> {job.location || 'N/A'}
          </div>
        </div>
      </div>
    </div>
  );
}