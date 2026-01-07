import React from "react";
import { NavLink, Link } from "react-router-dom";
export default function Hero() {
  return (
    <section className="home-hero">
      <div className="home-hero-container">
        {/* PHẦN BÊN TRÁI: TEXT CONTENT */}
        <div className="home-hero-left">
          <div className="hero-badge">
            <span className="dot"></span>
            Find Jobs, Employment & Career
          </div>
          
          <h1 className="home-hero-title">
            Khám phá Sự nghiệp Lý tưởng của Bạn
          </h1>

          <p className="home-hero-subtitle">
            Kết nối tài năng với cơ hội.
          </p>

          <NavLink className="hero-btn-primary" to="/jobs">
            TÌM VIỆC
          </NavLink>

          <div className="hero-user-stats">
            <div className="avatar-stack">
              <img src="https://i.pravatar.cc/150?u=1" alt="user" />
              <img src="https://i.pravatar.cc/150?u=2" alt="user" />
            </div>
            <div className="stats-content">
              <div className="stats-number">15M+</div>
              <div className="stats-text">Người dùng Toàn cầu</div>
            </div>
          </div>
        </div>

        {/* PHẦN BÊN PHẢI: VISUALS (ẢNH & DECOR) */}
        <div className="home-hero-right">
          <div className="image-grid">
            {/* Khối ảnh cô gái (Nền xanh nhạt) */}
            <div className="img-block block-blue">
              <img src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=500" alt="Professional" />
            </div>
            
            {/* Khối ảnh bắt tay (Nền vàng) */}
            <div className="img-block block-yellow">
              <img src="https://images.unsplash.com/photo-1517048676732-d65bc937f952?q=80&w=600" alt="Handshake" />
            </div>

            {/* Icon Briefcase nổi lên */}
            <div className="floating-icon">
              <svg viewBox="0 0 24 24" width="30" height="30" fill="currentColor">
                <path d="M20 7h-4V5c0-1.1-.9-2-2-2h-4c-1.1 0-2 .9-2 2v2H4c-1.1 0-2 .9-2 2v11c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V9c0-1.1-.9-2-2-2zM10 5h4v2h-4V5zm10 15H4V9h16v11z"/>
              </svg>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}