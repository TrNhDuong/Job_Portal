// src/home/components/Metrics.jsx

// THAY ĐỔI 1: Tăng kích thước font chữ
const Item = ({ big, small }) => (
  <div className="text-center">
    {/* Sửa: text-3xl -> text-4xl md:text-5xl */}
    <div className="text-4xl md:text-5xl font-extrabold text-[#2288f3]">{big}</div>
    {/* Sửa: Thêm text-lg và mt-1 cho dễ đọc hơn */}
    <div className="text-black text-lg mt-1">{small}</div>
  </div>
);

export default function Metrics() {
  return (
    // THAY ĐỔI 2: Tăng khoảng cách bên trên từ mt-6 -> mt-10
    <div className="grid font-black grid-cols-3 gap-4 md:gap-8 mt-10 ">
      <Item big="100k+" small="Active Jobs" />
      <Item big="10k+" small="Companies" />
      <Item big="500+" small="CV Template" />
    </div>
  );
}