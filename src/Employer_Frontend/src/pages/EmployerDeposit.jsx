import React, { useState, useEffect } from "react";
import PointDisplay from "../components/PointDisplay";
import { useAuth } from "../context/AuthContext";
import { HiOutlineCreditCard, HiCheckCircle, HiX, HiSparkles, HiOutlineLightningBolt, HiOutlineStar, HiOutlineBriefcase, HiOutlineGlobeAlt } from "react-icons/hi";
import "../styles/employerDeposit.css";
import toast from 'react-hot-toast';
import client from "../api/client.js";

const EXCHANGE_RATE = 500; // 500 VND = 1 Point
const MAX_POINTS_LIMIT = 100000;

const EmployerDeposit = () => {
  const { auth, handleTransaction } = useAuth();
  
  // Các state cũ giữ nguyên
  const [pointsToBuy, setPointsToBuy] = useState(0); 
  const [totalMoney, setTotalMoney] = useState(0);
  const [bonusPoints, setBonusPoints] = useState(0);
  const [showQR, setShowQR] = useState(false);

  // --- STATE MỚI THÊM ĐỂ XỬ LÝ API ---
  const [isLoading, setIsLoading] = useState(false);
  const [transactionData, setTransactionData] = useState(null); // Chứa link QR và mã đơn hàng từ server trả về
  // ------------------------------------

  // Cấu hình các gói nạp (Giữ nguyên)
  const quickPackages = [
    { 
      id: 1, points: 40, price: 20000, name: "Gói Khởi Động", bonus: 0, 
      icon: <HiOutlineStar />, 
      theme: "blue" 
    },
    { 
      id: 2, points: 100, price: 50000, name: "Gói Tăng Tốc", bonus: 10, recommend: true, 
      icon: <HiOutlineLightningBolt />, 
      theme: "orange" 
    },
    { 
      id: 3, points: 400, price: 200000, name: "Gói Chuyên Nghiệp", bonus: 50, 
      icon: <HiOutlineBriefcase />, 
      theme: "purple" 
    },
    { 
      id: 4, points: 1000, price: 500000, name: "Gói Doanh Nghiệp", bonus: 150, 
      icon: <HiOutlineGlobeAlt />, 
      theme: "gold" 
    },
  ];

  // Logic tính bonus (Giữ nguyên)
  useEffect(() => {
    if (pointsToBuy >= 1000) setBonusPoints(150);
    else if (pointsToBuy >= 400) setBonusPoints(50);
    else if (pointsToBuy >= 100) setBonusPoints(10);
    else setBonusPoints(0);
  }, [pointsToBuy]);

  const handleSelectPackage = (pkg) => {
    setPointsToBuy(pkg.points);
  };

  // Logic Input (Giữ nguyên)
  const handleInputChange = (e) => {
    const val = e.target.value;
    if (val === "") {
        setPointsToBuy(0);
        return;
    }
    const num = parseInt(val, 10);
    if (!isNaN(num)) {
        if (num > MAX_POINTS_LIMIT) {
            setPointsToBuy(MAX_POINTS_LIMIT);
            toast.error(`Giới hạn nạp tối đa trong một lần là ${MAX_POINTS_LIMIT.toLocaleString()} điểm.`);
        } else {
            setPointsToBuy(Math.max(0, num));
        }
    }
  };

  // --- PHẦN 1: SỬA HÀM HANDLE BUY (GỌI SERVER LẤY QR) ---
  const handleBuy = async () => {
    if (pointsToBuy <= 0) {
        toast.error("Vui lòng nhập số điểm lớn hơn 0");
        return;
    }

    setIsLoading(true);
    try {

        setTotalMoney(pointsToBuy * EXCHANGE_RATE)
        console.log('Tong tien: ', totalMoney)
        const res = await client.post('/api/payment', { 
            amount: pointsToBuy * EXCHANGE_RATE,
            email: localStorage.getItem('email'),
            point: parseInt(pointsToBuy) + bonusPoints
        });
        
        // Server trả về: { qrUrl: "...", amount: 50000, orderId: "DH001" }
        if (res.data.success) {
            setTransactionData(res.data.data);
            setShowQR(true);
        } else {
            toast.error("Lỗi: Không nhận được mã QR từ hệ thống.");
        }
    } catch (error) {
        console.error(error);
        toast.error("Không thể tạo giao dịch. Vui lòng thử lại sau.");
    } finally {
        setIsLoading(false);
    }
  };

  // --- PHẦN 2: SỬA HÀM XÁC NHẬN (GỌI SERVER CHECK TRẠNG THÁI) ---
  const confirmPayment = async () => {
    if (!transactionData?.orderId) return;

    const loadingToast = toast.loading("Đang kiểm tra giao dịch...");
    
    try {
        // Gọi API kiểm tra trạng thái thanh toán với orderId
        const res = await client.post('/deposit/check-status', { 
            orderId: transactionData.orderId 
        });

        if (res.data.status === 'SUCCESS') {
            const totalPoints = parseInt(pointsToBuy) + bonusPoints;
            
            // Cập nhật context (auth)
            // Lưu ý: Nếu backend tự cộng điểm vào DB thì handleTransaction chỉ cần reload lại user
            // Nếu client vẫn cần truyền tham số thì giữ nguyên:
            handleTransaction(totalPoints, "add");

            setShowQR(false);
            toast.dismiss(loadingToast);
            toast.success(`Thanh toán thành công! +${totalPoints} điểm.`);
            setPointsToBuy(0);
            setTransactionData(null);
        } else {
            toast.dismiss(loadingToast);
            toast.error("Giao dịch chưa hoàn tất hoặc đang xử lý. Vui lòng đợi!");
        }
    } catch (error) {
        toast.dismiss(loadingToast);
        toast.error("Lỗi khi kiểm tra trạng thái.");
    }
  };

  return (
    <div className="deposit-page">
      <PointDisplay points={auth.employerData.data.point} />

      <div className="deposit-container">
        <div className="deposit-header">
            <h3><HiOutlineCreditCard className="icon-header"/> Mua thêm điểm</h3>
            <p className="sub-text">Nạp điểm để đăng tin tuyển dụng và tiếp cận ứng viên tiềm năng.</p>
        </div>

        {/* Danh sách gói nạp (Giữ nguyên) */}
        <div className="package-grid">
          {(() => {
             const isAnyPackageSelected = quickPackages.some(p => p.points === pointsToBuy);
             return quickPackages.map((pkg) => {
                const isSelected = pointsToBuy === pkg.points;
                const isDimmed = isAnyPackageSelected && !isSelected;
                return (
                    <div 
                        key={pkg.id} 
                        className={`package-card theme-${pkg.theme} ${pkg.recommend ? 'recommended' : ''} ${isSelected ? 'selected' : ''} ${isDimmed ? 'dimmed' : ''}`}
                        onClick={() => handleSelectPackage(pkg)}
                    >
                      {pkg.recommend && (
                        <div className="badge-recommend">
                            <HiSparkles /> Khuyên dùng
                        </div>
                      )}
                      <div className="pkg-icon-circle">
                          {pkg.icon}
                      </div>
                      <h4 className="pkg-name">{pkg.name}</h4>
                      <div className="pkg-main-info">
                          <span className="pkg-points">{pkg.points}</span>
                          <span className="pkg-unit">điểm</span>
                      </div>
                      <div className={`pkg-bonus-badge ${pkg.bonus > 0 ? 'has-bonus' : 'no-bonus'}`}>
                         {pkg.bonus > 0 ? `+ Tặng ${pkg.bonus}` : 'Không ưu đãi'}
                      </div>
                      <div className="pkg-price-tag">
                          {pkg.price.toLocaleString('vi-VN')}đ
                      </div>
                    </div>
                  );
                  });
          })()}
        </div>

        {/* Khu vực nhập tùy chỉnh (Giữ nguyên) */}
        <div className="custom-input-section">
            <div className="input-group">
                <label>Số điểm muốn mua (Tùy chỉnh):</label>
                <div className="input-wrapper">
                    <input
                        type="number"
                        min="0"
                        value={pointsToBuy.toString()}
                        onChange={handleInputChange}
                        placeholder="0"
                    />
                    <span className="input-suffix">ĐIỂM</span>
                </div>
            </div>
            
            <div className="summary-box">
                <div className="summary-row">
                    <span>Thành tiền:</span>
                    <span className="money-value">{(pointsToBuy * EXCHANGE_RATE).toLocaleString("vi-VN")} VNĐ</span>
                </div>
                {bonusPoints > 0 && (
                    <div className="summary-row bonus-row">
                        <span>Điểm thưởng:</span>
                        <span>+{bonusPoints} điểm</span>
                    </div>
                )}
                <div className="divider"></div>
                <div className="summary-row total-row">
                    <span>Tổng nhận:</span>
                    <span>{parseInt(pointsToBuy) + bonusPoints} điểm</span>
                </div>
            </div>
        </div>

        <button className="btn-payment-momo" onClick={handleBuy} disabled={isLoading}>
           {isLoading ? "Đang xử lý..." : "Thanh toán"}
        </button>
      </div>

      {/* --- PHẦN 3: SỬA MODAL QR (DÙNG DỮ LIỆU THẬT TỪ STATE) --- */}
      {showQR && transactionData && (
        <div className="modal-overlay" onClick={() => setShowQR(false)}>
          <div 
            className="modal-content" 
            onClick={(e) => e.stopPropagation()}
            style={{ maxWidth: '500px', width: '90%' }} // Tăng độ rộng modal để chứa QR to
          >
            <button className="btn-close-modal" onClick={() => setShowQR(false)}><HiX /></button>
            
            <h4 style={{ marginBottom: '10px' }}>Quét mã để thanh toán</h4>
            <p className="qr-instruction">Sử dụng App Ngân hàng hoặc Ví điện tử để quét</p>
            
            {/* Tăng kích thước khung QR tại đây */}
            <div className="qr-frame" style={{ 
                width: '300px', 
                height: '300px', 
                margin: '20px auto',
                border: '2px solid #e0e0e0',
                borderRadius: '12px',
                padding: '10px',
                background: 'white'
            }}>
              {/* Sửa lại src để lấy đúng đường dẫn ảnh trong object data */}
              <img 
                src={transactionData} 
                alt="QR Code Thanh Toán" 
                style={{ width: '100%', height: '100%', objectFit: 'contain' }}
              />
            </div>
            
          
            
            {/* <button className="btn-confirm-mock" onClick={confirmPayment} style={{ marginTop: '20px' }}>
              <HiCheckCircle /> Đã thanh toán xong
            </button> */}
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployerDeposit;