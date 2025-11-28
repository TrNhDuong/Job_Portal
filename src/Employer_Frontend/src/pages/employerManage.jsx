
import React, { useState, useRef, useMemo, useEffect } from "react";
import "../styles/employerManagePosts.css";
import "../styles/employerManage.css";
import { HiDotsVertical, HiArrowLeft, HiX } from "react-icons/hi";
import CVDetailModal from "../components/CVDetailModal.jsx";

const jobTypes = ["Full-time", "Part-time", "Internship", "Freelance", "Contract"];

export default function EmployerDashboard({ jobPosts }) {
  const posts = jobPosts; // Dùng dữ liệu từ props

  const [menuOpenId, setMenuOpenId] = useState(null);
  const menuRef = useRef(null);

  const [textFilter, setTextFilter] = useState("");
  const [locationFilter, setLocationFilter] = useState("");
  const [jobTypeFilter, setJobTypeFilter] = useState("");

  const [selectedJob, setSelectedJob] = useState(null); // job đang được chọn

  const handleMenuToggle = (postId) => setMenuOpenId(prev => prev === postId ? null : postId);

  const uniqueLocations = useMemo(() => Array.from(new Set(posts.map(p => p.location))).sort(), [posts]);

  const filteredPosts = useMemo(() => posts.filter(post => {
    const matchesText = post.title.toLowerCase().includes(textFilter.toLowerCase()) || post.position.toLowerCase().includes(textFilter.toLowerCase());
    const matchesLocation = locationFilter ? post.location === locationFilter : true;
    const matchesJobType = jobTypeFilter ? post.jobType === jobTypeFilter : true;
    return matchesText && matchesLocation && matchesJobType;
  }), [posts, textFilter, locationFilter, jobTypeFilter]);

  // ===== CVs =====
  const [cvList, setCvList] = useState([]);
  const [nameFilter, setNameFilter] = useState("");
  const [positionTextFilter, setPositionTextFilter] = useState("");
  const [positionFilter, setPositionFilter] = useState("");
  const [locationCvFilter, setLocationCvFilter] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [dateFilter, setDateFilter] = useState("");

  const [selectedCv, setSelectedCv] = useState(null); // CV đang được xem
  const [selectedCvIds, setSelectedCvIds] = useState([]); // ID các CV được chọn

  const [isMounted, setIsMounted] = useState(false);
  const [sortOrder, setSortOrder] = useState("date_desc");



  // --- THÊM useEffect NÀY ĐỂ SỬA LỖI "FLASH" ---
  useEffect(() => {
    // Khi component CV List (return block 1) được render
    // isMounted sẽ là false
    // Nó chỉ được set = true sau khi render xong
    // Điều này ngăn transition chạy ở lần render đầu tiên
    setIsMounted(false); // Reset khi đổi Job
    if (selectedJob) {
      // Dùng setTimeout 0 để đợi DOM render xong
      setTimeout(() => setIsMounted(true), 0);
    }
  }, [selectedJob]); // Chạy lại mỗi khi đổi Job
  // ---------------------------------------------

  const handleResetCV = () => {
      setNameFilter(""); setPositionTextFilter(""); setPositionFilter(""); setLocationCvFilter(""); setPriorityFilter(""); setStatusFilter(""); setDateFilter("");
      setSortOrder("date_desc");
  };

  const filteredCVs = useMemo(() => {
    if (!selectedJob) return [];

    // --- BƯỚC 1: Lọc (Filter) như cũ ---
    const filtered = cvList.filter(cv => {
      const matchesJob = cv.position === selectedJob.position;
      const matchesText = cv.name.toLowerCase().includes(nameFilter.toLowerCase()) && cv.position.toLowerCase().includes(positionTextFilter.toLowerCase());
      const matchesPosition = positionFilter ? cv.position === positionFilter : true;
      const matchesLocation = locationCvFilter ? cv.location === locationCvFilter : true;
      const matchesPriority = priorityFilter === "high" ? cv.priority === "high" :
                              priorityFilter === "low" ? cv.priority === "low" :
                              priorityFilter === "none" ? !cv.priority : true;
      const matchesStatus = statusFilter ? cv.status === statusFilter : true;
      const matchesDate = dateFilter ? cv.date === dateFilter : true;
      
      return matchesJob && matchesText && matchesPosition && matchesLocation && matchesPriority && matchesStatus && matchesDate;
    });

    // --- BƯỚC 2: Sắp xếp (Sort) danh sách đã lọc ---
    
    // Hàm trợ giúp để gán điểm cho độ ưu tiên
    const priorityToNumber = (priority) => {
      if (priority === 'high') return 2;
      if (priority === 'low') return 1;
      return 0;
    };

    filtered.sort((a, b) => {
      switch (sortOrder) {
        case 'date_asc': // Cũ nhất
          return new Date(a.date) - new Date(b.date);
        case 'priority_desc': // Ưu tiên Cao-Thấp
          return priorityToNumber(b.priority) - priorityToNumber(a.priority);
        case 'date_desc': // Mới nhất (Mặc định)
        default:
          return new Date(b.date) - new Date(a.date);
      }
    });

    return filtered;

  }, [cvList, selectedJob, nameFilter, positionTextFilter, positionFilter, locationCvFilter, priorityFilter, statusFilter, dateFilter, sortOrder]);
  
  // --- BƯỚC 1: DÁN KHỐI TÍNH TOÁN THỐNG KÊ VÀO ĐÂY ---
  const cvStats = useMemo(() => {
    const total = filteredCVs.length;
    const dau = filteredCVs.filter(cv => cv.status === 'dau_cv').length;
    const tuChoi = filteredCVs.filter(cv => cv.status === 'tu_choi').length;
    const chuaXem = filteredCVs.filter(cv => cv.status === 'chua_xem').length;
    const daXem = filteredCVs.filter(cv => cv.status === 'da_xem').length;
    
    return { total, dau, tuChoi, chuaXem, daXem };
  }, [filteredCVs]);

  // --- HÀM XỬ LÝ MODAL (Giữ nguyên) ---
  const handleViewCv = (cv) => {
    setSelectedCv(cv);
    if (cv.status === 'chua_xem') {
        setCvList(prevList => 
            prevList.map(item => 
                item.id === cv.id ? { ...item, status: 'da_xem' } : item
            )
        );
    }
  };

  const handleCloseModal = () => {
    setSelectedCv(null);
  };

  const handleRejectCv = (cvId) => {
    if (window.confirm("Bạn có chắc muốn TỪ CHỐI CV này? (Hành động này không thể hoàn tác)")) {
        setCvList(prevList =>
            prevList.map(item => 
                item.id === cvId ? { ...item, status: 'tu_choi' } : item
            )
        );
        handleCloseModal();
    }
  };

  const handleAcceptCv = (cvId) => {
    setCvList(prevList =>
        prevList.map(item => 
            item.id === cvId ? { ...item, status: 'dau_cv' } : item
        )
    );
  };

  const handleMarkEmailSent = (cvId) => {
    setCvList(prevList =>
      prevList.map(item =>
        item.id === cvId ? { ...item, emailSent: true } : item
      )
    );
  };

  // --- HÀM XỬ LÝ CHECKBOX (Giữ nguyên) ---
  const handleCvCheckboxChange = (cvId) => {
    setSelectedCvIds(prevIds => {
      if (prevIds.includes(cvId)) {
        return prevIds.filter(id => id !== cvId);
      } else {
        return [...prevIds, cvId];
      }
    });
  };

  // --- HÀM XỬ LÝ HÀNH ĐỘNG HÀNG LOẠT (Giữ nguyên) ---
  const handleBatchAction = (action) => {
    if (selectedCvIds.length === 0) return;

    let newStatus = "";

    if (action === 'reject') {
      if (!window.confirm(`Bạn có chắc muốn TỪ CHỐI ${selectedCvIds.length} CV đã chọn?`)) {
        return;
      }
      newStatus = 'tu_choi';
    } else if (action === 'mark_read') {
      newStatus = 'da_xem';
    }

    setCvList(prevList =>
      prevList.map(cv => {
        if (selectedCvIds.includes(cv.id)) {
          if (action === 'mark_read' && (cv.status === 'dau_cv' || cv.status === 'tu_choi')) {
            return cv; 
          }
          return { ...cv, status: newStatus };
        }
        return cv;
      })
    );
    setSelectedCvIds([]);
  };

  
  // ===== RENDER (TÁCH RA 3 KHỐI NHƯ CŨ) =====

  // --- BLOCK 1: HIỂN THỊ DANH SÁCH CV ---
  if (selectedJob) {
    return (
      <>
        {/* Thanh Hành động */}
        <div 
          className={`batch-action-bar ${selectedCvIds.length > 0 ? "visible" : ""}`}
          style={{
            left: "17.5%",
            right: "24px", 
            
            // --- ĐÂY LÀ SỬA LỖI "FLASH" ---
            // Chỉ transition 'left' (cho sidebar)
            // Chỉ transition 'transform' và 'opacity' (ẩn/hiện) SAU KHI component đã mount
            transition: isMounted 
              ? "left 0.3s ease, transform 0.3s ease, opacity 0.3s ease" 
              : "left 0.3s ease", // Lần đầu render, chỉ transition 'left'
          }}
        >
          <span className="batch-action-info">
            Đã chọn: {selectedCvIds.length} CV
          </span>
          <div className="batch-action-buttons">
            <button className="btn-batch-action" onClick={() => handleBatchAction('mark_read')}>
              Đánh dấu "Đã xem"
            </button>
            <button className="btn-batch-reject" onClick={() => handleBatchAction('reject')}>
              Từ chối (Đã chọn)
            </button>
            <button className="btn-batch-cancel" onClick={() => setSelectedCvIds([])}>
              Hủy
            </button>
          </div>
        </div>
        
        <div className="manage-posts-container" style={"magin-top=-20px"}>
          {/* Back Button & Filter */}
          <div className="filter-bar" style={{ left: "17.5%", width: "82.5%", transition: "left 0.3s ease" }}>
            <button className="back-btn" onClick={() => setSelectedJob(null)}>
              <HiArrowLeft /> Trở về danh sách bài đăng
            </button>          
            <h2 style={{ marginBottom: "10px" }}>Các CV ứng tuyển vị trí: {selectedJob.title}</h2>
            {/* --- BƯỚC 2: DÁN DÒNG THỐNG KÊ VÀO ĐÂY --- */}
            <p className="cv-quick-stats">
              Tìm thấy <strong>{cvStats.total}</strong> CV:&nbsp;&nbsp; 
              <span className="stat-dau"><strong>{cvStats.dau}</strong> Đậu</span>,
              <span className="stat-tu-choi"> <strong>{cvStats.tuChoi}</strong> Từ chối</span>,
              <span className="stat-da-xem"> <strong>{cvStats.daXem}</strong> Đã xem</span>,
              <span className="stat-chua-xem"> <strong>{cvStats.chuaXem}</strong> Chưa xem</span>
              
            </p>
            <div className="filter-row-top">
              <input type="text" placeholder="Tìm theo tên" value={nameFilter} onChange={(e) => setNameFilter(e.target.value)} className="filter-input"/>
              <input type="text" placeholder="Tìm theo vị trí" value={positionTextFilter} onChange={(e) => setPositionTextFilter(e.target.value)} className="filter-input"/>
            </div>
            <div className="filter-row-bottom">
              {/* (Tất cả các bộ lọc ... ) */}
              <div className="filter-options">
                <select value={positionFilter} onChange={(e) => setPositionFilter(e.target.value)}>
                  <option value="">Tất cả vị trí</option>
                  <option value="Software Engineer">Software Engineer</option>
                  <option value="UI/UX Designer">UI/UX Designer</option>
                  <option value="Data Analyst">Data Analyst</option>
                </select>
              </div>
              <div className="filter-options">
                <select value={locationCvFilter} onChange={(e) => setLocationCvFilter(e.target.value)}>
                  <option value="">Tất cả quận/ huyện</option>
                </select>
              </div>
              <div className="filter-options">
                <select value={priorityFilter} onChange={(e) => setPriorityFilter(e.target.value)}>
                  <option value="">Độ ưu tiên</option>
                  <option value="high">Ưu tiên cao</option>
                  <option value="low">Ưu tiên thấp</option>
                  <option value="none">Không ưu tiên</option>
                </select>
              </div>
              <div className="filter-options">
                <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                  <option value="">Tất cả trạng thái</option>
                  <option value="chua_xem">Chưa xem</option>
                  <option value="da_xem">Đã xem</option>
                  <option value="dau_cv">Đậu CV</option>
                  <option value="tu_choi">Từ chối</option>
                </select>
              </div>

              {/* --- BƯỚC 2: DÁN KHỐI SẮP XẾP VÀO ĐÂY --- */}
              <div className="filter-options">
                <select value={sortOrder} onChange={(e) => setSortOrder(e.target.value)}>
                  <option value="date_desc">Ngày nộp (Mới nhất)</option>
                  <option value="date_asc">Ngày nộp (Cũ nhất)</option>
                  <option value="priority_desc">Ưu tiên (Cao-Thấp)</option>
                </select>
              </div>

              <div className="filter-options">
                <input type="date" value={dateFilter} onChange={(e) => setDateFilter(e.target.value)} />
              </div>
              <button onClick={handleResetCV}>Reset</button>
            </div>
          </div>

          {/* CV List */}
          <div className="job-post-list" style={{ paddingTop: "70px", paddingBottom: "90px" }}>
            {filteredCVs.length > 0 ? filteredCVs.map(cv => (
              <div key={cv.id} className={`cv-card ${cv.status !== 'chua_xem' ? 'faded' : ''}`}>
                <input 
                  type="checkbox"
                  className="cv-card-checkbox"
                  checked={selectedCvIds.includes(cv.id)}
                  onChange={() => handleCvCheckboxChange(cv.id)}
                  disabled={cv.status === 'dau_cv' || cv.status === 'tu_choi'}
                />
                <div className="cv-info">
                  <div className="cv-header">
                    <h3>{cv.name}</h3>
                    <p className="cv-position">{cv.position}</p>
                  </div>
                  <p className="cv-location">{cv.location}</p>
                  <p className="cv-date">Đã nộp ngày: {cv.date}</p>
                </div>
                {cv.priority && <span className={`cv-priority-flag ${cv.priority === "high" ? "cv-priority-high" : "cv-priority-low"}`}/>}
                {cv.status === 'dau_cv' && (
                  <span className="cv-status-tag dau">Đậu CV</span>
                )}
                {cv.status === 'tu_choi' && (
                  <span className="cv-status-tag tu-choi">Đã từ chối</span>
                )}
                <button className="view-btn" onClick={() => handleViewCv(cv)}>Xem CV</button>
              </div>
            )) : <div className="no-results">Không có CV nào khớp với bộ lọc.</div>}
          </div>
        </div>

        {/* Modal (Vẫn nằm trong fragment) */}
        {selectedCv && (
          <CVDetailModal 
              cv={selectedCv}
              onClose={handleCloseModal}
              onAccept={handleAcceptCv}
              onReject={handleRejectCv}
              onMarkEmailSent={handleMarkEmailSent}
          />
        )}
      </>
    );
  }

  // --- BLOCK 2: HIỂN THỊ "KHÔNG CÓ BÀI ĐĂNG" ---
  if (!posts || posts.length === 0) {
    return (
      <div className="manage-posts-container">
        <div className="no-results" style={{ paddingTop: '50px', margin: '0 auto', maxWidth: '600px' }}>
          <h3>Bạn chưa có tin tuyển dụng nào</h3>
          <p>Bạn cần đăng tin tuyển dụng trước khi có thể xem CV ứng tuyển tại đây.</p>
        </div>
      </div>
    );
  }
  
  // --- BLOCK 3: HIỂN THỊ DANH SÁCH JOB (Mặc định) ---
  return (
    <div className="manage-posts-container">
      {/* Job Filter */}
      <div className="filter-bar" style={{ left: "17.5%", width: "82.5%", transition: "left 0.3s ease" }}>
        <div className="filter-row-top">
          <input type="text" placeholder="Tìm theo tiêu đề hoặc vị trí..." value={textFilter} onChange={(e) => setTextFilter(e.target.value)} className="filter-input"/>
        </div>
        <div className="filter-row-bottom">
          <div className="filter-options">
            <select value={locationFilter} onChange={(e) => setLocationFilter(e.target.value)}>
              <option value="">Tất cả địa điểm</option>
              {uniqueLocations.map(loc => <option key={loc} value={loc}>{loc}</option>)}
            </select>
          </div>
          <div className="filter-options">
            <select value={jobTypeFilter} onChange={(e) => setJobTypeFilter(e.target.value)}>
              <option value="">Tất cả loại hình</option>
              {jobTypes.map(type => <option key={type} value={type}>{type}</option>)}
            </select>
          </div>
          <button onClick={() => { setTextFilter(""); setLocationFilter(""); setJobTypeFilter(""); }}>Reset</button>
        </div>
      </div>

      {/* Job Posts */}
      <div className="job-post-list" style={{ paddingTop: "90px" }}>
        {filteredPosts.length > 0 ? filteredPosts.map(post => (
          // Logic onClick đơn giản (vì bạn muốn giữ logic checkbox chung)
          <div key={post._id} className="job-post-card" onClick={() => setSelectedJob(post)}>
            <div className="job-post-info">
              <div className="job-post-header">
                <h3>{post.title}</h3>
                <p className="job-post-position">{post.position}</p>
              </div>
              <p className="job-post-location">{post.location}</p>
              {/* <p className="job-post-salary">
                {Number(post.salary.minSalary).toLocaleString()} -{" "}
                {Number(post.salary.maxSalary).toLocaleString()} {post.salary.currency}
              </p> */}
              <div className="job-post-metrics">
                {/* LƯU Ý: post phải có sẵn các trường newCount, potentialCount... */}
                <div className="metric-item count-new">
                    <span className="metric-count">{post.metric.newed || 0}</span>
                    <span className="metric-label">Mới</span>
                </div>
                
                <div className="metric-item count-potential">
                    <span className="metric-count">{post.metric.pass || 0}</span>
                    <span className="metric-label">Tiềm năng</span>
                </div>
                
                <div className="metric-item count-interviewed">
                    <span className="metric-count">{post.metric.interviewed || 0}</span>
                    <span className="metric-label">Phỏng vấn</span>
                </div>
            </div>
            </div>
          </div>
        )) : <div className="no-results">{posts.length > 0 ? "Không tìm thấy bài đăng nào." : "Chưa có job nào luôn."}</div>}
      </div>
    </div>
  );
}