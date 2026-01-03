// src/pages/MyJobsPage.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // Giữ lại navigate cho nút Back nếu cần
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

// ✅ 1. Import Modal Mới
import JobDetailModal from "../Home/components/JobDetailModal";

import "../styles/job-search.css";

export default function MyJobsPage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("applied");
  const [appliedJobs, setAppliedJobs] = useState([]); 
  const [savedJobs, setSavedJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);
  const [error, setError] = useState(null);

  // ✅ 2. State quản lý Modal
  const [selectedJob, setSelectedJob] = useState(null);

  /* ===================== HELPERS ===================== */
  const getStatusInfo = (label) => {
    const s = (label || "").toLowerCase();
    if (!s || s === "new") return { text: "Chưa xem", variant: "pending" };
    if (s === "viewed") return { text: "Đã xem", variant: "viewed" };
    if (s === "shortlisted") return { text: "Qua vòng hồ sơ", variant: "processing" };
    if (s === "interviewing") return { text: "Mời phỏng vấn", variant: "processing" };
    if (s === "offered") return { text: "Đề nghị nhận việc", variant: "accepted" };
    if (s === "hired") return { text: "Đã nhận việc", variant: "accepted" };
    if (s === "rejected") return { text: "Bị loại", variant: "rejected" };
    return { text: label, variant: "pending" };
  };

  const formatSalary = (salary) => {
    if (!salary) return "Thỏa thuận";
    if (typeof salary === "string") return salary;
    if (typeof salary === "object") {
      const { minSalary, maxSalary, currency } = salary || {};
      if (!currency || currency === "VND") {
        const toMillion = (num) => {
          if (!num) return 0;
          return (num / 1000000).toLocaleString('vi-VN', { maximumFractionDigits: 1 });
        };
        if (minSalary && maxSalary) return `${toMillion(minSalary)} - ${toMillion(maxSalary)} triệu`;
        if (minSalary) return `Từ ${toMillion(minSalary)} triệu`;
        if (maxSalary) return `Tối đa ${toMillion(maxSalary)} triệu`;
      } 
      else {
        const formatNum = (num) => num.toLocaleString('en-US');
        if (minSalary && maxSalary) return `${formatNum(minSalary)} - ${formatNum(maxSalary)} ${currency}`;
        if (minSalary) return `Từ ${formatNum(minSalary)} ${currency}`;
        if (maxSalary) return `Tối đa ${formatNum(maxSalary)} ${currency}`;
      }
    }
    if (typeof salary === "number") {
       return (salary / 1000000).toLocaleString('vi-VN', { maximumFractionDigits: 1 }) + " triệu";
    }
    return "Thỏa thuận";
  };

  const formatDate = (d) => {
    if (!d) return "Không rõ";
    const date = new Date(d);
    if (isNaN(date.getTime())) return "Không rõ";
    return date.toLocaleDateString("vi-VN");
  };

  /* ===================== FETCH DATA ===================== */
  useEffect(() => {
    if (!user?.email) return;
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await client.get(`/api/candidate?email=${encodeURIComponent(user.email)}`);
        const candidate = res.data?.data || res.data;
        const candidateId = candidate?._id;
        const appliedList = (candidate?.appliedJobs || []).map((x) => x.toString());
        const savedList = (candidate?.listSaveJobs || []).map((x) => x.toString());

        const applied = await Promise.all(
          appliedList.map(async (jobId) => {
            const jobRes = await client.get(`/api/post-job/id?jobId=${encodeURIComponent(jobId)}`);
            const job = jobRes.data?.data || jobRes.data;
            let application = { label: "New" };
            if (candidateId) {
              try {
                const appRes = await client.get(
                  `/api/application/byCandidateJob?candidateId=${encodeURIComponent(candidateId)}&jobId=${encodeURIComponent(jobId)}`
                );
                application = appRes.data?.data || appRes.data || { label: "New" };
              } catch (e) {
                application = { label: "New" };
              }
            }
            return { job, application };
          })
        );

        const saved = await Promise.all(
          savedList.map(async (jobId) => {
            const jobRes = await client.get(`/api/post-job/id?jobId=${encodeURIComponent(jobId)}`);
            return jobRes.data?.data || jobRes.data;
          })
        );

        setAppliedJobs(applied.filter((x) => x?.job));
        setSavedJobs(saved.filter(Boolean));
      } catch (err) {
        console.error(err);
        setError(err.response?.data?.message || "Không tải được danh sách việc làm của bạn.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user?.email]);

  /* ===================== ACTIONS ===================== */
  const handleRemoveApplication = async (jobId) => {
    if (!user?.email) return;
    setActionLoading(jobId);
    try {
      await client.patch(`/api/post-job/removeApplyJob?jobId=${encodeURIComponent(jobId)}`, {
        email: user.email,
      });
      setAppliedJobs((prev) => prev.filter((item) => item.job?._id !== jobId));
      // Nếu đang mở modal của job này thì đóng luôn
      if (selectedJob?._id === jobId) setSelectedJob(null);
    } catch (err) {
      console.error(err);
      alert("Không thể xóa đơn ứng tuyển.");
    } finally {
      setActionLoading(null);
    }
  };

  const handleUnsaveJob = async (jobId) => {
    if (!user?.email) return;
    setActionLoading(jobId);
    try {
      await client.patch(`/api/post-job/removeSaveJob?jobId=${encodeURIComponent(jobId)}`, {
        email: user.email,
      });
      setSavedJobs((prev) => prev.filter((job) => job?._id !== jobId));
      // Nếu đang mở modal của job này thì đóng
      if (selectedJob?._id === jobId) setSelectedJob(null);
    } catch (err) {
      console.error(err);
      alert("Không thể bỏ lưu việc làm.");
    } finally {
      setActionLoading(null);
    }
  };

  // ✅ Callback xử lý khi User tương tác TRONG MODAL
  // 1. Khi User bấm nút Lưu/Bỏ lưu trong Modal
  const handleToggleSaveFromModal = async (job) => {
    const isSaved = savedJobs.some(j => j._id === job._id);
    if (isSaved) {
        await handleUnsaveJob(job._id); // Đã có logic xóa khỏi state
    } else {
        // Logic lưu lại (nếu cần thiết, nhưng ở trang MyJobs thường là xem cái đã có)
        // Ở đây mình chỉ xử lý Unsave vì trang này là "Việc làm đã lưu"
        await handleUnsaveJob(job._id);
    }
  };

  // 2. Khi User bấm Hủy đơn trong Modal
  const handleUnapplyFromModal = async (jobId) => {
      await handleRemoveApplication(jobId);
  };

  /* ===================== UI RENDER ===================== */
  const renderAppliedCard = ({ job, application }) => {
    if (!job) return null;
    const label = application?.label || "New";
    const { text, variant } = getStatusInfo(label);

    return (
      <article key={job._id} className="myjobs-card">
        {/* ✅ Sửa onClick: Mở Modal thay vì Navigate */}
        <div className="myjobs-card-main" onClick={() => setSelectedJob(job)}>
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
              <span>{Array.isArray(job.applicants) ? job.applicants.length : 0} ứng viên</span>
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
            onClick={(e) => { e.stopPropagation(); handleRemoveApplication(job._id); }}
            type="button"
          >
            <Trash2 className="w-4 h-4" />
            {actionLoading === job._id ? "Đang xóa..." : "Xóa đơn"}
          </button>
        </div>
      </article>
    );
  };

  const renderSavedCard = (job) => {
    if (!job) return null;
    return (
      <article key={job._id} className="myjobs-card">
        {/* ✅ Sửa onClick: Mở Modal */}
        <div className="myjobs-card-main" onClick={() => setSelectedJob(job)}>
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
              <Calendar className="myjobs-meta-icon" />
              <span>Đăng ngày {formatDate(job.postedAt || job.createdAt)}</span>
            </div>
          </div>
        </div>

        <div className="myjobs-card-actions">
          <button className="myjobs-btn-primary" onClick={(e) => {e.stopPropagation(); navigate(`/apply/${job._id}`);}} type="button">
            Ứng tuyển <ArrowRight className="w-4 h-4" />
          </button>
          <button
            className="myjobs-btn-outline"
            disabled={actionLoading === job._id}
            onClick={(e) => { e.stopPropagation(); handleUnsaveJob(job._id); }}
            type="button"
          >
            <BookmarkX className="w-4 h-4" />
            {actionLoading === job._id ? "Đang xử lý..." : "Bỏ lưu"}
          </button>
        </div>
      </article>
    );
  };

  if (!user) return null;

  return (
    <div className="myjobs-wrapper">
      <div className="myjobs-tabs">
        <button
          className={`myjobs-tab ${activeTab === "applied" ? "active" : ""}`}
          onClick={() => setActiveTab("applied")}
          type="button"
        >
          Việc làm đã ứng tuyển
        </button>
        <button
          className={`myjobs-tab ${activeTab === "saved" ? "active" : ""}`}
          onClick={() => setActiveTab("saved")}
          type="button"
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

      {/* ✅ 3. RENDER MODAL */}
      {selectedJob && (
        <JobDetailModal
            job={selectedJob}
            onClose={() => setSelectedJob(null)}
            
            // Kiểm tra xem job này có trong danh sách savedJobs không
            isSaved={savedJobs.some(j => j._id === selectedJob._id)}
            
            // Xử lý sự kiện từ Modal
            onSave={handleToggleSaveFromModal} 
            onUnapply={handleUnapplyFromModal}
        />
      )}
    </div>
  );
}