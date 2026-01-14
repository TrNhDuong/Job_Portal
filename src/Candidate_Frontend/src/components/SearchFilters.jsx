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
    // ✅ để rỗng thì "", còn lại ép số
    const next = value === "" ? "" : Number(value);
    setFilters({ ...filters, [name]: next, page: 1 });
  };

  const handleCheckboxChange = (name, value) => {
    const newValue = filters[name] === value ? "" : value;
    setFilters({ ...filters, [name]: newValue, page: 1 });
  };

  return (
    <div className="job-filters-card job-filters-card--pro">
      {/* Header */}
      <div className="job-filters-header">
        <h2 className="job-filters-title">Tìm kiếm việc làm</h2>
      </div>

      {/* Keyword */}
      <div className="job-filters-section">
        <label className="job-filters-label">Từ khóa</label>
        <div className="job-filters-input-wrapper">
          <Search className="job-filters-input-icon" />
          <input
            name="keyword"
            placeholder="Chức danh, kỹ năng..."
            value={filters.keyword}
            onChange={handleChange}
            className="job-filters-input job-filters-input--with-icon job-filters-input--pro"
          />
        </div>
      </div>

      {/* Location */}
      <div className="job-filters-section">
        <label className="job-filters-label">Địa điểm</label>
        <div className="job-filters-input-wrapper">
          <MapPin className="job-filters-input-icon" />
          <input
            name="location"
            placeholder="Thành phố, khu vực..."
            value={filters.location}
            onChange={handleChange}
            className="job-filters-input job-filters-input--with-icon job-filters-input--pro"
          />
        </div>
      </div>

      {/* Salary + Currency */}
      <div className="job-filters-section">
        <label className="job-filters-label">Mức lương</label>

        <div className="job-filters-salary-grid">
          <input
            name="salaryMin"
            placeholder="Min"
            value={filters.salaryMin === "" ? "" : (filters.salaryMin || "")}
            onChange={handleSalaryChange}
            className="job-filters-input job-filters-input--pro"
            inputMode="numeric"
          />

          <input
            name="salaryMax"
            placeholder="Max"
            value={filters.salaryMax === "" ? "" : (filters.salaryMax || "")}
            onChange={handleSalaryChange}
            className="job-filters-input job-filters-input--pro"
            inputMode="numeric"
          />


        </div>
      </div>

      {/* Major */}
      <div className="job-filters-section">
        <label className="job-filters-label">Ngành nghề</label>
        <select
          name="major"
          value={filters.major}
          onChange={handleChange}
          className="job-filters-select job-filters-select--pro"
        >
        <option value="">Tất cả ngành nghề</option>
          <option value="IT">IT</option>
          <option value="Healthcare">Healthcare</option>
          <option value="Tài chính">Tài chính</option> {/* Đổi từ "Finance" thành "Tài chính" */}
          <option value="Bất động sản">Bất động sản</option>
          <option value="Logistics">Logistics</option>
          <option value="Thiết kế">Thiết kế</option>
          <option value="CSKH">CSKH</option>
          <option value="Truyền thông">Truyền thông</option>
        </select>
      </div>

      <div className="job-filters-divider" />

      {/* JobType chips */}
      <div className="job-filters-section">
        <h3 className="job-filters-label">Hình thức làm việc</h3>

        <div className="job-filters-chips">
          {["Full-time", "Part-time", "Contract"].map((type) => {
            const active = filters.jobType === type;

            return (
              <button
                key={type}
                type="button"
                className={`job-filter-chip ${active ? "is-active" : ""}`}
                onClick={() => handleCheckboxChange("jobType", type)}
              >
                <span className="job-filter-chip-dot" />
                <span className="job-filter-chip-label">{type}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
