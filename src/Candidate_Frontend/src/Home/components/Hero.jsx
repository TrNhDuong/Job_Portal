import React from "react";

export default function Hero() {
  return (
    <section className="home-hero">
      <div className="home-hero-content">
        <h1 className="home-hero-title">
          Khởi đầu sự nghiệp mơ ước với
          <span className="home-hero-gradient-text">CDH Job Portal</span>
        </h1>

        <p className="home-hero-subtitle">
          Khám phá hàng ngàn cơ hội việc làm từ các công ty hàng đầu – được cá
          nhân hoá theo kỹ năng và đam mê của bạn.
        </p>

        <div className="home-hero-metrics">
          {/* Card 1 */}
          <div className="home-hero-metric-item">
            <div className="home-hero-metric-big">100k+</div>
            <div className="home-hero-metric-small">Việc làm đang tuyển</div>
          </div>

          {/* Card 2 */}
          <div className="home-hero-metric-item">
            <div className="home-hero-metric-big">10k+</div>
            <div className="home-hero-metric-small">Doanh nghiệp tin dùng</div>
          </div>

          {/* Card 3 - MỚI THÊM */}
          <div className="home-hero-metric-item">
            <div className="home-hero-metric-big">24/7</div>
            <div className="home-hero-metric-small">Hỗ trợ trực tuyến</div>
          </div>
        </div>
      </div>
    </section>
  );
}