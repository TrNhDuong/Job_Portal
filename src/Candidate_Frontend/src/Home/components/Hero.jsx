
export default function Hero() {
  return (
    <section className="home-hero">
      <div className="home-hero-content">
        {/* Tiêu đề + mô tả */}
        <h1 className="home-hero-title">
          Khởi đầu sự nghiệp mơ ước với{" "}
          <span className="home-hero-gradient">CDH Job Portal</span>
        </h1>

        <p className="home-hero-subtitle">
          Khám phá hàng ngàn cơ hội việc làm từ các công ty hàng đầu – được cá
          nhân hoá theo kỹ năng và đam mê của bạn.
        </p>

        {/* Metrics ngay dưới hero */}
        <div className="home-hero-metrics">
          <div className="home-hero-metric-item">
            <div className="home-hero-metric-big">100k+</div>
            <div className="home-hero-metric-small">Việc làm đang tuyển</div>
          </div>

          <div className="home-hero-metric-item">
            <div className="home-hero-metric-big">10k+</div>
            <div className="home-hero-metric-small">Doanh nghiệp tin dùng</div>
          </div>

          <div className="home-hero-metric-item">
            <div className="home-hero-metric-big">500+</div>
            <div className="home-hero-metric-small">Mẫu CV chuyên nghiệp</div>
          </div>
        </div>
      </div>
    </section>
  );
}
