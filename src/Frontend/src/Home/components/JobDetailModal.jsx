import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Briefcase, DollarSign, Clock, X } from 'lucide-react';
import client from '../../api/client'; // Sửa: Sửa lại đường dẫn import (lỗi từ lần trước)
import { useAuth } from '../../context/AuthContext'; // Sửa: Sửa lại đường dẫn import

// Giả lập trạng thái đã ứng tuyển (bạn sẽ thay bằng API thật)
const FAKE_STATUS = {
  hasApplied: false // Đổi thành 'true' để test "View My Application"
};

export default function JobDetailModal({ job, onClose }) {
  const [status, setStatus] = useState(FAKE_STATUS);
  const { user } = useAuth(); 

  // --- SỬA LỖI CRASH: Thêm 'safeJob' (phòng trường hợp 'job' bị undefined) ---
  const safeJob = job || {};

  // Dữ liệu giả (chỉ dùng cho các trường Backend không có)
  const jobDetails = {
    // 1. Dùng Dữ liệu THẬT (có kiểm tra an toàn)
    title: safeJob.title || "Không có tiêu đề",
    company: safeJob.company || "Không rõ công ty",
    location: safeJob.location || "N/A",
    salary: safeJob.salary || "Thỏa thuận",
    about: safeJob.description || "Mô tả công việc không có sẵn.",
    state: safeJob.state || 'Closed',

    // 2. Dữ liệu Giả (vì CSDL của bạn không có 3 trường này)
    level: "Senior",
    posted: "2 days ago",
    requirements: [
        "5+ years of frontend experience",
        "Strong knowledge of React and TypeScript",
        "Experience with modern CSS and Tailwind",
        "Excellent communication skills"
    ]
  };
  /*
  // BƯỚC NÂNG CAO (Khi Backend sẵn sàng)
  // Bạn có thể mở (un-comment) code này để gọi API kiểm tra trạng thái
  
  useEffect(() => {
    const checkApplicationStatus = async () => {
      try {
        // API này (Backend) cần trả về { hasApplied: true/false }
        const res = await client.get(`/api/candidate/check-apply/${job._id}`); 
        setStatus(res.data);
      } catch (e) {
        console.error("Lỗi kiểm tra trạng thái:", e);
        setStatus({ hasApplied: false }); // Mặc định là chưa apply
      }
    };
    
    if (user) { // Chỉ kiểm tra nếu user đã đăng nhập
      checkApplicationStatus();
    }
  }, [job._id, user]);
  */
return (
    // Nền mờ (Backdrop)
    <div 
      className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4"
      onClick={onClose} 
    >
      <div 
        className="bg-white rounded-lg shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto animate-fade-in-down"
        onClick={e => e.stopPropagation()} 
      >
        
        <button
          onClick={onClose}
          className="sticky top-4 right-4 z-20 float-right text-gray-400 hover:text-gray-700 bg-white rounded-full"
        >
          <X className="w-6 h-6" />
        </button>
        
        <div className="p-6 md:p-8 border-b border-gray-200">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{jobDetails.title}</h1>
              <p className="text-lg text-gray-600 mt-1">{jobDetails.company}</p>
            </div>
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold
              ${jobDetails.state === 'Open' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600'}
            `}>
              {jobDetails.state === 'Open' ? 'Active' : 'Closed'}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 p-6 md:p-8 border-b border-gray-200">
          {/* Location */}
          <div className="flex items-center gap-3">
            <MapPin className="w-5 h-5 text-blue-600" />
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wide">Location</p>
              <p className="font-semibold text-gray-800">{jobDetails.location}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Briefcase className="w-5 h-5 text-blue-600" />
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wide">Level</p>
              <p className="font-semibold text-gray-800">{jobDetails.level}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <DollarSign className="w-5 h-5 text-blue-600" />
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wide">Salary</p>
              <p className="font-semibold text-gray-800">{jobDetails.salary}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Clock className="w-5 h-5 text-blue-600" />
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wide">Posted</p>
              <p className="font-semibold text-gray-800">{jobDetails.posted}</p>
            </div>
          </div>
        </div>

        <div className="p-6 md:p-8">
          <h3 className="text-xl font-bold text-gray-900 mb-4">About The Role</h3>
          <p className="text-gray-700 mb-4 leading-relaxed whitespace-pre-line">
            {jobDetails.about}
          </p>
          <h3 className="text-xl font-bold text-gray-900 mb-4 mt-8">Requirements (Fake)</h3>
          <ul className="list-disc list-inside text-gray-700 space-y-2">
            {jobDetails.requirements.map((req, i) => (
              <li key={i}>{req}</li>
            ))}
          </ul>
        </div>
        
        <div className="sticky bottom-0 bg-white border-t border-gray-200 p-4 
                          flex justify-center gap-4"> 
          
          {!user && (
            <Link 
              to={`/login`}
              className="px-8 py-3 font-semibold rounded-lg bg-blue-600 text-white hover:bg-blue-700"
            >
              Login to Apply
            </Link>
          )}
          
          {user && (
            <>
              <Link 
                to={`/jobs/${job._id}/apply`}
                className="px-8 py-3 font-semibold rounded-lg bg-blue-600 text-white hover:bg-blue-700"
              >
                Apply Now
              </Link>

              <Link 
                to={`/jobs/${job._id}/status`}
                className="px-8 py-3 font-semibold rounded-lg bg-gray-100 text-gray-800 hover:bg-gray-200"
              >
                View My Application
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
}