// src/pages/ApplicationPage.jsx
import React, { useState, useEffect } from "react";
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
} from "lucide-react";

export default function ApplicationPage() {
  const { id: jobId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [candidate, setCandidate] = useState(null);
  const [candidateCVs, setCandidateCVs] = useState([]);
  const [loadingCVs, setLoadingCVs] = useState(true);

  // ✅ JOB INFO
  const [job, setJob] = useState(null);
  const [loadingJob, setLoadingJob] = useState(true);

  const [selectedCV, setSelectedCV] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // ---------------------- HELPERS ---------------------- //

  const formatSalary = (salary) => {
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
  };

  const getCompanyName = (jobData) => {
    // tùy schema: có thể là job.companyName hoặc job.company?.name hoặc job.company
    return (
      jobData?.companyName ||
      jobData?.company?.name ||
      (typeof jobData?.company === "string" ? jobData.company : null) ||
      "Công ty"
    );
  };

  const getLocation = (jobData) => {
    // tùy schema: job.location hoặc job.address hoặc job.city
    return jobData?.location || jobData?.address || jobData?.city || "Chưa cập nhật";
  };

  // ---------------------- FETCH JOB INFO ---------------------- //

  const fetchJobInfo = async () => {
    if (!jobId) {
      setJob(null);
      setLoadingJob(false);
      return;
    }

    setLoadingJob(true);
    try {
      // ✅ Route backend của bạn: /api/post-job/id?jobId=
      const res = await client.get(`/api/post-job/id?jobId=${jobId}`);

      const jobData =
        res.data?.success && res.data?.data ? res.data.data : res.data;

      setJob(jobData || null);
    } catch (err) {
      console.error("Fetch job error:", err);
      setJob(null);
    } finally {
      setLoadingJob(false);
    }
  };

  useEffect(() => {
    fetchJobInfo();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [jobId]);

  // ---------------------- FETCH CV LIST ---------------------- //

  const normalizeCVArray = (cv) => {
    if (!cv) return [];
    let arr = Array.isArray(cv) ? cv : [cv];

    return arr.sort(
      (a, b) =>
        new Date(b.uploadedAt || 0).getTime() -
        new Date(a.uploadedAt || 0).getTime()
    );
  };

  const fetchCandidateCVs = async (email) => {
    if (!email) {
      setCandidate(null);
      setCandidateCVs([]);
      setLoadingCVs(false);
      return;
    }

    setLoadingCVs(true);
    try {
      const res = await client.get(`/api/candidate?email=${email}`);

      const candidateData =
        res.data?.success && res.data.data ? res.data.data : res.data;

      setCandidate(candidateData || null);

      const cvArray = normalizeCVArray(candidateData?.CV);
      setCandidateCVs(cvArray);

      if (cvArray.length > 0) {
        setSelectedCV(cvArray[0]._id);
      } else {
        setSelectedCV(null);
      }
    } catch (err) {
      console.error(err);
      setCandidate(null);
      setCandidateCVs([]);
    } finally {
      setLoadingCVs(false);
    }
  };

  useEffect(() => {
    if (user?.email) fetchCandidateCVs(user.email);
    else setLoadingCVs(false);
  }, [user?.email]);

  // ------------------------- HANDLERS ------------------------ //

  const handleSelectCV = (cvId) => {
    setSelectedCV(cvId);
    setError(null);
  };

  const handleSubmit = async () => {
    if (!selectedCV) {
      setError("Vui lòng chọn một hồ sơ xin việc.");
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    if (!user?.email) {
      setError("Bạn cần đăng nhập để nộp hồ sơ.");
      return;
    }

    if (!candidate?._id) {
      setError("Không tìm thấy hồ sơ ứng viên. Vui lòng hoàn thiện thông tin cá nhân trước.");
      return;
    }

    if (!jobId) {
      setError("Thiếu thông tin công việc.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const body = {
        candidateId: candidate._id,
        jobId: jobId,
        resumeId: selectedCV,
      };

      await client.post("/api/application", body);
      setIsSuccess(true);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Nộp hồ sơ thất bại. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  /* ---------------------- SUCCESS UI ---------------------- */

  if (isSuccess) {
    return (
      <div className="apply-success-wrapper">
        <div className="apply-success-card">
          <div className="apply-success-icon-wrap">
            <CheckCircle className="apply-success-icon" />
          </div>

          <h2 className="apply-success-title">Nộp hồ sơ thành công!</h2>
          <p className="apply-success-desc">
            Hồ sơ của bạn đã được gửi và đang được nhà tuyển dụng xem xét.
          </p>

          <div className="apply-success-meta">
            <div>
              <span className="apply-meta-label">Email</span>
              <p className="apply-meta-value">{user?.email}</p>
            </div>
            <div>
              <span className="apply-meta-label">Mã công việc</span>
              <p className="apply-meta-value">
                #{jobId?.slice(-6).toUpperCase()}
              </p>
            </div>
          </div>

          <div className="apply-success-actions">
            <button
              onClick={() => navigate("/my-applications")}
              className="apply-btn-primary"
            >
              Xem hồ sơ đã nộp <ChevronRight size={18} />
            </button>

            <button onClick={() => navigate("/")} className="apply-btn-ghost">
              Tìm thêm việc làm
            </button>
          </div>
        </div>
      </div>
    );
  }

  /* ------------------------ MAIN FORM UI ------------------------ */

  return (
    <div className="apply-page">
      <div className="apply-container">
        {error && (
          <div className="apply-error">
            <AlertCircle className="apply-error-icon" />
            <div>
              <h3 className="apply-error-title">Có lỗi xảy ra</h3>
              <p className="apply-error-text">{error}</p>
            </div>
          </div>
        )}

        {/* ✅ JOB INFO CARD */}
        <div className="apply-job-card">
          <div className="apply-job-card-top">
            <div className="apply-job-badge">
              <span className="apply-job-badge-dot" />
              <span>THÔNG TIN CÔNG VIỆC</span>
            </div>

            <button
              type="button"
              className="apply-job-link"
              onClick={() => navigate(-1)}
              title="Quay lại trang trước để xem chi tiết"
            >
              Xem chi tiết
            </button>
          </div>

          <div className="apply-job-card-body">
            {loadingJob ? (
              <p className="apply-loading-text">Đang tải thông tin công việc...</p>
            ) : !job ? (
              <div className="apply-empty-cv">
                <p>Không tải được thông tin công việc.</p>
                <p>Bạn có thể quay lại danh sách việc làm và thử lại.</p>
              </div>
            ) : (
              <>
                <div className="apply-job-main">
                  <div className="apply-job-icon">
                    <Briefcase size={18} />
                  </div>

                  <div className="apply-job-head">
                    <h2 className="apply-job-title-text">
                      {job?.title || job?.jobTitle || "Vị trí tuyển dụng"}
                    </h2>
                  </div>

                  <div className="apply-job-chip">
                    {formatSalary(job?.salary)}
                  </div>
                </div>

                <div className="apply-job-meta-grid">
                  <div className="apply-job-meta-item">
                    <Building2 size={16} />
                    <div>
                      <span className="apply-job-meta-label">Công ty</span>
                      <p className="apply-job-meta-value">{getCompanyName(job)}</p>
                    </div>
                  </div>

                  <div className="apply-job-meta-item">
                    <MapPin size={16} />
                    <div>
                      <span className="apply-job-meta-label">Địa điểm</span>
                      <p className="apply-job-meta-value">{getLocation(job)}</p>
                    </div>
                  </div>

                  <div className="apply-job-meta-item">
                    <DollarSign size={16} />
                    <div>
                      <span className="apply-job-meta-label">Mức lương</span>
                      <p className="apply-job-meta-value">{formatSalary(job?.salary)}</p>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        {/* ✅ CV SELECT CARD */}
        <div className="apply-card">
          <div className="apply-card-header">
            <h1 className="apply-card-title">Chọn hồ sơ xin việc</h1>
            <p className="apply-card-sub">
              Vui lòng chọn một CV đã lưu để nộp cho công việc này.
            </p>
          </div>

          <div className="apply-card-body">
            {loadingCVs ? (
              <p className="apply-loading-text">Đang tải danh sách hồ sơ của bạn...</p>
            ) : candidateCVs.length > 0 ? (
              <div>
                <h2 className="apply-section-label">Hồ sơ của bạn</h2>

                <div className="apply-cv-list">
                  {candidateCVs.map((cv) => (
                    <label
                      key={cv._id}
                      className={`apply-cv-item ${selectedCV === cv._id ? "active" : ""}`}
                    >
                      <input
                        type="radio"
                        name="resume"
                        checked={selectedCV === cv._id}
                        onChange={() => handleSelectCV(cv._id)}
                        className="hidden"
                      />

                      <div className="apply-cv-icon">
                        <FileText size={20} />
                      </div>

                      <div>
                        <p className="apply-cv-name">{cv.name || "Hồ sơ xin việc"}</p>
                        <p className="apply-cv-meta">
                          Tải lên{" "}
                          {cv.uploadedAt
                            ? new Date(cv.uploadedAt).toLocaleDateString("vi-VN")
                            : "Không rõ"}
                        </p>
                      </div>

                      {selectedCV === cv._id && (
                        <CheckCircle className="apply-cv-check" />
                      )}
                    </label>
                  ))}
                </div>
              </div>
            ) : (
              <div className="apply-empty-cv">
                <p>Bạn chưa có hồ sơ xin việc nào.</p>
                <p>
                  Vui lòng tải CV lên tại trang <strong>CV của tôi</strong> trước khi ứng tuyển.
                </p>
              </div>
            )}
          </div>

          <div className="apply-card-footer">
            <button onClick={() => navigate(-1)} className="apply-btn-ghost">
              Hủy
            </button>

            <button
              onClick={handleSubmit}
              disabled={loading || candidateCVs.length === 0}
              className="apply-btn-primary"
            >
              {loading ? "Đang nộp..." : "Nộp hồ sơ"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
