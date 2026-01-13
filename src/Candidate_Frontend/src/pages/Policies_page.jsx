// src/pages/Policies.jsx
import React from "react";
import Footer from "../Home/components/Footer"; // Đường dẫn đã sửa theo cấu trúc của bạn
import "../styles/polices.css";

export default function Policies() {
  return (
    <div className="policies-page">
      {/* Header trang chính sách */}
      <section className="policies-header">
        <div className="home-shell">
          <h1>Điều khoản & Chính sách</h1>
          <p>Cập nhật lần cuối: Ngày 08 tháng 01 năm 2026</p>
        </div>
      </section>

      <div className="home-shell">
        <main className="policies-content">
          <section className="policy-section">
            <h2>Điều khoản dịch vụ</h2>
            <p>
              Chào mừng bạn đến với <strong>CDH Job Portal</strong>. Khi sử dụng website của chúng tôi, bạn đồng ý tuân thủ các điều khoản dưới đây.
            </p>

            <div className="policy-item">
              <h3>1. Phạm vi áp dụng</h3>
              <p>Điều khoản này áp dụng cho tất cả người dùng đăng ký tài khoản và sử dụng các dịch vụ tuyển dụng trên CDH Job Portal.</p>
            </div>

            <div className="policy-item">
              <h3>2. Tài khoản người dùng</h3>
              <ul>
                <li>Bạn cam kết cung cấp thông tin cá nhân chính xác và đầy đủ.</li>
                <li>Bạn chịu trách nhiệm bảo mật thông tin đăng nhập của mình.</li>
                <li>Mỗi người dùng chỉ được tạo một tài khoản cá nhân.</li>
              </ul>
            </div>

            <div className="policy-item">
              <h3>3. Quyền và trách nhiệm của người dùng</h3>
              <ul>
                <li>Không sử dụng website cho mục đích gian lận hoặc trái pháp luật.</li>
                <li>Không đăng tải nội dung sai sự thật, gây hiểu nhầm hoặc vi phạm pháp luật.</li>
                <li>Chịu trách nhiệm về thông tin hồ sơ cá nhân và hồ sơ xin việc.</li>
              </ul>
            </div>

            <div className="policy-item">
              <h3>4. Quyền của hệ thống</h3>
              <ul>
                <li>CDH Job Portal có quyền từ chối hoặc khóa tài khoản vi phạm.</li>
                <li>Hệ thống có thể thay đổi, nâng cấp dịch vụ mà không cần thông báo trước.</li>
              </ul>
            </div>

            <div className="policy-item">
              <h3>5. Thay đổi điều khoản</h3>
              <p>Chúng tôi có quyền cập nhật điều khoản bất cứ lúc nào. Phiên bản mới sẽ có hiệu lực ngay khi được đăng tải trên hệ thống.</p>
            </div>
          </section>
        </main>
      </div>

      <Footer />
    </div>
  );
}