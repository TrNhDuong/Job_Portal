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
  const [selectedCV, setSelectedCV] = useState(null);

  const [job, setJob] = useState(null);

  const [loadingJob, setLoadingJob] = useState(true);
  const [loadingCVs, setLoadingCVs] = useState(true);
  const [loading, setLoading] = useState(false);

  const [error, setError] = useState(null);
  const [isSuccess, setIsSuccess] = useState(false);

  /* ===================== HELPERS ===================== */

  const formatSalary = (salary) => {
    if (!salary) return "Thỏa thuận";
    if (typeof salary === "string") return salary;
    if (typeof salary === "number") return salary.toString();

    if (typeof salary === "object") {
      const { minSalary, maxSalary, currency } = salary || {};
      const curr = currency || "";
      if (minSalary && maxSalary) return `${minSalary} - ${maxSalary} ${curr}`;
      if (minSalary) return `Từ ${minSalary} ${curr}`;
      if (maxSalary) return `Tối đa ${maxSalary} ${curr}`;
    }
    return "Thỏa thuận";
  };

  const getCompanyName = (job) =>
    job?.companyName ||
    job?.company?.name ||
    (typeof job?.company === "string" ? job.company : "Công ty");

  const getLocation = (job) =>
    job?.location || job?.address || job?.city || "Chưa cập nhật";

  const normalizeCVArray = (cv) => {
    if (!cv) return [];
    const arr = Array.isArray(cv) ? cv : [cv];
    return arr.sort(
      (a, b) =>
        new Date(b.uploadedAt || 0).getTime() -
        new Date(a.uploadedAt || 0).getTime()
    );
  };

  /* ===================== FETCH JOB ===================== */

  useEffect(() => {
    const fetchJob = async () => {
      if (!jobId) return setLoadingJob(false);

      try {
        const res = await client.get(`/api/post-job/id?jobId=${jobId}`);
        const data =
          res.data?.success && res.data?.data ? res.data.data : res.data;
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

      try {
        const res = await client.get(`/api/candidate?email=${user.email}`);
        const data =
          res.data?.success && res.data?.data ? res.data.data : res.data;

        setCandidate(data || null);

        const cvList = normalizeCVArray(data?.CV);
        setCandidateCVs(cvList);

        if (cvList.length > 0) {
          setSelectedCV(cvList[0]); // chọn CV mới nhất
        }
      } catch (err) {
        console.error(err);
        setCandidate(null);
        setCandidateCVs([]);
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

    setLoading(true);
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
    } finally {
      setLoading(false);
    }
  };

  /* ===================== SUCCESS UI ===================== */

  if (isSuccess) {
    return (
      <div className="apply-success-wrapper">
        <div className="apply-success-card">
          <CheckCircle className="apply-success-icon" />
          <h2>Nộp hồ sơ thành công!</h2>
          <p>Hồ sơ của bạn đã được gửi tới nhà tuyển dụng.</p>

          <div className="apply-success-actions">
            <button
              onClick={() => navigate("/my-applications")}
              className="apply-btn-primary"
            >
              Xem hồ sơ đã nộp <ChevronRight size={18} />
            </button>

            <button
              onClick={() => navigate("/")}
              className="apply-btn-ghost"
            >
              Tìm thêm việc làm
            </button>
          </div>
        </div>
      </div>
    );
  }

  /* ===================== MAIN UI ===================== */

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

        {/* JOB INFO */}
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
            >
              Xem chi tiết
            </button>
          </div>

          <div className="apply-job-card-body">
            <div className="apply-job-main">
              <div className="apply-job-icon">
                <Briefcase size={18} />
              </div>

              <div className="apply-job-head">
                <h2 className="apply-job-title-text">
                  {job?.title || "Vị trí tuyển dụng"}
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
                  <p className="apply-job-meta-value">
                    {getCompanyName(job)}
                  </p>
                </div>
              </div>

              <div className="apply-job-meta-item">
                <MapPin size={16} />
                <div>
                  <span className="apply-job-meta-label">Địa điểm</span>
                  <p className="apply-job-meta-value">
                    {getLocation(job)}
                  </p>
                </div>
              </div>

              <div className="apply-job-meta-item">
                <DollarSign size={16} />
                <div>
                  <span className="apply-job-meta-label">Mức lương</span>
                  <p className="apply-job-meta-value">
                    {formatSalary(job?.salary)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>


        {/* CV SELECT */}
        <div className="apply-card">
          <h1>Chọn hồ sơ xin việc</h1>

          {loadingCVs ? (
            <p>Đang tải CV...</p>
          ) : candidateCVs.length === 0 ? (
            <p>Bạn chưa có CV nào.</p>
          ) : (
            <div className="apply-cv-list">
              {candidateCVs.map((cv) => (
                <label
                  key={cv.public_id || cv.url}
                  className={`apply-cv-item ${
                    selectedCV?.url === cv.url ? "active" : ""
                  }`}
                >
                  <input
                    type="radio"
                    checked={selectedCV?.url === cv.url}
                    onChange={() => setSelectedCV(cv)}
                    hidden
                  />
                  <FileText />
                  <div>
                    <p>{cv.name || "CV xin việc"}</p>
                    <small>
                      Tải lên{" "}
                      {cv.uploadedAt
                        ? new Date(cv.uploadedAt).toLocaleDateString("vi-VN")
                        : ""}
                    </small>
                  </div>
                  {selectedCV?.url === cv.url && <CheckCircle />}
                </label>
              ))}
            </div>
          )}

          <div className="apply-card-footer">
            <button
              onClick={() => navigate(-1)}
              className="apply-btn-ghost"
            >
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
