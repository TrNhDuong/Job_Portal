// src/Home/components/FeaturedBrands.jsx
import { useState, useEffect, useRef } from "react";
import Section from "./Section";
import BrandCard from "./BrandCard";
import BrandDetailModal from "./BrandDetailModal";
import { Star, ChevronLeft, ChevronRight } from "lucide-react"; // Thêm icon mũi tên
import useFeatured from "../hooks/useFeatured";
import { fetchFeaturedBrands } from "../services/home-api";

// Tiêu đề (giữ nguyên)
const featuredBrandsTitle = (
  <div className="home-section-title">
    <div className="home-section-title-icon-wrap">
      <Star className="home-section-title-icon text-yellow-400" />
    </div>
    <div className="home-section-title-text">
      Thương hiệu nổi bật
    </div>
  </div>
);

export default function FeaturedBrands({ enableFetch = true }) {
  const { data: brands, loading, error } = useFeatured(
    fetchFeaturedBrands,
    enableFetch
  );

  const [selectedBrand, setSelectedBrand] = useState(null);
  
  // --- Logic Carousel (Giống FeaturedJobs) ---
  const [currentIndex, setCurrentIndex] = useState(0);
  const [itemsPerView, setItemsPerView] = useState(4); // Mặc định 4 như yêu cầu
  const timeoutRef = useRef(null);

  // 1. Responsive: Điều chỉnh số lượng brand hiển thị dựa trên màn hình
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) setItemsPerView(1);       // Mobile
      else if (window.innerWidth < 768) setItemsPerView(2);  // Tablet nhỏ
      else if (window.innerWidth < 1024) setItemsPerView(3); // Tablet lớn
      else setItemsPerView(4);                               // Desktop (Yêu cầu của bạn)
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // 2. Auto-play (Tự động trượt sau 5s - tùy chọn, nếu không muốn có thể bỏ)
  useEffect(() => {
    if (loading || brands.length === 0) return;
    const resetTimeout = () => { if (timeoutRef.current) clearTimeout(timeoutRef.current); };
    resetTimeout();
    
    timeoutRef.current = setTimeout(() => {
      handleNext();
    }, 5000);

    return () => resetTimeout();
  }, [currentIndex, loading, brands.length, itemsPerView]);

  // 3. Xử lý Next / Prev
  const handleNext = () => {
    const nextIndex = currentIndex + itemsPerView;
    if (nextIndex < brands.length) {
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
      // Về trang cuối
      const lastPageStartIndex = Math.floor((brands.length - 1) / itemsPerView) * itemsPerView;
      setCurrentIndex(lastPageStartIndex);
    }
  };

  // Điều kiện hiển thị nút điều hướng
  const showArrows = !loading && !error && brands.length > itemsPerView;

  return (
    <>
      <Section
        title={featuredBrandsTitle}
        right={
          error && <span className="home-section-error">{error}</span>
        }
      >
        {/* Thêm class relative để định vị nút mũi tên */}
        <div className="home-brands-wrapper relative-wrapper">
          
          {/* --- NÚT ĐIỀU HƯỚNG --- */}
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
            // Skeleton Loader (Giữ nguyên style grid cũ cho đẹp hoặc chuyển sang row)
            <div className="home-brands-grid">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="home-brands-skeleton" />
              ))}
            </div>
          ) : (
            // Cấu trúc Carousel
            <div className="home-brands-carousel">
              <div 
                className="home-brands-track"
                style={{ transform: `translateX(-${(currentIndex / itemsPerView) * 100}%)` }}
              >
                {brands.map((b) => (
                  <div 
                    key={b._id} 
                    className="home-brands-item" 
                    style={{ width: `${100 / itemsPerView}%` }}
                  >
                    <BrandCard
                      brand={b}
                      onViewDetails={setSelectedBrand}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </Section>

      {selectedBrand && (
        <BrandDetailModal
          brand={selectedBrand}
          onClose={() => setSelectedBrand(null)}
        />
      )}
    </>
  );
}