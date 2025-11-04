import Section from "./Section";
import {
  Banknote,
  Laptop2,
  Headphones,
  Megaphone,
  Globe2, // Đây là icon cho Logistics, không phải Globe
  PenTool,
  Home as HomeIcon,
  Play,
  TrendingUp, // BƯỚC 1: Thêm icon cho tiêu đề
} from "lucide-react";

// BƯỚC 2: IMPORT CÁC ẢNH TỪ ASSETS
// (Hãy đảm bảo đường dẫn "../assets/" là chính xác)
import imgBank from "../../assets/bank.jpg";
import imgMarketing from "../../assets/marketing.jpg";
import imgService from "../../assets/Service.jpg"; // Dùng Service.jpg cho Chăm Sóc KH
import imgMedia from "../../assets/Media.jpg";     // Dùng Media.jpg cho Truyền Thông
import imgIT from "../../assets/IT.jpg";
import imgDesigner from "../../assets/Designer.jpg";
import imgBDS from "../../assets/bds.jpg";         // Dùng bds.jpg cho Bất Động Sản
import imgLogistic from "../../assets/Logistic.jpg"; // Dùng Logistic.jpg cho Logistics

// BƯỚC 3: CẬP NHẬT MẢNG SECTORS
// (Thêm thuộc tính "img" trỏ đến ảnh đã import)
const SECTORS = [
  { id: 1, name: "Tài Chính - Ngân Hàng", jobs: "1,104 việc làm", icon: <Banknote className="w-7 h-7 text-white" />, bg: "from-blue-700 to-blue-500", img: imgBank },
  { id: 2, name: "Marketing", jobs: "1,253 việc làm", icon: <Megaphone className="w-7 h-7 text-white" />, bg: "from-blue-700 to-blue-500", img: imgMarketing },
  { id: 3, name: "Chăm Sóc Khách Hàng", jobs: "947 việc làm", icon: <Headphones className="w-7 h-7 text-white" />, bg: "from-blue-700 to-blue-500", img: imgService },
  { id: 4, name: "Truyền Thông", jobs: "921 việc làm", icon: <Play className="w-7 h-7 text-white" />, bg: "from-blue-700 to-blue-500", img: imgMedia },
  { id: 5, name: "Công Nghệ Thông Tin", jobs: "657 việc làm", icon: <Laptop2 className="w-7 h-7 text-white" />, bg: "from-blue-700 to-blue-500", img: imgIT },
  { id: 6, name: "Thiết Kế Đồ Họa", jobs: "869 việc làm", icon: <PenTool className="w-7 h-7 text-white" />, bg: "from-blue-700 to-blue-500", img: imgDesigner },
  { id: 7, name: "Bất Động Sản", jobs: "1,034 việc làm", icon: <HomeIcon className="w-7 h-7 text-white" />, bg: "from-blue-700 to-blue-500", img: imgBDS },
  { id: 8, name: "Logistics", jobs: "764 việc làm", icon: <Globe2 className="w-7 h-7 text-white" />, bg: "from-blue-700 to-blue-500", img: imgLogistic },
];

// BƯỚC 4: SỬA LẠI SECTORCARD ĐỂ HIỂN THỊ ẢNH NỀN
function SectorCard({ item }) {
  return (
    /* Giữ nguyên các class cũ, chỉ cần thêm "relative" và "overflow-hidden" 
       để chứa ảnh nền
    */
    <div className="relative rounded-2xl shadow-md bg-gradient-to-br hover:shadow-lg transition-shadow duration-200 p-4 overflow-hidden min-h-[120px] flex">
      
      {/* 1. ẢNH NỀN */}
      <img 
        src={item.img} 
        alt={item.name} 
        className="absolute inset-0 w-full h-full object-cover" 
      />

      {/* 2. "Ô XANH MỜ" (OVERLAY) */}
      {/* (Code này của bạn đã đúng, tôi chỉ sửa opacity-90 -> opacity-80 cho mờ hơn) */}
      <div className={`absolute inset-0 bg-gradient-to-br ${item.bg} opacity-50`} />

      {/* 3. NỘI DUNG (ICON + TEXT) */}
      {/* (Code này của bạn đã đúng, nó nằm đè lên trên) */}
      <div className="relative z-10 flex items-center gap-4">
        <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-white/20 backdrop-blur">
          {item.icon}
        </div>
        <div className="text-white">
          <div className="font-semibold">{item.name}</div>
          <div className="text-sm opacity-90">{item.jobs}</div>
        </div>
      </div>
    </div>
  );
}

// BƯỚC 5: SỬA LẠI TIÊU ĐỀ CHO ĐỒNG BỘ
const topSectorsTitle = (
  <div className="flex items-center gap-2">
    {/* Dùng icon TrendingUp (giống 'Top') màu cam */}
    <TrendingUp className="w-6 h-6 text-orange-500" />
    <span className="text-2xl md:text-3xl font-bold">Top Ngành Nổi Bật</span>
  </div>
);

export default function TopSectors() {
  return (
    <Section title={topSectorsTitle}> {/* Truyền tiêu đề JSX vào */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-5"> {/* Sửa: grid-cols-2 cho mobile */}
        {SECTORS.map((s) => (
          <SectorCard key={s.id} item={s} />
        ))}
      </div>
    </Section>
  );
}