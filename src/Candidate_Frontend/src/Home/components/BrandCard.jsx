// src/Home/components/BrandCard.jsx
import { Briefcase, MapPin } from "lucide-react";

export default function BrandCard({ brand, onViewDetails }) {
  const safeBrand = brand || {};

  // Tên công ty ưu tiên company, fallback name
  const companyName =
    safeBrand.company || safeBrand.name || "Thương hiệu chưa đặt tên";

  // Số việc làm: ưu tiên jobs, fallback jobPosted.length
  const jobsCount =
    safeBrand.jobs ??
    (Array.isArray(safeBrand.jobPosted) ? safeBrand.jobPosted.length : 0);

  // Địa chỉ: từ Employer.address, fallback location nếu FE có map
  const location = safeBrand.address || safeBrand.location || "";

  // Logo: ưu tiên logo.url (Employer), fallback logoUrl, cuối cùng là avatar
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
          <h3 className="home-brand-card-name">{companyName}</h3>

          {jobsCount > 0 && (
            <span className="home-brand-card-chip">
              Đang tuyển {jobsCount}
            </span>
          )}
        </div>

        <div className="home-brand-card-meta">
          <div className="home-brand-card-meta-item">
            <Briefcase className="home-brand-card-meta-icon" />
            <span>{jobsCount} việc làm</span>
          </div>

          {location && (
            <div className="home-brand-card-meta-item">
              <MapPin className="home-brand-card-meta-icon" />
              <span>{location}</span>
            </div>
          )}
        </div>
      </div>
    </article>
  );
}
