import React, { useState } from "react";
import "../styles/AdminWallet.css";
import { 
  HiCreditCard, 
  HiUser, 
  HiCurrencyDollar, 
  HiAnnotation, 
  HiSearch, 
  HiClock,
  HiCheckCircle,
  HiExclamationCircle,
  HiFilter
} from "react-icons/hi";
import { toast } from "react-toastify";

// --- MOCK DATA ---
const MOCK_HISTORY = [
  { id: "TRX-9821", admin: "Admin 01", userEmail: "candidate@gmail.com", amount: 500000, note: "Nạp khuyến mãi tháng 1", date: "2026-01-09 10:30", status: "success" },
  { id: "TRX-9822", admin: "Admin 01", userEmail: "employer@tech.com", amount: 2000000, note: "Hỗ trợ gói đăng tin VIP 30 ngày (Gói doanh nghiệp)", date: "2026-01-08 14:20", status: "success" },
  { id: "TRX-9823", admin: "Supper Admin", userEmail: "dev.user@gmail.com", amount: 100000, note: "Hoàn tiền lỗi hệ thống #ERR023", date: "2026-01-07 09:15", status: "success" },
  { id: "TRX-9824", admin: "Admin 02", userEmail: "hr.manager@corp.vn", amount: 5000000, note: "Thanh toán hợp đồng HĐ-2026/01", date: "2026-01-06 16:45", status: "success" },
  { id: "TRX-9825", admin: "Admin 01", userEmail: "student@edu.vn", amount: 50000, note: "Tặng tân thủ", date: "2026-01-06 11:00", status: "success" },
  { id: "TRX-9826", admin: "Supper Admin", userEmail: "partner@rec.com", amount: 10000000, note: "Thanh toán công nợ T12", date: "2026-01-05 08:30", status: "success" },
  { id: "TRX-9827", admin: "System", userEmail: "spammer@bot.com", amount: 0, note: "Từ chối giao dịch: Spam", date: "2026-01-04 20:10", status: "failed" },
];

