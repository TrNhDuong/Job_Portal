// src/Home/components/FeaturedBrands.jsx
import { useState } from "react";
import BrandCard from "./BrandCard";
import BrandDetailModal from "./BrandDetailModal";
import { ChevronLeft, ChevronRight, Filter } from "lucide-react"; 
import useFeatured from "../hooks/useFeatured";
import { fetchFeaturedBrands } from "../services/home-api";

export default function FeaturedBrands({ enableFetch = true }) {
  const { data: brands, loading, error } = useFeatured(fetchFeaturedBrands, enableFetch);
  const [selectedBrand, setSelectedBrand] = useState(null);
  const [activeFilter, setActiveFilter] = useState("Tất cả");


  return (
    <div className="home-brands-pro-container">
      {/* 1. BANNER VÀNG ĐỒNG */}
      <div className="brands-gold-banner">
        <div className="brands-gold-content">
          <div className="brands-gold-text">
            <h2 className="brands-gold-title">Thương hiệu lớn tiêu biểu</h2>
            <p className="brands-gold-subtitle">Hàng trăm thương hiệu lớn tiêu biểu đang tuyển dụng trên CDH Portal</p>
          </div>
        </div>
      </div>

      {/* 3. GRID HIỂN THỊ VÀ MŨI TÊN */}
      <div className="brands-grid-container">
        <button className="brand-nav-btn prev"><ChevronLeft size={24} /></button>
        <button className="brand-nav-btn next"><ChevronRight size={24} /></button>

        <div className="brands-display-grid">
          {loading ? (
            [...Array(6)].map((_, i) => <div key={i} className="home-brands-skeleton" />)
          ) : (
            brands.slice(0, 6).map((b) => (
              <BrandCard 
                key={b._id} 
                brand={b} 
                onViewDetails={setSelectedBrand} 
              />
            ))
          )}
        </div>
      </div>

      {selectedBrand && (
        <BrandDetailModal brand={selectedBrand} onClose={() => setSelectedBrand(null)} />
      )}
    </div>
  );
}