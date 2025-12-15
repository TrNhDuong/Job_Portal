import React, { useEffect, useState } from 'react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  BarChart, Bar, Legend 
} from 'recharts';
import { HiArrowSmUp, HiArrowSmDown, HiCurrencyDollar, HiUserAdd, HiDocumentText, HiDownload } from "react-icons/hi";
import '../styles/Dashboard.css';
import { statsService } from '../services/statsService'; // Import Service
import { exportToExcel } from '../utils/exportExcel';

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    setLoading(true);
    try {
      const res = await statsService.getDashboardStats();
      if (res.success) {
        setStats(res.data);
      }
    } catch (error) {
      console.error("Lỗi tải thống kê:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleExportRevenue = () => {
    if (!stats || !stats.revenue) return;
    
    // Chuẩn bị data
    const dataExport = stats.revenue.map(item => ({
        "Tháng": item.name,
        "Doanh thu (VND)": item.revenue
    }));

    exportToExcel(dataExport, "Bao_cao_doanh_thu_6_thang");
  };

  // Hàm format tiền tệ VNĐ
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
  };

  if (loading) {
    return <div className="dashboard-container"><p>Đang tải dữ liệu thống kê...</p></div>;
  }

  // Nếu load xong mà không có data (lỗi)
  if (!stats) return null; 

  return (
    <div className="dashboard-container fade-in">
      
      {/* Header Dashboard có nút Export */}
      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px'}}>
         {/* Bạn có thể thêm tiêu đề Dashboard ở đây nếu muốn */}
         <div></div> 
         
         {/* 👇 3. NÚT XUẤT BÁO CÁO */}
         <button 
            onClick={handleExportRevenue}
            className="btn-export" // Có thể style thêm trong CSS
            style={{
                display: 'flex', alignItems: 'center', gap: '8px',
                background: '#fff', color: '#374151', border: '1px solid #d1d5db',
                padding: '8px 16px', borderRadius: '8px', cursor: 'pointer',
                fontWeight: '600', fontSize: '0.9rem', boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
            }}
         >
            <HiDownload size={18} style={{color: '#0061ff'}} /> Xuất báo cáo Doanh thu
         </button>
      </div>
      
      {/* 1. CARDS THỐNG KÊ NHANH */}
      <div className="stats-grid">
        <div className="stat-card">
            <div className="stat-icon income"><HiCurrencyDollar /></div>
            <div className="stat-info">
                <span className="stat-label">Tổng Doanh Thu</span>
                {/* Hiển thị số liệu thật từ API/Mock */}
                <h3 className="stat-value">{formatCurrency(stats.summary.totalRevenue)}</h3>
                <span className="stat-trend positive"><HiArrowSmUp /> +12% tháng này</span>
            </div>
        </div>

        <div className="stat-card">
            <div className="stat-icon users"><HiUserAdd /></div>
            <div className="stat-info">
                <span className="stat-label">User Mới</span>
                <h3 className="stat-value">{stats.summary.newUsers.toLocaleString()}</h3>
                <span className="stat-trend positive"><HiArrowSmUp /> +5% hôm nay</span>
            </div>
        </div>

        <div className="stat-card">
            <div className="stat-icon jobs"><HiDocumentText /></div>
            <div className="stat-info">
                <span className="stat-label">Tin Tuyển Dụng</span>
                <h3 className="stat-value">{stats.summary.totalJobs.toLocaleString()}</h3>
                <span className="stat-trend negative"><HiArrowSmDown /> -2% tuần qua</span>
            </div>
        </div>
      </div>

      {/* 2. BIỂU ĐỒ */}
      <div className="charts-grid">
        
        {/* Chart 1: Doanh thu */}
        <div className="chart-box">
            <h3 className="chart-title">Thống kê Truy cập & Đăng ký (Tuần qua)</h3>
            <div style={{ width: '100%', height: 300 }}>
                <ResponsiveContainer>
                    <BarChart data={stats.traffic}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip cursor={{fill: 'transparent'}} />
                        <Legend />
                        <Bar dataKey="visits" name="Lượt truy cập" fill="#00c6ff" radius={[4, 4, 0, 0]} />
                        <Bar dataKey="registers" name="Đăng ký mới" fill="#0061ff" radius={[4, 4, 0, 0]} />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>

        {/* Chart 2: Lượt đăng ký mới (Traffic) */}
        <div className="chart-box">
            <h3 className="chart-title">Đăng ký mới (Tuần qua)</h3>
            <div style={{ width: '100%', height: 300 }}>
                <ResponsiveContainer>
                    <BarChart data={stats.traffic}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip cursor={{fill: 'transparent'}} />
                        <Legend />
                        <Bar dataKey="employer" name="Nhà tuyển dụng" fill="#00c6ff" radius={[4, 4, 0, 0]} />
                        <Bar dataKey="candidate" name="Ứng viên" fill="#0061ff" radius={[4, 4, 0, 0]} />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>

      </div>
    </div>
  );
}