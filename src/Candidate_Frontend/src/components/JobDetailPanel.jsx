// src/components/JobDetailPanel.jsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  X,
  MapPin,
  DollarSign,
  Briefcase,
  Heart,
  Building2,
  ExternalLink,
} from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import "../styles/job-search.css";

import { useAuth } from "../context/AuthContext";
import {
  saveJob as apiSaveJob,
  removeSaveJob as apiRemoveSaveJob,
} from "../api/candidate";

// Hàm format lương
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
  const navigate = useNavigate();
  const { user } = useAuth();

  const [isSaved, setIsSaved] = useState(false);
  const [saving, setSaving] = useState(false);

  const jobId = useMemo(() => String(job?._id || ""), [job?._id]);

  // --- LOGIC LOGO ---
  const companyInitial = (job?.company && job.company.charAt(0)) || "?";
  const placeholderLogo = useMemo(
    () =>
      `https://ui-avatars.com/api/?name=${encodeURIComponent(
        companyInitial
      )}&background=random&color=fff`,
    [companyInitial]
  );

  const placeholderRef = useRef(placeholderLogo);
  useEffect(() => {
    placeholderRef.current = placeholderLogo;
  }, [placeholderLogo]);

  const logoSrc = (job?.logo && job.logo.url) || job?.logoUrl || placeholderLogo;

  // --- LOGIC LINK CÔNG TY ---
  const companyIdentifier = job?.companyEmail || job?.company || "";
  const companyLink = useMemo(
    () => `/employer/${encodeURIComponent(companyIdentifier)}`,
    [companyIdentifier]
  );

  // Đồng bộ trạng thái saved từ user.listSaveJobs
  useEffect(() => {
    if (user && Array.isArray(user.listSaveJobs) && jobId) {
      setIsSaved(user.listSaveJobs.map(String).includes(jobId));
    } else {
      setIsSaved(false);
    }
  }, [user, jobId]);

  const handleApply = () => {
    if (!user) {
      alert("Bạn cần đăng nhập để ứng tuyển.");
      navigate("/login");
      return;
    }
    navigate(`/jobs/${job._id}/apply`);
  };

  // Lưu / Bỏ lưu job
  const handleSaveJob = async () => {
    if (!user) return navigate("/login");
    if (!jobId) return;

    try {
      setSaving(true);

      if (isSaved) {
        await apiRemoveSaveJob(user.email, jobId);
        setIsSaved(false);
      } else {
        await apiSaveJob(user.email, jobId);
        setIsSaved(true);
      }
    } catch (err) {
      console.error(err);
      // optional: alert("Không thể lưu công việc. Vui lòng thử lại.");
    } finally {
      setSaving(false);
    }
  };

  // Render description (Hyper text/HTML)
  const renderDescription = () => {
    const content = job?.description || "Chưa có mô tả chi tiết.";
    const hasHtml = /<[a-z][\s\S]*>/i.test(content);
    const htmlContent = hasHtml ? content : content.replace(/\n/g, "<br/>");
    return { __html: htmlContent };
  };

  if (!job) return null;

  return (
    <div className="job-detail">
      {/* --- HEADER --- */}
      <div className="job-detail-header">
        {/* Nút đóng */}
        <button
          type="button"
          onClick={onClose}
          className="job-detail-close"
          aria-label="Đóng"
        >
          <X size={20} />
        </button>

        <div className="flex flex-col gap-4">
          <div>
            <h2 className="job-detail-title">{job.title}</h2>

            {/* Link tới trang công ty */}
            <Link to={companyLink} className="job-detail-company-link">
              <Building2 size={16} />
              {job.company}
              <ExternalLink size={12} className="opacity-50 ml-0.5" />
            </Link>
          </div>
        </div>
      </div>

      {/* --- BODY --- */}
      <div className="job-detail-body">
        {/* Grid thông tin nhanh */}
        <div className="job-detail-grid">
          <div className="job-detail-info-card">
            <span className="label">
              <DollarSign size={14} /> Mức lương
            </span>
            <span className="value" >
              {formatSalary(job.salary)}
            </span>
          </div>

          <div className="job-detail-info-card">
            <span className="label">
              <MapPin size={14} /> Địa điểm
            </span>
            <span className="value" title={job.location || "N/A"}>
              {job.location || "N/A"}
            </span>
          </div>

          <div className="job-detail-info-card">
            <span className="label">
              <Briefcase size={14} /> Hình thức
            </span>
            <span className="value">{job.jobType || "Toàn thời gian"}</span>
          </div>

          {/* ✅ Thay vì "Ngày đăng" -> Hiển thị ngành nghề */}
          <div className="job-detail-info-card">
            <span className="label">
              <Briefcase size={14} /> Ngành nghề
            </span>
            <span className="value" title={job.major || "Chưa cập nhật"}>
              {job.major || "Chưa cập nhật"}
            </span>
          </div>
        </div>

        {/* Mô tả công việc */}
        <section className="job-detail-section">
          <h3 className="job-detail-section-title">Mô tả công việc</h3>
          <div
            className="job-detail-html-content"
            dangerouslySetInnerHTML={renderDescription()}
          />
        </section>
      </div>

      {/* --- FOOTER --- */}
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
          disabled={saving}
          className={`job-detail-save-btn ${isSaved ? "is-saved" : ""}`}
          title={isSaved ? "Bỏ lưu" : "Lưu công việc"}
        >
          <Heart size={18} fill={isSaved ? "currentColor" : "none"} />
          <span className="job-detail-save-text">
            {saving
              ? isSaved
                ? "Đang bỏ lưu..."
                : "Đang lưu..."
              : isSaved
              ? "Đã lưu"
              : "Lưu job"}
          </span>
        </button>
      </div>
    </div>
  );
}
