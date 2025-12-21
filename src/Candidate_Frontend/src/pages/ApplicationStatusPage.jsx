// src/pages/ApplicationStatusPage.jsx
import React, { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import client from "../api/client";
import {
  AlertCircle,
  CheckCircle,
  Clock3,
  FileText,
  Building2,
  MapPin,
  DollarSign,
  ChevronLeft,
  ExternalLink,
} from "lucide-react";

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

const getCompanyName = (job) =>
  job?.companyName ||
  job?.company?.name ||
  (typeof job?.company === "string" ? job.company : "Công ty");

const getLocation = (job) =>
  job?.location || job?.address || job?.city || "Chưa cập nhật";

const formatDateTimeVN = (value) => {
  if (!value) return "Không rõ";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "Không rõ";
  return d.toLocaleString("vi-VN", {
    year: "numeric",
    month: "long",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const pickResumeNameFromUrl = (url) => {
  if (!url) return "CV đã nộp";
  try {
    const pathname = new URL(url).pathname;
    const last = pathname.split("/").filter(Boolean).pop();
    return decodeURIComponent(last || "CV đã nộp");
  } catch {
    // url có thể không phải absolute
    const parts = String(url).split("/").filter(Boolean);
    return decodeURIComponent(parts[parts.length - 1] || "CV đã nộp");
  }
};

const STATUS_META = {
  New: { label: "Đang chờ xem", tone: "info", icon: Clock3 },
  Viewed: { label: "Đã xem", tone: "neutral", icon: CheckCircle },
  Interviewing: { label: "Đang phỏng vấn", tone: "purple", icon: Clock3 },
  Rejected: { label: "Từ chối", tone: "danger", icon: AlertCircle },
  Hired: { label: "Trúng tuyển", tone: "success", icon: CheckCircle },
};

async function tryGetFirst(urls) {
  let lastErr = null;
  for (const u of urls) {
    try {
      const res = await client.get(u);
      const data = res.data?.success && res.data?.data ? res.data.data : res.data;
      return data;
    } catch (e) {
      lastErr = e;
    }
  }
  throw lastErr;
}

export default function ApplicationStatusPage() {
  const { id: jobId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [job, setJob] = useState(null);
  const [application, setApplication] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const statusMeta = useMemo(() => {
    const key = application?.label || "New";
    return STATUS_META[key] || STATUS_META.New;
  }, [application?.label]);

  useEffect(() => {
    const run = async () => {
      setLoading(true);
      setError(null);

      try {
        if (!jobId) throw new Error("Thiếu jobId");
        if (!user?.email) throw new Error("Bạn cần đăng nhập để xem trạng thái ứng tuyển.");

        // 1) Fetch job info (bạn đã có endpoint này)
        const jobRes = await client.get(`/api/post-job/id?jobId=${jobId}`);
        const jobData =
          jobRes.data?.success && jobRes.data?.data ? jobRes.data.data : jobRes.data;
        setJob(jobData || null);

        // 2) Fetch candidate -> lấy candidateId
        const candRes = await client.get(`/api/candidate?email=${user.email}`);
        const candData =
          candRes.data?.success && candRes.data?.data ? candRes.data.data : candRes.data;

        const candidateId = candData?._id;
        if (!candidateId) throw new Error("Không tìm thấy hồ sơ ứng viên.");

        // 3) Fetch application theo (jobId + candidateId)
        // Bạn chỉ cần đảm bảo backend có 1 trong các endpoint dưới đây:
        const appData = await tryGetFirst([
          `/api/application/by-job?jobId=${jobId}&candidateId=${candidateId}`,
          `/api/application/byJob?jobId=${jobId}&candidateId=${candidateId}`,
          `/api/application?jobId=${jobId}&candidateId=${candidateId}`,
          `/api/application/status?jobId=${jobId}&candidateId=${candidateId}`,
        ]);

        // Kỳ vọng appData là object Application:
        // { candidateId, jobId, CV_url:{url}, label, createdAt/appliedDate }
        setApplication(appData || null);
      } catch (e) {
        console.error(e);
        setError(e?.response?.data?.message || e?.message || "Không tải được dữ liệu.");
        setJob(null);
        setApplication(null);
      } finally {
        setLoading(false);
      }
    };

    run();
  }, [jobId, user?.email]);

  const resumeUrl = application?.CV_url?.url || "";
  const resumeName = pickResumeNameFromUrl(resumeUrl);
  const StatusIcon = statusMeta.icon;

  return (
    <div className="appstat-page">
      <div className="appstat-container">
        {/* Top bar */}
        <div className="appstat-topbar">
          <button className="appstat-back" onClick={() => navigate(-1)} type="button">
            <ChevronLeft size={18} />
            Quay lại
          </button>

          <div className="appstat-topbar-right">
            <Link className="appstat-link" to="/">
              Trang chủ
            </Link>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="appstat-alert appstat-alert--danger">
            <AlertCircle className="appstat-alert-icon" />
            <div>
              <div className="appstat-alert-title">Có lỗi xảy ra</div>
              <div className="appstat-alert-text">{error}</div>
            </div>
          </div>
        )}

        {/* Loading */}
        {loading ? (
          <div className="appstat-skeleton">
            <div className="sk-card sk-card--hero" />
            <div className="sk-card" />
            <div className="sk-card" />
          </div>
        ) : !application ? (
          <div className="appstat-empty">
            <div className="appstat-empty-card">
              <AlertCircle className="appstat-empty-icon" />
              <h2>Chưa có đơn ứng tuyển</h2>
              <p>
                Bạn chưa ứng tuyển công việc này (hoặc hệ thống chưa tìm thấy đơn ứng tuyển).
              </p>
              <div className="appstat-empty-actions">
                <Link to={`/apply/${jobId}`} className="appstat-btn-primary">
                  Đi tới trang ứng tuyển
                </Link>
                <button onClick={() => navigate(-1)} className="appstat-btn-ghost" type="button">
                  Quay lại
                </button>
              </div>
            </div>
          </div>
        ) : (
          <>
            {/* Hero notice */}
            <div className="appstat-hero">
              <div className="appstat-hero-left">
                <div className="appstat-hero-icon">
                  <StatusIcon size={20} />
                </div>
                <div>
                  <div className="appstat-hero-title">Bạn đã ứng tuyển công việc này</div>
                  <div className="appstat-hero-sub">
                    Hệ thống đã ghi nhận đơn ứng tuyển của bạn. Bạn có thể theo dõi trạng thái tại đây.
                  </div>
                </div>
              </div>

              <div className={`appstat-pill appstat-pill--${statusMeta.tone}`}>
                <span className="appstat-pill-dot" />
                {statusMeta.label}
              </div>
            </div>

            {/* Job card */}
            <div className="appstat-card">
              <div className="appstat-card-head">
                <div className="appstat-card-title">Thông tin công việc</div>
                <Link to={`/jobs/${jobId}`} className="appstat-card-link">
                  Xem chi tiết <ExternalLink size={16} />
                </Link>
              </div>

              <div className="appstat-job">
                <div className="appstat-job-title">
                  {job?.title || job?.jobTitle || "Vị trí tuyển dụng"}
                </div>

                <div className="appstat-job-meta">
                  <div className="appstat-meta-item">
                    <Building2 size={16} />
                    <span>{getCompanyName(job)}</span>
                  </div>
                  <div className="appstat-meta-item">
                    <MapPin size={16} />
                    <span>{getLocation(job)}</span>
                  </div>
                  <div className="appstat-meta-item">
                    <DollarSign size={16} />
                    <span>{formatSalary(job?.salary)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Application details */}
            <div className="appstat-grid">
              <div className="appstat-card">
                <div className="appstat-card-head">
                  <div className="appstat-card-title">Chi tiết ứng tuyển</div>
                </div>

                <div className="appstat-kv">
                  <div className="appstat-kv-row">
                    <div className="appstat-kv-key">Ngày nộp</div>
                    <div className="appstat-kv-val">
                      {formatDateTimeVN(application?.appliedDate || application?.createdAt)}
                    </div>
                  </div>

                  <div className="appstat-kv-row">
                    <div className="appstat-kv-key">Trạng thái</div>
                    <div className="appstat-kv-val">
                      <span className={`appstat-badge appstat-badge--${statusMeta.tone}`}>
                        {statusMeta.label}
                      </span>
                    </div>
                  </div>

                  <div className="appstat-kv-row">
                    <div className="appstat-kv-key">Email</div>
                    <div className="appstat-kv-val">{user?.email}</div>
                  </div>
                </div>

                <div className="appstat-note">
                  <b>Lưu ý:</b> Mỗi công việc chỉ cho phép nộp 01 hồ sơ. Nếu muốn cập nhật CV, bạn có thể liên hệ nhà tuyển dụng hoặc bộ phận hỗ trợ.
                </div>
              </div>

              <div className="appstat-card">
                <div className="appstat-card-head">
                  <div className="appstat-card-title">CV đã nộp</div>
                </div>

                {resumeUrl ? (
                  <div className="appstat-resume">
                    <div className="appstat-resume-icon">
                      <FileText size={18} />
                    </div>

                    <div className="appstat-resume-body">
                      <div className="appstat-resume-name">{resumeName}</div>
                      <div className="appstat-resume-sub">Nhấn để mở / tải xuống CV bạn đã nộp.</div>
                    </div>

                    <a
                      className="appstat-btn-primary"
                      href={resumeUrl}
                      target="_blank"
                      rel="noreferrer"
                    >
                      Mở CV
                    </a>
                  </div>
                ) : (
                  <div className="appstat-empty-mini">
                    Không tìm thấy CV trong đơn ứng tuyển.
                  </div>
                )}
              </div>
            </div>

            {/* Footer actions */}
            <div className="appstat-actions">
              <Link to={`/jobs/${jobId}`} className="appstat-btn-ghost">
                Quay lại trang chi tiết job
              </Link>
              <Link to="/my-applications" className="appstat-btn-primary">
                Xem danh sách đã ứng tuyển
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
