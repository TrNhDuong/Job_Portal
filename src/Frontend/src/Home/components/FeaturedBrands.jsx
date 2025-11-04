import { useState } from "react"; 
import Section from "./Section";
import BrandCard from "./BrandCard";
import BrandDetailModal from "./BrandDetailModal"; 
import { Star } from "lucide-react"; 
import useFeatured from "../hooks/useFeatured"; 
import { fetchFeaturedBrands } from "../services/home-api";

const featuredBrandsTitle = (
  <div className="flex items-center gap-2">
    <Star className="w-6 h-6 text-yellow-500 fill-yellow-500" />
    <span className="text-2xl md:text-3xl font-bold">Thương Hiệu Nổi Bật</span>
  </div>
);

export default function FeaturedBrands({ enableFetch = true }) {
  // GỌI HOOK ĐỂ LẤY DATA THẬT
  const { data: brands, loading, error } = useFeatured(
    fetchFeaturedBrands, 
    enableFetch 
  );

  const [selectedBrand, setSelectedBrand] = useState(null);
  
  return (
    <>
      <Section title={featuredBrandsTitle} right={error && <span className="text-sm text-red-600">{error}</span>}>
      
      {loading ? (
        // Hiển thị loading...
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="h-20 bg-gray-100 rounded-xl animate-pulse" />
          ))}
        </div>
      ) : (
        // Hiển thị data thật
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {/* DÙNG "brands.map" (DATA THẬT) */}
          {brands.map(b => ( 
            <BrandCard
              key={b._id}
              brand={b} 
              onViewDetails={setSelectedBrand} 
              />
            ))}
          </div>
      )}
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