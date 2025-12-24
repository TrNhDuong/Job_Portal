// src/Home/components/BrandDetailModal.jsx
import { Link } from "react-router-dom";
import { X, MapPin, Briefcase } from "lucide-react";

export default function BrandDetailModal({ brand, onClose }) {
  const safeBrand = brand || {};
  const placeholderLogo =
    "https://ui-avatars.com/api/?name=" +
    encodeURIComponent(safeBrand.name || "Brand") +
    "&background=0D8ABC&color=fff";

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <div className="home-modal-backdrop" onClick={handleBackdropClick}>
      <div className="home-brand-modal" onClick={(e) => e.stopPropagation()}>
        {/* Close */}
        <button className="home-modal-close" onClick={onClose}>
          <X className="home-modal-close-icon" />
        </button>

        {/* Header */}
        <header className="home-brand-modal-header">
          <div className="home-brand-modal-header-main">
            <div className="home-brand-modal-logo-wrap">
              <img
                src={safeBrand.logoUrl || placeholderLogo}
                alt={safeBrand.name}
                className="home-brand-modal-logo"
              />
            </div>
            <div className="home-brand-modal-header-text">
              <h2 className="home-brand-modal-title">
                {safeBrand.name || "Thương hiệu chưa đặt tên"}
              </h2>

              <div className="home-brand-modal-meta">
                {safeBrand.location && (
                  <div className="home-brand-modal-meta-item">
                    <MapPin className="home-brand-modal-meta-icon" />
                    <span>{safeBrand.location}</span>
                  </div>
                )}

                <div className="home-brand-modal-meta-item">
                  <Briefcase className="home-brand-modal-meta-icon" />
                  <span>
                    {safeBrand.jobs ?? 0} việc làm đang tuyển
                  </span>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Body */}
        <section className="home-brand-modal-body">
          <h3 className="home-brand-modal-subtitle">
            Giới thiệu công ty
          </h3>
          <div className="home-brand-modal-desc">
            {safeBrand.description || "Mô tả công ty không có sẵn."}
          </div>
        </section>

        {/* Footer */}
        <footer className="home-brand-modal-footer">
          <Link
            to={`/company/${safeBrand._id}`}
            className="home-job-modal-btn primary"
          >
            Xem tất cả việc làm ({safeBrand.jobs ?? 0})
          </Link>
        </footer>
      </div>
    </div>
  );
}
