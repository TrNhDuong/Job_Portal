// src/pages/MyJobsPage.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import client from "../api/client";
import Swal from "sweetalert2"; // Import thư viện SweetAlert2
import {
  saveJob as apiSaveJob,
  removeSaveJob as apiRemoveSaveJob,
} from "../api/candidate";

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
  // Lấy user + login để cập nhật Context sau khi xóa
  const { user, login } = useAuth();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("applied");
  const [appliedJobs, setAppliedJobs] = useState([]); // [{ job, application }]
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
          return (num / 1_000_000).toLocaleString("vi-VN", {
            maximumFractionDigits: 1,
          });
        };
        if (minSalary && maxSalary)
          return `${toMillion(minSalary)} - ${toMillion(maxSalary)} triệu`;
        if (minSalary) return `Từ ${toMillion(minSalary)} triệu`;
        if (maxSalary) return `Tối đa ${toMillion(maxSalary)} triệu`;
      } else {
        const formatNum = (num) =>
          typeof num === "number" ? num.toLocaleString("en-US") : num;
        if (minSalary && maxSalary)
          return `${formatNum(minSalary)} - ${formatNum(maxSalary)} ${currency}`;
        if (minSalary) return `Từ ${formatNum(minSalary)} ${currency}`;
        if (maxSalary) return `Tối đa ${formatNum(maxSalary)} ${currency}`;
      }
    }

    if (typeof salary === "number") {
      return (
        (salary / 1_000_000).toLocaleString("vi-VN", {
          maximumFractionDigits: 1,
        }) + " triệu"
      );
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
        // 1. Lấy candidate theo email
        const res = await client.get(
          `/api/candidate?email=${encodeURIComponent(user.email)}`
        );
        const candidate = res.data?.data || res.data;
        const candidateId = candidate?._id;

        const appliedList = (candidate?.appliedJobs || []).map((x) =>
          x.toString()
        );
        const savedList = (candidate?.listSaveJobs || []).map((x) =>
          x.toString()
        );

        // 2. Lấy full thông tin job + application cho các job đã apply
        const applied = await Promise.all(
          appliedList.map(async (jobId) => {
            const jobRes = await client.get(
              `/api/post-job/id?jobId=${encodeURIComponent(jobId)}`
            );
            const job = jobRes.data?.data || jobRes.data;

            let application = { label: "New" };
            if (candidateId) {
              try {
                // Lấy thông tin application (label, id, ...)
                const appRes = await client.get(
                  `/api/application/applicantinfo?candidateId=${encodeURIComponent(
                    candidateId
                  )}&jobId=${encodeURIComponent(jobId)}`
                );
                application = appRes.data?.data || appRes.data || { label: "New" };
              } catch (e) {
                application = { label: "New" };
              }
            }

            return { job, application };
          })
        );

        // 3. Lấy full thông tin job đã lưu
        const saved = await Promise.all(
          savedList.map(async (jobId) => {
            const jobRes = await client.get(
              `/api/post-job/id?jobId=${encodeURIComponent(jobId)}`
            );
            return jobRes.data?.data || jobRes.data;
          })
        );

        setAppliedJobs(applied.filter((x) => x?.job));
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
  }, [user?.email]);

  /* ===================== ACTIONS ===================== */

  // Xóa đơn ứng tuyển: dùng email + jobId, backend tự tìm Application và xóa
