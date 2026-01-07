import React, { useEffect, useState } from "react";
import "../styles/Dashboard.css";
import { 
  HiUsers, 
  HiBriefcase, 
  HiFilter,
  HiTrendingUp 
} from "react-icons/hi";
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  BarChart, Bar, PieChart, Pie, Cell, Legend 
} from "recharts";
import { userService } from "../services/userService";
import { jobService } from "../services/jobService";
import { statsService } from "../services/statsService";
import { toast } from "react-toastify";

export default function Dashboard() {
  // State quản lý tab đang chọn: 'members' hoặc 'jobs'
  const [activeTab, setActiveTab] = useState('members'); 

  const [totalUsers, setTotalUsers] = useState(0);
  const [totalJobs, setTotalJobs] = useState(0);
  const [chartData, setChartData] = useState([]); 
  const [userTypeData, setUserTypeData] = useState([]);
  const [timeFilter, setTimeFilter] = useState('month');
  const [loading, setLoading] = useState(true);

  // Colors cho biểu đồ
  const COLORS_PIE = ['#3b82f6', '#10b981']; // Xanh dương (Employer), Xanh lá (Candidate)

  useEffect(() => {
    fetchDashboardData();
  }, [timeFilter]);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const now = new Date();
      const currentYear = now.getFullYear();
      const currentMonth = now.getMonth() + 1;

      const [userRes, jobRes, statsRes] = await Promise.all([
        userService.getAllUsers(),
        jobService.getAllJobs(),
        statsService.getMonthlyStats(currentYear, currentMonth)
      ]);

      // Xử lý User & User Type
      if (userRes.success) {
        const users = userRes.data || [];
        setTotalUsers(users.length);
        const employerCount = users.filter(u => u.role === 'employer').length;
        const candidateCount = users.filter(u => u.role === 'candidate').length;
        setUserTypeData([
            { name: 'Nhà tuyển dụng', value: employerCount },
            { name: 'Ứng viên', value: candidateCount },
        ]);
      }

      // Xử lý Job
      if (jobRes.success) {
        setTotalJobs(jobRes.jobs?.length || 0);
      }

      // Xử lý Chart Data theo ngày
      if (statsRes.success && statsRes.data && statsRes.data.daily_stats) {
        const dailyMap = statsRes.data.daily_stats;
        const currentDay = now.getDate();
        let processedData = [];

        for (let i = 1; i <= currentDay; i++) {
            const dayKey = i.toString();
            const dayStats = dailyMap[dayKey] || { candidateRegister: 0, employerRegister: 0, jobPost: 0 };
            processedData.push({
                name: `${i}/${currentMonth}`,
                newMembers: (dayStats.candidateRegister || 0) + (dayStats.employerRegister || 0),
                newJobs: dayStats.jobPost || 0
            });
        }

        if (timeFilter === 'week') {
            setChartData(processedData.slice(-7)); 
        } else {
            setChartData(processedData);
        }
      } else {
        setChartData([]);
      }
    } catch (error) {
      console.error("Dashboard Error:", error);
      toast.error("Lỗi tải dữ liệu Dashboard");
    } finally {
      setLoading(false);
    }
  };
  
  const [currentDate, setCurrentDate] = useState('');

  useEffect(() => {
    // Format ngày: "Thứ Tư, 07 tháng 01, 2026"
    const dateStr = new Date().toLocaleDateString('vi-VN', {
        weekday: 'long', 
        day: '2-digit', 
        month: 'long', 
        year: 'numeric'
    });
    // Viết hoa chữ cái đầu (thứ)
    setCurrentDate(dateStr.charAt(0).toUpperCase() + dateStr.slice(1));
  }, []);

  return (
    <div className="dashboard-container fade-in">
      {/* HEADER */}
      <div className="welcome-banner">
        <div className="welcome-content">
            <h2 className="welcome-title">Chào mừng, Administrator!</h2>
            <p className="welcome-subtitle">{currentDate}</p>
        </div>
      </div>

      {/* 1. STATS GRID (Clickable) */}
      <div className="stats-grid">
        {/* Card Thành viên */}
        <div 
            className={`stat-card ${activeTab === 'members' ? 'active' : ''}`}
            onClick={() => setActiveTab('members')}
        >
          <div className="stat-icon-wrapper blue">
            <HiUsers className="stat-icon" />
          </div>
          <div className="stat-info">
            <span className="stat-label">Tổng Thành Viên</span>
            <h3 className="stat-value">{totalUsers}</h3>
            <span className="stat-hint">Bấm để xem chi tiết</span>
          </div>
        </div>

        {/* Card Tin tuyển dụng */}
        <div 
            className={`stat-card ${activeTab === 'jobs' ? 'active' : ''}`}
            onClick={() => setActiveTab('jobs')}
        >
          <div className="stat-icon-wrapper green">
            <HiBriefcase className="stat-icon" />
          </div>
          <div className="stat-info">
            <span className="stat-label">Tổng Tin Tuyển Dụng</span>
            <h3 className="stat-value">{totalJobs}</h3>
            <span className="stat-hint">Bấm để xem chi tiết</span>
          </div>
        </div>
      </div>

      {/* 2. DYNAMIC CHART SECTION */}
      <div className="chart-section-wrapper">
        <div className="chart-header-row">
            <h3 className="section-title">
                {activeTab === 'members' ? <HiUsers /> : <HiBriefcase />} 
                {activeTab === 'members' ? 'Thống kê Thành viên' : 'Thống kê Tin tuyển dụng'}
            </h3>

            {/* Bộ lọc chung */}
            <div className="chart-filter">
                <HiFilter className="filter-icon" />
                <select value={timeFilter} onChange={(e) => setTimeFilter(e.target.value)}>
                    <option value="week">7 ngày qua</option>
                    <option value="month">Tháng này</option>
                </select>
            </div>
        </div>

        {/* --- VIEW 1: THÀNH VIÊN (Hiện 2 biểu đồ: Line + Pie) --- */}
        {activeTab === 'members' && (
            <div className="charts-split-layout fade-in">
                {/* Chart 1: Xu hướng đăng ký */}
                <div className="chart-box main-chart">
                    <h4>Xu hướng đăng ký mới</h4>
                    <div style={{ width: '100%', height: 300 }}>
                        <ResponsiveContainer>
                            <AreaChart data={chartData}>
                                <defs>
                                    <linearGradient id="colorUser" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-color)" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: 'var(--text-secondary)'}} />
                                <YAxis axisLine={false} tickLine={false} allowDecimals={false} tick={{fill: 'var(--text-secondary)'}} />
                                <Tooltip contentStyle={{backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-color)', color: 'var(--text-primary)'}} />
                                <Area type="monotone" dataKey="newMembers" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorUser)" name="Thành viên mới" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Chart 2: Phân loại User */}
                <div className="chart-box side-chart">
                    <h4>Phân loại người dùng</h4>
                    <div style={{ width: '100%', height: 300 }}>
                        <ResponsiveContainer>
                            <PieChart>
                                <Pie
                                    data={userTypeData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={80}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {userTypeData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS_PIE[index % COLORS_PIE.length]} />
                                    ))}
                                </Pie>
                                <Tooltip contentStyle={{backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-color)', color: 'var(--text-primary)'}} />
                                <Legend verticalAlign="bottom" height={36}/>
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        )}

        {/* --- VIEW 2: TIN TUYỂN DỤNG (Chỉ hiện 1 biểu đồ Bar Full Width) --- */}
        {activeTab === 'jobs' && (
            <div className="charts-full-layout fade-in">
                <div className="chart-box full-chart">
                    <h4>Số lượng tin đăng theo thời gian</h4>
                    <div style={{ width: '100%', height: 400 }}>
                        <ResponsiveContainer>
                            <BarChart data={chartData} barSize={40}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-color)" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: 'var(--text-secondary)'}} />
                                <YAxis axisLine={false} tickLine={false} allowDecimals={false} tick={{fill: 'var(--text-secondary)'}} />
                                <Tooltip cursor={{fill: 'var(--bg-hover)'}} contentStyle={{backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-color)', color: 'var(--text-primary)'}}/>
                                <Bar dataKey="newJobs" fill="#10b981" radius={[4, 4, 0, 0]} name="Tin tuyển dụng mới" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        )}

      </div>
    </div>
  );
}