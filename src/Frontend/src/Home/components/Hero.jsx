import { Search, MapPin, Briefcase } from "lucide-react";

export default function Hero() {
  return (
    <section className="rounded-3xl bg-indigo-50 shadow-sm ring-1 ring-indigo-100 px-4 md:px-10 py-10 text-center">
      <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">
        Find Your Dream Job
      </h1>
      <p className="text-gray-600 mt-2">
        Discover opportunities that match your skills and passion
      </p>

      {/* Search row */}
      <div className="mt-6 flex flex-col md:flex-row items-stretch gap-3 md:gap-4">
        {/* Keyword */}
        <div className="flex-1 flex items-center bg-white rounded-full border border-gray-300 shadow-sm px-4 py-2">
          <Search className="w-4 h-4 text-gray-400 mr-2" />
          <input
            className="w-full outline-none text-sm md:text-base"
            placeholder="Từ khóa công việc..."
          />
        </div>

        {/* Location */}
        <div className="md:w-64 flex items-center bg-white rounded-full border border-gray-300 shadow-sm px-4 py-2">
          <MapPin className="w-4 h-4 text-gray-400 mr-2" />
          <input className="w-full outline-none" placeholder="Vị trí" />
        </div>

        {/* Category */}
        <div className="md:w-64 flex items-center bg-white rounded-full border border-gray-300 shadow-sm px-4 py-2">
          <Briefcase className="w-4 h-4 text-gray-400 mr-2" />
          <input className="w-full outline-none" placeholder="Lĩnh vực" />
        </div>

        <button className="px-5 py-2 rounded-full bg-black text-white font-semibold hover:bg-gray-900 transition">
          Search
        </button>
      </div>
    </section>
  );
}
