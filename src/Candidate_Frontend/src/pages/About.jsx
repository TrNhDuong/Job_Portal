import React from "react";
import { Users, Target, Rocket, Award, CheckCircle } from "lucide-react";
import Footer from "../Home/components/Footer";
import "../styles/about.css";

export default function About() {
  return (
    <div className="about-page">
      {/* 1. HERO SECTION - GIỚI THIỆU TỔNG QUAN */}
      <section className="about-hero">
        <div className="about-container">
          <div className="about-hero-content">
            <span className="about-badge">Về chúng tôi</span>
            <h1 className="about-title">Kết nối Tài năng với <br /> Cơ hội Tương lai</h1>
            <p className="about-subtitle">
              CDH Job Portal không chỉ là một nền tảng tuyển dụng, chúng tôi là cầu nối giúp hàng triệu người tìm thấy sự nghiệp lý tưởng và giúp doanh nghiệp xây dựng đội ngũ vững mạnh.
            </p>
          </div>
        </div>
        <div className="about-hero-bg-shapes">
          <div className="shape shape-1"></div>
          <div className="shape shape-2"></div>
        </div>
      </section>

      <div className="home-shell">
        {/* 2. SỐ LIỆU ẤN TƯỢNG (Re-use stats style) */}
        <section className="about-stats-section">
          <div className="about-stats-grid">
            <div className="stat-card">
              <h3>15M+</h3>
              <p>Ứng viên tin dùng</p>
            </div>
            <div className="stat-card">
              <h3>500K+</h3>
              <p>Doanh nghiệp đối tác</p>
            </div>
            <div className="stat-card">
              <h3>1M+</h3>
              <p>Việc làm đã kết nối</p>
            </div>
            <div className="stat-card">
              <h3>98%</h3>
              <p>Tỷ lệ hài lòng</p>
            </div>
          </div>
        </section>

        {/* 3. TẦM NHÌN & SỨ MỆNH */}
        <section className="about-mission-section">
          <div className="mission-grid">
            <div className="mission-content">
              <h2 className="section-title">Sứ mệnh của chúng tôi</h2>
              <p>
                Tại <strong>CDH Job Portal</strong>, sứ mệnh của chúng tôi là tối ưu hóa quá trình tuyển dụng bằng công nghệ hiện đại, giúp ứng viên và nhà tuyển dụng tìm thấy nhau một cách nhanh chóng, minh bạch và hiệu quả nhất.
              </p>
              <ul className="mission-list">
                <li><CheckCircle className="icon" size={20} /> Xây dựng hệ sinh thái nghề nghiệp bền vững.</li>
                <li><CheckCircle className="icon" size={20} /> Cung cấp công cụ phân tích dữ liệu tuyển dụng Pro.</li>
                <li><CheckCircle className="icon" size={20} /> Hỗ trợ ứng viên phát triển kỹ năng sự nghiệp.</li>
              </ul>
            </div>
            <div className="mission-image">
              <img src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=800&auto=format&fit=crop" alt="Teamwork" />
            </div>
          </div>
        </section>

        {/* 4. GIÁ TRỊ CỐT LÕI */}
        <section className="about-values-section">
          <h2 className="section-title-center">Giá trị cốt lõi</h2>
          <div className="values-grid">
            <div className="value-card">
              <div className="value-icon-wrap"><Target /></div>
              <h4>Đổi mới (Innovation)</h4>
              <p>Luôn cập nhật xu hướng công nghệ AI để mang lại trải nghiệm tốt nhất.</p>
            </div>
            <div className="value-card">
              <div className="value-icon-wrap"><Users /></div>
              <h4>Con người (People First)</h4>
              <p>Chúng tôi đặt lợi ích của ứng viên và nhà tuyển dụng lên hàng đầu.</p>
            </div>
            <div className="value-card">
              <div className="value-icon-wrap"><Rocket /></div>
              <h4>Tốc độ (Agility)</h4>
              <p>Phản hồi nhanh chóng, quy trình tinh gọn, kết quả tức thì.</p>
            </div>
            <div className="value-card">
              <div className="value-icon-wrap"><Award /></div>
              <h4>Chất lượng (Quality)</h4>
              <p>Đảm bảo nguồn việc làm uy tín và hồ sơ ứng viên chất lượng cao.</p>
            </div>
          </div>
        </section>
      </div>

      <Footer />
    </div>
  );
}