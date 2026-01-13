// src/Home/components/TopSectors.jsx
import Section from "./Section";
import { useNavigate } from "react-router-dom";
import {
  Banknote,
  Laptop2,
  Headphones,
  Megaphone,
  Globe2,
  PenTool,
  Home as HomeIcon,
  Play,
  TrendingUp,
  ArrowRight,
} from "lucide-react";

// Import hình ảnh (Đảm bảo đường dẫn đúng với project của bạn)
import imgBank from "../../assets/bank.jpg";
import imgMarketing from "../../assets/marketing.jpg";
import imgService from "../../assets/Service.jpg";
import imgMedia from "../../assets/Media.jpg";
import imgIT from "../../assets/IT.jpg";
import imgDesigner from "../../assets/Designer.jpg";
import imgBDS from "../../assets/bds.jpg";
import imgLogistic from "../../assets/Logistic.jpg";

const SECTORS = [
  { id: 1, name: "Tài chính", jobs: 1104, icon: <Banknote />, img: imgBank },
  { id: 2, name: "Marketing", jobs: 1253, icon: <Megaphone />, img: imgMarketing },
  { id: 3, name: "CSKH", jobs: 947, icon: <Headphones />, img: imgService },
  { id: 4, name: "Truyền thông", jobs: 921, icon: <Play />, img: imgMedia },
  { id: 5, name: "IT", jobs: 657, icon: <Laptop2 />, img: imgIT },
  { id: 6, name: "Thiết kế", jobs: 869, icon: <PenTool />, img: imgDesigner },
  { id: 7, name: "Bất động sản", jobs: 1034, icon: <HomeIcon />, img: imgBDS },
  { id: 8, name: "Logistics", jobs: 764, icon: <Globe2 />, img: imgLogistic },
];

function SectorCard({ item }) {
  const navigate=useNavigate();
  const handleSectorClick = () =>{
    navigate(`/jobs?category=${encodeURIComponent(item.name)}`);
  };

  return (
    <article className="home-sector-card" onClick={handleSectorClick}>
      {/* Background Image with Zoom Effect */}
      <div className="home-sector-card-bg-wrap">
        <img src={item.img} alt={item.name} className="home-sector-card-bg" />
      </div>

      {/* Gradient Overlay */}
      <div className="home-sector-card-overlay" />

      {/* Nội dung chính */}
      <div className="home-sector-card-content">
        <div className="home-sector-card-top">
          <div className="home-sector-card-icon-wrap">
            {item.icon}
          </div>
          {/* Mũi tên chỉ hiện khi hover */}
          <div className="home-sector-card-arrow">
            <ArrowRight size={18} />
          </div>
        </div>

        <div className="home-sector-card-text">
          <h3 className="home-sector-card-title">{item.name}</h3>
          <span className="home-sector-card-jobs">
            {item.jobs.toLocaleString()} việc làm
          </span>
        </div>
      </div>
    </article>
  );
}

// Tiêu đề section
const topSectorsTitle = (
  <div className="home-sectors-title">
    <div className="home-sectors-title-icon">
      <TrendingUp size={24} />
    </div>
    <div className="home-sectors-title-text">Top ngành nổi bật</div>
  </div>
);

export default function TopSectors() {
  return (
    <Section title={topSectorsTitle}>
      {/* Wrapper này giúp tạo khoảng cách margin-top với tiêu đề */}
      <div className="home-sectors-wrapper">
        <div className="home-sector-grid">
          {SECTORS.map((s) => (
            <SectorCard key={s.id} item={s} />
          ))}
        </div>
      </div>
    </Section>
  );
}