import React, { useState, useRef, useMemo } from "react";
import "../styles/employerManagePosts.css";
import { HiDotsVertical } from "react-icons/hi";

const jobTypes = ["Full-time", "Part-time", "Internship", "Freelance", "Contract"];

export default function EmployerManagePosts({
  posts,
  onEdit,
  onDelete,
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

  // TRONG EmployerManagePosts.jsx

  const filteredPosts = useMemo(() => {
      if (disableFilterBar) return posts;
      
      return posts.filter((post) => {
          // ...
          // Logic lọc đầu tiên: matchesText (Định nghĩa và sử dụng đúng)
          const matchesText = post.title.toLowerCase().includes(textFilter.toLowerCase()) || 
                              post.position.toLowerCase().includes(textFilter.toLowerCase());
          
          // Logic lọc thứ hai: matchesLocation (Định nghĩa)
          const matchesLocation = locationFilter ? post.location === locationFilter : true; 

          // Logic lọc thứ ba: matchesJobType (Định nghĩa)
          const matchesJobType = jobTypeFilter ? post.jobType === jobTypeFilter : true;
          
          // DÒNG KẾT HỢP CUỐI CÙNG (Dòng 56 trong ảnh)
          return matchesText && matchesLocation && matchesJobType; 
      });
  }, [posts, textFilter, locationFilter, jobTypeFilter, disableFilterBar]);

  return (
    <div className="manage-posts-container">
      {!disableFilterBar && (
        <div
          className="filter-bar"
          style={{
            left: "17.5%",    
            width: "82.5%", 
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

      <div className="job-post-list" style={{ paddingTop: disableFilterBar ? "0px" : "90px" }}>
        {filteredPosts.length > 0 ? (
          filteredPosts.map((post) => (
            <div
              key={post._id}
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
                  {Number(post.salary.minSalary).toLocaleString()} -{" "}
                  {Number(post.salary.maxSalary).toLocaleString()} {post.salary.currency}
                </p>

              </div>

              {!disableFilterBar && (
                <div className="actions-container">
                  <button
                    className="action-menu-toggle"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleMenuToggle(post._id);
                    }}
                  >
                    <HiDotsVertical size={20} />
                  </button>

                  {menuOpenId === post._id && (
                    <div className="action-menu" ref={menuRef}>
                      <button onClick={() => handleEditClick(post)}>Chỉnh sửa</button>
                      <button onClick={() => handleDeleteClick(post._id)} className="delete">Xóa</button>
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
