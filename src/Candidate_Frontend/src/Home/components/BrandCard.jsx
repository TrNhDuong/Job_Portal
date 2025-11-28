// src/Home/components/BrandCard.jsx
import { Briefcase, MapPin } from "lucide-react";

export default function BrandCard({ brand, onViewDetails }) {
  const handleClick = () => {
    if (onViewDetails) onViewDetails(brand);
  };

  const placeholderLogo =
    "https://ui-avatars.com/api/?name=" +
    encodeURIComponent(brand?.name || "Brand") +
    "&background=0D8ABC&color=fff";

  return (
    <article
      className="home-brand-card"
      onClick={handleClick}
    >
      {/* Logo + tên brand */}
      <div className="home-brand-card-main">
        <div className="home-brand-card-logo-wrap">
          <img
            src={brand.logoUrl || placeholderLogo}
            alt={brand.name}
            className="home-brand-card-logo"
          />
        </div>

        <div className="home-brand-card-text">
          <h3 className="home-brand-card-name">
            {brand.name || "Thương hiệu chưa đặt tên"}
          </h3>

          <div className="home-brand-card-meta">
            <div className="home-brand-card-meta-item">
              <Briefcase className="home-brand-card-meta-icon" />
              <span>
                {brand.jobs ?? 0} việc làm
              </span>
            </div>

            {brand.location && (
              <div className="home-brand-card-meta-item">
                <MapPin className="home-brand-card-meta-icon" />
                <span>{brand.location}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}
