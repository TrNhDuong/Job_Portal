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

import JobDetailModal from "../Home/components/JobDetailModal";
import "../styles/job-search.css";

export default function MyJobsPage() {
  // ✅ 1. Lấy thêm hàm login để cập nhật lại Context sau khi xóa
  const { user, login } = useAuth();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("applied");
  const [appliedJobs, setAppliedJobs] = useState([]); 
  const [savedJobs, setSavedJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);
  const [error, setError] = useState(null);

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
                  `/api/application/applicantinfo?candidateId=${encodeURIComponent(candidateId)}&jobId=${encodeURIComponent(jobId)}`
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

  /* ===================== ACTIONS (ĐÃ SỬA LOGIC) ===================== */
  
  // ✅ Logic xóa đơn ứng tuyển đã được cập nhật
  const handleRemoveApplication = async (jobId) => {
    if (!user?.email) return;
    if (!window.confirm("Bạn có chắc muốn xóa đơn ứng tuyển này không?")) return;

    setActionLoading(jobId);
    try {
      // Gọi API Backend
      await client.patch(`/api/post-job/removeApplyJob?jobId=${encodeURIComponent(jobId)}`, {
        email: user.email,
        applicationId: applicationId
      });

      // 1. Cập nhật State danh sách hiện tại (đảm bảo so sánh String ID)
      setAppliedJobs((prev) => prev.filter((item) => String(item.job?._id) !== String(jobId)));

      // 2. Cập nhật Context User (để đồng bộ với Modal và các trang khác)
      if (user.appliedJobs) {
        const updatedAppliedList = user.appliedJobs.filter(id => String(id) !== String(jobId));
        login({ ...user, appliedJobs: updatedAppliedList });
      }

      // 3. Nếu đang mở Modal của job này thì đóng lại
      if (selectedJob && String(selectedJob._id) === String(jobId)) {
        setSelectedJob(null);
      }

    } catch (err) {
      console.error(err);
      alert("Không thể xóa đơn ứng tuyển. Vui lòng thử lại.");
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
      
      // Update UI List
      setSavedJobs((prev) => prev.filter((job) => String(job._id) !== String(jobId)));
      
      // Update Context
      if (user.listSaveJobs) {
        const updatedSaveList = user.listSaveJobs.filter(id => String(id) !== String(jobId));
        login({ ...user, listSaveJobs: updatedSaveList });
      }

      if (selectedJob && String(selectedJob._id) === String(jobId)) {
        // Tùy chọn: Đóng modal hoặc giữ nguyên nhưng đổi icon
        // setSelectedJob(null); 
      }
    } catch (err) {
      console.error(err);
      alert("Không thể bỏ lưu việc làm.");
    } finally {
      setActionLoading(null);
    }
  };

  // Callbacks từ Modal
  const handleToggleSaveFromModal = async (job) => {
    // Logic trong Modal: Nếu đang ở trang Saved Jobs thì bấm nút sẽ là Bỏ lưu
    await handleUnsaveJob(job._id);
  };

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
            {actionLoading === job._id ? "Đang xử lý..." : "Xóa đơn"}
          </button>
        </div>
      </article>
    );
  };

  const renderSavedCard = (job) => {
    if (!job) return null;
    return (
      <article key={job._id} className="myjobs-card">
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

      {selectedJob && (
        <JobDetailModal
            job={selectedJob}
            onClose={() => setSelectedJob(null)}
            isSaved={savedJobs.some(j => String(j._id) === String(selectedJob._id))}
            onSave={handleToggleSaveFromModal} 
            onUnapply={handleUnapplyFromModal}
        />
      )}
    </div>
  );
}