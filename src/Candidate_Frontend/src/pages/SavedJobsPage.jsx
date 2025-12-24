// src/pages/SavedJobsPage.jsx

import React, { useState, useEffect } from 'react';
import client from '../api/client';
import DashboardJobCard from '../components/DashboardJobCard';

// Dữ liệu giả (Sẽ thay bằng API 'GET /api/candidate/my-saved-jobs')
const MOCK_SAVED_JOBS = [
  { 
    _id: "fakejob3", 
    title: "Kế Toán Tổng Hợp (Đã lưu)", 
    company: "Công ty Test Kế Toán", 
    location: "Đà Nẵng", 
    salary: "10 - 15 Triệu", 
    logoUrl: "https://ui-avatars.com/api/?name=K",
    createdAt: new Date(),
  }
];

export default function SavedJobsPage() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // (Trong tương lai, bạn sẽ gọi API thật ở đây)
    // const fetchSavedJobs = async () => {
    //   const res = await client.get('/api/candidate/my-saved-jobs');
    //   setJobs(res.data.data);
    //   setLoading(false);
    // };
    // fetchSavedJobs();

    // Dùng data giả
    setJobs(MOCK_SAVED_JOBS);
    setLoading(false);
  }, []);

  // Hàm (giả) để xóa một job khỏi danh sách
  const handleRemoveJob = (jobId) => {
    setJobs(prevJobs => prevJobs.filter(job => job._id !== jobId));
    // (Trong tương lai, bạn sẽ gọi API:
    //  client.patch(`/api/candidate/unsave-job/${jobId}`)
    // )
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 md:p-8">
      <h2 className="text-2xl font-bold mb-6">Việc làm đã lưu</h2>

      {loading && <p>Đang tải...</p>}

      {!loading && jobs.length === 0 && (
        <p className="text-gray-500">Bạn chưa lưu công việc nào.</p>
      )}

      {!loading && jobs.length > 0 && (
        <div className="space-y-4">
          {jobs.map(job => (
            <DashboardJobCard
              key={job._id}
              job={job}
              onRemove={handleRemoveJob} // Truyền hàm 'onRemove' vào
            />
          ))}
        </div>
      )}
    </div>
  );
}