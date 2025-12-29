import React, { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import client from "../api/client";
import {
  FileText,
  AlertCircle,
  CheckCircle,
  ChevronRight,
  Briefcase,
  MapPin,
  DollarSign,
  Building2,
  Loader2,
} from "lucide-react";

// 1. Import Component chi tiết
import JobDetailPanel from "../components/JobDetailPanel";

export default function ApplicationPage() {
  const { id: jobId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [candidate, setCandidate] = useState(null);
  const [candidateCVs, setCandidateCVs] = useState([]);
  const [selectedCV, setSelectedCV] = useState(null);

  const [job, setJob] = useState(null);

  const [loadingJob, setLoadingJob] = useState(true);
  const [loadingCVs, setLoadingCVs] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [error, setError] = useState(null);
  const [isSuccess, setIsSuccess] = useState(false);

  // 2. State quản lý hiển thị Modal
  const [showDetail, setShowDetail] = useState(false);

  /* ===================== HELPERS ===================== */
  const formatSalary = (salary) => {
    if (!salary) return "Thỏa thuận";
    if (typeof salary === "string") return salary;
    if (typeof salary === "number") return salary.toString();

    if (typeof salary === "object") {
      const { minSalary, maxSalary, currency } = salary || {};
      const curr = currency || "VND";
      if (minSalary != null && maxSalary != null) return `${minSalary} - ${maxSalary} ${curr}`;
      if (minSalary != null) return `Từ ${minSalary} ${curr}`;
      if (maxSalary != null) return `Tối đa ${maxSalary} ${curr}`;
    }
    return "Thỏa thuận";
  };

  const getCompanyName = (j) =>
    j?.companyName ||
    j?.company?.name ||
    (typeof j?.company === "string" ? j.company : "Công ty");

  const getLocation = (j) => j?.location || j?.address || j?.city || "Chưa cập nhật";

  const normalizeCVArray = (cv) => {
    if (!cv) return [];
    const arr = Array.isArray(cv) ? cv : [cv];
    return arr
      .filter(Boolean)
      .sort(
        (a, b) =>
          new Date(b.uploadedAt || 0).getTime() - new Date(a.uploadedAt || 0).getTime()
      );
  };

  const canSubmit = useMemo(() => {
    return !!(selectedCV?.url && candidate?._id && !submitting);
  }, [selectedCV?.url, candidate?._id, submitting]);

  /* ===================== FETCH JOB ===================== */
  useEffect(() => {
    const fetchJob = async () => {
      if (!jobId) {
        setLoadingJob(false);
        return;
      }

      setLoadingJob(true);
      try {
        const res = await client.get(`/api/post-job/id?jobId=${jobId}`);
        const data = res.data?.success && res.data?.data ? res.data.data : res.data;
        setJob(data || null);
      } catch (err) {
        console.error(err);
        setJob(null);
      } finally {
        setLoadingJob(false);
      }
    };

    fetchJob();
  }, [jobId]);

  /* ===================== FETCH CANDIDATE + CV ===================== */
  useEffect(() => {
    const fetchCandidate = async () => {
      if (!user?.email) {
        setLoadingCVs(false);
        return;
      }

      setLoadingCVs(true);
      try {
        const res = await client.get(`/api/candidate?email=${encodeURIComponent(user.email)}`);
        const data = res.data?.success && res.data?.data ? res.data.data : res.data;

        setCandidate(data || null);

        const cvList = normalizeCVArray(data?.CV);
        setCandidateCVs(cvList);

        if (cvList.length > 0) setSelectedCV(cvList[0]);
      } catch (err) {
        console.error(err);
        setCandidate(null);
        setCandidateCVs([]);
        setSelectedCV(null);
      } finally {
        setLoadingCVs(false);
      }
    };

    fetchCandidate();
  }, [user?.email]);

  /* ===================== SUBMIT ===================== */
  const handleSubmit = async () => {
    if (!selectedCV?.url) {
      setError("Vui lòng chọn một hồ sơ xin việc.");
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    if (!candidate?._id) {
      setError("Không tìm thấy thông tin ứng viên.");
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      await client.patch(`/api/post-job/applyJob?jobId=${jobId}`, {
        candidateId: candidate._id,
        email: user.email,
        cv_url: selectedCV.url,
      });

      setIsSuccess(true);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Nộp hồ sơ thất bại.");
      window.scrollTo({ top: 0, behavior: "smooth" });
    } finally {
      setSubmitting(false);
    }
  };

  /* ===================== SUCCESS UI ===================== */
  if (isSuccess) {
    return (
      <div className="apply-page">
        <div className="apply-container">
          <div className="apply-success">
            <div className="apply-success-icon">
              <CheckCircle size={40} />
            </div>
            <h2 className="apply-success-title">Nộp hồ sơ thành công!</h2>
            <p className="apply-success-desc">Hồ sơ của bạn đã được gửi tới nhà tuyển dụng.</p>

            <div className="apply-success-actions">
              <button onClick={() => navigate("/my-applications")} className="apply-btn apply-btn-primary">
                Xem hồ sơ đã nộp <ChevronRight size={18} />
              </button>

              <button onClick={() => navigate("/")} className="apply-btn apply-btn-ghost">
                Tìm thêm việc làm
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  /* ===================== MAIN UI ===================== */
  return (
    <div className="apply-page">
      <div className="apply-container">
        {/* Error */}
        {error && (
          <div className="apply-alert apply-alert-error">
            <AlertCircle size={18} />
            <div>
              <div className="apply-alert-title">Có lỗi xảy ra</div>
              <div className="apply-alert-text">{error}</div>
            </div>
          </div>
        )}

        {/* JOB INFO */}
        <section className="apply-panel">
          <div className="apply-panel-top">
            <div className="apply-panel-badge">
              <span className="dot" />
              THÔNG TIN CÔNG VIỆC
            </div>

            {/* 3. Sửa logic nút xem chi tiết: set state true */}
            <button 
                type="button" 
                className="apply-link" 
                onClick={() => setShowDetail(true)}
            >
              Xem chi tiết
            </button>
          </div>

          <div className="apply-job">
            <div className="apply-job-head">
              <div className="apply-job-icon">
                <Briefcase size={18} />
              </div>

              <div className="apply-job-title">
                <h2>{loadingJob ? "Đang tải..." : job?.title || "Vị trí tuyển dụng"}</h2>
                <p>{loadingJob ? " " : getCompanyName(job)}</p>
              </div>
            </div>

            <div className="apply-job-grid">
              <div className="apply-job-item">
                <Building2 size={16} />
                <div>
                  <span className="label">Công ty</span>
                  <span className="value">{loadingJob ? "Đang tải..." : getCompanyName(job)}</span>
                </div>
              </div>

              <div className="apply-job-item">
                <MapPin size={16} />
                <div>
                  <span className="label">Địa điểm</span>
                  <span className="value">{loadingJob ? "Đang tải..." : getLocation(job)}</span>
                </div>
              </div>

              <div className="apply-job-item">
                <DollarSign size={16} />
                <div>
                  <span className="label">Mức lương</span>
                  <span className="value">{loadingJob ? "Đang tải..." : formatSalary(job?.salary)}</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CV SELECT */}
        <section className="apply-card">
          <header className="apply-card-header">
            <div className="apply-card-title">Chọn hồ sơ xin việc</div>
            <div className="apply-card-sub">
              Hãy chọn 1 CV phù hợp nhất để nộp cho công việc này.
            </div>
          </header>

          <div className="apply-card-body">
            {loadingCVs ? (
              <div className="apply-loading">
                <Loader2 className="spin" size={18} />
                Đang tải CV...
              </div>
            ) : candidateCVs.length === 0 ? (
              <div className="apply-empty">
                <FileText size={22} />
                <div>
                  <div className="apply-empty-title">Bạn chưa có CV nào</div>
                  <div className="apply-empty-sub">Hãy tải CV lên trong hồ sơ của bạn trước khi ứng tuyển.</div>
                </div>
              </div>
            ) : (
              <div className="apply-cv-list">
                {candidateCVs.map((cv) => {
                  const active = selectedCV?.url === cv.url;
                  return (
                    <label key={cv.public_id || cv.url} className={`apply-cv ${active ? "is-active" : ""}`}>
                      <input
                        type="radio"
                        checked={active}
                        onChange={() => setSelectedCV(cv)}
                        hidden
                      />
                      <div className="apply-cv-left">
                        <div className="apply-cv-ico">
                          <FileText size={18} />
                        </div>
                        <div className="apply-cv-meta">
                          <div className="apply-cv-name">{cv.name || "CV xin việc"}</div>
                          <div className="apply-cv-time">
                            {cv.uploadedAt
                              ? `Tải lên ${new Date(cv.uploadedAt).toLocaleDateString("vi-VN")}`
                              : " "}
                          </div>
                        </div>
                      </div>

                      {active ? (
                        <div className="apply-cv-check">
                          <CheckCircle size={20} />
                        </div>
                      ) : null}
                    </label>
                  );
                })}
              </div>
            )}
          </div>

          <footer className="apply-card-footer">
            <button onClick={() => navigate(-1)} className="apply-btn apply-btn-ghost">
              Hủy
            </button>

            <button
              onClick={handleSubmit}
              disabled={!canSubmit || candidateCVs.length === 0}
              className="apply-btn apply-btn-primary"
            >
              {submitting ? (
                <>
                  <Loader2 className="spin" size={18} /> Đang nộp...
                </>
              ) : (
                "Nộp hồ sơ"
              )}
            </button>
          </footer>
        </section>
      </div>

      {/* 4. Thêm Modal hiển thị JobDetailPanel */}
      {showDetail && job && (
        <div 
            className="apply-modal-overlay" 
            onClick={() => setShowDetail(false)}
        >
            <div 
                className="apply-modal-content" 
                onClick={(e) => e.stopPropagation()}
            >
                <JobDetailPanel job={job} onClose={() => setShowDetail(false)} />
            </div>
        </div>
      )}
    </div>
  );
}