import { Link } from "react-router-dom";
import { X, MapPin, Briefcase, User2 } from "lucide-react";

export default function BrandDetailModal({ brand, onClose }) {
  const safeBrand = brand || {};

  // Tên công ty hiển thị
  const companyDisplayName =
    safeBrand.company || safeBrand.name || "Thương hiệu chưa đặt tên";

  // Logo: ưu tiên logo.url (Employer), fallback logoUrl, cuối cùng là avatar placeholder
  const placeholderLogo =
    "https://ui-avatars.com/api/?name=" +
    encodeURIComponent(companyDisplayName || "Brand") +
    "&background=0D8ABC&color=fff";

  const logoSrc =
    (safeBrand.logo && safeBrand.logo.url) ||
    safeBrand.logoUrl ||
    placeholderLogo;

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  // Số việc làm: ưu tiên brand.jobs, fallback jobPosted.length
  const jobsCount =
    safeBrand.jobs ??
    (Array.isArray(safeBrand.jobPosted) ? safeBrand.jobPosted.length : 0);

  // Địa chỉ
  const location = safeBrand.address || safeBrand.location || "";

  // Người đại diện (name trong Employer)
  const representativeName =
    safeBrand.representativeName || safeBrand.name || "";

  // Mô tả
  const description = safeBrand.description || "Mô tả công ty không có sẵn.";

  return (
    <div className="home-modal-backdrop" onClick={handleBackdropClick}>
      <div className="home-brand-modal" onClick={(e) => e.stopPropagation()}>
        {/* Close */}
        <button className="home-modal-close" onClick={onClose}>
          <X className="home-modal-close-icon" />
        </button>

        {/* Header */}
        <header className="home-brand-modal-header">
          <div className="home-brand-modal-header-top">
            <span className="home-brand-modal-label">Thương hiệu nổi bật</span>
            {jobsCount > 0 && (
              <span className="home-brand-modal-label-chip">
                {jobsCount} việc làm đang mở
              </span>
            )}
          </div>

          <div className="home-brand-modal-header-main">
            <div className="home-brand-modal-logo-wrap">
              <img
                src={logoSrc}
                alt={companyDisplayName}
                className="home-brand-modal-logo"
              />
            </div>

            <div className="home-brand-modal-header-text">
              <h2 className="home-brand-modal-title">{companyDisplayName}</h2>

              <div className="home-brand-modal-meta">
                {location && (
                  <div className="home-brand-modal-meta-item">
                    <MapPin className="home-brand-modal-meta-icon" />
                    <span>{location}</span>
                  </div>
                )}

                {representativeName && (
                  <div className="home-brand-modal-meta-item">
                    <User2 className="home-brand-modal-meta-icon" />
                    <span>Người đại diện: {representativeName}</span>
                  </div>
                )}

                <div className="home-brand-modal-meta-item">
                  <Briefcase className="home-brand-modal-meta-icon" />
                  <span>{jobsCount} việc làm đang tuyển</span>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Body */}
        <section className="home-brand-modal-body">
          <h3 className="home-brand-modal-subtitle">Giới thiệu công ty</h3>
          <div className="home-brand-modal-desc">{description}</div>
        </section>

        {/* Footer */}
        <footer className="home-brand-modal-footer">
          <div className="home-brand-modal-footer-left">
            <span className="home-brand-modal-footer-caption">
              Xem chi tiết hồ sơ và toàn bộ tin tuyển dụng của doanh nghiệp.
            </span>
          </div>

          <div className="home-brand-modal-footer-actions">
            <Link
              to={`/company/${safeBrand._id}`}
              className="home-job-modal-btn primary"
            >
              Xem tất cả việc làm ({jobsCount})
            </Link>
          </div>
        </footer>
      </div>
    </div>
  );
}
