import Section from "./Section";
import {
  Banknote,
  Laptop2,
  Headphones,
  Megaphone,
  Globe2,
  PenTool,
  Home as HomeIcon, // đổi tên
  Play,              // bổ sung import
} from "lucide-react";

const SECTORS = [
  { id: 1, name: "Tài Chính - Ngân Hàng", jobs: "1,104 việc làm", icon: <Banknote className="w-7 h-7 text-white" />, bg: "from-blue-700 to-blue-500" },
  { id: 2, name: "Marketing", jobs: "1,253 việc làm", icon: <Megaphone className="w-7 h-7 text-white" />, bg: "from-blue-700 to-blue-500" },
  { id: 3, name: "Chăm Sóc Khách Hàng", jobs: "947 việc làm", icon: <Headphones className="w-7 h-7 text-white" />, bg: "from-blue-700 to-blue-500" },
  { id: 4, name: "Truyền Thông", jobs: "921 việc làm", icon: <Play className="w-7 h-7 text-white" />, bg: "from-blue-700 to-blue-500" },
  { id: 5, name: "Công Nghệ Thông Tin", jobs: "657 việc làm", icon: <Laptop2 className="w-7 h-7 text-white" />, bg: "from-blue-700 to-blue-500" },
  { id: 6, name: "Thiết Kế Đồ Họa", jobs: "869 việc làm", icon: <PenTool className="w-7 h-7 text-white" />, bg: "from-blue-700 to-blue-500" },
  { id: 7, name: "Bất Động Sản", jobs: "1,034 việc làm", icon: <HomeIcon className="w-7 h-7 text-white" />, bg: "from-blue-700 to-blue-500" },
  { id: 8, name: "Logistics", jobs: "764 việc làm", icon: <Globe2 className="w-7 h-7 text-white" />, bg: "from-blue-700 to-blue-500" },
];

function SectorCard({ item }) {
  return (
    <div className="rounded-2xl shadow-md bg-gradient-to-br hover:shadow-lg transition-shadow duration-200 p-4 overflow-hidden relative min-h-[120px] flex">
      <div className={`absolute inset-0 bg-gradient-to-br ${item.bg} opacity-90`} />
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

export default function TopSectors() {
  return (
    <Section
      title="Top Ngành Nổi Bật"
      icon={<span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-orange-500 text-white">↗</span>}
    >
      <div className="grid md:grid-cols-4 gap-5">
        {SECTORS.map((s) => (
          <SectorCard key={s.id} item={s} />
        ))}
      </div>
    </Section>
  );
}
