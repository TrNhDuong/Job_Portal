// src/components/JobDetailPanel.jsx
import React from 'react';
import { X, MapPin, DollarSign, Briefcase, Clock, Heart } from "lucide-react";
import { Link as RouterLink } from 'react-router-dom'; // Đổi tên để không trùng

export default function JobDetailPanel({ job, onClose }) {
  
  // Dữ liệu giả (vì CSDL của bạn không có 2 trường này)
  const postedDate = "2 days ago"; // (Backend của bạn có 'createdAt', nhưng 'getFilterJob' không lấy nó)
  const requirements = [
    "5+ years of frontend experience (Fake)",
    "Strong knowledge of React and TypeScript (Fake)",
  ];

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Header */}
      <div className="p-6 border-b border-gray-200 sticky top-0 bg-white/95 backdrop-blur flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <h2 className="text-2xl font-bold text-gray-900 truncate">{job.title}</h2>
          <p className="text-gray-500">{job.company}</p>
        </div>
        <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition-colors flex-shrink-0">
          <X className="h-5 w-5 text-gray-800" />
        </button>
      </div>

      {/* Nội dung (Scroll) */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-6 space-y-6">
          {/* Grid thông tin */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
                <MapPin className="h-4 w-4" /> Location
              </div>
              <p className="font-semibold text-gray-800">{job.location}</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
                <DollarSign className="h-4 w-4" /> Salary
              </div>
              <p className="font-semibold text-gray-800">{job.salary}</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
                <Briefcase className="h-4 w-4" /> Type
              </div>
              <p className="font-semibold text-gray-800">{job.jobType}</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
                <Clock className="h-4 w-4" /> Posted
              </div>
              <p className="font-semibold text-gray-800">{postedDate}</p>
            </div>
          </div>

          {/* Mô tả */}
          <div>
            <h3 className="font-semibold text-gray-800 mb-3">About the Role</h3>
            <p className="text-gray-600 leading-relaxed whitespace-pre-line">{job.description}</p>
          </div>

          {/* Yêu cầu (Giả) */}
          <div>
            <h3 className="font-semibold text-gray-800 mb-3">Requirements (Fake)</h3>
            <div className="space-y-2">
              {requirements.map((req, idx) => (
                <div key={idx} className="flex items-start gap-3 text-sm">
                  <div className="h-2 w-2 rounded-full bg-blue-500 mt-1.5 flex-shrink-0" />
                  <span className="text-gray-700">{req}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Ngành (Category) */}
          <div>
            <h3 className="font-semibold text-gray-800 mb-3">Category</h3>
            <span className="px-2 py-0.5 bg-gray-100 text-gray-700 rounded-full text-sm capitalize">
              {job.major}
            </span>
          </div>
        </div>
      </div>

      {/* Nút bấm Footer */}
      <div className="p-6 border-t border-gray-200 space-y-3 bg-white/95 backdrop-blur sticky bottom-0">
        {/* Link đến trang Apply mà bạn đã tạo */}
        <RouterLink 
          to={`/jobs/${job._id}/apply`}
          className="w-full bg-blue-600 text-white hover:bg-blue-700 text-base py-3 font-semibold rounded-md flex items-center justify-center"
        >
          Apply Now
        </RouterLink>
        <button className="w-full flex items-center justify-center gap-2 bg-transparent border border-gray-300 py-3 rounded-md font-semibold text-gray-700 hover:bg-gray-50">
          <Heart className="h-4 w-4" />
          Save Job
        </button>
      </div>
    </div>
  );
}