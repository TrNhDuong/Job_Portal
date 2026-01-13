import React, { useState, useEffect, useCallback } from "react";
import "../styles/AdminWallet.css";
import { 
  HiCreditCard, 
  HiUser, 
  HiCurrencyDollar, 
  HiAnnotation, 
  HiSearch, 
  HiClock,
  HiFilter,
  HiRefresh
} from "react-icons/hi";
import { toast } from "react-toastify";
import client from "../api/client.js";


export default function ManualPayment() {
  const [activeTab, setActiveTab] = useState('topup'); // 'topup' | 'history'

  // --- LOGIC FORM NẠP TIỀN ---
  const [formData, setFormData] = useState({
    email: "",
    amount: "",
    note: ""
  });
  const [submitting, setSubmitting] = useState(false);

  // --- LOGIC LỊCH SỬ ---
  const [history, setHistory] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // Helper: Format tiền tệ
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
  };

  // --- 1. CALL API: LẤY LỊCH SỬ GIAO DỊCH ---
  const fetchHistory = useCallback(async () => {
    setLoadingHistory(true);
    try {
        const response = await client.get(`api/payment`);
        if (response.data.success) {
            // Giả sử API trả về mảng data.transactions
            console.log(response.data.data)
            setHistory(response.data.data || []); 
        } else {
            toast.error(data.message || "Không thể tải lịch sử giao dịch");
        }
    } catch (error) {
      console.error("Fetch Error:", error);
      toast.error("Lỗi kết nối server!");
    } finally {
      setLoadingHistory(false);
    }
  }, []);

  // Gọi API khi chuyển sang tab history
  useEffect(() => {
    if (activeTab === 'history') {
      fetchHistory();
    }
  }, [activeTab, fetchHistory]);

  // --- 2. CALL API: XỬ LÝ NẠP TIỀN ---
  const handleTopUp = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.amount) return toast.warning("Vui lòng nhập đủ Email và Số tiền!");

    setSubmitting(true);
    try {
        const email = formData.email;
        const amount = formData.amount;

        const response = await client.post(
            `api/payment/admin?email=${email}`,
            {
                "point": amount
            }
        )
        const data = await response.data;

        if (data.message === 'Create payment successfully') {
            toast.success("Nạp tiền thành công!");
            setFormData({ email: "", amount: "", note: "" }); // Reset form
            fetchHistory(); // Refresh lại list ngầm
            setActiveTab('history'); // Chuyển tab để check
        } else {
            toast.error(data.message || "Giao dịch thất bại!");
        }
    } catch (error) {
      console.error("Topup Error:", error);
      toast.error("Lỗi kết nối server khi nạp tiền!");
    } finally {
      setSubmitting(false);
    }
  };

  // Filter Client-side (Tối ưu nhất là Filter Server-side nếu dữ liệu lớn)
  const filteredHistory = history;

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
        
        {/* === TAB 1: FORM NẠP TIỀN === */}
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
                            <label>Tài khoản (Email) <span className="req">*</span></label>
                            <div className="input-group">
                                <HiUser className="input-icon" />
                                <input 
                                    type="email" 
                                    placeholder="Ví dụ: candidate@gmail.com" 
                                    value={formData.email}
                                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label>Số điểm <span className="req">*</span></label>
                            <div className="input-group">
                                <HiCurrencyDollar className="input-icon" />
                                <input 
                                    type="number" 
                                    placeholder="500,000" 
                                    value={formData.amount}
                                    onChange={(e) => setFormData({...formData, amount: e.target.value})}
                                />
                            </div>
                            {formData.amount && <div className="amount-helper">Sẽ nạp: <b>{formatCurrency(formData.amount)}</b></div>}
                        </div>

                        <div className="form-group">
                            <label>Ghi chú</label>
                            <div className="input-group">
                                <HiAnnotation className="input-icon" />
                                <textarea 
                                    rows="3" 
                                    placeholder="Nhập lý do, mã hợp đồng..."
                                    value={formData.note}
                                    onChange={(e) => setFormData({...formData, note: e.target.value})}
                                ></textarea>
                            </div>
                        </div>

                        <div className="form-actions">
                            <button type="submit" className="btn-primary-lg" disabled={submitting}>
                                {submitting ? "Đang xử lý..." : "Xác nhận Nạp tiền"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        )}

        {/* === TAB 2: LỊCH SỬ (ĐÃ SỬA CỘT) === */}
        {activeTab === 'history' && (
            <div className="history-container fade-in">
                <div className="history-toolbar">
                    <div className="toolbar-left">
                        <h3>Lịch sử nạp/rút</h3>
                        <span className="count-badge">{filteredHistory.length} bản ghi</span>
                    </div>
                    <div className="search-bar">
                        <HiSearch />
                        <input 
                            type="text" 
                            placeholder="Tìm theo Email hoặc Ghi chú..." 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <button className="btn-filter" onClick={fetchHistory} title="Làm mới">
                        <HiRefresh />
                    </button>
                    <button className="btn-filter"><HiFilter /> Lọc</button>
                </div>

                <div className="table-wrapper">
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th width="25%">Tài khoản</th>
                                <th width="15%">Số điểm</th>
                                <th width="30%">Ghi chú</th>
                                <th width="15%">Thời gian</th>
                                <th width="15%" className="text-center">Trạng thái</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loadingHistory ? (
                                <tr><td colSpan="5" className="text-center py-4">Đang tải dữ liệu...</td></tr>
                            ) : filteredHistory.length > 0 ? (
                                filteredHistory.map((item, index) => (
                                    <tr key={item.id || index}>
                                        {/* Cột 1: Tài khoản */}
                                        <td className="fw-600">{item.email}</td>
                                        
                                        {/* Cột 2: Số điểm */}
                                        <td className="text-money">+{formatCurrency(item.point)}</td>
                                        
                                        {/* Cột 3: Ghi chú */}
                                        <td className="text-limit" title={item.note}>{item.note || "Không có ghi chú"}</td>
                                        
                                        {/* Cột 4: Thời gian (Giả sử BE trả về string ISO) */}
                                        <td className="text-sm">
                                            {item.createdAt ? new Date(item.createdAt).toLocaleString('vi-VN') : item.date}
                                        </td>
                                        
                                        {/* Cột 5: Trạng thái */}
                                        <td className="text-center">
                                            <span className={`status-badge ${item.status}`}>
                                                {item.state === 'Success' ? 'Thành công' : 
                                                 item.state === 'Fail' ? 'Đang xử lý' : 'Thất bại'}
                                            </span>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr><td colSpan="5" className="text-center py-4">Không có dữ liệu giao dịch</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        )}

      </div>
    </div>
  );
}