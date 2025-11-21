import Section from "./Section";
import { ArrowLeft, ArrowRight, CheckCircle2 } from "lucide-react";

const TIPS = [
  {
    id: 1,
    title: "Xây dựng CV ấn tượng",
    desc: "Hướng dẫn cách tạo CV chuyên nghiệp, thu hút và những lưu ý...",
    img: "https://images.unsplash.com/photo-1555421689-491a97ff2040?q=80&w=1200&auto=format&fit=crop",
  },
  {
    id: 2,
    title: "Ứng dụng lãi đơn trong thực tế",
    desc: "Giải thích cách lãi đơn được sử dụng trong các trường hợp...",
    img: "https://images.unsplash.com/photo-1604594849809-dfedbc827105?q=80&w=1200&auto=format&fit=crop",
  },
  {
    id: 3,
    title: "Ngành nhân sự và cơ hội nghề nghiệp",
    desc: "Giới thiệu vai trò của ngành nhân sự và những hướng phát triển...",
    img: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?q=80&w=1200&auto=format&fit=crop",
  },
];

function TipCard({ tip }) {
  return (
    <div className="group">
      <div className="rounded-2xl overflow-hidden shadow-md bg-white">
        <img src={tip.img} alt={tip.title} className="w-full h-44 object-cover" />
      </div>
      <div className="mt-3">
        <h3 className="text-[22px] font-bold text-[#1E63D0] group-hover:underline">{tip.title}</h3>
        <p className="text-gray-600 mt-1 leading-snug">{tip.desc}</p>
      </div>
    </div>
  );
}

export default function CareerTips() {
  const actions = (
    <div className="flex items-center gap-2">
      <button className="w-10 h-10 rounded-full border border-gray-300 bg-white grid place-items-center">
        <ArrowLeft className="w-5 h-5" />
      </button>
      <button className="w-10 h-10 rounded-full border-2 border-[#2F6AF2] text-[#2F6AF2] bg-white grid place-items-center">
        <ArrowRight className="w-5 h-5" />
      </button>
    </div>
  );

  return (
    <Section
      title="Cẩm Nang Tìm Việc"
      icon={<CheckCircle2 className="w-7 h-7 text-[#2F6AF2]" />}
      actions={actions}
    >
      <div className="grid md:grid-cols-3 gap-6">
        {TIPS.map(t => <TipCard key={t.id} tip={t} />)}
      </div>
    </Section>
  );
}
