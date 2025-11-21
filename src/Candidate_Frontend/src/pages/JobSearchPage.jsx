// src/pages/JobSearchPage.jsx
import React, { useState } from 'react';
import SearchFilters from '../components/SearchFilters';
import JobListings from '../components/JobListings';
import JobDetailPanel from '../components/JobDetailPanel';

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

  return (
    <main className="flex h-full bg-background">
      
      <aside className="w-full md:w-80 bg-sidebar text-sidebar-foreground border-r border-sidebar-border overflow-y-auto p-4">
        <SearchFilters filters={filters} setFilters={setFilters} />
      </aside>

      <div className="flex-1 border-r border-border overflow-y-auto">
        <JobListings 
          selectedJob={selectedJob} 
          onSelectJob={setSelectedJob} 
          filters={filters}
          setFilters={setFilters}
        />
      </div>

      {/* Cột Phải (Chi tiết) - Sửa: Dùng 'bg-card' (xám) */}
      {selectedJob && (
        <div className="hidden lg:block w-96 bg-card border-l border-border overflow-y-auto">
          <JobDetailPanel 
            job={selectedJob} 
            onClose={() => setSelectedJob(null)} 
          />
        </div>
      )}
    </main>
  );
}