const handleRemoveApplication = async (jobId) => {
    if (!user?.email) return;
    const result = await Swal.fire({
        title: "Xác nhận xóa?",
        text: "Bạn có chắc muốn xóa đơn ứng tuyển này không? Hành động này không thể hoàn tác.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33", // Màu nút xóa
        cancelButtonColor: "#3085d6", // Màu nút hủy
        confirmButtonText: "Xóa ngay",
        cancelButtonText: "Hủy bỏ",
    });
    

    // 2. Nếu người dùng không nhấn nút "Xóa ngay" thì dừng lại
    if (!result.isConfirmed) return;

    // 3. Thực hiện logic xóa (giữ nguyên code cũ của bạn)
    setActionLoading(jobId);
    try {
        await client.patch(`/api/post-job/removeApplyJob`, {
            email: user.email,
            jobId,
        });

        // Cập nhật list ứng tuyển ở frontend
        setAppliedJobs((prev) =>
            prev.filter((item) => String(item.job?._id) !== String(jobId))
        );

        // Cập nhật Context
        if (user.appliedJobs) {
            const updatedAppliedList = user.appliedJobs.filter(
                (id) => String(id) !== String(jobId)
            );
            login({ ...user, appliedJobs: updatedAppliedList });
        }

        // Đóng modal chi tiết job nếu đang mở
        if (selectedJob && String(selectedJob._id) === String(jobId)) {
            setSelectedJob(null);
        }

        // Thông báo thành công (Optional)
        Swal.fire("Đã xóa!", "Đơn ứng tuyển đã được xóa.", "success");

    } catch (err) {
        console.error(err);
        Swal.fire("Lỗi!", "Không thể xóa đơn ứng tuyển. Vui lòng thử lại.", "error");
    } finally {
        setActionLoading(null);
    }
};

  const handleSaveJob = async (job) => {
    if (!user?.email) return;
    const jobId = job._id;
    setActionLoading(jobId);

    try {
      await apiSaveJob(user.email, jobId);

      setSavedJobs((prev) => {
        const exists = prev.some(j => String(j._id) === String(jobId));
        return exists ? prev : [...prev, job];
      });

      if (Array.isArray(user.listSaveJobs)) {
        const isExist = user.listSaveJobs.some(id => String(id) === String(jobId));
        if (!isExist) {
          login({ ...user, listSaveJobs: [...user.listSaveJobs, jobId] });
        }
      }

    } catch (err) {
      console.error(err);
      alert("Không thể lưu việc làm. Vui lòng thử lại.");
    } finally {
      setActionLoading(null);
    }
  };

  const handleUnsaveJob = async (jobId) => {
    if (!user?.email) return;
    setActionLoading(jobId);
    try {
      await apiRemoveSaveJob(user.email, jobId);

      // Cập nhật UI list saved jobs
      setSavedJobs((prev) =>
        prev.filter((job) => String(job._id) !== String(jobId))
      );

      // Cập nhật Context
      if (Array.isArray(user.listSaveJobs)) {
        const updatedSaveList = user.listSaveJobs.filter(
          (id) => String(id) !== String(jobId)
        );
        login({ ...user, listSaveJobs: updatedSaveList });
      }

    } catch (err) {
      console.error(err);
      alert("Không thể bỏ lưu việc làm.");
    } finally {
      setActionLoading(null);
    }
  };


  const handleToggleSaveFromModal = async (job) => {
    const isAlreadySaved = savedJobs.some(
      (savedJob) => String(savedJob._id) === String(job._id)
    );

    if (isAlreadySaved) {
      await handleUnsaveJob(job._id);
    } else {
      await handleSaveJob(job);
    }
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
      <article
        key={`${job._id}-${application?._id || "noapp"}`}
        className="myjobs-card"
      >
        <div
          className="myjobs-card-main"
          onClick={() => setSelectedJob(job)}
        >
          <h3 className="myjobs-title">{job.title}</h3>
          <p className="myjobs-company">
            {job.company || "Không rõ công ty"}
          </p>

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
                {Array.isArray(job.applicants) ? job.applicants.length : 0} ứng viên
              </span>
            </div>
            <div className="myjobs-meta-item">
              <Calendar className="myjobs-meta-icon" />
              <span>
                Đăng ngày {formatDate(job.postedAt || job.createdAt)}
              </span>
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
            onClick={(e) => {
              e.stopPropagation();
              handleRemoveApplication(job._id);
            }}
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
        <div
          className="myjobs-card-main"
          onClick={() => setSelectedJob(job)}
        >
          <h3 className="myjobs-title">{job.title}</h3>
          <p className="myjobs-company">
            {job.company || "Không rõ công ty"}
          </p>

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
              <span>
                Đăng ngày {formatDate(job.postedAt || job.createdAt)}
              </span>
            </div>
          </div>
        </div>

        <div className="myjobs-card-actions">
          <button
            className="myjobs-btn-primary"
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/apply/${job._id}`);
            }}
            type="button"
          >
            Ứng tuyển <ArrowRight className="w-4 h-4" />
          </button>
          <button
            className="myjobs-btn-outline"
            disabled={actionLoading === job._id}
            onClick={(e) => {
              e.stopPropagation();
              handleUnsaveJob(job._id);
            }}
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
          className={`myjobs-tab ${
            activeTab === "applied" ? "active" : ""
          }`}
          onClick={() => setActiveTab("applied")}
          type="button"
        >
          Việc làm đã ứng tuyển
        </button>
        <button
          className={`myjobs-tab ${
            activeTab === "saved" ? "active" : ""
          }`}
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
          <div className="myjobs-list">
            {appliedJobs.map(renderAppliedCard)}
          </div>
        )
      ) : savedJobs.length === 0 ? (
        <div className="myjobs-empty">Bạn chưa lưu việc làm nào.</div>
      ) : (
        <div className="myjobs-list">
          {savedJobs.map(renderSavedCard)}
        </div>
      )}

      {selectedJob && (
        <JobDetailModal
          job={selectedJob}
          onClose={() => setSelectedJob(null)}
          isSaved={savedJobs.some(
            (j) => String(j._id) === String(selectedJob._id)
          )}
          onSave={handleToggleSaveFromModal}
          onUnapply={handleUnapplyFromModal}
        />
      )}
    </div>
  );
}
