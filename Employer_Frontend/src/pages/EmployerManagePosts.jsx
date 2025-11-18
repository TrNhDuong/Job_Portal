import React, { useState, useRef, useMemo } from "react";
import "./employerManagePosts.css";
import { HiDotsVertical } from "react-icons/hi";

const jobTypes = ["Full-time", "Part-time", "Internship", "Freelance", "Contract"];

export default function EmployerManagePosts({
  posts,
  onEdit,
  onDelete,
  collapsed,
  disableFilterBar = false,   // ✅ NEW
  onSelectPost = null         // ✅ NEW
}) {
  const [menuOpenId, setMenuOpenId] = useState(null);
  const menuRef = useRef(null);

  const [textFilter, setTextFilter] = useState("");
  const [locationFilter, setLocationFilter] = useState("");
  const [jobTypeFilter, setJobTypeFilter] = useState("");

  const handleMenuToggle = (postId) => {
    setMenuOpenId((prevId) => (prevId === postId ? null : postId));
  };

  const handleEditClick = (post) => {
    onEdit?.(post);
    setMenuOpenId(null);
  };

  const handleDeleteClick = (postId) => {
    if (window.confirm("Bạn có chắc muốn xóa bài đăng này không?")) {
      onDelete?.(postId);
    }
    setMenuOpenId(null);
  };

  const uniqueLocations = useMemo(() => {
    const locations = new Set(posts.map((p) => p.location));
    return Array.from(locations).sort();
  }, [posts]);

  const filteredPosts = useMemo(() => {
    if (disableFilterBar) return posts; // ✅ BỎ LỌC KHI DISABLE
    return posts.filter((post) => {
      const matchesText =
        post.title.toLowerCase().includes(textFilter.toLowerCase()) ||
        post.position.toLowerCase().includes(textFilter.toLowerCase());
      const matchesLocation = locationFilter ? post.location === locationFilter : true;
      const matchesJobType = jobTypeFilter ? post.jobType === jobTypeFilter : true;
      return matchesText && matchesLocation && matchesJobType;
    });
  }, [posts, textFilter, locationFilter, jobTypeFilter, disableFilterBar]);

  return (
    <div className="manage-posts-container">

      {/* ✅ BỎ FILTER BAR NẾU disableFilterBar=true */}
      {!disableFilterBar && (
        <div
          className="filter-bar"
          style={{
            left: collapsed ? "5%" : "17.5%",
            transition: "left 0.3s ease",
          }}
        >
          <div className="filter-row-top">
            <input
              type="text"
              placeholder="Tìm theo tiêu đề hoặc vị trí..."
              value={textFilter}
              onChange={(e) => setTextFilter(e.target.value)}
              className="filter-input"
            />
          </div>

          <div className="filter-row-bottom">
            <div className="filter-options">
              <select value={locationFilter} onChange={(e) => setLocationFilter(e.target.value)}>
                <option value="">Tất cả địa điểm</option>
                {uniqueLocations.map((loc) => (
                  <option key={loc} value={loc}>{loc}</option>
                ))}
              </select>
            </div>

            <div className="filter-options">
              <select value={jobTypeFilter} onChange={(e) => setJobTypeFilter(e.target.value)}>
                <option value="">Tất cả loại hình</option>
                {jobTypes.map((type) => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>

            <button onClick={() => {
              setTextFilter("");
              setLocationFilter("");
              setJobTypeFilter("");
            }}>Reset</button>
          </div>
        </div>
      )}

      <div className="job-post-list" style={{ paddingTop: disableFilterBar ? "0px" : "120px" }}>
        {filteredPosts.length > 0 ? (
          filteredPosts.map((post) => (
            <div
              key={post.id}
              className="job-post-card"
              onClick={() => onSelectPost?.(post)} // ✅ CLICK → CHỌN POST
            >
              <div className="job-post-info">
                <div className="job-post-header">
                  <h3>{post.title}</h3>
                  <p className="job-post-position">{post.position}</p>
                </div>

                <p className="job-post-location">{post.location}</p>

                <p className="job-post-salary">
                  {Number(post.minSalary).toLocaleString()} -{" "}
                  {Number(post.maxSalary).toLocaleString()} {post.currency}
                </p>
              </div>

              {!disableFilterBar && (
                <div className="actions-container">
                  <button
                    className="action-menu-toggle"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleMenuToggle(post.id);
                    }}
                  >
                    <HiDotsVertical size={20} />
                  </button>

                  {menuOpenId === post.id && (
                    <div className="action-menu" ref={menuRef}>
                      <button onClick={() => handleEditClick(post)}>Chỉnh sửa</button>
                      <button onClick={() => handleDeleteClick(post.id)} className="delete">Xóa</button>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="no-results">
            {posts.length > 0 ? "Không tìm thấy bài đăng nào." : "Bạn đang muốn tuyển dụng nhân sự? Hãy đăng tin."}
          </div>
        )}
      </div>
    </div>
  );
}
