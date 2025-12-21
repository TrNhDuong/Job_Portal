import React, { useState, useEffect } from "react";
import "../styles/AdminMonitor.css";
import { monitorService } from "../services/monitorService";
import { 
    HiSearch, HiClock, HiCheckCircle, HiExclamation, 
    HiBriefcase, HiUser, HiShieldCheck, HiLightningBolt, HiBan, HiEye, HiX,
    HiCalendar, HiIdentification, HiHashtag, HiFlag
} from "react-icons/hi";
import { toast } from "react-toastify";

export default function AdminMonitor() {
  const [search, setSearch] = useState("");
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLog, setActionLog] = useState([]);

  // State cho Modal
  const [selectedReport, setSelectedReport] = useState(null);

  useEffect(() => {
    fetchReports();
  }, []);

  // --- 🔥 QUAN TRỌNG: Khóa cuộn trang khi mở Modal ---
  useEffect(() => {
    if (selectedReport) {
      document.body.style.overflow = "hidden"; // Khóa cuộn
    } else {
      document.body.style.overflow = "unset"; // Mở lại cuộn
    }
    // Cleanup khi component unmount
    return () => { document.body.style.overflow = "unset"; }
  }, [selectedReport]);

  const fetchReports = async () => {
    setLoading(true);
    try {
      const res = await monitorService.getReports();
      if (res.success) setReports(res.data);
    } catch (error) { } 
    finally { setLoading(false); }
  };

  const handleAction = async (id, actionLabel, newStatus, targetName) => {
    try {
      const res = await monitorService.resolveReport(id, actionLabel);
      if (res.success) {
        setReports((prev) =>
          prev.map((item) => item.id === id ? { ...item, status: newStatus } : item)
        );
        toast.success(`Đã xử lý: ${actionLabel}`);
        
        const now = new Date();
        const timeString = `${now.getHours()}:${String(now.getMinutes()).padStart(2, '0')}`;
        setActionLog(prev => [{ time: timeString, content: <span>Đã <b>{actionLabel}</b> đối tượng <b>{targetName}</b></span> }, ...prev]);
        
        if (selectedReport && selectedReport.id === id) {
            setSelectedReport(prev => ({...prev, status: newStatus}));
        }
      }
    } catch (error) { toast.error("Lỗi xử lý"); }
  };

  const renderStatus = (status) => {
      switch(status) {
          case 'Pending': return <span className="status-pill status-pending">Chờ xử lý</span>;
          case 'Safe': return <span className="status-pill status-safe">An toàn</span>;
          case 'Warning': return <span className="status-pill status-warning">Đã cảnh báo</span>;
          case 'Suspended': return <span className="status-pill status-suspended">Đã khóa</span>;
          default: return <span className="status-pill status-pending">{status}</span>;
      }
  }

  const filteredReports = reports.filter((item) =>
    item.targetName?.toLowerCase().includes(search.toLowerCase()) ||
    item.reason?.toLowerCase().includes(search.toLowerCase())
  );

  const pendingCount = reports.filter(r => r.status === 'Pending').length;
  const resolvedCount = reports.filter(r => r.status !== 'Pending').length;

  return (
    <>
      {/* 🔥 QUAN TRỌNG: 
         Main Content nằm trong 'monitor-container' để có animation fade-in.
      */}
      <div className="monitor-container fade-in">
        
        {/* LEFT CONTENT */}
        <div className="monitor-main-panel">
          
          {/* STATS ROW */}
          <div className="monitor-stats-row">
              <div className="mini-stat-card">
                  <div className="mini-icon" style={{background: 'rgba(245, 158, 11, 0.1)', color:'#f59e0b'}}>
                      <HiExclamation />
                  </div>
                  <div className="mini-info">
                      <h4>Cần xử lý</h4>
                      <span>{pendingCount}</span>
                  </div>
              </div>
              <div className="mini-stat-card">
                  <div className="mini-icon" style={{background: 'rgba(59, 130, 246, 0.1)', color:'#3b82f6'}}>
                      <HiClock />
                  </div>
                  <div className="mini-info">
                      <h4>Tổng báo cáo</h4>
                      <span>{reports.length}</span>
                  </div>
              </div>
              <div className="mini-stat-card">
                  <div className="mini-icon" style={{background: 'rgba(16, 185, 129, 0.1)', color:'#10b981'}}>
                      <HiCheckCircle />
                  </div>
                  <div className="mini-info">
                      <h4>Đã giải quyết</h4>
                      <span>{resolvedCount}</span>
                  </div>
              </div>
          </div>

          {/* TABLE CARD */}
          <div className="monitor-table-card">
              <div className="monitor-header-actions">
                  <h3 className="monitor-title">Danh sách báo cáo</h3>
                  <div className="monitor-search-wrapper">
                      <HiSearch className="search-icon" />
                      <input
                          type="text"
                          className="monitor-search"
                          placeholder="Tìm kiếm..."
                          value={search}
                          onChange={(e) => setSearch(e.target.value)}
                      />
                  </div>
              </div>

              <table className="monitor-table">
                  <thead>
                      <tr>
                          <th className="col-target">Đối tượng</th>
                          <th className="col-reason">Lý do</th>
                          <th className="col-reporter">Người báo cáo</th>
                          <th className="col-status" style={{textAlign: 'center'}}>Trạng thái</th>
                          <th className="col-action">Hành động</th>
                      </tr>
                  </thead>
                  <tbody>
                      {filteredReports.map((item) => (
                      <tr key={item.id}>
                          {/* 1. Target: Giữ nguyên ellipsis */}
                          <td>
                              <div className="target-cell-content">
                                  <div className="target-icon-box" style={{
                                      background: item.targetType === 'Job Post' ? 'rgba(0, 97, 255, 0.1)' : 'rgba(139, 92, 246, 0.1)',
                                      color: item.targetType === 'Job Post' ? '#0061ff' : '#8b5cf6'
                                  }}>
                                      {item.targetType === 'Job Post' ? <HiBriefcase /> : <HiUser />}
                                  </div>
                                  <div className="target-info">
                                      <span className="target-name" title={item.targetName}>{item.targetName}</span>
                                      <span className="target-sub">#{item.id} • {item.targetType}</span>
                                  </div>
                              </div>
                          </td>

                          {/* 2. Reason: Wrap text (xuống dòng) */}
                          <td>
                              <div className="reason-cell" title={item.reason}>
                                  {item.reason}
                              </div>
                          </td>

                          {/* 3. Reporter: Email */}
                          <td>
                              <div className="reporter-cell">
                                  {item.reportedBy}
                              </div>
                          </td>
                          
                          <td style={{textAlign: 'center'}}>{renderStatus(item.status)}</td>

                          <td className="col-action">
                              <div className="action-group">
                                  <button className="btn-icon-only btn-view" title="Xem chi tiết" onClick={() => setSelectedReport(item)}>
                                      <HiEye />
                                  </button>
                                  <button className="btn-icon-only btn-approve" title="Duyệt an toàn" onClick={() => handleAction(item.id, "Approve", "Safe", item.targetName)}>
                                      <HiShieldCheck />
                                  </button>
                                  <button className="btn-icon-only btn-warn" title="Gửi cảnh báo" onClick={() => handleAction(item.id, "Warning", "Warning", item.targetName)}>
                                      <HiExclamation />
                                  </button>
                                  <button className="btn-icon-only btn-lock" title="Khóa" onClick={() => handleAction(item.id, "Suspend", "Suspended", item.targetName)}>
                                      <HiBan />
                                  </button>
                              </div>
                          </td>
                      </tr>
                      ))}

                      {filteredReports.length === 0 && (
                          <tr>
                              <td colSpan="5" style={{textAlign:'center', padding:'40px', color:'var(--text-secondary)'}}>
                                  Không có dữ liệu phù hợp.
                              </td>
                          </tr>
                      )}
                  </tbody>
              </table>
          </div>
        </div>

        {/* RIGHT CONTENT: TIMELINE */}
        <div className="monitor-side-panel">
          <div className="side-header">
              <h3><HiClock /> Nhật ký hoạt động</h3>
          </div>
          <div className="log-container">
              <ul className="timeline-list">
                  {actionLog.map((log, idx) => (
                      <li key={idx} className="timeline-item">
                          <div className="timeline-dot"></div>
                          <span className="time-stamp">{log.time}</span>
                          <div className="log-content">{log.content}</div>
                      </li>
                  ))}
                  {actionLog.length === 0 && (
                      <li style={{paddingLeft:'10px', color:'var(--text-secondary)', fontStyle:'italic'}}>
                          Chưa có hoạt động nào.
                      </li>
                  )}
              </ul>
          </div>
        </div>
      </div>

      {/* 🔥 QUAN TRỌNG: 
         Modal được đưa ra NGOÀI 'monitor-container'.
         Điều này giúp nó không bị ảnh hưởng bởi transform/animation của container cha.
         => Sẽ căn giữa chuẩn xác theo Window.
      */}
      {selectedReport && (
        <div className="monitor-modal-overlay" onClick={() => setSelectedReport(null)}>
            <div className="monitor-modal" onClick={(e) => e.stopPropagation()}>
                
                {/* Header Modal */}
                <div className="modal-header">
                    <div className="modal-title-box">
                        <div className="modal-icon-large">
                            <HiFlag />
                        </div>
                        <div>
                            <h3>Chi tiết báo cáo <span className="modal-id">#{selectedReport.id}</span></h3>
                        </div>
                    </div>
                    <button className="btn-close" onClick={() => setSelectedReport(null)}><HiX /></button>
                </div>
                
                {/* Body Modal */}
                <div className="modal-body">
                    {/* Hàng 1: Đối tượng chính */}
                    <div className="info-group">
                        <span className="info-label"><HiBriefcase /> Đối tượng bị báo cáo</span>
                        <div className="info-box highlight">
                            {selectedReport.targetName}
                        </div>
                    </div>

                    {/* Hàng 2: Grid 2 cột */}
                    <div className="modal-grid-row">
                        <div className="info-group">
                            <span className="info-label"><HiHashtag /> Loại đối tượng</span>
                            <div className="info-box">
                                {selectedReport.targetType === 'Job Post' ? 'Tin tuyển dụng' : 'Tài khoản User'}
                            </div>
                        </div>
                        <div className="info-group">
                            <span className="info-label"><HiCheckCircle /> Trạng thái</span>
                            <div style={{marginTop: '5px'}}>{renderStatus(selectedReport.status)}</div>
                        </div>
                    </div>

                    {/* Hàng 3: Người báo cáo & Ngày */}
                    <div className="modal-grid-row">
                        <div className="info-group">
                            <span className="info-label"><HiIdentification /> Người báo cáo</span>
                            <div className="info-box">
                                {selectedReport.reportedBy}
                            </div>
                        </div>
                        <div className="info-group">
                            <span className="info-label"><HiCalendar /> Ngày báo cáo</span>
                            <div className="info-box">
                                {selectedReport.date || '20/12/2024'}
                            </div>
                        </div>
                    </div>

                    {/* Hàng 4: Lý do (Nổi bật - Danger) */}
                    <div className="info-group">
                        <span className="info-label" style={{color: '#e11d48'}}><HiExclamation /> Lý do vi phạm</span>
                        <div className="info-box danger">
                            {selectedReport.reason}
                        </div>
                    </div>
                </div>
            </div>
        </div>
      )}
    </>
  );
}