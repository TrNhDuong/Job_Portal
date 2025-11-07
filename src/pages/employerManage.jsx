import React, { useState, useRef, useMemo, useEffect } from "react";
import "./employerManagePosts.css";
import { HiDotsVertical } from "react-icons/hi";

const jobTypes = ["Full-time", "Part-time", "Internship", "Freelance", "Contract"];

export default function EmployerDashboard({ collapsed }) {
  // ===== JOB POSTS =====
  const [posts, setPosts] = useState([
    { id: 1, title: "Frontend Dev", position: "Software Engineer", location: "Gò Vấp", minSalary: 1000, maxSalary: 2000, currency: "USD", jobType: "Full-time" },
    { id: 2, title: "UI Designer", position: "UI/UX Designer", location: "Thủ Đức", minSalary: 800, maxSalary: 1500, currency: "USD", jobType: "Part-time" },
    { id: 3, title: "Data Analysis", position: "Data Analyst", location: "Thảo Điền", minSalary: 900, maxSalary: 1800, currency: "USD", jobType: "Internship" },
  ]);

  const [menuOpenId, setMenuOpenId] = useState(null);
  const menuRef = useRef(null);

  const [textFilter, setTextFilter] = useState("");
  const [locationFilter, setLocationFilter] = useState("");
  const [jobTypeFilter, setJobTypeFilter] = useState("");

  const [selectedJob, setSelectedJob] = useState(null); // selected job for CV view

  const handleMenuToggle = (postId) => setMenuOpenId(prev => prev === postId ? null : postId);
  const handleEditClick = (post) => { alert("Edit " + post.title); setMenuOpenId(null); };
  const handleDeleteClick = (postId) => {
    if (window.confirm("Bạn có chắc muốn xóa bài đăng này không?")) {
      setPosts(posts.filter(p => p.id !== postId));
    }
    setMenuOpenId(null);
  };

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
  const [readFilter, setReadFilter] = useState("");
  const [dateFilter, setDateFilter] = useState("");

  useEffect(() => {
    setCvList([
      { id: 1, name: "Trần Nhật Dương", position: "Software Engineer", location: "Gò Vấp", priority: "high", read: false, date: "2025-10-15" },
      { id: 2, name: "Đào Duy Hảo", position: "UI/UX Designer", location: "Thủ Đức", priority: "low", read: false, date: "2025-10-20" },
      { id: 3, name: "Văn Phú Hiệu", position: "Data Analyst", location: "Thảo Điền", priority: "", read: false, date: "2025-10-18" },
      { id: 4, name: "Nguyễn Huỳnh Trọng Đức", position: "Software Engineer", location: "Quận 8", priority: "low", read: false, date: "2025-10-22" },
      { id: 5, name: "Nguyễn Văn A", position: "UI/UX Designer", location: "Bến Thành", priority: "high", read: false, date: "2025-10-10" },
    ]);
  }, []);

  const handleResetCV = () => {
    setNameFilter(""); setPositionTextFilter(""); setPositionFilter(""); setLocationCvFilter(""); setPriorityFilter(""); setReadFilter(""); setDateFilter("");
  };

  const filteredCVs = useMemo(() => {
    if (!selectedJob) return [];
    return cvList.filter(cv => {
      const matchesJob = cv.position === selectedJob.position; // only CVs for selected job
      const matchesText = cv.name.toLowerCase().includes(nameFilter.toLowerCase()) && cv.position.toLowerCase().includes(positionTextFilter.toLowerCase());
      const matchesPosition = positionFilter ? cv.position === positionFilter : true;
      const matchesLocation = locationCvFilter ? cv.location === locationCvFilter : true;
      const matchesPriority = priorityFilter === "high" ? cv.priority === "high" :
                              priorityFilter === "low" ? cv.priority === "low" :
                              priorityFilter === "none" ? !cv.priority : true;
      const matchesRead = readFilter === "read" ? cv.read : readFilter === "unread" ? !cv.read : true;
      const matchesDate = dateFilter ? cv.date === dateFilter : true;
      return matchesJob && matchesText && matchesPosition && matchesLocation && matchesPriority && matchesRead && matchesDate;
    });
  }, [cvList, selectedJob, nameFilter, positionTextFilter, positionFilter, locationCvFilter, priorityFilter, readFilter, dateFilter]);

    // ===== RENDER =====
    if (selectedJob) {
    return (
      <div className="manage-posts-container">
        {/* Back Button */}
        <div className="filter-bar" style={{ left: collapsed ? "5%" : "17.5%", transition: "left 0.3s ease" }}>
          <button onClick={() => setSelectedJob(null)} style={{ marginBottom: "10px" }}>← Back to Jobs</button>
          <h2 style={{ marginBottom: "10px" }}>CVs for: {selectedJob.title}</h2>

          {/* CV Filter */}
          <div className="filter-row-top">
            <input type="text" placeholder="Search by name" value={nameFilter} onChange={(e) => setNameFilter(e.target.value)} className="filter-input"/>
            <input type="text" placeholder="Search by position" value={positionTextFilter} onChange={(e) => setPositionTextFilter(e.target.value)} className="filter-input"/>
          </div>
          <div className="filter-row-bottom">
            <div className="filter-options">
              <select value={positionFilter} onChange={(e) => setPositionFilter(e.target.value)}>
                <option value="">All Positions</option>
                <option value="Software Engineer">Software Engineer</option>
                <option value="UI/UX Designer">UI/UX Designer</option>
                <option value="Data Analyst">Data Analyst</option>
              </select>
            </div>
            <div className="filter-options">
              <select value={locationCvFilter} onChange={(e) => setLocationCvFilter(e.target.value)}>
                <option value="">All Wards</option>
                {/* Add all location options here */}
              </select>
            </div>
            <div className="filter-options">
              <select value={priorityFilter} onChange={(e) => setPriorityFilter(e.target.value)}>
                <option value="">All Priorities</option>
                <option value="high">High Priority</option>
                <option value="low">Low Priority</option>
                <option value="none">No Priority</option>
              </select>
            </div>
            <div className="filter-options">
              <select value={readFilter} onChange={(e) => setReadFilter(e.target.value)}>
                <option value="">All CVs</option>
                <option value="read">Read</option>
                <option value="unread">Unread</option>
              </select>
            </div>
            <div className="filter-options">
              <input type="date" value={dateFilter} onChange={(e) => setDateFilter(e.target.value)} />
            </div>
            <button onClick={handleResetCV}>Reset</button>
          </div>
        </div>

        {/* CV List */}
        <div className="job-post-list" style={{ paddingTop: "200px" }}>
          {filteredCVs.length > 0 ? filteredCVs.map(cv => (
            <div key={cv.id} className="job-post-card" style={{ opacity: cv.read ? 0.6 : 1 }}>
              <div className="job-post-info">
                <div className="job-post-header">
                  <h3>{cv.name}</h3>
                  <p className="job-post-position">{cv.position}</p>
                </div>
                <p className="job-post-location">{cv.location}</p>
                <p className="job-post-salary">Submitted: {cv.date}</p>
              </div>
              {cv.priority && <span className={`cv-priority-flag ${cv.priority === "high" ? "cv-priority-high" : "cv-priority-low"}`}/>}
              <div className="actions-container">
                <button className="view-btn" onClick={() => alert("Đang đọc nè")}>View CV</button>
              </div>
            </div>
          )) : <div className="no-results">No CVs match your filters.</div>}
        </div>
      </div>
    );
  }


  // ===== JOB LIST =====
  return (
    <div className="manage-posts-container">
      {/* Job Filter */}
      <div className="filter-bar" style={{ left: collapsed ? "5%" : "17.5%", transition: "left 0.3s ease" }}>
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
      <div className="job-post-list" style={{ paddingTop: "120px" }}>
        {filteredPosts.length > 0 ? filteredPosts.map(post => (
          <div key={post.id} className="job-post-card" onClick={() => setSelectedJob(post)}>
            <div className="job-post-info">
              <div className="job-post-header">
                <h3>{post.title}</h3>
                <p className="job-post-position">{post.position}</p>
              </div>
              <p className="job-post-location">{post.location}</p>
              <p className="job-post-salary">{Number(post.minSalary).toLocaleString()} - {Number(post.maxSalary).toLocaleString()} {post.currency}</p>
            </div>
            <div className="actions-container">
              <button className="action-menu-toggle" onClick={(e) => { e.stopPropagation(); handleMenuToggle(post.id); }}>
                <HiDotsVertical size={20} />
              </button>
              {menuOpenId === post.id && (
                <div className="action-menu" ref={menuRef}>
                  <button onClick={() => handleEditClick(post)}>Chỉnh sửa</button>
                  <button onClick={() => handleDeleteClick(post.id)} className="delete">Xóa</button>
                </div>
              )}
            </div>
          </div>
        )) : <div className="no-results">{posts.length > 0 ? "Không tìm thấy bài đăng nào." : "Chưa có job nào luôn."}</div>}
      </div>
    </div>
  );
}
