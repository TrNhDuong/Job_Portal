import React, { useEffect, useState } from 'react';
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import {
  HiArrowSmUp,
  HiArrowSmDown,
  HiCurrencyDollar,
  HiUserAdd,
  HiDocumentText,
  HiDownload,
  HiCalendar,
  HiArrowLeft
} from "react-icons/hi";
import '../styles/Dashboard.css';
import { statsService } from '../services/statsService';
import { exportToExcel } from '../utils/exportExcel';

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  const [activeCard, setActiveCard] = useState('revenue'); // default chart doanh thu
  const [drillDownType, setDrillDownType] = useState('revenue'); // 'revenue' | 'users' | 'jobs'
  const [timeRange, setTimeRange] = useState('month'); // month | week
  const [selectedMonth, setSelectedMonth] = useState(null);
  const [monthlyData, setMonthlyData] = useState([]);
  const [weeklyData, setWeeklyData] = useState([]);

  const theme = localStorage.getItem('theme') || 'light';
  const isDark = theme === 'dark';
  const gridColor = isDark ? '#334155' : '#e5e7eb';
  const axisColor = isDark ? '#94a3b8' : '#6b7280';

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    setLoading(true);
    const res = await statsService.getDashboardStats();
    if (res.success) {
      setStats(res.data);
      setMonthlyData(res.data.revenue); // default chart doanh thu tháng
    }
    setLoading(false);
  };

  const handleExportRevenue = () => {
    if (!stats?.revenue) return;
    exportToExcel(
      stats.revenue.map(i => ({
        Tháng: i.name,
        "Doanh thu (VND)": i.revenue
      })),
      "Bao_cao_doanh_thu"
    );
  };

  const formatCurrency = (v) =>
    new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(v);

  const getUserComposition = () => {
    let totalEmployer = 0, totalCandidate = 0;
    if (stats?.traffic) {
      stats.traffic.forEach(day => {
        totalEmployer += day.employer || 0;
        totalCandidate += day.candidate || 0;
      });
    }
    if (totalEmployer === 0 && totalCandidate === 0) {
      return [
        { name: 'Nhà tuyển dụng', value: 450, color: '#3b82f6' },
        { name: 'Ứng viên', value: 850, color: '#8b5cf6' }
      ];
    }
    return [
      { name: 'Nhà tuyển dụng', value: totalEmployer, color: '#3b82f6' },
      { name: 'Ứng viên', value: totalCandidate, color: '#8b5cf6' }
    ];
  };

  const pieData = getUserComposition();

  if (loading) return (
    <div className="dashboard-container">
      <div className="loading-container">
        <div className="spinner" />
      </div>
    </div>
  );

  if (!stats) return null;

  const today = new Date().toLocaleDateString('vi-VN', { weekday:'long', year:'numeric', month:'long', day:'numeric' });

  const handleCardClick = async (type) => {
    setActiveCard(type);
    setDrillDownType(type);
    setTimeRange('month');
    setSelectedMonth(null);

    if (type === 'revenue') {
      setMonthlyData(stats.revenue);
    } else if (type === 'users') {
      const monthly = await statsService.getMonthlyUsers(); // giả lập data tháng users
      setMonthlyData(monthly);
    } else if (type === 'jobs') {
      const monthly = await statsService.getMonthlyJobs(); // giả lập data tháng jobs
      setMonthlyData(monthly);
    }
  };

  const handleBarClick = async (data) => {
    if (!data) return;
    setSelectedMonth(data.name);
    setTimeRange('week');
    let weekly;
    if (drillDownType === 'revenue') {
      weekly = await statsService.getWeeklyRevenueByMonth(data.name);
    } else if (drillDownType === 'users') {
      weekly = await statsService.getWeeklyUsersByMonth(data.name);
    } else if (drillDownType === 'jobs') {
      weekly = await statsService.getWeeklyJobsByMonth(data.name);
    }
    setWeeklyData(weekly);
  };

  const getDataKey = () => drillDownType==='revenue'?'revenue':'value';

  return (
    <div className="dashboard-container fade-in">

      <div className="welcome-banner">
        <h1 className="welcome-title">Xin chào, Administrator!</h1>
        <div className="welcome-subtitle">
          <HiCalendar /> {today}
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 20 }}>
        <button className="btn-excel" onClick={handleExportRevenue}>
          <HiDownload /> Xuất báo cáo Doanh thu
        </button>
      </div>

      <div className="stats-grid">
        <div
          className={`stat-card income ${activeCard==='revenue'?'active':''}`}
          onClick={()=>handleCardClick('revenue')}
        >
          <div className="stat-icon income"><HiCurrencyDollar /></div>
          <div className="stat-info">
            <span className="stat-label">Tổng Doanh Thu</span>
            <h3 className="stat-value">{formatCurrency(stats.summary.totalRevenue)}</h3>
            <span className="stat-trend positive"><HiArrowSmUp /> +12.5%</span>
          </div>
        </div>

        <div
          className={`stat-card users ${activeCard==='users'?'active':''}`}
          onClick={()=>handleCardClick('users')}
        >
          <div className="stat-icon users"><HiUserAdd /></div>
          <div className="stat-info">
            <span className="stat-label">Thành viên mới</span>
            <h3 className="stat-value">{stats.summary.newUsers}</h3>
            <span className="stat-trend positive"><HiArrowSmUp /> +5.2%</span>
          </div>
        </div>

        <div
          className={`stat-card jobs ${activeCard==='jobs'?'active':''}`}
          onClick={()=>handleCardClick('jobs')}
        >
          <div className="stat-icon jobs"><HiDocumentText /></div>
          <div className="stat-info">
            <span className="stat-label">Tin tuyển dụng</span>
            <h3 className="stat-value">{stats.summary.totalJobs}</h3>
            <span className="stat-trend negative"><HiArrowSmDown /> -2.1%</span>
          </div>
        </div>
      </div>

      {/* MONTHLY CHART */}
      <div className="chart-box">
        <h3 className="chart-title">
          {drillDownType==='revenue'?'Doanh thu theo tháng':
           drillDownType==='users'?'Thành viên mới theo tháng':
           'Tin tuyển dụng theo tháng'}
        </h3>
        <div style={{ width:'100%', height:320 }}>
          <ResponsiveContainer>
            <BarChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={gridColor} />
              <XAxis dataKey="name" tick={{ fill: axisColor }} />
              <YAxis tick={{ fill: axisColor }} />
              <Tooltip />
              <Bar
                dataKey={getDataKey()}
                radius={[6,6,0,0]}
                onClick={handleBarClick}
              >
                {monthlyData.map((entry,i)=>(
                  <Cell
                    key={i}
                    fill={drillDownType==='revenue'?'#22c55e': drillDownType==='users'?'#3b82f6':'#f97316'}
                    stroke={entry.name===selectedMonth?'#000': 'none'}
                    strokeWidth={entry.name===selectedMonth?2:0}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* WEEKLY DRILL-DOWN CHART */}
      {timeRange==='week' && weeklyData.length>0 && (
        <div className="chart-box">
          <button className="back-btn" onClick={()=>setTimeRange('month')}>
            <HiArrowLeft /> Quay lại
          </button>
          <h3 className="chart-title">
            {drillDownType==='revenue'?'Doanh thu theo tuần':
             drillDownType==='users'?'Thành viên mới theo tuần':
             'Tin tuyển dụng theo tuần'}
          </h3>
          <div style={{width:'100%', height:300}}>
            <ResponsiveContainer>
              <BarChart data={weeklyData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false}/>
                <XAxis dataKey="name"/>
                <YAxis/>
                <Tooltip/>
                <Bar
                  dataKey="value"
                  radius={[6,6,0,0]}
                  fill={drillDownType==='revenue'?'#22c55e': drillDownType==='users'?'#3b82f6':'#f97316'}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* USER COMPOSITION DONUT */}
      <div className="chart-box">
        <h3 className="chart-title">Phân loại người dùng mới</h3>
        <div style={{width:'100%', height:280}}>
          <ResponsiveContainer>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                innerRadius={70}
                outerRadius={100}
                dataKey="value"
              >
                {pieData.map((e,i)=><Cell key={i} fill={e.color}/>)}
              </Pie>
              <Tooltip/>
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

    </div>
  );
}
