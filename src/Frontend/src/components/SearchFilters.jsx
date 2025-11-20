// src/components/SearchFilters.jsx
import React from "react";
import { Search, MapPin } from "lucide-react";

export default function SearchFilters({ filters, setFilters }) {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters({ ...filters, [name]: value, page: 1 });
  };

  const handleSalaryChange = (e) => {
    const { name, value } = e.target;
    setFilters({ ...filters, [name]: value, page: 1 });
  };

  const handleCheckboxChange = (name, value) => {
    const newValue = filters[name] === value ? "" : value;
    setFilters({ ...filters, [name]: newValue, page: 1 });
  };

  return (
    <div className="h-full bg-[#0D1117] text-white">
      <div className="px-5 py-6 space-y-6">
        <div className="mx-8">
        {/* Header */}
        <div className="space-y-1">
          <h2 className="text-xl font-semibold">Find Jobs</h2>
          <p className="text-sm text-gray-400">
            Search and filter available positions
          </p>
        </div>

        {/* Keyword */}
        <div style={{ height: 20 }} />
        <div className="space-y-2 mt-8">
          <label className="text-sm font-medium">Keyword</label>
          <div className="relative mx-4">
            {!filters.keyword && (
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-300" />
            )}
            <input
              name="keyword"
              placeholder="       Job title, skill..."
              value={filters.keyword}
              onChange={handleChange}
              className="w-full h-10 rounded-md bg-[#445760] text-white 
                         placeholder-gray-300 pl-10 pr-3 
                         border border-[#2F3B42]
                         focus:outline-none focus:ring-2 focus:ring-[#00A5B8] mx-8"
            />
          </div>
        </div>

        {/* Location */}
        <div style={{ height: 20 }} />
        <div className="space-y-2">
          <label className="text-sm font-medium">Location</label>
          <div className="relative mx-4">
            {!filters.location && (
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-300" />
            )}
            <input
              name="location"
              placeholder="       City, region..."
              value={filters.location}
              onChange={handleChange}
              className="w-full h-10 rounded-md bg-[#445760] text-white 
                         placeholder-gray-300 pl-10 pr-3 
                         border border-[#2F3B42]
                         focus:outline-none focus:ring-2 focus:ring-[#00A5B8] mx-8"
            />
          </div>
        </div>

        {/* Salary Range */}
        <div style={{ height: 20 }} />
        <div className="space-y-2">
          <label className="text-sm font-medium">Salary Range</label>
          <div className="grid grid-cols-2 gap-3 mx-4">
            <input
              name="salaryMin"
              placeholder="  Min"
              value={filters.salaryMin || ""}
              onChange={handleSalaryChange}
              className="h-10 rounded-md bg-[#445760] text-white 
                         placeholder-gray-300 px-3 
                         border border-[#2F3B42]
                         focus:outline-none focus:ring-2 focus:ring-[#00A5B8] mx-8"
            />
            <input
              name="salaryMax"
              placeholder="  Max"
              value={filters.salaryMax || ""}
              onChange={handleSalaryChange}
              className="h-10 rounded-md bg-[#445760] text-white 
                         placeholder-gray-300 px-3 
                         border border-[#2F3B42]
                         focus:outline-none focus:ring-2 focus:ring-[#00A5B8] mx-8"
            />
          </div>
        </div>

        {/* Category */}
        <div style={{ height: 20 }} />
        <div className="space-y-2">
          <label className="text-sm font-medium">Category</label>
          <select
            name="major"
            value={filters.major}
            onChange={handleChange}
            className="w-full h-10 rounded-md bg-[#445760] text-white 
                       px-3 border border-[#2F3B42]
                       focus:outline-none mx-8"
          >
            <option value=""> All categories</option>
            <option value="IT">IT</option>
            <option value="Business">Business</option>
            <option value="Finance">Finance</option>
            <option value="Marketing">Marketing</option>
            <option value="Sales">Sales</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <hr className="border-gray-700 mx-8" />

        {/* Employment Type */}
        <div style={{ height: 20 }} />
        <div className="space-y-3 text-sm">
          <h3 className="font-medium">Employment Type</h3>
          {["Full-time", "Part-time", "Contract"].map((type) => (
            <label key={type} className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={filters.jobType === type}
                onChange={() => handleCheckboxChange("jobType", type)}
                className="w-4 h-4 rounded border border-gray-400 bg-[#445760]
                           focus:ring-[#0097A7]"
              />
              <span>{type}</span>
            </label>
          ))}
        </div>
        </div>
      </div>
    </div>
  );
}
