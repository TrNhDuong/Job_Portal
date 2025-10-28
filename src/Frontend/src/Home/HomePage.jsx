// src/home/HomePage.jsx

import Hero from "./components/Hero";
import Metrics from "./components/Metrics";
import FeaturedJobs from "./components/FeaturedJobs";
import FeaturedBrands from "./components/FeaturedBrands";
import TopSectors from "./components/TopSectors";
import CareerTips from "./components/CareerTips";

export default function HomePage() {
  return (
    <div className="py-6 bg-[#EAF1FF]">
      {/* DÒNG QUAN TRỌNG NHẤT LÀ DÒNG DƯỚI ĐÂY.
        Nó PHẢI giống hệt class container trong Navbar.jsx
      */}
      <div className=" mx-auto px-4 md:px-6 lg:px-10">
        <Hero />
        <Metrics />
        <div className="mt-8"><FeaturedJobs enableFetch={false} /></div>
        <div className="mt-8"><FeaturedBrands enableFetch={false} /></div>
        <div className="mt-8"><TopSectors /></div>
        <div className="mt-8 pb-8"><CareerTips /></div>
      </div>
    </div>
  );
}