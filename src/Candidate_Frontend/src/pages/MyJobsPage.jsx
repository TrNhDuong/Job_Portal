// src/pages/MyJobsPage.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import client from "../api/client";

import {
  MapPin,
  DollarSign,
  Users,
  Calendar,
  Trash2,
  BookmarkX,
  ArrowRight,
} from "lucide-react";

export default function MyJobsPage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("applied"); // "applied" | "saved"
  const [appliedJobs, setAppliedJobs] = useState([]);    // [{ job, application }]
  const [savedJobs, setSavedJobs] = useState([]);        // [job]
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null); // jobId đang xử lý
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user?.email) return;

    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        // lấy candidate đầy đủ (có listApply, listSaveJob)
        const res = await client.get(
          `/api/candidate?email=${user.email}`
        );
        const candidate = res.data?.data || res.data;
        const listApply = candidate.appliedJobs || [];
        const listSaveJob = candidate.listSaveJobs ||[];

        // Lấy job cho từng đơn ứng tuyển
        const applied = await Promise.all(
          listApply.map(async (app) => {
            const jobId = app.jobId || app.job || app.jobID || app;
            const jobRes = await client.get(
              `/api/post-job/id?id=${encodeURIComponent(jobId)}`
            );
            const job = jobRes.data?.data || jobRes.data;
            return { job, application: app };
          })
        );

        // Lấy job cho từng job đã lưu
        const saved = await Promise.all(
          listSaveJob.map(async (item) => {
            const jobId = item.jobId || item.job || item.jobID || item;
            const jobRes = await client.get(
              `/api/post-job/id?jobId=${jobId}`
            );
            return jobRes.data?.data || jobRes.data;
          })
        );

        setAppliedJobs(applied.filter((x) => x.job)); // bỏ null
        setSavedJobs(saved.filter(Boolean));
      } catch (err) {
        console.error(err);
        setError(
          err.response?.data?.message ||
            "Không tải được danh sách việc làm của bạn."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  // map trạng thái application -> text + màu
  const getStatusInfo = (status) => {
    const s = (status || "").toString().toLowerCase();

    if (!s || s === "pending" || s === "unseen") {
      return { text: "Chưa xem", variant: "pending" };
    }
    if (s === "viewed" || s === "seen") {
      return { text: "Đã xem", variant: "viewed" };
    }
    if (s === "rejected" || s === "failed" || s === "deny") {
      return { text: "Bị loại", variant: "rejected" };
    }
    if (s === "accepted" || s === "success" || s === "pass") {
      return { text: "Chấp nhận", variant: "accepted" };
    }
    return { text: status, variant: "pending" };
  };

  const formatSalary = (salary) => {
    if (!salary) return "Thỏa thuận";
    if (typeof salary === "string") return salary;

    const min = salary.minSalary ? salary.minSalary / 1_000_000 + "M" : null;
    const max = salary.maxSalary ? salary.maxSalary / 1_000_000 + "M" : null;
    if (min && max) return `${min} - ${max} ${salary.currency || "VND"}`;
    if (min) return `Từ ${min} ${salary.currency || "VND"}`;
    if (max) return `Đến ${max} ${salary.currency || "VND"}`;
    return "Thỏa thuận";
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "Không rõ";
    const d = new Date(dateStr);
    if (Number.isNaN(d.getTime())) return "Không rõ";
    return d.toLocaleDateString("vi-VN");
  };

  // XÓA ĐƠN ỨNG TUYỂN
  const handleRemoveApplication = async (jobId) => {
    if (!user?.email) return;
    setActionLoading(jobId);
    try {
      await client.patch(
        `/api/post-job/removeApplyJob?jobId=${encodeURIComponent(jobId)}`,
        { email: user.email }
      );
      setAppliedJobs((prev) =>
        prev.filter((item) => item.job?._id !== jobId)
      );
    } catch (err) {
      console.error(err);
      alert(
        err.response?.data?.message ||
          "Không thể xóa đơn ứng tuyển, hãy thử lại sau."
      );
    } finally {
      setActionLoading(null);
    }
  };

  // BỎ LƯU JOB
  const handleUnsaveJob = async (jobId) => {
    if (!user?.email) return;
    setActionLoading(jobId);
    try {
      await client.patch(
        `/api/post-job/removeSaveJob?jobId=${encodeURIComponent(jobId)}`,
        { email: user.email }
      );
      setSavedJobs((prev) => prev.filter((job) => job._id !== jobId));
    } catch (err) {
      console.error(err);
      alert(
        err.response?.data?.message ||
          "Không thể bỏ lưu việc làm, hãy thử lại sau."
      );
    } finally {
      setActionLoading(null);
    }
  };

  const handleApplyNow = (jobId) => {
    navigate(`/apply/${jobId}`);
  };

  const renderAppliedCard = ({ job, application }) => {
    if (!job) return null;
    const { text, variant } = getStatusInfo(application?.status);

    return (
      <article key={job._id} className="myjobs-card">
        <div className="myjobs-card-main" onClick={() => navigate(`/jobs/${job._id}`)}>
          <h3 className="myjobs-title">{job.title || "Không có tiêu đề"}</h3>
          <p className="myjobs-company">{job.company || "Không rõ công ty"}</p>

          <div className="myjobs-meta-row">
            <div className="myjobs-meta-item">
              <MapPin className="myjobs-meta-icon" />
              <span>{job.location || "Địa điểm linh hoạt"}</span>
            </div>
            <div className="myjobs-meta-item">
              <DollarSign className="myjobs-meta-icon" />
              <span>{formatSalary(job.salary)}</span>
            </div>
            <div className="myjobs-meta-item">
              <Users className="myjobs-meta-icon" />
              <span>
                {(job.applicantsCount ?? job.applicants?.length) || 0} ứng viên
              </span>
            </div>
            <div className="myjobs-meta-item">
              <Calendar className="myjobs-meta-icon" />
              <span>Đăng ngày {formatDate(job.postedAt || job.createdAt)}</span>
            </div>
          </div>
        </div>

        <div className="myjobs-card-actions">
          <span className={`myjobs-status-badge myjobs-status-${variant}`}>
            {text}
          </span>

          <button
            type="button"
            className="myjobs-btn-danger"
            disabled={actionLoading === job._id}
            onClick={() => handleRemoveApplication(job._id)}
          >
            <Trash2 className="w-4 h-4" />
            <span>
              {actionLoading === job._id ? "Đang xóa..." : "Xóa đơn ứng tuyển"}
            </span>
          </button>
        </div>
      </article>
    );
  };

  const renderSavedCard = (job) => {
    if (!job) return null;

    return (
      <article key={job._id} className="myjobs-card">
        <div className="myjobs-card-main" onClick={() => navigate(`/jobs/${job._id}`)}>
          <h3 className="myjobs-title">{job.title || "Không có tiêu đề"}</h3>
          <p className="myjobs-company">{job.company || "Không rõ công ty"}</p>

          <div className="myjobs-meta-row">
            <div className="myjobs-meta-item">
              <MapPin className="myjobs-meta-icon" />
              <span>{job.location || "Địa điểm linh hoạt"}</span>
            </div>
            <div className="myjobs-meta-item">
              <DollarSign className="myjobs-meta-icon" />
              <span>{formatSalary(job.salary)}</span>
            </div>
            <div className="myjobs-meta-item">
              <Calendar className="myjobs-meta-icon" />
              <span>Đăng ngày {formatDate(job.postedAt || job.createdAt)}</span>
            </div>
          </div>
        </div>

        <div className="myjobs-card-actions">
          <button
            type="button"
            className="myjobs-btn-primary"
            onClick={() => handleApplyNow(job._id)}
          >
            <span>Ứng tuyển ngay</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            type="button"
            className="myjobs-btn-outline"
            disabled={actionLoading === job._id}
            onClick={() => handleUnsaveJob(job._id)}
          >
            <BookmarkX className="w-4 h-4" />
            <span>
              {actionLoading === job._id ? "Đang xử lý..." : "Bỏ lưu"}
            </span>
          </button>
        </div>
      </article>
    );
  };

  if (!user) return null;

  return (
    <div className="myjobs-wrapper">
      {/* 2 NÚT / TAB ĐẦU TRANG */}
      <div className="myjobs-tabs">
        <button
          type="button"
          className={`myjobs-tab ${
            activeTab === "applied" ? "active" : ""
          }`}
          onClick={() => setActiveTab("applied")}
        >
          Việc làm đã ứng tuyển
        </button>
        <button
          type="button"
          className={`myjobs-tab ${
            activeTab === "saved" ? "active" : ""
          }`}
          onClick={() => setActiveTab("saved")}
        >
          Việc làm đã lưu
        </button>
      </div>

      {error && <p className="myjobs-error">{error}</p>}

      {loading ? (
        <div className="myjobs-empty">Đang tải danh sách việc làm của bạn...</div>
      ) : activeTab === "applied" ? (
        appliedJobs.length === 0 ? (
          <div className="myjobs-empty">
            Bạn chưa ứng tuyển việc làm nào.
          </div>
        ) : (
          <div className="myjobs-list">
            {appliedJobs.map(renderAppliedCard)}
          </div>
        )
      ) : savedJobs.length === 0 ? (
        <div className="myjobs-empty">
          Bạn chưa lưu việc làm nào.
        </div>
      ) : (
        <div className="myjobs-list">{savedJobs.map(renderSavedCard)}</div>
      )}
    </div>
  );
}
