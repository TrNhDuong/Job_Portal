// src/components/SearchFilters.jsx
import React from 'react';
import { Search, MapPin } from 'lucide-react';

export default function SearchFilters({ filters, setFilters }) {
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    // Khi đổi filter, quay về trang 1
    setFilters({ ...filters, [name]: value, page: 1 });
  };
  
  // Hàm xử lý cho checkbox
  const handleCheckboxChange = (name, value) => {
    const newValue = filters[name] === value ? "" : value; // Bấm lần nữa để bỏ chọn
    setFilters({ ...filters, [name]: newValue, page: 1 });
  };

  return (
    <div className="p-2 space-y-6">
      <div>
        <h2 className="text-xl font-bold text-gray-900 mb-2">Find Jobs</h2>
        <p className="text-sm text-gray-600">Search and filter positions</p>
      </div>

      {/* Keyword Search (Lọc ở Frontend) */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-800">Keyword</label>
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <input
            name="keyword"
            placeholder="Job title, skill..."
            className="pl-10 w-full px-3 py-2 bg-gray-50 border border-gray-300 text-gray-800 rounded-md text-sm"
            value={filters.keyword}
            onChange={handleChange}
          />
        </div>
      </div>

      {/* Location (Lọc ở Backend) */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-800">Location</label>
        <div className="relative">
          <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <input
            name="location"
            placeholder="City, region..."
            className="pl-10 w-full px-3 py-2 bg-gray-50 border border-gray-300 text-gray-800 rounded-md text-sm"
            value={filters.location}
            onChange={handleChange}
          />
        </div>
      </div>

      {/* Major (Ngành) - Khớp với model/jobPost.js */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-800">Category</label>
        <select
          name="major"
          className="w-full px-3 py-2 bg-gray-50 border border-gray-300 text-gray-800 rounded-md text-sm"
          value={filters.major}
          onChange={handleChange}
        >
          <option value="">All categories</option>
          <option value="IT">IT</option>
          <option value="Business">Business</option>
          <option value="Finance">Finance</option>
          <option value="Marketing">Marketing</option>
          <option value="Sales">Sales</option>
          <option value="Other">Other</option>
        </select>
      </div>
      
      {/* Salary (Lương) - Khớp với model/jobPost.js */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-800">Salary Range</label>
        <div className="flex gap-2">
          <input
            name="salaryMin"
            type="number"
            placeholder="Min (VND)"
            className="w-full px-3 py-2 bg-gray-50 border border-gray-300 text-gray-800 rounded-md text-sm"
            value={filters.salaryMin}
            onChange={handleChange}
          />
          <input
            name="salaryMax"
            type="number"
            placeholder="Max (VND)"
            className="w-full px-3 py-2 bg-gray-50 border border-gray-300 text-gray-800 rounded-md text-sm"
            value={filters.salaryMax}
            onChange={handleChange}
          />
        </div>
      </div>

      {/* Job Type */}
      <div className="space-y-3 text-sm">
        <h3 className="font-medium text-gray-800">Employment Type</h3>
        {['Full-time', 'Part-time', 'Internship', 'Freelance'].map((type) => (
          <label key={type} className="flex items-center space-x-2 cursor-pointer">
            <input 
              type="checkbox" 
              className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500" 
              checked={filters.jobType === type}
              onChange={() => handleCheckboxChange("jobType", type)}
            />
            <span className="text-gray-700">{type}</span>
          </label>
        ))}
      </div>
    </div>
  );
}