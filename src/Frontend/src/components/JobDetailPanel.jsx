// src/components/JobDetailPanel.jsx
import React from "react";
import { X, MapPin, DollarSign, Briefcase, Clock, Heart } from "lucide-react";
import { Link as RouterLink } from "react-router-dom";

// HÀM FORMAT LƯƠNG
function formatSalary(salary) {
  if (!salary) return "Negotiable";
  if (typeof salary === "string") return salary;
  if (typeof salary === "number") return salary.toString();
  if (typeof salary === "object") {
    const { minSalary, maxSalary, currency } = salary;
    const curr = currency || "";
    if (minSalary && maxSalary) {
      return `${minSalary} - ${maxSalary} ${curr}`.trim();
    }
    if (minSalary) {
      return `From ${minSalary} ${curr}`.trim();
    }
    if (maxSalary) {
      return `Up to ${maxSalary} ${curr}`.trim();
    }
  }
  return "Negotiable";
}

export default function JobDetailPanel({ job, onClose }) {
  // Dữ liệu giả cho ngày đăng (nếu DB chưa có)
  const postedDate = "2 days ago";

  // ĐÃ XÓA: const requirements = ...

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Header */}
      <div className="p-6 border-b border-slate-200 flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <h2 className="text-2xl font-bold text-slate-900 leading-snug truncate">
            {job.title}
          </h2>
          <p className="text-sm text-slate-500 mt-1">{job.company}</p>
        </div>
        <button
          onClick={onClose}
          className="p-2 rounded-full hover:bg-slate-100 transition-colors shrink-0"
        >
          <X className="h-5 w-5 text-slate-500" />
        </button>
      </div>

      {/* Nội dung (scroll) */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-6 space-y-8">
          {/* Grid thông tin */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-sky-50 rounded-xl p-4">
              <div className="flex items-center gap-2 text-xs font-medium text-slate-500 mb-1">
                <MapPin className="h-4 w-4" />
                Location
              </div>
              <p className="font-semibold text-slate-900">
                {job.location || "N/A"}
              </p>
            </div>

            <div className="bg-sky-50 rounded-xl p-4">
              <div className="flex items-center gap-2 text-xs font-medium text-slate-500 mb-1">
                <DollarSign className="h-4 w-4" />
                Salary
              </div>
              <p className="font-semibold text-slate-900">
                {formatSalary(job.salary)}
              </p>
            </div>

            <div className="bg-sky-50 rounded-xl p-4">
              <div className="flex items-center gap-2 text-xs font-medium text-slate-500 mb-1">
                <Briefcase className="h-4 w-4" />
                Type
              </div>
              <p className="font-semibold text-slate-900">
                {job.jobType || "N/A"}
              </p>
            </div>

            <div className="bg-sky-50 rounded-xl p-4">
              <div className="flex items-center gap-2 text-xs font-medium text-slate-500 mb-1">
                <Clock className="h-4 w-4" />
                Posted
              </div>
              <p className="font-semibold text-slate-900">{postedDate}</p>
            </div>
          </div>

          {/* Mô tả (Bao gồm cả Requirements) */}
          <div>
            <h3 className="font-semibold text-slate-900 mb-3">
              About the Role
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-line">
              {job.description}
            </p>
          </div>

          {/* ĐÃ XÓA: Phần hiển thị Requirements */}

          {/* Category */}
          <div>
            <h3 className="font-semibold text-slate-900 mb-3">Category</h3>
            <span className="inline-flex items-center px-3 py-1 rounded-full bg-sky-50 text-sky-700 text-xs font-semibold capitalize">
              {job.major || "General"}
            </span>
          </div>
        </div>
      </div>

      {/* Footer buttons */}
      <div className="p-6 border-t border-slate-200 space-y-3 bg-white">
        <RouterLink
          to={`/jobs/${job._id}/apply`}
          className="w-full bg-blue-900 hover:bg-blue-800 text-white text-sm py-3 font-semibold rounded-md flex items-center justify-center transition-colors"
        >
          Apply Now
        </RouterLink>

        <button className="w-full flex items-center justify-center gap-2 bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 text-sm py-3 rounded-md font-semibold transition-colors">
          <Heart className="h-4 w-4" />
          Save Job
        </button>
      </div>
    </div>
  );
}