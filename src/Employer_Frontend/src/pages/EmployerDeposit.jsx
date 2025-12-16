import React, { useState, useEffect } from "react";
import PointDisplay from "../components/PointDisplay";
import { useAuth } from "../context/AuthContext";
import { HiOutlineCreditCard, HiCheckCircle, HiX, HiSparkles, HiOutlineLightningBolt, HiOutlineStar, HiOutlineBriefcase, HiOutlineGlobeAlt } from "react-icons/hi";
import "../styles/employerDeposit.css";
import toast from 'react-hot-toast';

const EXCHANGE_RATE = 500; // 500 VND = 1 Point
const MAX_POINTS_LIMIT = 100000;
const DISCOUNT = 1;

const EmployerDeposit = () => {
  const { auth, handleTransaction } = useAuth();
  
  // Mặc định để trống hoặc số 0
  const [pointsToBuy, setPointsToBuy] = useState(0); 
  const [bonusPoints, setBonusPoints] = useState(0);
  const [showQR, setShowQR] = useState(false);

  

  // Cấu hình các gói nạp (Thêm trường name)
  const quickPackages = [
    { 
      id: 1, points: 40, price: 20000, priceDiscount: 19999, name: "Gói Khởi Động", bonus: 0, 
      icon: <HiOutlineStar />, 
      theme: "blue" 
    },
    { 
      id: 2, points: 100, price: 50000, priceDiscount: 49999, name: "Gói Tăng Tốc", bonus: 10, recommend: true, 
      icon: <HiOutlineLightningBolt />, 
      theme: "orange" 
    },
    { 
      id: 3, points: 400, price: 200000, priceDiscount: 199999, // example discount
      name: "Gói Chuyên Nghiệp", bonus: 50, 
      icon: <HiOutlineBriefcase />, 
      theme: "purple" 
    },
    { 
      id: 4, points: 1000, price: 500000, priceDiscount: 499999, // example discount
      name: "Gói Doanh Nghiệp", bonus: 150, 
      icon: <HiOutlineGlobeAlt />, 
      theme: "gold" 
    },
  ];


  // Tự động tính bonus khi nhập tay
  useEffect(() => {
    if (pointsToBuy >= 1000) setBonusPoints(150);
    else if (pointsToBuy >= 400) setBonusPoints(50);
    else if (pointsToBuy >= 100) setBonusPoints(10);
    else setBonusPoints(0);
  }, [pointsToBuy]);

  const handleSelectPackage = (pkg) => {
    setPointsToBuy(pkg.points);
  };

  // Xử lý Input: Chặn số âm, số 0 đầu VÀ số quá lớn
  const handleInputChange = (e) => {
    const val = e.target.value;
    
    if (val === "") {
        setPointsToBuy(0);
        return;
    }

    const num = parseInt(val, 10);

    if (!isNaN(num)) {
        // Logic kẹp giá trị: Không nhỏ hơn 0, không lớn hơn MAX
        if (num > MAX_POINTS_LIMIT) {
            setPointsToBuy(MAX_POINTS_LIMIT);
            toast.error(`Giới hạn nạp tối đa trong một lần là ${MAX_POINTS_LIMIT.toLocaleString()} điểm.`);
        } else {
            setPointsToBuy(Math.max(0, num));
        }
    }
  };

  const handleBuy = () => {
    if (pointsToBuy <= 0) {
        toast.error("Vui lòng nhập số điểm lớn hơn 0");
        return;
    }
    setShowQR(true);
  };

  const confirmPayment = () => {
    const totalPoints = parseInt(pointsToBuy) + bonusPoints;
    handleTransaction(totalPoints, "add");
    setShowQR(false);
    toast.success(`Thanh toán thành công! +${totalPoints} điểm.`);
    setPointsToBuy(0);
  };

  return (
    <div className="deposit-page">
      <PointDisplay points={auth.employerData.data.point} />

      <div className="deposit-container">
        <div className="deposit-header">
            <h3><HiOutlineCreditCard className="icon-header"/> Mua thêm điểm</h3>
            <p className="sub-text">Nạp điểm để đăng tin tuyển dụng và tiếp cận ứng viên tiềm năng.</p>
        </div>

        {/* Danh sách gói nạp - UI Mới */}
        <div className="package-grid">
          {(() => {
             // Kiểm tra xem hiện tại người dùng có đang chọn một trong các gói nhanh không
             const isAnyPackageSelected = quickPackages.some(p => p.points === pointsToBuy);

              return quickPackages.map((pkg) => {
                const isSelected = pointsToBuy === pkg.points;
                const isDimmed = isAnyPackageSelected && !isSelected;

                return (
                    <div 
                        key={pkg.id} 
                        // 👇 THÊM CLASS 'dimmed' VÀO ĐÂY 👇
                        className={`package-card theme-${pkg.theme} ${pkg.recommend ? 'recommended' : ''} ${isSelected ? 'selected' : ''} ${isDimmed ? 'dimmed' : ''}`}
                        onClick={() => handleSelectPackage(pkg)}
            >

              {/* Icon đại diện */}
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

              {/* Package icon, name, points, etc. */}
              {pkg.recommend && (
                <div className="badge-recommend">
                    <HiSparkles /> Khuyên dùng
                </div>
              )}


              <div className="pkg-price-tag">
                {pkg.price && pkg.priceDiscount ? (
                  <>
                    <span className="original-price">{pkg.price.toLocaleString('vi-VN')}đ</span>
                    <span className="discount-price">{pkg.priceDiscount.toLocaleString('vi-VN')}đ</span>
                  </>
                ) : (
                  <span className="discount-price">{pkg.price.toLocaleString('vi-VN')}đ</span>
                )}
              </div>
            </div>
          );
          });
      })()}
    </div>

        {/* Khu vực nhập tùy chỉnh */}
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
                    <span className="money-value">{Math.max(0, pointsToBuy * EXCHANGE_RATE - DISCOUNT).toLocaleString("vi-VN")} VNĐ</span>
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

        <button className="btn-payment-momo" onClick={handleBuy}>
           Thanh toán
        </button>
      </div>

      {/* Modal QR Code */}
      {showQR && (
        <div className="modal-overlay" onClick={() => setShowQR(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="btn-close-modal" onClick={() => setShowQR(false)}><HiX /></button>
            <h4>Quét mã để thanh toán</h4>
            <p className="qr-instruction">Sử dụng App MoMo hoặc Camera để quét</p>
            <div className="qr-frame">
              <img src="https://upload.wikimedia.org/wikipedia/commons/d/d0/QR_code_for_mobile_English_Wikipedia.svg" alt="Momo QR" />
            </div>
            <div className="payment-info">
                <p>Số tiền: <strong>{(pointsToBuy * EXCHANGE_RATE).toLocaleString("vi-VN")} đ</strong></p>
                <p>Nội dung: <strong>NAP {pointsToBuy} DIEM</strong></p>
            </div>
            <button className="btn-confirm-mock" onClick={confirmPayment}>
              <HiCheckCircle /> [Giả lập] Đã thanh toán xong
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployerDeposit;