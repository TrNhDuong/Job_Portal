import React, { useState } from "react";
import "../styles/AdminWallet.css";
import { HiSearch, HiCurrencyDollar, HiCheck, HiX, HiClock } from "react-icons/hi";
import { toast } from "react-toastify";

// --- MOCK DATA: DANH SÁCH YÊU CẦU NẠP TIỀN (Giả lập DB) ---
const INITIAL_REQUESTS = [
  {
    id: "req-001",
    user: { name: "Nguyễn Văn A", email: "nguyenvana@gmail.com", avatar: "" },
    amount: 500000,
    time: "2025-12-30T10:30:00",
    status: "pending", // pending, approved, rejected
    bankCode: "FT12345678" // Mã giao dịch ngân hàng
  },
  {
    id: "req-002",
    user: { name: "Trần Thị B", email: "tranthib@gmail.com", avatar: "" },
    amount: 2000000,
    time: "2025-12-30T11:15:00",
    status: "pending",
    bankCode: "FT87654321"
  },
  {
    id: "req-003",
    user: { name: "Lê C", email: "lec@gmail.com", avatar: "" },
    amount: 100000,
    time: "2025-12-29T09:00:00",
    status: "rejected", // Đã từ chối trước đó
    bankCode: "ERR001"
  }
];

export default function AdminWallet() {
  const [activeTab, setActiveTab] = useState("requests"); // 'requests' hoặc 'manual'
  const [requests, setRequests] = useState(INITIAL_REQUESTS);
  
  // State cho phần Manual Search (Cũ)
  const [emailSearch, setEmailSearch] = useState("");
  const [foundUser, setFoundUser] = useState(null);
  const [manualAmount, setManualAmount] = useState("");
  const [loading, setLoading] = useState(false);

  // --- LOGIC XỬ LÝ YÊU CẦU (TAB 1) ---
  
  // Duyệt tiền
  const handleApproveRequest = (req) => {
    // 1. Chuyển Tab sang Manual
    setActiveTab('manual');

    // 2. Điền sẵn Email vào ô tìm kiếm
    setEmailSearch(req.user.email);

    // 3. Điền sẵn Số tiền vào ô nạp
    setManualAmount(req.amount.toString());

    // 4. "Giả vờ" như đã tìm thấy User xong rồi (Set luôn data user vào state)
    // Để nó hiện cái Card và nút Xác nhận lên ngay lập tức
    setFoundUser({
        _id: req.user._id || "auto-fill-id",
        name: req.user.name,
        email: req.user.email,
        avatar: req.user.avatar,
        role: "employer", // Hoặc lấy từ req nếu có
        balance: 0, // Mock số dư
        company: "Công ty (Auto Fill)" 
    });

    // 5. Thông báo nhẹ
    toast.info(`Đã điền thông tin của ${req.user.name}. Vui lòng bấm xác nhận!`);
  };

  // Từ chối
  const handleRejectRequest = (reqId) => {
    if(!window.confirm("Bạn muốn từ chối yêu cầu này?")) return;
    
    setRequests(prev => prev.map(r => {
        if (r.id === reqId) return { ...r, status: "rejected" };
        return r;
    }));
    toast.info("Đã từ chối yêu cầu.");
  };


  // --- LOGIC MANUAL (TAB 2 - GIỮ NGUYÊN) ---
  const handleSearchUser = async () => {
    if (!emailSearch.trim()) return toast.warning("Nhập email đi bạn ơi!");
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setFoundUser({ 
        _id: "manual-01", 
        name: "User Thủ Công", 
        email: emailSearch, 
        balance: 0, 
        role: "employer" 
      });
      toast.success("Tìm thấy user!");
    }, 600);
  };

  const handleManualTopUp = () => {
    if (!manualAmount) return;
    setLoading(true);
    setTimeout(() => {
        setLoading(false);
        toast.success(`Đã nạp tay ${parseInt(manualAmount).toLocaleString()}đ thành công!`);
        setManualAmount("");
        setFoundUser(null);
    }, 800);
  };

  return (
    <div className="wallet-container fade-in">
      <div className="wallet-header">
        <h2 className="wallet-title">Quản lý Tài chính & Nạp tiền</h2>
      </div>

      <div className="wallet-card">
        {/* TABS SWITCHER */}
        <div className="wallet-tabs">
            <button 
                className={`tab-btn ${activeTab === 'requests' ? 'active' : ''}`}
                onClick={() => setActiveTab('requests')}
            >
                <HiClock style={{marginBottom: -2, marginRight: 4}}/> Duyệt yêu cầu ({requests.filter(r => r.status === 'pending').length})
            </button>
            <button 
                className={`tab-btn ${activeTab === 'manual' ? 'active' : ''}`}
                onClick={() => setActiveTab('manual')}
            >
                <HiSearch style={{marginBottom: -2, marginRight: 4}}/> Nạp thủ công
            </button>
        </div>

        {/* --- NỘI DUNG TAB 1: DANH SÁCH YÊU CẦU --- */}
        {activeTab === 'requests' && (
            <div className="fade-in" style={{width: '100%'}}>
                <table className="request-table">
                    <thead>
                        <tr>
                            <th>Người yêu cầu</th>
                            <th>Mã giao dịch</th>
                            <th>Số tiền nạp</th>
                            <th>Thời gian</th>
                            <th>Trạng thái</th>
                            <th>Hành động</th>
                        </tr>
                    </thead>
                    <tbody>
                        {requests.map(req => (
                            <tr key={req.id}>
                                <td>
                                    <div className="req-user-info">
                                        <div className="req-avatar">{(req.user.name || "U").charAt(0)}</div>
                                        <div className="req-text">
                                            <h4>{req.user.name}</h4>
                                            <p>{req.user.email}</p>
                                        </div>
                                    </div>
                                </td>
                                <td style={{fontFamily: 'monospace', color: '#666'}}>{req.bankCode}</td>
                                <td className="req-amount">+{req.amount.toLocaleString()} đ</td>
                                <td style={{fontSize: '0.9rem', color: '#666'}}>
                                    {new Date(req.time).toLocaleString('vi-VN')}
                                </td>
                                <td>
                                    <span className={`status-badge ${req.status}`}>
                                        {req.status === 'pending' ? 'Chờ duyệt' : 
                                         req.status === 'approved' ? 'Thành công' : 'Từ chối'}
                                    </span>
                                </td>
                                <td>
                                    {req.status === 'pending' && (
                                        <div className="action-group">
                                            <button className="btn-approve" onClick={() => handleApproveRequest(req)}>
                                                <HiCheck /> Duyệt & Nạp
                                            </button>
                                            <button className="btn-reject" onClick={() => handleRejectRequest(req.id)}>
                                                <HiX /> Hủy
                                            </button>
                                        </div>
                                    )}
                                    {req.status !== 'pending' && <span style={{color: '#999', fontSize: '0.85rem'}}>Đã xử lý</span>}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {requests.length === 0 && <div className="empty-state">Chưa có yêu cầu nào</div>}
            </div>
        )}

        {/* --- NỘI DUNG TAB 2: NẠP THỦ CÔNG (CODE CŨ) --- */}
        {activeTab === 'manual' && (
            <div className="fade-in" style={{width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                 <div className="search-section">
                    <label className="step-label">Tìm user để nạp tiền trực tiếp:</label>
                    <div className="search-input-group">
                        <div className="wallet-search-wrapper">
                            <HiSearch className="search-icon-wallet"/>
                            <input
                                className="wallet-search-input"
                                placeholder="Nhập email user..."
                                value={emailSearch}
                                onChange={(e) => setEmailSearch(e.target.value)}
                            />
                        </div>
                        <button className="btn-search-wallet" onClick={handleSearchUser} disabled={loading}>
                            {loading ? "..." : "Tìm"}
                        </button>
                    </div>
                </div>

                {foundUser && (
                    <div className="user-result-card">
                        <div className="user-info-row">
                            <div className="avatar-large">{(foundUser.name || "U").charAt(0)}</div>
                            <div className="user-text">
                                <h3>{foundUser.name}</h3>
                                <p>{foundUser.email}</p>
                            </div>
                        </div>
                        <div className="amount-wrapper">
                            <HiCurrencyDollar className="currency-icon" />
                            <input 
                                type="number" 
                                className="amount-input"
                                placeholder="Nhập số tiền..."
                                value={manualAmount}
                                onChange={e => setManualAmount(e.target.value)}
                            />
                        </div>
                        <button className="btn-topup" onClick={handleManualTopUp} disabled={loading}>
                            <HiCheck /> XÁC NHẬN NẠP NGAY
                        </button>
                    </div>
                )}
            </div>
        )}

      </div>
    </div>
  );
}