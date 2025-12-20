import { Link } from "react-router-dom";
import { X, MapPin, Globe, ExternalLink, Users } from "lucide-react"; 
// Lưu ý: Tôi thêm icon ExternalLink và Users

export default function BrandDetailModal({ brand, onClose }) {
  const safeBrand = brand || {};
  const companyDisplayName = safeBrand.company || safeBrand.name || "Thương hiệu";
  
  // Logo setup
  const placeholderLogo = "https://ui-avatars.com/api/?name=" + encodeURIComponent(companyDisplayName) + "&background=eff6ff&color=2563eb&bold=true";
  const logoSrc = (safeBrand.logo && safeBrand.logo.url) || safeBrand.logoUrl || placeholderLogo;

  // Data Processing
  const description = safeBrand.description ? safeBrand.description.replace(/\n/g, '<br/>') : "<p>Chưa có mô tả chi tiết.</p>";
  const jobsCount = safeBrand.jobs ?? (Array.isArray(safeBrand.jobPosted) ? safeBrand.jobPosted.length : 0);
  const location = safeBrand.address || safeBrand.location || "Chưa cập nhật địa chỉ";
  const website = safeBrand.website || "";
  const scale = safeBrand.scale || "Chưa cập nhật";

  return (
    <div className="home-modal-backdrop" onClick={(e) => { if(e.target === e.currentTarget) onClose(); }}>
      <div className="home-brand-modal" onClick={(e) => e.stopPropagation()}>
        
        <button className="home-modal-close" onClick={onClose}>
          <X size={20} />
        </button>

        {/* --- HEADER ĐÃ SỬA UI --- */}
        <header className="home-brand-modal-header">
          <div className="home-brand-modal-header-main">
            {/* Logo */}
            <div className="home-brand-modal-logo-wrap">
              <img src={logoSrc} alt={companyDisplayName} className="home-brand-modal-logo" />
            </div>

            {/* Info Column */}
            <div className="home-brand-modal-header-info">
              {/* Row 1: Tên + Badge Tuyển dụng */}
              <div className="home-brand-modal-title-row">
                <h2 className="home-brand-modal-title">{companyDisplayName}</h2>
                {jobsCount > 0 && (
                   <span className="home-brand-modal-badge">
                      Đang tuyển {jobsCount} vị trí
                   </span>
                )}
              </div>
              
              {/* Row 2: Grid thông tin (Địa chỉ + Website) */}
              <div className="home-brand-modal-meta-list">
                
                {/* Địa chỉ (Có xử lý cắt dòng) */}
                <div className="home-brand-modal-meta-item">
                   <MapPin size={15} className="icon mt-1" /> {/* mt-1 để icon căn với dòng đầu của text */}
                   <span className="text-clamp-2">{location}</span>
                </div>

                {/* Quy mô */}
                <div className="home-brand-modal-meta-item">
                    <Users size={15} className="icon" />
                    <span>Quy mô: {scale}</span>
                </div>

                {/* Website Button */}
                {website && (
                  <div className="home-brand-modal-meta-item">
                     <Globe size={15} className="icon" />
                     <a href={website} target="_blank" rel="noreferrer" className="link-website">
                        Website công ty <ExternalLink size={12} style={{ marginLeft: 4 }}/>
                     </a>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* --- BODY --- */}
        <div className="home-brand-modal-body">
          <div className="home-brand-modal-section">
            <h3 className="home-brand-modal-subtitle">Giới thiệu</h3>
            <div className="home-brand-modal-html-content" dangerouslySetInnerHTML={{ __html: description }} />
          </div>
        </div>

        {/* --- FOOTER --- */}
        <footer className="home-brand-modal-footer">
          <div className="home-brand-modal-footer-text">Xem chi tiết hồ sơ doanh nghiệp</div>
          <Link to={`/employer/${encodeURIComponent(safeBrand.email)}`} className="home-job-modal-btn primary">
            Xem trang công ty
          </Link>
        </footer>

      </div>
    </div>
  );
}