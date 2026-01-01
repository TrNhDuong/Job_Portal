import React from 'react';
import '../styles/AboutPage.css';
import { 
  Sparkles, 
  Users, 
  GraduationCap, 
  MessageCircle, 
  Code2, 
  Database, 
  Globe, 
  Server,
  Cpu,
  Mail,
  ArrowRight,
  Target
} from 'lucide-react';

export default function AboutPage() {
  
  // Danh sách thành viên chuẩn (5 người)
  const teamMembers = [
    { 
      name: "Trần Nhật Dương", 
      id: "23120243", 
      role: "Leader & Backend Engineer",
      color: "gradient-blue" 
    },
    { 
      name: "Nguyễn Huỳnh Trọng Đức", 
      id: "23120239", 
      role: "Frontend Engineer",
      color: "gradient-emerald"
    },
    { 
      name: "Văn Phú Hiệu", 
      id: "23120261", 
      role: "Backend Engineer",
      color: "gradient-orange"
    },
    { 
      name: "Nguyễn Đình Chuẩn", 
      id: "23120221", 
      role: "Frontend Engineer",
      color: "gradient-pink"
    },
    { 
      name: "Đào Duy Hảo", 
      id: "23120251", 
      role: "Database Admin",
      color: "gradient-purple"
    },
  ];

  return (
    <div className="about-page-wrapper">
      
      {/* --- HERO SECTION --- */}
      <section className="about-hero-section">
        {/* Họa tiết nền (Pattern) */}
        <div className="hero-pattern-grid"></div>
        <div className="hero-glow-1"></div>
        <div className="hero-glow-2"></div>

        <div className="hero-content">
          <div className="badge-pill">
            <Sparkles size={14} /> <span>Đồ án Nhập môn CNPM • CQ2023/1</span>
          </div>
          <h1 className="hero-title">InspireLeader</h1>
          <p className="hero-subtitle">
            Cầu nối thông minh giữa <strong>Nhân tài</strong> và <strong>Doanh nghiệp</strong>.
            <br/>Kiến tạo tương lai từ những mảnh ghép hoàn hảo.
          </p>
        </div>
      </section>

      {/* --- MAIN CONTENT CONTAINER --- */}
      <div className="about-main-container">
        
        {/* 1. FEATURED CARD: CÂU CHUYỆN DỰ ÁN (Đè lên Hero) */}
        <div className="story-card-wrapper">
          <section className="project-story-card">
            <div className="story-icon">
              <GraduationCap size={32} color="#fff" />
            </div>
            <div className="story-content">
              <h2>Câu chuyện dự án</h2>
              <div className="story-meta">Trường Đại học Khoa học Tự nhiên, ĐHQG-HCM</div>
              <p>
                Chúng tôi tin rằng quy trình tuyển dụng không chỉ là việc lấp đầy một vị trí trống, mà là hành trình tìm kiếm sự phù hợp. 
                <strong> InspireLeader</strong> ra đời với sứ mệnh áp dụng quy trình <strong>Agile/Scrum</strong> chuyên nghiệp để giải quyết bài toán tuyển dụng thực tế, mang lại trải nghiệm tối ưu cho cả Nhà tuyển dụng và Ứng viên.
              </p>
            </div>
          </section>
        </div>

        {/* 2. CÔNG NGHỆ SỬ DỤNG */}
        <section className="section-block">
          <div className="section-title-center">
            <div className="title-icon-box"><Code2 size={24} /></div>
            <h3>Công Nghệ & Kỹ Thuật</h3>
          </div>
          <div className="tech-stack-grid">
            <div className="tech-item">
              <Globe size={28} className="tech-icon text-blue" />
              <div className="tech-text">
                <strong>ReactJS (Vite)</strong>
                <span>Frontend Hiệu năng cao</span>
              </div>
            </div>
            <div className="tech-item">
              <Server size={28} className="tech-icon text-green" />
              <div className="tech-text">
                <strong>NodeJS & Express</strong>
                <span>Backend API Robust</span>
              </div>
            </div>
            <div className="tech-item">
              <Database size={28} className="tech-icon text-purple" />
              <div className="tech-text">
                <strong>MongoDB</strong>
                <span>Cơ sở dữ liệu NoSQL</span>
              </div>
            </div>
            <div className="tech-item">
              <Cpu size={28} className="tech-icon text-orange" />
              <div className="tech-text">
                <strong>JWT & RESTful</strong>
                <span>Bảo mật & Chuẩn giao tiếp</span>
              </div>
            </div>
          </div>
        </section>

        {/* 3. ĐỘI NGŨ PHÁT TRIỂN (Căn giữa hàng 5 người) */}
        <section className="section-block">
          <div className="section-title-center">
            <div className="title-icon-box"><Users size={24} /></div>
            <h3>Đội Ngũ Phát Triển (Nhóm CDH)</h3>
            <p className="section-desc">Những người kiến tạo nên sản phẩm</p>
          </div>
          
          <div className="team-grid-container">
            {teamMembers.map((mem, index) => (
              <div className="member-profile-card" key={index}>
                {/* Header màu sắc */}
                <div className={`member-header-bg ${mem.color}`}></div>
                
                <div className="member-content">
                  <div className="member-avatar-wrapper">
                    <div className="avatar-circle">
                      {getInitials(mem.name)}
                    </div>
                  </div>
                  <h4 className="member-name">{mem.name}</h4>
                  <div className="member-id-tag">{mem.id}</div>
                  <div className="member-role-badge">
                    {mem.role}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 4. LIÊN HỆ */}
        <section className="contact-cta-section">
          <div className="cta-content">
            <MessageCircle size={48} className="cta-icon" />
            <h3>Gửi phản hồi cho chúng tôi</h3>
            <p>Mọi ý kiến đóng góp của bạn là động lực để nhóm hoàn thiện sản phẩm tốt hơn.</p>
            <a href="mailto:23120243@student.hcmus.edu.vn" className="btn-cta">
              <Mail size={18} /> Liên hệ Leader <ArrowRight size={16} />
            </a>
          </div>
        </section>

      </div>
    </div>
  );
}

// Hàm lấy chữ cái đầu
function getInitials(name) {
  const parts = name.split(' ');
  const last = parts[parts.length - 1];
  const first = parts[0];
  return (first[0] + last[0]).toUpperCase();
}