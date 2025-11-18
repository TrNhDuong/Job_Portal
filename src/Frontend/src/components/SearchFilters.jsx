// src/components/SearchFilters.jsx
import React from 'react';
import { Search, MapPin } from 'lucide-react';

export default function SearchFilters({ filters, setFilters }) {
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters({ ...filters, [name]: value, page: 1 });
  };
  
  const handleCheckboxChange = (name, value) => {
    const newValue = filters[name] === value ? "" : value;
    setFilters({ ...filters, [name]: newValue, page: 1 });
  };

  // Hàm (giả) cho nút Search Jobs
  const handleSearch = () => {
    // Logic tìm kiếm đã được xử lý tự động bởi hook 'useJobs'
    // Nút này chỉ để cho đẹp
    console.log("Đang tìm với filters:", filters);
  };

  return (
    <div className="p-2 space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-sidebar-foreground mb-2">Find Jobs</h2>
        <p className="text-sm text-sidebar-foreground/70">Search and filter positions</p>
      </div>

      {/* Keyword Search */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-sidebar-foreground">Keyword</label>
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-sidebar-foreground/50" />
          <input
            name="keyword"
            placeholder="Job title, skill..."
            className="pl-10 w-full px-3 py-2 bg-sidebar-accent/50 border border-sidebar-border text-sidebar-foreground placeholder:text-sidebar-foreground/50 rounded-md text-sm"
            value={filters.keyword}
            onChange={handleChange}
          />
        </div>
      </div>

      {/* Location */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-sidebar-foreground">Location</label>
        <div className="relative">
          <MapPin className="absolute left-3 top-3 h-4 w-4 text-sidebar-foreground/50" />
          <input
            name="location"
            placeholder="City, region..."
            className="pl-10 w-full px-3 py-2 bg-sidebar-accent/50 border border-sidebar-border text-sidebar-foreground placeholder:text-sidebar-foreground/50 rounded-md text-sm"
            value={filters.location}
            onChange={handleChange}
          />
        </div>
      </div>

      {/* Major (Category) */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-sidebar-foreground">Category</label>
        <select
          name="major"
          className="w-full px-3 py-2 bg-sidebar-accent/50 border border-sidebar-border text-sidebar-foreground rounded-md text-sm"
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
      
      {/* Salary (Lương) */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-sidebar-foreground">Salary Range</label>
        <select
          name="salaryRange" // Tạm thời dùng 1 select (dễ hơn)
          className="w-full px-3 py-2 bg-sidebar-accent/50 border border-sidebar-border text-sidebar-foreground rounded-md text-sm"
          value={filters.salaryRange || ""} // (Backend chưa hỗ trợ, đây là UI)
          onChange={(e) => {
            // (Logic này cần được cập nhật khi Backend hỗ trợ salaryMin/Max)
            const [min, max] = e.target.value.split('-');
            setFilters({ ...filters, salaryMin: min || "", salaryMax: max || "", page: 1 });
          }}
        >
          <option value="">Any salary</option>
          <option value="10000000-20000000">10tr - 20tr</option>
          <option value="20000000-30000000">20tr - 30tr</option>
          <option value="30000000-50000000">30tr - 50tr</option>
        </select>
      </div>

      <button 
        onClick={handleSearch}
        className="w-full py-2 bg-sidebar-primary text-sidebar-primary-foreground hover:bg-sidebar-primary/90 rounded-md font-semibold"
      >
        Search Jobs
      </button>

      <hr className="border-sidebar-border" />

      {/* Job Type */}
      <div className="space-y-3 text-sm">
        <h3 className="font-medium text-sidebar-foreground">Employment Type</h3>
        {['Full-time', 'Part-time', 'Contract'].map((type) => (
          <label key={type} className="flex items-center space-x-2 cursor-pointer">
            <input 
              type="checkbox" 
              className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500" // (Tailwind mặc định)
              checked={filters.jobType === type}
              onChange={() => handleCheckboxChange("jobType", type)}
            />
            <span className="text-sidebar-foreground">{type}</span>
          </label>
        ))}
      </div>
    </div>
  );
}