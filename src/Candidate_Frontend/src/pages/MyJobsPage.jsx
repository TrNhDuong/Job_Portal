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

  const [activeTab, setActiveTab] = useState("applied"); 
  const [appliedJobs, setAppliedJobs] = useState([]);
  const [savedJobs, setSavedJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);
  const [error, setError] = useState(null);

  /* ===================== FETCH DATA ===================== */

  useEffect(() => {
    if (!user?.email) return;

    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        // ---- Lấy thông tin ứng viên ----
        const res = await client.get(`/api/candidate?email=${user.email}`);
        const candidate = res.data?.data || res.data;

        const listApply = candidate.appliedJobs || [];
        const listSaveJob = candidate.listSaveJobs || [];

        /* ===================== FETCH APPLIED JOBS ===================== */
        const applied = await Promise.all(
          listApply.map(async (app) => {
            const jobId = app.jobId || app.job || app.jobID || app;
            const jobRes = await client.get(
              `/api/post-job/id?jobId=${encodeURIComponent(jobId)}`
            );
            const job = jobRes.data?.data || jobRes.data;
            return { job, application: app };
          })
        );

        /* ===================== FETCH SAVED JOBS ===================== */
        const saved = await Promise.all(
          listSaveJob.map(async (item) => {
            const jobId = item.toString(); 
            const jobRes = await client.get(
              `/api/post-job/id?jobId=${encodeURIComponent(jobId)}`
            );
            return jobRes.data?.data || jobRes.data;
          })
        );

        setAppliedJobs(applied.filter((x) => x.job));
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

  /* ===================== HELPERS ===================== */

  const getStatusInfo = (status) => {
    const s = (status || "").toLowerCase();
    if (s === "pending" || s === "unseen" || !s)
      return { text: "Chưa xem", variant: "pending" };
    if (s === "viewed" || s === "seen")
      return { text: "Đã xem", variant: "viewed" };
    if (["rejected", "failed", "deny"].includes(s))
      return { text: "Bị loại", variant: "rejected" };
    if (["accepted", "pass", "success"].includes(s))
      return { text: "Chấp nhận", variant: "accepted" };
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

  const formatDate = (d) => {
    if (!d) return "Không rõ";
    const date = new Date(d);
    if (isNaN(date)) return "Không rõ";
    return date.toLocaleDateString("vi-VN");
  };

  /* ===================== ACTIONS ===================== */

  const handleRemoveApplication = async (jobId) => {
    if (!user?.email) return;
    setActionLoading(jobId);

    try {
      await client.patch(`/api/post-job/removeApplyJob?jobId=${jobId}`, {
        email: user.email,
      });

      setAppliedJobs((prev) => prev.filter((item) => item.job._id !== jobId));
    } catch (err) {
      alert("Không thể xóa đơn ứng tuyển.");
    } finally {
      setActionLoading(null);
    }
  };

  const handleUnsaveJob = async (jobId) => {
    if (!user?.email) return;
    setActionLoading(jobId);

    try {
      await client.patch(`/api/post-job/removeSaveJob?jobId=${jobId}`, {
        email: user.email,
      });

      setSavedJobs((prev) => prev.filter((job) => job._id !== jobId));
    } catch (err) {
      alert("Không thể bỏ lưu việc làm.");
    } finally {
      setActionLoading(null);
    }
  };

  const handleApplyNow = (jobId) => {
    navigate(`/apply/${jobId}`);
  };

  /* ===================== UI RENDER ===================== */

  const renderAppliedCard = ({ job, application }) => {
    const { text, variant } = getStatusInfo(application?.status);
    if (!job) return null;

    return (
      <article key={job._id} className="myjobs-card">
        <div
          className="myjobs-card-main"
          onClick={() => navigate(`/jobs/${job._id}`)}
        >
          <h3 className="myjobs-title">{job.title}</h3>
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
              <span>{job.applicantsCount || 0} ứng viên</span>
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
            className="myjobs-btn-danger"
            disabled={actionLoading === job._id}
            onClick={() => handleRemoveApplication(job._id)}
          >
            <Trash2 className="w-4 h-4" />
            {actionLoading === job._id ? "Đang xóa..." : "Xóa đơn ứng tuyển"}
          </button>
        </div>
      </article>
    );
  };

  const renderSavedCard = (job) => {
    if (!job) return null;

    return (
      <article key={job._id} className="myjobs-card">
        <div
          className="myjobs-card-main"
          onClick={() => navigate(`/jobs/${job._id}`)}
        >
          <h3 className="myjobs-title">{job.title}</h3>
          <p className="myjobs-company">{job.company}</p>

          <div className="myjobs-meta-row">
            <div className="myjobs-meta-item">
              <MapPin className="myjobs-meta-icon" />
              <span>{job.location}</span>
            </div>

            <div className="myjobs-meta-item">
              <DollarSign className="myjobs-meta-icon" />
              <span>{formatSalary(job.salary)}</span>
            </div>

            <div className="myjobs-meta-item">
              <Calendar className="myjobs-meta-icon" />
              <span>Đăng ngày {formatDate(job.postedAt)}</span>
            </div>
          </div>
        </div>

        <div className="myjobs-card-actions">
          <button
            className="myjobs-btn-primary"
            onClick={() => handleApplyNow(job._id)}
          >
            Ứng tuyển ngay <ArrowRight className="w-4 h-4" />
          </button>

          <button
            className="myjobs-btn-outline"
            disabled={actionLoading === job._id}
            onClick={() => handleUnsaveJob(job._id)}
          >
            <BookmarkX className="w-4 h-4" />
            {actionLoading === job._id ? "Đang xử lý..." : "Bỏ lưu"}
          </button>
        </div>
      </article>
    );
  };

  /* ===================== MAIN RETURN ===================== */

  if (!user) return null;

  return (
    <div className="myjobs-wrapper">
      {/* Tabs */}
      <div className="myjobs-tabs">
        <button
          className={`myjobs-tab ${activeTab === "applied" ? "active" : ""}`}
          onClick={() => setActiveTab("applied")}
        >
          Việc làm đã ứng tuyển
        </button>

        <button
          className={`myjobs-tab ${activeTab === "saved" ? "active" : ""}`}
          onClick={() => setActiveTab("saved")}
        >
          Việc làm đã lưu
        </button>
      </div>

      {error && <p className="myjobs-error">{error}</p>}

      {loading ? (
        <div className="myjobs-empty">Đang tải danh sách việc làm...</div>
      ) : activeTab === "applied" ? (
        appliedJobs.length === 0 ? (
          <div className="myjobs-empty">Bạn chưa ứng tuyển việc nào.</div>
        ) : (
          <div className="myjobs-list">{appliedJobs.map(renderAppliedCard)}</div>
        )
      ) : savedJobs.length === 0 ? (
        <div className="myjobs-empty">Bạn chưa lưu việc làm nào.</div>
      ) : (
        <div className="myjobs-list">{savedJobs.map(renderSavedCard)}</div>
      )}
    </div>
  );
}
