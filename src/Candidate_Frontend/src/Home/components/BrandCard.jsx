// src/Home/components/BrandCard.jsx
import { Briefcase } from "lucide-react";

export default function BrandCard({ brand, onViewDetails }) {
  const safeBrand = brand || {};
  const companyName = safeBrand.name || safeBrand.company || "Doanh nghiệp";
  const logoSrc = (safeBrand.logo && safeBrand.logo.url) || safeBrand.logoUrl || "https://ui-avatars.com/api/?name=" + encodeURIComponent(companyName) + "&background=eff6ff&color=2563eb&bold=true";
  const jobsCount = safeBrand.jobCount || (Array.isArray(safeBrand.jobPosted) ? safeBrand.jobPosted.length : 0);

  return (
    <article className="brand-card-pro" onClick={() => onViewDetails?.(safeBrand)}>
      <div className="brand-card-pro-logo">
        <img src={logoSrc} alt={companyName} />
      </div>
      <div className="brand-card-pro-info">
        <h3 className="brand-card-pro-name">{companyName}</h3>
        {/* Dòng 2 hiển thị lại tên như yêu cầu của bạn */}
        <p className="brand-card-pro-industry">{companyName}</p>
        <div className="brand-card-pro-jobs">
          <Briefcase size={14} />
          <span>{jobsCount} việc làm</span>
        </div>
      </div>
    </article>
  );
}