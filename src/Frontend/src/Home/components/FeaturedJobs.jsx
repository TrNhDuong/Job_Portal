// src/home/components/FeaturedJobs.jsx
import { useState } from "react";
import Section from "./Section";
import JobCard from "./JobCard";
import JobDetailModal from "./JobDetailModal";
import { Bookmark } from "lucide-react"; 
import useFeatured from "../hooks/useFeatured";
import { fetchFeaturedJobs } from "../services/home-api";

const featuredJobsTitle = (
  <div className="flex items-center gap-2">
    <Bookmark className="w-6 h-6 text-red-600 fill-red-600" />
    <span className="text-2xl md:text-3xl font-bold">Việc Làm Nổi Bật</span>
  </div>
);

export default function FeaturedJobs({ enableFetch = true }) {
  const { data: jobs, loading, error } = useFeatured(
    fetchFeaturedJobs, 
    enableFetch
  );

  // Sửa: Thêm lại state "selectedJob"
  const [selectedJob, setSelectedJob] = useState(null);

  return (
    <> 
      <Section title={featuredJobsTitle} right={error && <span className="text-sm text-red-600">{error}</span>}>
        {loading ? (
          <div className="grid md:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-24 bg-gray-100 rounded-xl animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-4">
            {jobs.map(j => (
              <JobCard
                key={j._id}
                job={j}
                onViewDetails={setSelectedJob} 
              />
            ))}
          </div>
        )}
      </Section>

      {selectedJob && (
        <JobDetailModal 
          job={selectedJob} 
          onClose={() => setSelectedJob(null)}
        />
      )}
    </>
  );
}