import React, { useState, useRef, useMemo, useEffect } from "react";
import "../styles/employerManagePosts.css";
// Import thêm các icon đẹp mắt
import { HiDotsHorizontal, HiLocationMarker, HiCurrencyDollar, HiBriefcase, HiClock, HiEye, HiUserGroup } from "react-icons/hi";

const jobTypes = ["Full-time", "Part-time", "Internship", "Freelance", "Contract"];

export default function EmployerManagePosts({
  posts,
  onEdit,
  onDelete,
  onUpdateState,
  onToggleStatus,
  disableFilterBar = false,
  onSelectPost = null
}) {
  const [menuOpenId, setMenuOpenId] = useState(null);
  const menuRef = useRef(null);

  // States cho bộ lọc
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
    if (window.confirm("Hành động này không thể hoàn tác. Bạn chắc chắn muốn xóa?")) {
      onDelete?.(postId);
    }
    setMenuOpenId(null);
  };

  const handleToggleStatusClick = (post) => {
    // 1. Kiểm tra trạng thái hiện tại
    const isCurrentlyClosed = post.state === 'Closed';
    
    const message = isCurrentlyClosed 
      ? "Bạn có muốn mở lại bài tuyển dụng này không?" 
      : "Bạn muốn đóng bài tuyển dụng này? Ứng viên sẽ không thể nộp đơn nữa.";

    if (window.confirm(message)) {
      post.state = isCurrentlyClosed ? 'Open' : 'Closed';
      onUpdateState(post)
    }
    
    setMenuOpenId(null);
  };

  // Logic lọc giữ nguyên
  const uniqueLocations = useMemo(() => {
    const locations = new Set(posts.map((p) => p.location));
    return Array.from(locations).sort();
  }, [posts]);

  const filteredPosts = useMemo(() => {
    if (disableFilterBar) return posts;
    return posts.filter((post) => {
      const matchesText = post.title.toLowerCase().includes(textFilter.toLowerCase()) || 
                          post.position.toLowerCase().includes(textFilter.toLowerCase());
      const matchesLocation = locationFilter ? post.location === locationFilter : true; 
      const matchesJobType = jobTypeFilter ? post.jobType === jobTypeFilter : true;
      return matchesText && matchesLocation && matchesJobType; 
    });
  }, [posts, textFilter, locationFilter, jobTypeFilter, disableFilterBar]);

  // Helper format tiền tệ
  const formatSalary = (min, max, currency) => {
    return `${Number(min).toLocaleString()} - ${Number(max).toLocaleString()} ${currency}`;
  };

  // Helper format ngày (UX: Hiển thị dạng "3 ngày trước" sẽ thân thiện hơn, nhưng ở đây dùng ngày tháng cho chuẩn admin)
  const formatDate = (dateString) => {
     if(!dateString) return "Mới đăng";
     return new Date(dateString).toLocaleDateString('vi-VN');
  }

  useEffect(() => {
    const handleClickOutside = (event) => {
      // Nếu menu đang mở và click không nằm trong menu đó
      if (menuOpenId && !event.target.closest('.menu-wrapper')) {
        setMenuOpenId(null);
      }
    };

    // Đăng ký sự kiện khi component được mount
    document.addEventListener("mousedown", handleClickOutside);
    
    // Hủy đăng ký khi component bị unmount (để tránh rò rỉ bộ nhớ)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [menuOpenId]);

  return (
    <div className="manage-posts-wrapper">
      {!disableFilterBar && (
        <div className="modern-filter-bar">
           <div className="search-group">
              <input 
                type="text" 
                placeholder="Tìm kiếm công việc, vị trí..." 
                value={textFilter} 
                onChange={(e) => setTextFilter(e.target.value)} 
              />
              <svg className="search-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
           </div>
           
           <div className="filter-group">
              <select value={locationFilter} onChange={(e) => setLocationFilter(e.target.value)}>
                <option value="">📍 Tất cả địa điểm</option>
                {uniqueLocations.map((loc) => <option key={loc} value={loc}>{loc}</option>)}
              </select>

              <select value={jobTypeFilter} onChange={(e) => setJobTypeFilter(e.target.value)}>
                <option value="">💼 Tất cả loại hình</option>
                {jobTypes.map((type) => <option key={type} value={type}>{type}</option>)}
              </select>

              <button className="btn-reset" onClick={() => { setTextFilter(""); setLocationFilter(""); setJobTypeFilter(""); }}>
                Làm mới
              </button>
           </div>
        </div>
      )}

      <div className="post-grid">
        {filteredPosts.length > 0 ? (
          filteredPosts.map((post) => {
            const isClosed = post.state === 'Closed';

            return  (
              post.state !== 'Pending' && 
              <div
                key={post._id}
                className={`modern-card ${isClosed ? 'is-closed' : ''}`}
                onClick={() => onSelectPost?.(post)}
              >
                {/* --- HEADER CARD: Trạng thái & Menu --- */}
                <div className="card-top">
                    <div className={`status-chip ${isClosed ? 'Closed' : 'Open'}`}>
                        <span className="dot"></span>
                        {isClosed ? "Đang đóng" : "Đang tuyển"}
                    </div>
                    
                    {!disableFilterBar && (
                        <div className="menu-wrapper">
                            <button className="btn-icon" onClick={(e) => { e.stopPropagation(); handleMenuToggle(post._id); }}>
                                <HiDotsHorizontal size={20} />
                            </button>
                            {menuOpenId === post._id && (
                                <div className="dropdown-menu" ref={menuRef} onClick={(e) => e.stopPropagation()}>
                                    <div className="dropdown-item" onClick={() => handleToggleStatusClick(post)}>
                                        {isClosed ? "🔄 Mở lại tuyển dụng" : "⛔ Đóng tuyển dụng"}
                                    </div>
                                    <div className="dropdown-item" onClick={() => handleEditClick(post)}>✏️ Chỉnh sửa</div>
                                    <div className="dropdown-item danger" onClick={() => handleDeleteClick(post._id)}>🗑️ Xóa bài</div>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* --- BODY CARD: Nội dung chính --- */}
                <div className="card-body">
                    <h3 className="post-title" title={post.title}>{post.title}</h3>
                    <p className="post-position">{post.position}</p>

                    <div className="tags-container">
                        <div className="info-tag salary">
                            <HiCurrencyDollar className="tag-icon" />
                            {formatSalary(post.salary.minSalary, post.salary.maxSalary, post.salary.currency)}
                        </div>
                        <div className="info-tag">
                            <HiLocationMarker className="tag-icon" />
                            {post.location}
                        </div>
                        <div className="info-tag">
                            <HiBriefcase className="tag-icon" />
                            {post.jobType}
                        </div>
                    </div>
                </div>

                {/* --- FOOTER CARD: Meta Data (Views, Date) --- */}
                <div className="card-footer">
                    <div className="meta-info">
                        <HiClock className="meta-icon" />
                        <span>{formatDate(post.createdAt || new Date())}</span>
                    </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="empty-state">
             <img src="https://cdni.iconscout.com/illustration/premium/thumb/search-not-found-illustration-download-in-svg-png-gif-file-formats--zoom-magnifier-404-error-empty-state-pack-user-interface-illustrations-5216538.png" alt="Empty" />
             <p>Không tìm thấy bài đăng nào phù hợp.</p>
          </div>
        )}
      </div>
    </div>
  );
}