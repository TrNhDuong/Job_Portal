// src/Home/components/FeaturedJobs.jsx
import { useState, useEffect } from "react";
import Section from "./Section";
import JobCard from "./JobCard";
import JobDetailModal from "./JobDetailModal";
import { Bookmark } from "lucide-react";
import useFeatured from "../hooks/useFeatured";
import { fetchFeaturedJobs } from "../services/home-api";
import { saveJob as apiSaveJob, removeSaveJob as apiRemoveSaveJob } from "../../api/candidate";
import { useAuth } from "../../context/AuthContext.jsx";

const featuredJobsTitle = (
  <div className="home-featured-title">
    <div className="home-featured-title-icon-wrap">
      <Bookmark className="home-featured-title-icon" />
    </div>
    <div className="home-featured-title-text">Việc làm nổi bật</div>
  </div>
);

export default function FeaturedJobs({ enableFetch = true }) {
  const { data: jobs, loading, error } = useFeatured(fetchFeaturedJobs, enableFetch);

  // 🔹 TẤT CẢ HOOKS NẰM TRONG COMPONENT
  const { user } = useAuth();
  const [savedList, setSavedList] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  
  // Lấy listSaveJobs ban đầu từ user (nếu backend có trả về)
  useEffect(() => {
    if (user && Array.isArray(user.listSaveJobs)) {
      setSavedList(user.listSaveJobs.map(String)); 
    }
  }, [user]);

  const handleSaveJob = async (job) => {
    if (!user) {
      alert("Bạn cần đăng nhập để lưu job");
      return;
    }

    const jobId = String(job._id);

    try {
      // nếu đã lưu rồi -> bỏ lưu
      if (savedList.includes(jobId)) {
        await apiRemoveSaveJob(user.email, jobId);
        setSavedList((prev) => prev.filter((id) => id !== jobId));
      } else {
        // chưa lưu -> lưu
        await apiSaveJob(user.email, jobId);
        setSavedList((prev) => [...prev, jobId]);
      }
    } catch (err) {
      console.error("Error (save job):", err);
      alert(err?.response?.data?.message || "Không thể lưu job");
    }
  };


  return (
    <>
      <Section
        title={featuredJobsTitle}
        right={error && <span className="home-featured-error">{error}</span>}
      >
        <div className="home-featured-wrapper">
          {loading ? (
            <div className="home-featured-grid">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="home-featured-skeleton" />
              ))}
            </div>
          ) : (
            <div className="home-featured-grid">
              {jobs.map((j) => (
                <JobCard
                  key={j._id}
                  job={j}
                  onViewDetails={setSelectedJob}
                  onSave={handleSaveJob}
                  isSaved={savedList.includes(String(j._id))}
                />
              ))}
            </div>
          )}
        </div>
      </Section>

      {selectedJob && (
        <JobDetailModal
          job={selectedJob}
          onClose={() => setSelectedJob(null)}
          onSave={handleSaveJob}                                
          isSaved={savedList.includes(String(selectedJob._id))} 
        />
      )}
    </>
  );
}
