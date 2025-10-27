import { Briefcase, MapPin } from "lucide-react";

export default function BrandCard({ brand }) {
  return (
    <div className="rounded-xl border bg-white shadow-sm p-4 flex items-center gap-3">
      <img
        src={brand.logoUrl}
        alt={brand.name}
        className="w-12 h-12 rounded-md object-contain bg-gray-100"
      />
      <div className="flex-1">
        <div className="font-semibold">{brand.name}</div>
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
