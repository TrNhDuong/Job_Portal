import { Link } from "react-router-dom";
import { X, MapPin, Briefcase } from "lucide-react";

export default function BrandDetailModal({ brand, onClose }) {
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-lg shadow-2xl max-w-2xl w-full p-6 relative animate-fade-in-down">
        
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-700"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="flex gap-4">
          <img
            src={brand.logoUrl}
            alt={brand.name}
            className="w-16 h-16 rounded-md object-contain bg-gray-100"
          />
          <div>
            <h2 className="text-xl font-bold text-blue-600">{brand.name}</h2>
            <div className="text-gray-700 flex items-center gap-1 mt-1">
              <MapPin className="w-4 h-4" /> {brand.location}
            </div>
            <div className="text-gray-700 flex items-center gap-1">
              <Briefcase className="w-4 h-4" /> {brand.jobs} việc làm đang tuyển
            </div>
          </div>
        </div>

        <div className="mt-4">
          <h3 className="font-semibold text-gray-800">Giới thiệu công ty:</h3>
          <p className="text-sm text-gray-700 h-60 overflow-y-auto mt-1 p-2 bg-gray-50 rounded">
            {brand.description || "Mô tả công ty không có sẵn."}
          </p>
        </div>

        <div className="flex gap-3 mt-4">
          <Link
            to={`/company/${brand._id}`}
            className="flex-1 text-center px-4 py-2 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700"
          >
            Xem tất cả việc làm ({brand.jobs})
          </Link>
        </div>
      </div>
    </div>
  );
}