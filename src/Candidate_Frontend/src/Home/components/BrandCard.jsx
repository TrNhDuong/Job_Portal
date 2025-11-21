import { Briefcase, MapPin } from "lucide-react";

export default function BrandCard({ brand, onViewDetails }) {
    const handleClick = () => {
    onViewDetails(brand);
  };

  return (
    <div
      className="rounded-xl border bg-white shadow-sm p-4 flex items-center gap-3
                 transition-all duration-200 hover:shadow-lg hover:scale-[1.02] cursor-pointer"
      onClick={handleClick}
    >
      <img
        src={brand.logoUrl}
        alt={brand.name}
        className="w-12 h-12 rounded-md object-contain bg-gray-100"
      />
      <div className="flex-1 overflow-hidden">
        <div className="font-semibold line-clamp-1">{brand.name}</div>
        <div className="text-sm text-gray-600 flex items-center gap-1">
          <Briefcase className="w-3 h-3" /> {brand.jobs} việc làm
        </div>
        {brand.location && (
          <div className="text-sm text-gray-500 flex items-center gap-1">
            <MapPin className="w-3 h-3" /> {brand.location}
          </div>
        )}
      </div>
    </div>
  );
}