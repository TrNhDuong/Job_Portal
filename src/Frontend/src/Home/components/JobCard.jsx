import { MapPin } from "lucide-react";

export default function JobCard({ job }) {
  return (
    <div className="rounded-xl border bg-white shadow-sm p-4 flex gap-3">
      <img
        src={job.logoUrl}
        alt={job.company}
        className="w-10 h-10 rounded-md object-contain bg-gray-100"
      />
      <div className="flex-1">
        <div className="font-semibold">{job.title}</div>
        <div className="text-sm text-gray-600">{job.company}</div>
        <div className="text-sm text-gray-600">{job.salary}</div>
        <div className="text-sm text-gray-500 flex items-center gap-1">
          <MapPin className="w-3 h-3" /> {job.location}
        </div>
      </div>
    </div>
  );
}