export default function ManualPayment() {
  const [activeTab, setActiveTab] = useState('topup'); // 'topup' | 'history'

  // --- LOGIC FORM NẠP TIỀN ---
  const [email, setEmail] = useState("");
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(false);

  // --- LOGIC LỊCH SỬ ---
  const [history, setHistory] = useState(MOCK_HISTORY);
  const [searchTerm, setSearchTerm] = useState("");

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
  };

  const handleTopUp = async (e) => {
    e.preventDefault();
    if (!email || !amount) return toast.warning("Vui lòng nhập đủ thông tin!");
    
    setLoading(true);
    setTimeout(() => {
      const newTrx = {
        id: `TRX-${Math.floor(Math.random() * 10000)}`,
        admin: "Admin",
        userEmail: email,
        amount: parseFloat(amount),
        note: note || "Nạp thủ công",
        date: new Date().toLocaleString('sv-SE').slice(0, 16).replace('T', ' '),
        status: "success"
      };
      setHistory([newTrx, ...history]);
      toast.success("Nạp tiền thành công!");
      setLoading(false);
      setEmail(""); setAmount(""); setNote("");
      setActiveTab('history'); // Chuyển sang tab lịch sử để xem kết quả ngay
    }, 1000);
  };

  // Filter cho Table
  const filteredHistory = history.filter(item => 
    item.userEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="wallet-page fade-in">
      
      {/* HEADER & TABS */}
      <div className="wallet-header">
        <div className="header-content">
            <h2 className="page-title">Quản lý Ví & Giao dịch</h2>
            <p className="page-subtitle">Hệ thống xử lý nạp tiền và tra soát lịch sử</p>
        </div>
        
        <div className="tab-navigation">
            <button 
                className={`tab-btn ${activeTab === 'topup' ? 'active' : ''}`}
                onClick={() => setActiveTab('topup')}
            >
                <HiCreditCard /> Nạp tiền thủ công
            </button>
            <button 
                className={`tab-btn ${activeTab === 'history' ? 'active' : ''}`}
                onClick={() => setActiveTab('history')}
            >
                <HiClock /> Lịch sử giao dịch
            </button>
        </div>
      </div>

      <div className="wallet-body">
        
        {/* === TAB 1: FORM NẠP TIỀN (GIAO DIỆN TẬP TRUNG) === */}
        {activeTab === 'topup' && (
            <div className="topup-container fade-in">
                <div className="topup-card">
                    <div className="card-header-center">
                        <div className="icon-circle">
                            <HiCreditCard />
                        </div>
                        <h3>Thông tin nạp tiền</h3>
                        <p>Nhập thông tin người nhận và số tiền cần nạp vào ví hệ thống.</p>
                    </div>

                    <form onSubmit={handleTopUp} className="topup-form">
                        <div className="form-group">
                            <label>Email người nhận <span className="req">*</span></label>
                            <div className="input-group">
                                <HiUser className="input-icon" />
                                <input 
                                    type="email" 
                                    placeholder="Ví dụ: candidate@gmail.com" 
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label>Số tiền <span className="req">*</span></label>
                            <div className="input-group">
                                <HiCurrencyDollar className="input-icon" />
                                <input 
                                    type="number" 
                                    placeholder="500,000" 
                                    value={amount}
                                    onChange={(e) => setAmount(e.target.value)}
                                />
                            </div>
                            {amount && <div className="amount-helper">Sẽ nạp: <b>{formatCurrency(amount)}</b></div>}
                        </div>

                        <div className="form-group">
                            <label>Ghi chú giao dịch</label>
                            <div className="input-group">
                                <HiAnnotation className="input-icon" />
                                <textarea 
                                    rows="3" 
                                    placeholder="Nhập lý do, mã hợp đồng, ghi chú..."
                                    value={note}
                                    onChange={(e) => setNote(e.target.value)}
                                ></textarea>
                            </div>
                        </div>

                        <div className="form-actions">
                            <button type="submit" className="btn-primary-lg" disabled={loading}>
                                {loading ? "Đang xử lý..." : "Xác nhận Nạp tiền"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        )}

        {/* === TAB 2: LỊCH SỬ (FULL WIDTH) === */}
        {activeTab === 'history' && (
            <div className="history-container fade-in">
                <div className="history-toolbar">
                    <div className="toolbar-left">
                        <h3>Danh sách giao dịch</h3>
                        <span className="count-badge">{filteredHistory.length} bản ghi</span>
                    </div>
                    <div className="search-bar">
                        <HiSearch />
                        <input 
                            type="text" 
                            placeholder="Tìm kiếm theo Email hoặc Mã GD..." 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <button className="btn-filter"><HiFilter /> Lọc</button>
                </div>

                <div className="table-wrapper">
                    <table className="data-table">
                        <thead>
                            <tr>
                                {/* 1. NGƯỜI NHẬN (Tăng lên 25%) */}
                                <th width="25%">Người nhận</th>
                                
                                {/* 2. SỐ TIỀN (Giữ 15%) */}
                                <th width="15%">Số tiền</th>
                                
                                {/* 3. GHI CHÚ (Mở rộng tối đa lên 35% cho rộng rãi) */}
                                <th width="35%">Ghi chú</th>
                                
                                {/* 4. THỜI GIAN (Tăng nhẹ lên 15% cho thoáng) */}
                                <th width="15%">Thời gian</th>
                                
                                {/* 5. TRẠNG THÁI (Giữ 10%) */}
                                <th width="10%" className="text-center">Trạng thái</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredHistory.map(item => (
                                <tr key={item.id}>
                                    {/* BỎ <td> Mã GD và <td> Admin */}
                                    
                                    {/* Người nhận */}
                                    <td className="fw-600">{item.userEmail}</td>
                                    
                                    {/* Số tiền */}
                                    <td className="text-money">+{formatCurrency(item.amount)}</td>
                                    
                                    {/* Ghi chú */}
                                    <td className="text-limit" title={item.note}>{item.note}</td>
                                    
                                    {/* Thời gian */}
                                    <td className="text-sm">{item.date}</td>
                                    
                                    {/* Trạng thái */}
                                    <td className="text-center">
                                        <span className={`status-badge ${item.status}`}>
                                            {item.status === 'success' ? 'Thành công' : 'Thất bại'}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        )}

      </div>
    </div>
  );
}