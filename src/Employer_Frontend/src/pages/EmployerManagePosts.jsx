import React, { useState, useRef, useMemo, useEffect } from "react";
import "../styles/employerManagePosts.css";
import { 
  HiDotsHorizontal, HiLocationMarker, HiCurrencyDollar, HiBriefcase, HiClock, 
  HiOfficeBuilding, HiRefresh, 
  HiOutlineTrash, HiOutlinePencil, HiOutlineLockClosed, HiOutlineLockOpen, HiOutlineExclamation 
} from "react-icons/hi";
import toast from 'react-hot-toast';

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
    setMenuOpenId(null);
    toast((t) => (
      <div style={{ minWidth: '50px', padding: '2px' }}>
        <div 
            className="toast-backdrop-hack" 
            onClick={() => toast.dismiss(t.id)} 
            title="Nhấn vào đây để đóng"
        ></div>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px', position: 'relative', pointerEvents: 'none' }}>
            <div style={{ 
                width: '40px', height: '40px', borderRadius: '50%', 
                background: '#fee2e2', display: 'flex', alignItems: 'center', justifyContent: 'center' 
            }}>
                <HiOutlineTrash size={22} color="#ef4444" />
            </div>
            <div>
                <p style={{ fontWeight: '600', margin: 0, fontSize: '15px', color: '#1f2937' }}>Xóa bài đăng này?</p>
                <p style={{ margin: 0, fontSize: '13px', color: '#6b7280' }}>Hành động này không thể hoàn tác.</p>
            </div>
        </div>
        
        {/* Footer: Buttons (Đã dùng Class CSS để có Hover) */}
        <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end', position: 'relative' }}>
          <button 
            onClick={() => toast.dismiss(t.id)}
            className="toast-btn-base toast-btn-cancel"
          >
            Hủy
          </button>
          <button 
            onClick={() => {
              onDelete?.(postId);
              toast.dismiss(t.id);
            }}
            className="toast-btn-base toast-btn-delete"
          >
            Xóa
          </button>
        </div>
      </div>
    ), { 
        duration: 4000, 
        position: 'top-center',
        style: {
            background: '#fff',
            boxShadow: '0 10px 30px rgba(0,0,0,0.15)',
            borderRadius: '12px',
            border: '1px solid #f3f4f6',
            padding: '16px',
            pointerEvents: 'auto' // Quan trọng để click được nút
        }
    });
  };

  const handleToggleStatusClick = (post) => {
    setMenuOpenId(null);
    const isCurrentlyClosed = post.state === 'Closed';

    toast((t) => (
      <div style={{ minWidth: '50px', padding: '2px' }}>
        <div 
            className="toast-backdrop-hack" 
            onClick={() => toast.dismiss(t.id)} 
        ></div>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', marginBottom: '16px', pointerEvents: 'none' }}>
            <div style={{ 
                width: '40px', height: '40px', borderRadius: '50%', 
                background: isCurrentlyClosed ? '#dbeafe' : '#fee2e2',
                display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
            }}>
                {isCurrentlyClosed 
                    ? <HiOutlineLockOpen size={22} color="#0061ff"/> 
                    : <HiOutlineLockClosed size={22} color="#ef4444"/>
                }
            </div>
            <div>
                <p style={{ fontWeight: '600', margin: '0 0 4px 0', fontSize: '15px', color: '#1f2937' }}>
                    {isCurrentlyClosed ? "Mở lại tuyển dụng?" : "Đóng bài đăng này?"}
                </p>
                <p style={{ margin: 0, fontSize: '13px', color: '#6b7280', lineHeight: '1.4' }}>
                    {isCurrentlyClosed 
                        ? "Bài viết sẽ hiển thị công khai để ứng viên nộp hồ sơ." 
                        : "Ứng viên sẽ không thể nộp đơn nữa."}
                </p>
            </div>
        </div>

        {/* Buttons (Đã dùng Class CSS để có Hover) */}
        <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
          <button 
            onClick={() => toast.dismiss(t.id)}
            className="toast-btn-base toast-btn-cancel"
          >
            Hủy
          </button>
          <button 
            onClick={() => {
              const updatedPost = { ...post, state: isCurrentlyClosed ? 'Open' : 'Closed' };
              onUpdateState(updatedPost);
              toast.dismiss(t.id);
            }}
            className={`toast-btn-base ${isCurrentlyClosed ? 'toast-btn-confirm' : 'toast-btn-close'}`}
          >
            Xác nhận
          </button>
        </div>
      </div>
    ), { 
        duration: 4000, 
        position: 'top-center',
        style: {
            background: '#fff',
            boxShadow: '0 10px 30px rgba(0,0,0,0.15)',
            borderRadius: '12px',
            border: '1px solid #f3f4f6',
            padding: '16px',
            pointerEvents: 'auto'
        }
    });
  };

  // Logic lọc giữ nguyên
  const uniqueLocations = useMemo(() => {
  if (!Array.isArray(posts)) return [];

  const locations = new Set(
    posts
      .map(p => p.location)
      .filter(Boolean)
  );

  return [...locations].sort();
}, [posts]);

  const filteredPosts = useMemo(() => {
  if (!Array.isArray(posts)) return [];
  if (disableFilterBar) return posts;

  const filterText = textFilter.toLowerCase();

  return posts.filter(post => {
    const title = post.title?.toLowerCase() ?? "";
    const position = post.position?.toLowerCase() ?? "";

    const matchesText =
      title.includes(filterText) ||
      position.includes(filterText);

    const matchesLocation =
      locationFilter
        ? post.location?.toLowerCase() === locationFilter.toLowerCase()
        : true;

    const matchesJobType =
      jobTypeFilter
        ? post.jobType === jobTypeFilter
        : true;

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
  console.log(posts)
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
              <div className="select-wrapper">
                <HiLocationMarker className="select-icon" />
                <select value={locationFilter} onChange={(e) => setLocationFilter(e.target.value)}>
                  <option value="">Tất cả địa điểm</option>
                  {uniqueLocations.map((loc) => <option key={loc} value={loc}>{loc}</option>)}
                </select>
              </div>

              <div className="select-wrapper">
                <HiBriefcase className="select-icon" />
                <select value={jobTypeFilter} onChange={(e) => setJobTypeFilter(e.target.value)}>
                  <option value="">Tất cả loại hình</option>
                  {jobTypes.map((type) => <option key={type} value={type}>{type}</option>)}
                </select>
              </div>

              <button 
                className="btn-reset" 
                onClick={() => { setTextFilter(""); setLocationFilter(""); setJobTypeFilter(""); }}
                title="Xóa bộ lọc"
              >
                <HiRefresh className="btn-icon-spin" />
                <span>Làm mới</span>
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
                                    <div className="dropdown-item" onClick={() => handleToggleStatusClick(post)} style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
                                        {isClosed ? (
                                            <>
                                                <HiOutlineLockOpen size={18} /> Mở lại tuyển dụng
                                            </>
                                        ) : (
                                            <>
                                                <HiOutlineLockClosed size={18} /> Đóng tuyển dụng
                                            </>
                                        )}
                                    </div>

                                    {/* 2. Thay emoji Pencil */}
                                    <div className="dropdown-item" onClick={() => handleEditClick(post)} style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
                                        <HiOutlinePencil size={18} /> Chỉnh sửa
                                    </div>

                                    {/* 3. Thay emoji Trash */}
                                    <div className="dropdown-item danger" onClick={() => handleDeleteClick(post._id)} style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
                                        <HiOutlineTrash size={18} /> Xóa bài
                                    </div>
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
              <div className="empty-icon-wrapper">
                  <HiOfficeBuilding size={25} color="#9ca3af" /> {/* Icon tòa nhà xám */}
              </div>
              <h3>Chưa có bài đăng nào đang mở</h3>
              <p>Hãy bắt đầu tạo tin tuyển dụng đầu tiên để thu hút nhân tài.</p>
          </div>
        )}
      </div>
    </div>
  );
}