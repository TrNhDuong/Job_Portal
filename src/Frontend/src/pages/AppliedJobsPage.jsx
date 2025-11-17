// src/pages/AppliedJobsPage.jsx

import React, { useState, useEffect } from 'react';
import client from '../api/client';
import DashboardJobCard from '../components/DashboardJobCard';

// Dữ liệu giả (Sẽ thay bằng API 'GET /api/candidate/my-applied-jobs')
const MOCK_APPLIED_JOBS = [
  { 
    _id: "fakejob1", 
    title: "Lập Trình Viên ReactJS (Đã nộp)", 
    company: "Công ty Test Frontend", 
    location: "TP. Hồ Chí Minh", 
    salary: "Thỏa thuận", 
    logoUrl: "https://ui-avatars.com/api/?name=R",
    createdAt: new Date(),
    status: "Đã gửi" // THÊM TRƯỜNG STATUS
  },
  { 
    _id: "fakejob2", 
    title: "Chuyên Viên Marketing (Đã xem)", 
    company: "Công ty Test Marketing", 
    location: "Hà Nội", 
    salary: "15 - 20 Triệu", 
    logoUrl: "https://ui-avatars.com/api/?name=M",
    createdAt: new Date(),
    status: "Đã xem" // THÊM TRƯỜNG STATUS
  }
];

export default function AppliedJobsPage() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // (Trong tương lai, bạn sẽ gọi API thật ở đây)
    // const fetchAppliedJobs = async () => {
    //   const res = await client.get('/api/candidate/my-applied-jobs');
    //   setJobs(res.data.data);
    //   setLoading(false);
    // };
    // fetchAppliedJobs();

    // Dùng data giả
    setJobs(MOCK_APPLIED_JOBS);
    setLoading(false);
  }, []);

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 md:p-8">
      <h2 className="text-2xl font-bold mb-6">Việc làm đã ứng tuyển</h2>

      {loading && <p>Đang tải...</p>}

      {!loading && jobs.length === 0 && (
        <p className="text-gray-500">Bạn chưa ứng tuyển vào công việc nào.</p>
      )}

      {!loading && jobs.length > 0 && (
        <div className="space-y-4">
          {jobs.map(job => (
            <DashboardJobCard
              key={job._id}
              job={job}
              status={job.status} // Truyền 'status' vào
            />
          ))}
        </div>
      )}
    </div>
  );
}