// src/Home/components/BrandCard.jsx
import { Briefcase, MapPin } from "lucide-react";

export default function BrandCard({ brand, onViewDetails }) {
  const safeBrand = brand || {};

  // Tên công ty
  const companyName =
    safeBrand.company || safeBrand.name || "Thương hiệu chưa đặt tên";

  // Số việc làm
  const jobsCount =
    safeBrand.jobs ??
    (Array.isArray(safeBrand.jobPosted) ? safeBrand.jobPosted.length : 0);

  // Địa chỉ
  const location = safeBrand.address || safeBrand.location || "";

  // Logo logic
  const placeholderLogo =
    "https://ui-avatars.com/api/?name=" +
    encodeURIComponent(companyName || "Brand") +
    "&background=0D8ABC&color=fff";

  const logoSrc =
    (safeBrand.logo && safeBrand.logo.url) ||
    safeBrand.logoUrl ||
    placeholderLogo;

  const handleClick = () => {
    if (onViewDetails) onViewDetails(safeBrand);
  };

  return (
    <article className="home-brand-card" onClick={handleClick}>
      <div className="home-brand-card-logo-wrap">
        <img
          src={logoSrc}
          alt={companyName}
          className="home-brand-card-logo"
        />
      </div>

      <div className="home-brand-card-text">
        <div className="home-brand-card-top-row">
          <h3 className="home-brand-card-name" title={companyName}>
            {companyName}
          </h3>
          
          {/* Badge số lượng job (nếu muốn hiển thị ở đây) */}
          {/* Bạn có thể bỏ comment nếu muốn hiện badge "Đang tuyển X" */}
          {/* {jobsCount > 0 && (
            <span className="home-brand-card-chip">
              {jobsCount} job
            </span>
          )} */}
        </div>

        <div className="home-brand-card-meta">
          <div className="home-brand-card-meta-item">
            <Briefcase className="home-brand-card-meta-icon" />
            <span>{jobsCount} việc làm</span>
          </div>

          {location && (
            <div className="home-brand-card-meta-item">
              <MapPin className="home-brand-card-meta-icon" />
              {/* Thêm class 'home-brand-card-address' và title */}
              <span className="home-brand-card-address" title={location}>
                {location}
              </span>
            </div>
          )}
        </div>
      </div>
    </article>
  );
}