import React, { useEffect, useMemo, useState } from "react";
import { useParams, Link } from "react-router-dom";
import client from "../api/client";
import {
  Globe,
  MapPin,
  Users,
  Mail,
  Phone,
  Briefcase,
  Plus,
  Share2,
  Copy,
  Star,
} from "lucide-react";

import "../styles/employer-profile.css";

export default function EmployerProfilePage() {
  const { email } = useParams();
  const [employer, setEmployer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  const profileUrl = useMemo(() => {
    // chạy tốt cả local/prod
    return typeof window !== "undefined" ? window.location.href : "";
  }, []);

  useEffect(() => {
    const fetchEmployer = async () => {
      setLoading(true);
      try {
        const res = await client.get(`/api/employer?email=${encodeURIComponent(email)}`);
        const data = res.data?.data || null;
        setEmployer(data);
      } catch (err) {
        console.error(err);
        setEmployer(null);
      } finally {
        setLoading(false);
      }
    };

    fetchEmployer();
  }, [email]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(profileUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    } catch (e) {
      console.error("Copy failed:", e);
    }
  };

  if (loading) return <div className="emp-loading">Đang tải thông tin công ty...</div>;
  if (!employer) return <div className="emp-loading">Không tìm thấy công ty.</div>;

  const companyName = employer.company || "Công ty";
  const logoSrc = employer.logo?.url || "/logo-placeholder.png";
  const coverSrc = employer.wallpaper?.url || "/cover-placeholder.jpg";

  const contactEmail = employer.contact?.email || employer.email || "Chưa cập nhật";
  const contactPhone = employer.contact?.phone || employer.phone || "Chưa cập nhật";

  const jobs = Array.isArray(employer.jobPosted) ? employer.jobPosted : [];
  const point = typeof employer.point === "number" ? employer.point : 0;

  return (
    <div className="emp-page">
      {/* HERO */}
      <div className="emp-hero">
        <img src={coverSrc} alt="cover" className="emp-hero-bg" />

        <div className="emp-hero-overlay" />

        <div className="emp-hero-inner container">
          <div className="emp-hero-card">
            <div className="emp-logo">
              <img src={logoSrc} alt={companyName} />
            </div>

            <div className="emp-hero-main">
              <div className="emp-title-row">
                <h1 className="emp-name">{companyName}</h1>

                <div className="emp-badges">
                  <span className="emp-badge">
                    <Star size={14} />
                    <span>{point} điểm</span>
                  </span>

                  {employer.scale ? (
                    <span className="emp-badge subtle">
                      <Users size={14} />
                      <span>{employer.scale}</span>
                    </span>
                  ) : null}
                </div>
              </div>

              <div className="emp-meta">
                {employer.website ? (
                  <a
                    className="emp-meta-item link"
                    href={employer.website}
                    target="_blank"
                    rel="noreferrer"
                    title={employer.website}
                  >
                    <Globe size={16} />
                    <span>{employer.website}</span>
                  </a>
                ) : (
                  <div className="emp-meta-item">
                    <Globe size={16} />
                    <span>Website chưa cập nhật</span>
                  </div>
                )}

                <div className="emp-meta-item">
                  <MapPin size={16} />
                  <span>{employer.address || "Địa chỉ chưa cập nhật"}</span>
                </div>
              </div>
            </div>

            <div className="emp-hero-actions">
              <button type="button" className="emp-btn emp-btn-outline">
                <Plus size={18} />
                Theo dõi
              </button>

              <button type="button" className="emp-btn emp-btn-primary" onClick={handleCopy}>
                {copied ? <Copy size={18} /> : <Share2 size={18} />}
                {copied ? "Đã copy link" : "Chia sẻ"}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* BODY */}
      <div className="container emp-grid">
        {/* LEFT */}
        <div className="emp-col-main">
          {/* About */}
          <section className="emp-card">
            <header className="emp-card-header">
              <h2>Giới thiệu công ty</h2>
            </header>

            <div className="emp-card-body">
              <p className="emp-desc">
                {employer.description || "Công ty chưa cập nhật mô tả chi tiết."}
              </p>
            </div>
          </section>

          {/* Jobs */}
          <section className="emp-card">
            <header className="emp-card-header highlight">
              <h2>Việc làm đang tuyển</h2>
              <span className="emp-card-chip">
                <Briefcase size={14} />
                {jobs.length} tin
              </span>
            </header>

            <div className="emp-card-body">
              {jobs.length > 0 ? (
                <div className="emp-jobs">
                  {jobs.map((jobId) => (
                    <article key={jobId} className="emp-job">
                      <div className="emp-job-left">
                        <div className="emp-job-logo">
                          <img src={logoSrc} alt="logo" />
                        </div>

                        <div className="emp-job-info">
                          <h3 className="emp-job-title">
                            <span className="emp-job-title-main">Tin tuyển dụng</span>
                            <span className="emp-job-id">#{String(jobId).slice(-6).toUpperCase()}</span>
                          </h3>

                          <div className="emp-job-sub">
                            <MapPin size={14} />
                            <span>{employer.address || "Chưa cập nhật địa chỉ"}</span>
                          </div>
                        </div>
                      </div>

                      <div className="emp-job-actions">
                        {/* Nếu bạn có route job detail thì đổi Link này sang /jobs/:id */}
                        <Link to={`/apply/${jobId}`} className="emp-btn emp-btn-primary small">
                          Ứng tuyển
                        </Link>
                      </div>
                    </article>
                  ))}
                </div>
              ) : (
                <div className="emp-empty">
                  <p>Hiện tại công ty chưa có tin tuyển dụng.</p>
                </div>
              )}
            </div>
          </section>
        </div>

        {/* RIGHT */}
        <aside className="emp-col-sidebar">
          {/* Contact */}
          <section className="emp-card">
            <header className="emp-card-header">
              <h2>Thông tin liên hệ</h2>
            </header>

            <div className="emp-card-body">
              <div className="emp-contact">
                <div className="emp-contact-item">
                  <MapPin className="emp-icon" />
                  <div>
                    <div className="emp-contact-label">Địa chỉ</div>
                    <div className="emp-contact-value">{employer.address || "Chưa cập nhật"}</div>
                  </div>
                </div>

                <div className="emp-contact-item">
                  <Mail className="emp-icon" />
                  <div>
                    <div className="emp-contact-label">Email</div>
                    <div className="emp-contact-value">{contactEmail}</div>
                  </div>
                </div>

                <div className="emp-contact-item">
                  <Phone className="emp-icon" />
                  <div>
                    <div className="emp-contact-label">Số điện thoại</div>
                    <div className="emp-contact-value">{contactPhone}</div>
                  </div>
                </div>

                {employer.website ? (
                  <a className="emp-contact-cta" href={employer.website} target="_blank" rel="noreferrer">
                    <Globe size={16} />
                    Mở website công ty
                  </a>
                ) : null}
              </div>
            </div>
          </section>

          {/* Share */}
          <section className="emp-card">
            <header className="emp-card-header">
              <h2>Chia sẻ</h2>
            </header>

            <div className="emp-card-body">
              <div className="emp-share">
                <div className="emp-share-label">Sao chép đường dẫn</div>

                <div className="emp-copybox">
                  <input readOnly value={profileUrl} />
                  <button type="button" className="emp-copybtn" onClick={handleCopy} title="Copy link">
                    <Copy size={16} />
                  </button>
                </div>

                <div className="emp-share-hint">
                  Bạn có thể gửi link này cho bạn bè để xem hồ sơ doanh nghiệp.
                </div>
              </div>
            </div>
          </section>
        </aside>
      </div>
    </div>
  );
}
