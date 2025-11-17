// src/components/DashboardJobCard.jsx

import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, DollarSign, CalendarDays, Trash2, Eye } from 'lucide-react';

// Hàm helper để chọn màu cho trạng thái
const getStatusClass = (status) => {
  switch (status?.toLowerCase()) {
    case 'đã xem':
    case 'under review':
      return 'bg-blue-100 text-blue-800';
    case 'đậu':
    case 'approved':
      return 'bg-green-100 text-green-800';
    case 'bị loại':
    case 'rejected':
      return 'bg-red-100 text-red-800';
    case 'đã gửi':
    case 'sent':
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

export default function DashboardJobCard({ job, status, onRemove }) {
  const placeholderLogo = `https://ui-avatars.com/api/?name=${job.company.charAt(0)}&background=random&color=fff`;

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
      <div className="flex gap-4">
        {/* Logo */}
        <img
          src={job.logoUrl || placeholderLogo}
          alt={job.company}
          className="w-12 h-12 rounded-md object-contain bg-gray-100"
        />
        {/* Thông tin chính */}
        <div className="flex-1">
          <Link to={`/jobs/${job._id}`} className="font-bold text-lg text-gray-900 hover:text-blue-700">
            {job.title}
          </Link>
          <p className="text-gray-600">{job.company}</p>
          <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-500 mt-2">
            <div className="flex items-center gap-1.5"><MapPin className="w-4 h-4" /> {job.location}</div>
            <div className="flex items-center gap-1.5"><DollarSign className="w-4 h-4" /> {job.salary}</div>
            <div className="flex items-center gap-1.5"><CalendarDays className="w-4 h-4" /> {new Date(job.createdAt).toLocaleDateString()}</div>
          </div>
        </div>
      </div>
      
      {/* Footer (Trạng thái hoặc Nút Xóa) */}
      <div className="flex justify-between items-center mt-4 pt-4 border-t">
        <div>
          {/* Chỉ hiển thị 'status' nếu nó được truyền vào */}
          {status && (
            <span className={`px-3 py-1 text-xs font-semibold rounded-full ${getStatusClass(status)}`}>
              Trạng thái: {status}
            </span>
          )}
        </div>
        <div>
          {/* Chỉ hiển thị 'onRemove' (nút Xóa) nếu nó được truyền vào */}
          {onRemove && (
            <button 
              onClick={() => onRemove(job._id)} 
              className="p-2 text-gray-500 hover:bg-red-100 hover:text-red-600 rounded-full"
              title="Bỏ lưu"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          )}
          {/* Link xem chi tiết */}
          <Link 
            to={`/jobs/${job._id}`} 
            className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-blue-600 hover:bg-blue-50 rounded-lg"
          >
            Xem chi tiết <Eye className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}