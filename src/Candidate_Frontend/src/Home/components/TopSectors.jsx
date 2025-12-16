// src/Home/components/TopSectors.jsx
import Section from "./Section";
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
} from "lucide-react";

import imgBank from "../../assets/bank.jpg";
import imgMarketing from "../../assets/marketing.jpg";
import imgService from "../../assets/Service.jpg";
import imgMedia from "../../assets/Media.jpg";
import imgIT from "../../assets/IT.jpg";
import imgDesigner from "../../assets/Designer.jpg";
import imgBDS from "../../assets/bds.jpg";
import imgLogistic from "../../assets/Logistic.jpg";

const SECTORS = [
  {
    id: 1,
    name: "Tài Chính - Ngân Hàng",
    jobs: "1,104 việc làm",
    icon: <Banknote />,
    img: imgBank,
  },
  {
    id: 2,
    name: "Marketing",
    jobs: "1,253 việc làm",
    icon: <Megaphone />,
    img: imgMarketing,
  },
  {
    id: 3,
    name: "Chăm Sóc Khách Hàng",
    jobs: "947 việc làm",
    icon: <Headphones />,
    img: imgService,
  },
  {
    id: 4,
    name: "Truyền Thông",
    jobs: "921 việc làm",
    icon: <Play />,
    img: imgMedia,
  },
  {
    id: 5,
    name: "Công Nghệ Thông Tin",
    jobs: "657 việc làm",
    icon: <Laptop2 />,
    img: imgIT,
  },
  {
    id: 6,
    name: "Thiết Kế Đồ Họa",
    jobs: "869 việc làm",
    icon: <PenTool />,
    img: imgDesigner,
  },
  {
    id: 7,
    name: "Bất Động Sản",
    jobs: "1,034 việc làm",
    icon: <HomeIcon />,
    img: imgBDS,
  },
  {
    id: 8,
    name: "Logistics",
    jobs: "764 việc làm",
    icon: <Globe2 />,
    img: imgLogistic,
  },
];

function SectorCard({ item }) {
  return (
    <article className="home-sector-card">
      {/* Ảnh nền */}
      <img src={item.img} alt={item.name} className="home-sector-card-bg" />
      {/* overlay màu */}
      <div className="home-sector-card-overlay" />
      {/* nội dung */}
      <div className="home-sector-card-content">
        <div className="home-sector-card-icon-wrap">
          <span className="home-sector-card-icon">{item.icon}</span>
        </div>
        <div className="home-sector-card-text">
          <div className="home-sector-card-title">{item.name}</div>
          <div className="home-sector-card-jobs">{item.jobs}</div>
        </div>
      </div>
    </article>
  );
}

const topSectorsTitle = (
  <div className="home-sectors-title">
    <div className="home-sectors-title-icon">
      <TrendingUp />
    </div>
    <div>
      <div className="home-featured-title-text">Top ngành nổi bật</div>
      <div className="home-sectors-subtitle">
        Nhóm lĩnh vực đang có nhiều cơ hội việc làm
      </div>
    </div>
  </div>
);

export default function TopSectors() {
  return (
    <Section title={topSectorsTitle}>
      <div className="home-sector-grid">
        {SECTORS.map((s) => (
          <SectorCard key={s.id} item={s} />
        ))}
      </div>
    </Section>
  );
}
