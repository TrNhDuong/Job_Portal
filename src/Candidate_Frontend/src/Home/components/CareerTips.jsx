// src/Home/components/CareerTips.jsx
import Section from "./Section";
import { CheckCircle2 } from "lucide-react";

const TIPS = [
  {
    id: 1,
    title: "Xây dựng CV ấn tượng trong 1 trang",
    desc: "Tập trung vào thành tựu đo được (số %, doanh thu, số người) thay vì chỉ liệt kê nhiệm vụ. Sử dụng từ khóa trùng với JD để vượt qua hệ thống lọc CV (ATS).",
    img: "https://images.unsplash.com/photo-1555421689-491a97ff2040?q=80&w=1200&auto=format&fit=crop",
    tag: "CV & Hồ sơ",
  },
  {
    id: 2,
    title: "Chuẩn bị trước buổi phỏng vấn",
    desc: "Nghiên cứu công ty, luyện trả lời STAR cho các câu hỏi hành vi, chuẩn bị 3–5 câu hỏi ngược lại dành cho nhà tuyển dụng để thể hiện sự chủ động.",
    img: "https://images.unsplash.com/photo-1604594849809-dfedbc827105?q=80&w=1200&auto=format&fit=crop",
    tag: "Phỏng vấn",
  },
  {
    id: 3,
    title: "Xây dựng thương hiệu cá nhân online",
    desc: "Tối ưu LinkedIn, GitHub hoặc portfolio cá nhân; chia sẻ dự án, bài viết chuyên môn. Một hồ sơ online tốt giúp bạn được “săn” thay vì chỉ đi “xin”.",
    img: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?q=80&w=1200&auto=format&fit=crop",
    tag: "Thương hiệu cá nhân",
  },
];

function TipCard({ tip }) {
  return (
    <article className="home-tip-card">
      <div className="home-tip-card-img-wrap">
        <img src={tip.img} alt={tip.title} className="home-tip-card-img" />
        {tip.tag && <span className="home-tip-card-tag">{tip.tag}</span>}
      </div>

      <div className="home-tip-card-body">
        <h3 className="home-tip-card-title">{tip.title}</h3>
        <p className="home-tip-card-desc">{tip.desc}</p>
      </div>
    </article>
  );
}

// Tiêu đề
const tipsTitle = (
  <div className="home-tips-title">
    <div className="home-tips-title-icon">
      <CheckCircle2 />
    </div>
    <div className="home-tips-title-text">Cẩm nang tìm việc</div>
  </div>
);

export default function CareerTips() {
  return (
    <Section title={tipsTitle}>
      {/* Wrapper này giúp tạo khoảng cách margin-top với tiêu đề */}
      <div className="home-tips-wrapper">
        <div className="home-tips-grid">
          {TIPS.map((t) => (
            <TipCard key={t.id} tip={t} />
          ))}
        </div>
      </div>
    </Section>
  );
}