// src/home/components/Hero.jsx
import { Search, MapPin, Briefcase } from "lucide-react";

export default function Hero() {
  return (
    <section className="flex flex-col items-center justify-center text-center py-16 bg-[#EAF1FF]">
      {/* Tiêu đề */}
      <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-gray-900">
        Find Your Dream Job
      </h1>
      <p className="text-gray-600 mt-3 text-lg max-w-2xl">
        Discover opportunities that match your skills and passion
      </p>

      {/* Thanh tìm kiếm */}
      <div className="mt-10 w-full flex justify-center">
        <div
          className="flex flex-col md:flex-row bg-white rounded-full shadow-xl overflow-hidden border border-gray-200
          w-[90%] max-w-5xl"
        >
          {/* Ô 1: Từ khóa */}
          <div className="flex-1 flex items-center px-6 py-7 border-b md:border-b-0 md:border-r border-gray-200">
            <Search className="w-7 h-7 text-gray-400 mr-3" />
            <input
              className="w-full outline-none border-none placeholder-gray-500 text-lg"
              placeholder="Từ khóa công việc..."
            />
          </div>

          {/* Ô 2: Vị trí */}
          <div className="flex items-center px-6 py-7 border-b md:border-b-0 md:border-r border-gray-200">
            <MapPin className="w-7 h-7 text-gray-400 mr-3" />
            <input
              className="w-full md:w-48 outline-none border-none placeholder-gray-500 text-lg"
              placeholder="Vị trí"
            />
          </div>

          {/* Ô 3: Lĩnh vực */}
          <div className="flex items-center px-6 py-7 border-b md:border-b-0 md:border-r border-gray-200">
            <Briefcase className="w-7 h-7 text-gray-400 mr-3" />
            <input
              className="w-full md:w-48 outline-none border-none placeholder-gray-500 text-lg"
              placeholder="Lĩnh vực"
            />
          </div>

          {/* Ô 4: Nút Search */}
          <button className="shrink-0 px-10 py-7 bg-black text-white font-semibold hover:bg-gray-800 transition text-lg rounded-r-full">
            Search
          </button>
        </div>
      </div>
    </section>
  );
}
