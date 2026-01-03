import React, { useEffect, useState } from "react";
import "../styles/AdminMonitor.css";
import { monitorService } from "../services/monitorService";
import {
  HiSearch,
  HiEye,
  HiTrash,
  HiCalendar,
  HiIdentification,
  HiHashtag,
  HiFlag,
  HiX,
} from "react-icons/hi";
import { toast } from "react-toastify";

export default function AdminMonitor() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedReport, setSelectedReport] = useState(null);

  useEffect(() => {
    fetchReports();
  }, []);

  useEffect(() => {
    document.body.style.overflow = selectedReport ? "hidden" : "unset";
    return () => (document.body.style.overflow = "unset");
  }, [selectedReport]);

  const fetchReports = async () => {
    setLoading(true);
    try {
      const res = await monitorService.getReports();
      if (res.success) setReports(res.data);
    } catch {
      toast.error("Không tải được report");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Xoá report này nha?")) return;
    try {
      const res = await monitorService.deleteReport(id);
      if (res.success) {
        setReports((prev) => prev.filter((r) => r._id !== id));
        toast.success("Đã xoá report");
        setSelectedReport(null);
      }
    } catch {
      toast.error("Xoá thất bại");
    }
  };

  const filteredReports = reports.filter(
    (r) =>
      r.reportedBy.toLowerCase().includes(search.toLowerCase()) ||
      r.reason.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <div className="monitor-container fade-in">
        <div className="monitor-main-panel">
          <div className="monitor-header-actions">
            <h3 className="monitor-title">Danh sách báo cáo</h3>
            <div className="monitor-search-wrapper">
              <HiSearch />
              <input
                className="monitor-search"
                placeholder="Tìm email hoặc lý do..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>

          <table className="monitor-table">
            <thead>
              <tr>
                <th>JobPost ID</th>
                <th>Lý do</th>
                <th>Người báo cáo</th>
                <th>Thời gian</th>
                <th>Hành động</th>
              </tr>
            </thead>
            <tbody>
              {filteredReports.map((r) => (
                <tr key={r._id}>
                  <td>
                    <div>{r.JobPost?.title}</div>
                    <small style={{ color: "#888" }}>{r.JobPost?._id}</small>
                  </td>

                  <td>{r.reason}</td>
                  <td>{r.reportedBy}</td>
                  <td>{new Date(r.timeStamp).toLocaleString()}</td>
                  <td style={{ textAlign: "center" }}>
                    <div className="action-buttons">
                    <button
                      className="btn-icon btn-view"
                      onClick={() => setSelectedReport(r)}
                    >
                      <HiEye />
                    </button>
                    <button
                      className="btn-icon btn-delete"
                      onClick={() => handleDelete(r._id)}
                    >
                      <HiTrash />
                    </button>
                    </div>
                  </td>
                </tr>
              ))}

              {!loading && filteredReports.length === 0 && (
                <tr>
                  <td colSpan="5" style={{ textAlign: "center", padding: 40 }}>
                    Không có report nào hết 🥲
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {selectedReport && (
        <div
          className="monitor-modal-overlay"
          onClick={() => setSelectedReport(null)}
        >
          <div
            className="monitor-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header">
              <h3>
                <HiFlag /> Chi tiết report
              </h3>
              <button
                className="btn-close"
                onClick={() => setSelectedReport(null)}
              >
                <HiX />
              </button>
            </div>

            <div className="modal-body">
              <div className="info-group">
                <span className="info-label">
                  <HiHashtag /> JobPost ID
                </span>
                <div className="info-box">
                  {selectedReport.JobPost?.title} <br />
                  <small>{selectedReport.JobPost?._id}</small>
                </div>
              </div>

              <div className="info-group">
                <span className="info-label">
                  <HiIdentification /> Người báo cáo
                </span>
                <div className="info-box">{selectedReport.reportedBy}</div>
              </div>

              <div className="info-group">
                <span className="info-label">
                  <HiCalendar /> Thời gian
                </span>
                <div className="info-box">
                  {new Date(selectedReport.timeStamp).toLocaleString()}
                </div>
              </div>

              <div className="info-group">
                <span
                  className="info-label"
                  style={{ color: "#e11d48" }}
                >
                  Lý do
                </span>
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
