// src/Home/components/FeaturedBrands.jsx
import { useState } from "react";
import Section from "./Section";
import BrandCard from "./BrandCard";
import BrandDetailModal from "./BrandDetailModal";
import { Star } from "lucide-react";
import useFeatured from "../hooks/useFeatured";
import { fetchFeaturedBrands } from "../services/home-api";

// Tiêu đề dùng cùng style với FeaturedJobs
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

  return (
    <>
      <Section
        title={featuredBrandsTitle}
        right={
          error && <span className="home-section-error">{error}</span>
        }
      >
        <div className="home-brands-wrapper">
          {loading ? (
            <div className="home-brands-grid">
              {[...Array(8)].map((_, i) => (
                <div
                  key={i}
                  className="home-brands-skeleton"
                />
              ))}
            </div>
          ) : (
            <div className="home-brands-grid">
              {brands.map((b) => (
                <BrandCard
                  key={b._id}
                  brand={b}
                  onViewDetails={setSelectedBrand}
                />
              ))}
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
