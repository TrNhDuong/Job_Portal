import Section from "./Section";
import BrandCard from "./BrandCard";
import useFeatured from "../hooks/useFeatured";
import { fetchFeaturedBrands } from "../services/home-api";
export default function FeaturedBrands({ enableFetch = false }) {
  const { data: brands, loading, error } = useFeatured(fetchFeaturedBrands, enableFetch);

  // Hiện chỉ chừa tiêu đề
  if (!enableFetch) {
    return <Section title="Thương Hiệu Nổi Bật"><div className="h-4"></div></Section>;
  }

  return (
    <Section title="Thương Hiệu Nổi Bật" right={error && <span className="text-sm text-red-600">{error}</span>}>
      {loading ? (
        <div className="grid md:grid-cols-4 gap-4">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="h-20 bg-gray-100 rounded-xl animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="grid md:grid-cols-4 gap-4">
          {brands.map(b => <BrandCard key={b._id} brand={b} />)}
        </div>
      )}
    </Section>
  );
}
