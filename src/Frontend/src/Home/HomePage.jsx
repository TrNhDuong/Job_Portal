import Hero from "./components/Hero";
import Metrics from "./components/Metrics";
import FeaturedJobs from "./components/FeaturedJobs";
import FeaturedBrands from "./components/FeaturedBrands";

export default function HomePage() {
  return (
    <div className="px-4 md:px-6 lg:px-10 py-6 max-w-7xl mx-auto">
      <Hero />
      <Metrics />

      <FeaturedJobs enableFetch={false} />
      <FeaturedBrands enableFetch={false} />
    </div>
  );
}
