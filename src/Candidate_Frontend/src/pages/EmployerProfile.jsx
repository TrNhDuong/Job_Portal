// src/pages/EmployerProfilePage.jsx
import React, { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import client from "../api/client";
import {
  Globe,
  MapPin,
  Users,
  Mail,
  Phone,
  Share2,
  Copy,
  Info,
  LayoutList,
  Briefcase,
  Bookmark,
  DollarSign,
} from "lucide-react";

// --- THAY ĐỔI 1: Import Modal mới ---
import JobDetailModal from "../Home/components/JobDetailModal"; 

import "../styles/employer-profile.css";

// ... (Giữ nguyên phần Helper formatSalary và EmployerJobCard cũ) ...
function formatSalary(salary) {
  if (!salary) return "Thỏa thuận";
  if (typeof salary === "string") return salary;
  if (typeof salary === "number") return salary.toString();
  if (typeof salary === "object") {
    const { minSalary, maxSalary, currency } = salary || {};
    const curr = currency || "";
    if (minSalary && maxSalary) return `${minSalary} - ${maxSalary} ${curr}`.trim();
    if (minSalary) return `Từ ${minSalary} ${curr}`.trim();
    if (maxSalary) return `Tối đa ${maxSalary} ${curr}`.trim();
  }
  return "Thỏa thuận";
}

function EmployerJobCard({ job, logoSrc, companyName, onOpen, saved, onToggleSave }) {
  // ... (Giữ nguyên code EmployerJobCard của bạn) ...
  const companyInitial = (companyName && companyName.charAt(0)) || "?";
  const placeholderLogo = `https://ui-avatars.com/api/?name=${companyInitial}&background=random&color=fff`;

  const handleBookmark = (e) => {
    e.stopPropagation();
    onToggleSave(job);
  };

  return (
    <article
      className={`job-card ${saved ? "job-card--saved" : ""}`}
      onClick={() => onOpen(job)}
      role="button"
      tabIndex={0}
    >
      <div className="job-card-inner">
        <div className="job-card-logo-wrap">
          <img
            src={logoSrc || job.logoUrl || placeholderLogo}
            alt={companyName || job.company || "Company Logo"}
            className="job-card-logo"
          />
        </div>
        <div className="job-card-main">
          <h3 className="job-card-title">{job.title || "Không có tiêu đề"}</h3>
          <p className="job-card-company">{companyName || job.company || "Không rõ công ty"}</p>
          <div className="job-card-meta-row">
            <div className="job-card-meta">
              <MapPin className="job-card-meta-icon" />
              <span>{job.location || "N/A"}</span>
            </div>
            <div className="job-card-meta">
              <DollarSign className="job-card-meta-icon" />
              <span>{formatSalary(job.salary)}</span>
            </div>
          </div>
          <div className="job-card-pill-row">
            <span className="job-card-pill">{job.jobType || "N/A"}</span>
            <span className="job-card-pill job-card-pill--outline">{job.major || "N/A"}</span>
          </div>
        </div>
        <button
          type="button"
          onClick={handleBookmark}
          className="job-card-bookmark"
          title={saved ? "Bỏ lưu" : "Lưu công việc"}
        >
          <Bookmark className="job-card-bookmark-icon" />
        </button>
      </div>
    </article>
  );
}

export default function EmployerProfilePage() {
  const { email } = useParams();

  const [employer, setEmployer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState("about");
  const [descExpanded, setDescExpanded] = useState(false);
  const [jobs, setJobs] = useState([]);
  const [loadingJobs, setLoadingJobs] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);

  // ===== Saved Jobs Logic =====
  const [savedJobIds, setSavedJobIds] = useState(() => {
    try {
      const raw = localStorage.getItem("saved_job_ids");
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem("saved_job_ids", JSON.stringify(savedJobIds));
  }, [savedJobIds]);

  // ===== Fetch Logic =====
  // ... (Giữ nguyên logic useEffect fetchEmployer và fetchJobs của bạn) ...
  useEffect(() => {
    const fetchEmployer = async () => {
      setLoading(true);
      setSelectedJob(null);
      try {
        const res = await client.get(`/api/employer?email=${encodeURIComponent(email)}`);
        const emp = res.data?.data || null;
        setEmployer(emp);

        const jobIds = Array.isArray(emp?.jobPosted) ? emp.jobPosted : [];
        if (jobIds.length) {
          setLoadingJobs(true);
          try {
            const results = [];
            for (const id of jobIds) {
              try {
                const r = await client.get(`/api/post-job/id?jobId=${id}`);
                if (r.data?.data) results.push(r.data.data);
              } catch {}
            }
            setJobs(results);
          } finally {
            setLoadingJobs(false);
          }
        } else {
          setJobs([]);
        }
      } catch (err) {
        console.error(err);
        setEmployer(null);
        setJobs([]);
      } finally {
        setLoading(false);
      }
    };
    fetchEmployer();
  }, [email]);

  // ... (Giữ nguyên handleCopy, toggleSaveJob, isJobSaved) ...
  const profileUrl = useMemo(() => (typeof window !== "undefined" ? window.location.href : ""), []);
  
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(profileUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    } catch {}
  };

  const toggleSaveJob = (job) => {
    if (!job?._id) return;
    const id = String(job._id);
    setSavedJobIds((prev) => {
      const exists = prev.includes(id);
      return exists ? prev.filter((x) => x !== id) : [...prev, id];
    });
  };

  const isJobSaved = (job) => {
    if (!job?._id) return false;
    return savedJobIds.includes(String(job._id));
  };

  const renderDescription = (content) => {
    if (!content) return { __html: "" };
    const hasHtml = /<[a-z][\s\S]*>/i.test(content);
    const htmlContent = hasHtml ? content : content.replace(/\n/g, "<br/>");
    return { __html: htmlContent };
  };

  // ===== Render Logic =====
  if (loading) return <div className="empfb-page"><div className="empfb-container empfb-loading">Đang tải...</div></div>;
  if (!employer) return <div className="empfb-page"><div className="empfb-container empfb-loading">Không tìm thấy công ty.</div></div>;

  const companyName = employer.company || "Công ty";
  const logoSrc = employer.logo?.url || "/logo-placeholder.png";
  const coverSrc = employer.wallpaper?.url || "/cover-placeholder.jpg";
  const contactEmail = employer.contact?.email || employer.email || "Chưa cập nhật";
  const contactPhone = employer.contact?.phone || employer.phone || "Chưa cập nhật";
  const website = employer.website || "";
  const address = employer.address || "";
  
  const fullDesc = employer.description || "";
  const MAX_DESC_LENGTH = 300;
  const shouldTruncate = fullDesc.length > MAX_DESC_LENGTH;
  const displayContent = descExpanded || !shouldTruncate ? fullDesc : fullDesc.substring(0, MAX_DESC_LENGTH) + "...";

  return (
    <div className="empfb-page">
      {/* ... (Giữ nguyên phần COVER, HEADER, TABS, SIDEBAR của bạn) ... */}
      
      <div className="empfb-cover">
        <img className="empfb-cover-img" src={coverSrc} alt="cover" />
        <div className="empfb-cover-overlay" />
      </div>

      <div className="empfb-container empfb-header">
         {/* ... Code Header cũ của bạn ... */}
         <div className="empfb-header-card">
           <div className="empfb-avatar"><img src={logoSrc} alt={companyName} /></div>
           <div className="empfb-header-main">
             <div className="empfb-title-row">
               <h1 className="empfb-name">{companyName}</h1>
               <div className="empfb-badges">
                 {employer.scale && <span className="empfb-badge"><Users size={14} /> <span>{employer.scale}</span></span>}
               </div>
             </div>
             <div className="empfb-subrow">
                {website ? (
                  <a className="empfb-subitem empfb-link" href={website} target="_blank" rel="noreferrer">
                    <Globe size={16} /> <span className="empfb-truncate">{website}</span>
                  </a>
                ) : (<div className="empfb-subitem"><Globe size={16} /> <span>Chưa có website</span></div>)}
                <div className="empfb-subitem"><MapPin size={16} /> <span className="empfb-truncate">{address || "Chưa cập nhật địa chỉ"}</span></div>
             </div>
           </div>
           <div className="empfb-actions">
             <button type="button" className="empfb-btn empfb-btn-primary" onClick={handleCopy}>
               {copied ? <Copy size={18} /> : <Share2 size={18} />} {copied ? "Đã copy" : "Chia sẻ"}
             </button>
           </div>
         </div>

         <div className="empfb-tabs">
           <button className={`empfb-tab ${activeTab === "about" ? "is-active" : ""}`} onClick={() => setActiveTab("about")}><Info size={16} /> Giới thiệu</button>
           <button className={`empfb-tab ${activeTab === "jobs" ? "is-active" : ""}`} onClick={() => setActiveTab("jobs")}><LayoutList size={16} /> Việc làm ({jobs.length})</button>
         </div>
      </div>

      <div className="empfb-container empfb-body">
        <div className="empfb-grid">
          <main className="empfb-left">
            {activeTab === "about" && (
              <section className="empfb-card">
                <header className="empfb-card-header"><h2>Giới thiệu chung</h2></header>
                <div className="empfb-card-body">
                  {fullDesc ? (
                    <>
                      <div className="empfb-desc-html" dangerouslySetInnerHTML={renderDescription(displayContent)} />
                      {shouldTruncate && (
                        <button className="empfb-readmore" onClick={() => setDescExpanded(!descExpanded)}>
                          {descExpanded ? "Thu gọn" : "Xem thêm"}
                        </button>
                      )}
                    </>
                  ) : <p className="empfb-desc">Chưa có mô tả.</p>}
                </div>
              </section>
            )}

            {activeTab === "jobs" && (
              <section className="empfb-card">
                <header className="empfb-card-header">
                   <h2>Việc làm đang tuyển</h2>
                   <span className="empfb-chip"><Briefcase size={14} /> {loadingJobs ? "..." : jobs.length}</span>
                </header>
                <div className="empfb-card-body">
                  {loadingJobs ? (
                    <div className="job-listings-skeleton">{[...Array(5)].map((_, i) => <div key={i} className="job-skeleton-item" />)}</div>
                  ) : jobs.length > 0 ? (
                    <div className="job-list">
                      {jobs.map((job) => (
                        <EmployerJobCard
                          key={job._id}
                          job={job}
                          logoSrc={logoSrc}
                          companyName={companyName}
                          saved={isJobSaved(job)}
                          onToggleSave={toggleSaveJob}
                          onOpen={(j) => setSelectedJob(j)}
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="job-listings-empty">
                      <Briefcase className="job-empty-icon" />
                      <p className="job-empty-title">Chưa có tin tuyển dụng nào</p>
                      <p className="job-empty-subtitle">Công ty này hiện chưa đăng tin tuyển dụng.</p>
                    </div>
                  )}
                </div>
              </section>
            )}
          </main>

          <aside className="empfb-right">
             {/* ... Code Sidebar giữ nguyên ... */}
             <section className="empfb-card empfb-sticky">
              <header className="empfb-card-header"><h2>Thông tin liên hệ</h2></header>
              <div className="empfb-card-body empfb-intro">
                <div className="empfb-intro-item"><MapPin className="empfb-intro-icon" /><div><div className="empfb-intro-label">Địa chỉ</div><div className="empfb-intro-value">{address || "Chưa cập nhật"}</div></div></div>
                <div className="empfb-intro-item"><Mail className="empfb-intro-icon" /><div><div className="empfb-intro-label">Email</div><div className="empfb-intro-value">{contactEmail}</div></div></div>
                <div className="empfb-intro-item"><Phone className="empfb-intro-icon" /><div><div className="empfb-intro-label">Điện thoại</div><div className="empfb-intro-value">{contactPhone}</div></div></div>
              </div>
            </section>
          </aside>
        </div>
      </div>

      {/* --- THAY ĐỔI 2: Render Modal mới --- */}
      {selectedJob && (
        <JobDetailModal
          job={selectedJob}
          onClose={() => setSelectedJob(null)}
          isSaved={isJobSaved(selectedJob)}
          onSave={toggleSaveJob}
        />
      )}
    </div>
  );
}