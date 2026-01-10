// src/pages/JobSearchPage.jsx
import React, { useState, useEffect } from "react";
import SearchFilters from "../components/SearchFilters";
import JobListings from "../components/JobListings";
import JobDetailPanel from "../components/JobDetailPanel";

import { useAuth } from "../context/AuthContext";
import client from "../api/client";
import "../styles/job-search.css"; // Đảm bảo đã import file CSS

export default function JobSearchPage() {
  const [selectedJob, setSelectedJob] = useState(null);
  const [filters, setFilters] = useState({
    keyword: "",
    location: "",
    major: "",
    jobType: "",
    salaryMin: "",
    salaryMax: "",
    experience: "",
    degree: "",
    page: 1,
  });

  const { user, login } = useAuth();

  useEffect(() => {
    const fetchCandidate = async () => {
      if (!user?.email) return;
      try {
        const res = await client.get(`/api/candidate?email=${user.email}`);
        if (res.data) login(res.data);
      } catch (err) {
        console.error("Lỗi user:", err);
      }
    };
    fetchCandidate();
  }, [user?.email, login]);

  return (
    // Container chính dùng layout Flex + Gap
    <main className="job-search-layout">

      {/* Cột trái: Bộ lọc */}
      <aside className="job-search-col job-search-sidebar">
        <SearchFilters filters={filters} setFilters={setFilters} />
      </aside>

      {/* Cột giữa: Danh sách */}
      <div className="job-search-col job-search-main">
        <JobListings
          selectedJob={selectedJob}
          onSelectJob={setSelectedJob}
          filters={filters}
          setFilters={setFilters}
        />
      </div>

      {/* Cột phải: Chi tiết (Chỉ hiện khi chọn job) */}
      {selectedJob && (
        <div className="job-search-col job-search-detail-panel">
          <JobDetailPanel job={selectedJob} onClose={() => setSelectedJob(null)} />
        </div>
      )}

    </main>
  );
}