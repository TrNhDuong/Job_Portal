// src/home/components/JobDetailModal.jsx

import { Link } from "react-router-dom";
import { X } from "lucide-react";

// Component này nhận "job" đang được chọn và hàm "onClose" để đóng nó lại
export default function JobDetailModal({ job, onClose }) {
  
  // Hàm này để khi click vào nền mờ thì đóng Modal
  const handleBackdropClick = (e) => {
    // Chỉ đóng khi click vào nền (target) chứ không phải nội dung (currentTarget)
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    /* Nền mờ (Backdrop) */
    <div
      className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4"
      onClick={handleBackdropClick}
    >
      {/* Khung nội dung Modal */}
      <div className="bg-white rounded-lg shadow-2xl max-w-2xl w-full p-6 relative animate-fade-in-down">
        
        {/* Nút X để đóng */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-700"
        >
          <X className="w-6 h-6" />
        </button>

        {/* --- Nội dung Modal --- */}
        <div className="flex gap-4">
          <img
            src={job.logoUrl}
            alt={job.company}
            className="w-16 h-16 rounded-md object-contain bg-gray-100"
          />
          <div>
            <h2 className="text-xl font-bold text-blue-600">{job.title}</h2>
            <p className="text-gray-700">{job.company}</p>
          </div>
        </div>

        <div className="mt-4">
          <h3 className="font-semibold text-gray-800">Mô tả công việc:</h3>
          {/* h-60 overflow-y-auto: Tạo khung cuộn nếu mô tả quá dài */}
          <p className="text-sm text-gray-700 h-60 overflow-y-auto mt-1 p-2 bg-gray-50 rounded">
            {job.description || "Mô tả công việc không có sẵn. Vui lòng xem chi tiết."}
          </p>
        </div>

        <div className="flex gap-3 mt-4">
          <Link
            to="#"
            className="flex-1 text-center px-4 py-2 bg-gray-100 text-gray-800 rounded-lg font-semibold hover:bg-gray-200"
          >
            Ứng tuyển
          </Link>
          <Link
            to={`/jobs/${job._id}`}
            className="flex-1 text-center px-4 py-2 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700"
          >
            Xem chi tiết
          </Link>
        </div>
      </div>
    </div>
  );
}