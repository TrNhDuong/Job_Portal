import Section from "./Section";
import JobCard from "./JobCard";
import useFeatured from "../hooks/useFeatured";
import { fetchFeaturedJobs } from "../../src/Home/services/homeApi";

export default function FeaturedJobs({ enableFetch = false }) {
  const { data: jobs, loading, error } = useFeatured(fetchFeaturedJobs, enableFetch);

  // YÊU CẦU CỦA BẠN: hiện giờ chỉ chừa tiêu đề, không render danh sách
  if (!enableFetch) {
    return <Section title="Việc Làm Nổi Bật"><div className="h-4"></div></Section>;
  }

  return (
    <Section title="Việc Làm Nổi Bật" right={error && <span className="text-sm text-red-600">{error}</span>}>
      {loading ? (
        <div className="grid md:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-24 bg-gray-100 rounded-xl animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="grid md:grid-cols-3 gap-4">
          {jobs.map(j => <JobCard key={j._id} job={j} />)}
        </div>
      )}
    </Section>
  );
}
