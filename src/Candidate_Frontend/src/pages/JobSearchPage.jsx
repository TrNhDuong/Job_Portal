// src/pages/JobSearchPage.jsx
import React, { useState, useEffect } from "react";
import SearchFilters from "../components/SearchFilters";
import JobListings from "../components/JobListings";
import JobDetailPanel from "../components/JobDetailPanel";

import { useAuth } from "../context/AuthContext";
import client from "../api/client";

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

  // 🔄 Mỗi lần vào trang JobSearchPage, đồng bộ lại dữ liệu candidate
  useEffect(() => {
    const fetchCandidate = async () => {
      if (!user?.email) return;

      try {
        const res = await client.get(`/api/candidate?email=${user.email}`);
        const candidate = res.data;

        if (candidate) {
          // ghi đè lại user trong AuthContext bằng dữ liệu candidate mới nhất
          login(candidate);
        } else {
          console.warn("Không tìm thấy candidate cho email", user.email);
        }
      } catch (err) {
        console.error("Lỗi khi lấy dữ liệu user (JobSearchPage):", err);
      }
    };

    fetchCandidate();
    // chỉ re-run khi email thay đổi (khi login user khác)
  }, [user?.email, login]);

  return (
    <main className="flex h-full bg-background">
      {/* Cột trái: bộ lọc */}
      <aside className="w-full md:w-80 bg-sidebar text-sidebar-foreground border-r border-sidebar-border overflow-y-auto p-4">
        <SearchFilters filters={filters} setFilters={setFilters} />
      </aside>

      {/* Cột giữa: danh sách job */}
      <div className="flex-1 border-r border-border overflow-y-auto">
        <JobListings
          selectedJob={selectedJob}
          onSelectJob={setSelectedJob}
          filters={filters}
          setFilters={setFilters}
        />
      </div>

      {/* Cột phải: panel chi tiết */}
      {selectedJob && (
        <div className="hidden lg:block w-96 bg-card border-l border-border overflow-y-auto">
          <JobDetailPanel job={selectedJob} onClose={() => setSelectedJob(null)} />
        </div>
      )}
    </main>
  );
}
