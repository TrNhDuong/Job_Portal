// src/components/JobDetailPanel.jsx
import React, { useState, useEffect } from "react";
import { X, MapPin, DollarSign, Briefcase, Clock, Heart } from "lucide-react";
import { useNavigate } from "react-router-dom";
import "../styles/job-search.css";

import { useAuth } from "../context/AuthContext";
import {
  saveJob as apiSaveJob,
  removeSaveJob as apiRemoveSaveJob,
} from "../api/candidate";

function formatSalary(salary) {
  if (!salary) return "Thỏa thuận";
  if (typeof salary === "string") return salary;
  if (typeof salary === "number") return salary.toString();
  if (typeof salary === "object") {
    const { minSalary, maxSalary, currency } = salary || {};
    const curr = currency || "";
    if (minSalary && maxSalary) return `${minSalary} - ${maxSalary} ${curr}`.trim();
    if (minSalary) return `Từ ${minSalary} ${curr}`.trim();
    if (maxSalary) return `Tối đa ${maxSalary} ${curr}`.trim();
  }
  return "Thỏa thuận";
}

export default function JobDetailPanel({ job, onClose }) {
  const postedDate = "2 ngày trước"; // placeholder

  const navigate = useNavigate();
  const { user } = useAuth();

  const jobId = String(job._id);
  const [isSaved, setIsSaved] = useState(false);

  // lấy trạng thái đã lưu ban đầu từ user.listSaveJobs (giống FeaturedJobs)
  useEffect(() => {
    if (user && Array.isArray(user.listSaveJobs)) {
      const hasSaved = user.listSaveJobs
        .map(String)
        .includes(jobId);
      setIsSaved(hasSaved);
    } else {
      setIsSaved(false);
    }
  }, [user, jobId]);

  const handleApply = () => {
    if (!user) {
      alert("Bạn cần đăng nhập để ứng tuyển công việc này.");
      navigate("/login");
      return;
    }
    navigate(`/jobs/${job._id}/apply`);
  };

  const handleSaveJob = async () => {
    if (!user) {
      alert("Bạn cần đăng nhập để lưu job.");
      navigate("/login");
      return;
    }

    try {
      if (isSaved) {
        await apiRemoveSaveJob(user.email, jobId);
        setIsSaved(false);
      } else {
        await apiSaveJob(user.email, jobId);
        setIsSaved(true);
      }
    } catch (err) {
      console.error("Error (save job):", err);
      alert(err?.response?.data?.message || "Không thể lưu job");
    }
  };

  return (
    <div className="job-detail">
      {/* Header */}
      <div className="job-detail-header">
        <div className="job-detail-header-main">
          <h2 className="job-detail-title">{job.title}</h2>
          <button
            type="button"
            className="job-detail-company-link"
            onClick={() =>
              navigate(`/company/${encodeURIComponent(job.company || "")}`, {
                state: { companyName: job.company },
              })
            }
          >
            {job.company}
          </button>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="job-detail-close"
        >
          <X className="job-detail-close-icon" />
        </button>
      </div>

      {/* Content */}
      <div className="job-detail-body">
        <div className="job-detail-grid">
          <div className="job-detail-info-card">
            <div className="job-detail-info-label">
              <MapPin className="job-detail-info-icon" />
              <span>Địa điểm</span>
            </div>
            <p className="job-detail-info-value">
              {job.location || "N/A"}
            </p>
          </div>

          <div className="job-detail-info-card">
            <div className="job-detail-info-label">
              <DollarSign className="job-detail-info-icon" />
              <span>Mức lương</span>
            </div>
            <p className="job-detail-info-value">
              {formatSalary(job.salary)}
            </p>
          </div>

          <div className="job-detail-info-card">
            <div className="job-detail-info-label">
              <Briefcase className="job-detail-info-icon" />
              <span>Hình thức</span>
            </div>
            <p className="job-detail-info-value">
              {job.jobType || "N/A"}
            </p>
          </div>

          <div className="job-detail-info-card">
            <div className="job-detail-info-label">
              <Clock className="job-detail-info-icon" />
              <span>Ngày đăng</span>
            </div>
            <p className="job-detail-info-value">{postedDate}</p>
          </div>
        </div>

        {/* Description */}
        <section className="job-detail-section">
          <h3 className="job-detail-section-title">Mô tả công việc</h3>
          <p className="job-detail-section-text">
            {job.description || "Chưa có mô tả chi tiết cho công việc này."}
          </p>
        </section>

        {/* Category */}
        <section className="job-detail-section">
          <h3 className="job-detail-section-title">Ngành nghề</h3>
          <span className="job-detail-chip">
            {job.major || "General"}
          </span>
        </section>
      </div>

      {/* Footer */}
      <div className="job-detail-footer">
        <button
          type="button"
          onClick={handleApply}
          className="job-detail-apply-btn"
        >
          Ứng tuyển ngay
        </button>

        <button
          type="button"
          onClick={handleSaveJob}
          className="job-detail-save-btn"
        >
          <Heart
            className="job-detail-save-icon"
            fill={isSaved ? "currentColor" : "none"}
          />
          {isSaved ? "Đã lưu công việc" : "Lưu công việc"}
        </button>
      </div>
    </div>
  );
}
