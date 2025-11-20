import React, { useState } from "react";
import { Link } from "react-router-dom";
import { MapPin, Briefcase, DollarSign, Clock, X, Heart } from "lucide-react";
import client from "../../api/client";
import { useAuth } from "../../context/AuthContext";

// Giả lập trạng thái đã ứng tuyển (bạn sẽ thay bằng API thật)
const FAKE_STATUS = {
  hasApplied: false,
};

// HÀM FORMAT LƯƠNG – giống các file khác
function formatSalary(salary) {
  if (!salary) return "Thỏa thuận";

  if (typeof salary === "string") return salary;

  if (typeof salary === "number") return salary.toString();

  if (typeof salary === "object") {
    const { minSalary, maxSalary, currency } = salary || {};
    const curr = currency || "";

    if (minSalary && maxSalary) {
      return `${minSalary} - ${maxSalary} ${curr}`.trim();
    }
    if (minSalary) {
      return `Từ ${minSalary} ${curr}`.trim();
    }
    if (maxSalary) {
      return `Tối đa ${maxSalary} ${curr}`.trim();
    }
  }

  return "Thỏa thuận";
}

export default function JobDetailModal({ job, onClose, onSave }) {
  const [status, setStatus] = useState(FAKE_STATUS);
  const { user } = useAuth();

  // An toàn nếu job bị null/undefined
  const safeJob = job || {};

  // Dữ liệu hiển thị (một phần thật, một phần fake)
  const jobDetails = {
    title: safeJob.title || "Không có tiêu đề",
    company: safeJob.company || "Không rõ công ty",
    location: safeJob.location || "N/A",
    salary: formatSalary(safeJob.salary),
    about: safeJob.description || "Mô tả công việc không có sẵn.",
    state: safeJob.state || "Closed",

    // Giả (vì CSDL không có)
    level: "Senior",
    posted: "2 days ago",
    requirements: [
      "5+ years of frontend experience",
      "Strong knowledge of React and TypeScript",
      "Experience with modern CSS and Tailwind",
      "Excellent communication skills",
    ],
  };

  const jobId = safeJob._id; // dùng cho Link / Save

  return (
    // Nền mờ (Backdrop)
    <div
      className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto animate-fade-in-down"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Nút đóng */}
        <button
          onClick={onClose}
          className="sticky top-4 right-4 z-20 float-right text-gray-400 hover:text-gray-700 bg-white rounded-full"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Header */}
        <div className="p-6 md:p-8 border-b border-gray-200">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {jobDetails.title}
              </h1>
              <p className="text-lg text-gray-600 mt-1">
                {jobDetails.company}
              </p>
            </div>
            <span
              className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold
              ${
                jobDetails.state === "Open"
                  ? "bg-blue-100 text-blue-700"
                  : "bg-gray-100 text-gray-600"
              }
            `}
            >
              {jobDetails.state === "Open" ? "Active" : "Closed"}
            </span>
          </div>
        </div>

        {/* Info grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 p-6 md:p-8 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <MapPin className="w-5 h-5 text-blue-600" />
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wide">
                Location
              </p>
              <p className="font-semibold text-gray-800">
                {jobDetails.location}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Briefcase className="w-5 h-5 text-blue-600" />
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wide">
                Level
              </p>
              <p className="font-semibold text-gray-800">
                {jobDetails.level}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <DollarSign className="w-5 h-5 text-blue-600" />
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wide">
                Salary
              </p>
              <p className="font-semibold text-gray-800">
                {jobDetails.salary}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Clock className="w-5 h-5 text-blue-600" />
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wide">
                Posted
              </p>
              <p className="font-semibold text-gray-800">
                {jobDetails.posted}
              </p>
            </div>
          </div>
        </div>

        {/* About & Requirements */}
        <div className="p-6 md:p-8">
          <h3 className="text-xl font-bold text-gray-900 mb-4">
            About The Role
          </h3>
          <p className="text-gray-700 mb-4 leading-relaxed whitespace-pre-line">
            {jobDetails.about}
          </p>

          <h3 className="text-xl font-bold text-gray-900 mb-4 mt-8">
            Requirements (Fake)
          </h3>
          <ul className="list-disc list-inside text-gray-700 space-y-2">
            {jobDetails.requirements.map((req, i) => (
              <li key={i}>{req}</li>
            ))}
          </ul>
        </div>

        {/* Footer buttons – Apply Now + Save Job giống panel chi tiết trước đó */}
        <div className="sticky bottom-0 bg-white border-t border-gray-200 p-4 space-y-3">
          {/* Nếu chưa đăng nhập: chỉ hiện nút Login */}
          {!user && (
            <Link
              to="/login"
              className="w-full inline-flex items-center justify-center px-8 py-3 font-semibold rounded-md bg-blue-600 text-white hover:bg-blue-700"
            >
              Login to Apply
            </Link>
          )}

          {/* Đã đăng nhập & có jobId: Apply + Save */}
          {user && jobId && (
            <>
              <Link
                to={`/jobs/${jobId}/apply`}
                className="w-full inline-flex items-center justify-center px-8 py-3 font-semibold rounded-md bg-blue-600 text-white hover:bg-blue-700"
              >
                Apply Now
              </Link>

              <button
                type="button"
                onClick={() => onSave && onSave(jobId)}
                className="w-full inline-flex items-center justify-center gap-2 px-8 py-3 font-semibold rounded-md bg-white border border-gray-300 text-gray-800 hover:bg-gray-50"
              >
                <Heart className="w-4 h-4" />
                Save Job
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
