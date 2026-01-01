// src/Home/components/FeaturedJobs.jsx
import { useState, useEffect, useRef } from "react";
import Section from "./Section";
import JobCard from "./JobCard";
import JobDetailModal from "./JobDetailModal";
import { Bookmark, ChevronLeft, ChevronRight } from "lucide-react";
import useFeatured from "../hooks/useFeatured";
import { fetchFeaturedJobs } from "../services/home-api";
import { saveJob as apiSaveJob, removeSaveJob as apiRemoveSaveJob } from "../../api/candidate";
import { useAuth } from "../../context/AuthContext.jsx";

// Component Tiêu đề con
const FeaturedTitle = () => (
  <div className="home-featured-title-inner">
    <div className="home-featured-title-icon-wrap">
      <Bookmark className="home-featured-title-icon" />
    </div>
    <div className="home-featured-title-text">Việc làm nổi bật</div>
  </div>
);

export default function FeaturedJobs({ enableFetch = true }) {
  const { data: jobs, loading, error } = useFeatured(fetchFeaturedJobs, enableFetch);
  const { user } = useAuth();
  
  const [savedList, setSavedList] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [itemsPerView, setItemsPerView] = useState(3);
  const timeoutRef = useRef(null);

  // 1. Lấy danh sách đã lưu
  useEffect(() => {
    if (user && Array.isArray(user.listSaveJobs)) {
      setSavedList(user.listSaveJobs.map(String));
    }
  }, [user]);

  // 2. Responsive
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) setItemsPerView(1);
      else if (window.innerWidth < 1024) setItemsPerView(2);
      else setItemsPerView(3);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // 3. Auto-play
  useEffect(() => {
    if (loading || jobs.length === 0) return;
    const resetTimeout = () => { if (timeoutRef.current) clearTimeout(timeoutRef.current); };
    resetTimeout();
    
    timeoutRef.current = setTimeout(() => {
      handleNext();
    }, 5000); // Tăng lên 5s cho người dùng kịp đọc

    return () => resetTimeout();
  }, [currentIndex, loading, jobs.length, itemsPerView]);

  const handleNext = () => {
    const nextIndex = currentIndex + itemsPerView;
    if (nextIndex < jobs.length) {
      setCurrentIndex(nextIndex);
    } else {
      setCurrentIndex(0); // Loop về đầu
    }
  };

  const handlePrev = () => {
    const prevIndex = currentIndex - itemsPerView;
    if (prevIndex >= 0) {
      setCurrentIndex(prevIndex);
    } else {
      const lastPageStartIndex = Math.floor((jobs.length - 1) / itemsPerView) * itemsPerView;
      setCurrentIndex(lastPageStartIndex);
    }
  };

  const handleSaveJob = async (job) => {
    if (!user) { alert("Bạn cần đăng nhập để lưu job"); return; }
    const jobId = String(job._id);
    try {
      if (savedList.includes(jobId)) {
        await apiRemoveSaveJob(user.email, jobId);
        setSavedList((prev) => prev.filter((id) => id !== jobId));
      } else {
        await apiSaveJob(user.email, jobId);
        setSavedList((prev) => [...prev, jobId]);
      }
    } catch (err) { console.error(err); }
  };

  // Chỉ hiển thị nút điều hướng nếu cần thiết
  const showArrows = !loading && !error && jobs.length > itemsPerView;

  return (
    <>
      {/* Header chỉ còn Title */}
      <Section title={<FeaturedTitle />}>
        
        <div className="home-featured-wrapper">
          {error && <div className="home-featured-error">{error}</div>}

          {/* --- NÚT ĐIỀU HƯỚNG (NẰM ĐÈ LÊN CAROUSEL) --- */}
          {showArrows && (
            <>
              <button onClick={handlePrev} className="home-arrow prev" aria-label="Previous">
                <ChevronLeft size={24} />
              </button>
              <button onClick={handleNext} className="home-arrow next" aria-label="Next">
                <ChevronRight size={24} />
              </button>
            </>
          )}

          {loading ? (
            <div className="home-featured-grid-skeleton">
              {[...Array(3)].map((_, i) => <div key={i} className="home-featured-skeleton" />)}
            </div>
          ) : (
            <div className="home-featured-carousel">
              <div 
                className="home-featured-track"
                style={{ transform: `translateX(-${(currentIndex / itemsPerView) * 100}%)` }}
              >
                {jobs.map((j) => (
                  <div key={j._id} className="home-featured-item" style={{ width: `${100 / itemsPerView}%` }}>
                    <div className="home-featured-card-wrapper">
                      <JobCard
                        job={j}
                        onViewDetails={setSelectedJob}
                        onSave={handleSaveJob}
                        isSaved={savedList.includes(String(j._id))}
                      />
                    </div>
                  </div>
                ))}
              </div>
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