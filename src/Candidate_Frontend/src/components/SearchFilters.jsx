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
    <div className="job-filters-card">
      {/* Header */}
      <div className="job-filters-header">
        <h2 className="job-filters-title">Tìm kiếm việc làm</h2>
        <p className="job-filters-subtitle">
          Lọc và khám phá các vị trí phù hợp với bạn
        </p>
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
            className="job-filters-input job-filters-input--with-icon"
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
            className="job-filters-input job-filters-input--with-icon"
          />
        </div>
      </div>

      {/* Salary Range */}
      <div className="job-filters-section">
        <label className="job-filters-label">Mức lương (triệu VNĐ)</label>
        <div className="job-filters-salary-row">
          <input
            name="salaryMin"
            placeholder="Tối thiểu"
            value={filters.salaryMin || ""}
            onChange={handleSalaryChange}
            className="job-filters-input"
          />
          <span className="job-filters-salary-separator">—</span>
          <input
            name="salaryMax"
            placeholder="Tối đa"
            value={filters.salaryMax || ""}
            onChange={handleSalaryChange}
            className="job-filters-input"
          />
        </div>
      </div>

      {/* Category */}
      <div className="job-filters-section">
        <label className="job-filters-label">Ngành nghề</label>
        <select
          name="major"
          value={filters.major}
          onChange={handleChange}
          className="job-filters-select"
        >
          <option value="">Tất cả ngành nghề</option>
          <option value="IT">Công nghệ thông tin</option>
          <option value="Business">Kinh doanh</option>
          <option value="Finance">Tài chính</option>
          <option value="Marketing">Marketing</option>
          <option value="Sales">Bán hàng</option>
          <option value="Other">Khác</option>
        </select>
      </div>

      <div className="job-filters-divider" />

      {/* Employment Type */}
      <div className="job-filters-section">
        <h3 className="job-filters-label">Hình thức làm việc</h3>
        <div className="job-filters-checkbox-group">
          {["Full-time", "Part-time", "Contract"].map((type) => (
            <label key={type} className="job-filters-checkbox-item">
              <input
                type="checkbox"
                checked={filters.jobType === type}
                onChange={() => handleCheckboxChange("jobType", type)}
                className="job-filters-checkbox"
              />
              <span className="job-filters-checkbox-label">{type}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}
