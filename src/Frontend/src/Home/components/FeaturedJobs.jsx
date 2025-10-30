// src/home/components/FeaturedJobs.jsx

import { useState } from "react"; // BƯỚC 1: Import useState
import Section from "./Section";
import JobCard from "./JobCard";
import JobDetailModal from "./JobDetailModal"; // BƯỚC 2: Import Modal
import { Bookmark } from "lucide-react";

// Dữ liệu giả (giữ nguyên để test)
const mockJobs = [
  {
    _id: "1",
    title: "Nhân Viên Kinh Doanh (Test)",
    company: "Công Ty Test A",
    salary: "10 - 15 triệu",
    location: "TP. Hồ Chí Minh",
    logoUrl: "https://via.placeholder.com/40x40.png?text=A",
    description: "Đây là mô tả chi tiết cho công việc Test A. Cần kỹ năng giao tiếp và làm việc nhóm. Đây là một đoạn text rất dài để kiểm tra chức năng cuộn của thẻ."
  },
  {
    _id: "2",
    title: "React Developer (Test)",
    company: "Công Ty Test B",
    salary: "Thỏa thuận",
    location: "Hà Nội",
    logoUrl: "https://via.placeholder.com/40x40.png?text=B",
    description: "Đây là mô tả cho công việc React Developer. Yêu cầu 2 năm kinh nghiệm."
  },
  {
    _id: "3",
    title: "Chuyên Viên Marketing (Test)",
    company: "Công Ty Test C",
    salary: "Trên 20 triệu",
    location: "Đà Nẵng",
    logoUrl: "https://via.placeholder.com/40x40.png?text=C",
    description: "Mô tả công việc Marketing. Cần biết chạy ads và làm nội dung."
  }
];

const featuredJobsTitle = (
  <div className="flex items-center gap-2">
    <Bookmark className="w-6 h-6 text-red-600 fill-red-600" />
    <span className="text-2xl md:text-3xl font-bold">Việc Làm Nổi Bật</span>
  </div>
);

export default function FeaturedJobs({ enableFetch = false }) {
  // BƯỚC 3: Tạo state để lưu job đang được chọn
  // Mặc định là 'null' (không có job nào được chọn)
  const [selectedJob, setSelectedJob] = useState(null);

  return (
    // BƯỚC 4: Bọc trong "React.Fragment" (dấu <>)
    <> 
      <Section title={featuredJobsTitle}>
        <div className="grid md:grid-cols-3 gap-4">
          {mockJobs.map(j => (
            // BƯỚC 5: Truyền hàm setSelectedJob vào prop "onViewDetails"
            <JobCard
              key={j._id}
              job={j}
              onViewDetails={setSelectedJob} // Khi click, job "j" sẽ được lưu vào state
            />
          ))}
        </div>
      </Section>

      {/* BƯỚC 6: Render Modal NẾU "selectedJob" không phải là null */}
      {selectedJob && (
        <JobDetailModal 
          job={selectedJob} 
          onClose={() => setSelectedJob(null)} // Hàm để đóng Modal (set state về null)
        />
      )}
    </>
  );
}