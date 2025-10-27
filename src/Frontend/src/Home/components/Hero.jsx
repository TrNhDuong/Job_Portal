import { Search, MapPin, Briefcase } from "lucide-react";

export default function Hero() {
  return (
    <div className="rounded-2xl bg-indigo-50 px-4 md:px-8 py-10 text-center shadow-sm">
      <h1 className="text-2xl md:text-4xl font-bold">Find Your Dream Job</h1>
      <p className="text-gray-600 mt-2">
        Discover opportunities that match your skills and passion
      </p>

      <div className="mt-6 mx-auto max-w-4xl flex items-center gap-2">
        <div className="flex-1 flex items-center bg-white rounded-full shadow-sm px-4 py-2 border">
          <Search className="w-4 h-4 text-gray-400 mr-2" />
          <input
            className="w-full outline-none text-sm md:text-base"
            placeholder="Từ khóa công việc..."
          />
        </div>

        <div className="hidden md:flex items-center bg-white rounded-full shadow-sm px-4 py-2 border">
          <MapPin className="w-4 h-4 text-gray-400 mr-2" />
          <input className="w-40 outline-none" placeholder="Vị trí" />
        </div>

        <div className="hidden md:flex items-center bg-white rounded-full shadow-sm px-4 py-2 border">
          <Briefcase className="w-4 h-4 text-gray-400 mr-2" />
          <input className="w-40 outline-none" placeholder="Lĩnh vực" />
        </div>

        <button className="px-5 py-2 rounded-full bg-black text-white font-medium">
          Search
        </button>
      </div>
    </div>
  );
}
