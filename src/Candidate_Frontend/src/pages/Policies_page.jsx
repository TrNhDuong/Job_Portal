import React, { useEffect } from "react";
import { useLocation } from "react-router-dom"; // Import useLocation
import Footer from "../Home/components/Footer";
import "../styles/polices.css";

export default function Policies() {
  const { hash } = useLocation();

  // Logic tự động cuộn xuống đúng phần (Terms hoặc Privacy) dựa vào URL
  useEffect(() => {
    if (hash) {
      const element = document.getElementById(hash.replace("#", ""));
      if (element) {
        // setTimeout để đảm bảo DOM đã render xong mới cuộn
        setTimeout(() => {
          element.scrollIntoView({ behavior: "smooth", block: "start" });
        }, 100);
      }
    } else {
      window.scrollTo(0, 0);
    }
  }, [hash]);

  return (
    <div className="policies-page">
      <section className="policies-header">
        <div className="home-shell">
          <h1>Chính sách bảo mật</h1>
          <p>Cập nhật lần cuối: Ngày 08 tháng 01 năm 2026</p>
        </div>
      </section>

      <div className="home-shell">
        <main className="policies-content">
          {/* --- PHẦN ĐIỀU KHOẢN --- */}
          <section id="terms" className="policy-section">
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
              </ul>
            </div>
            {/* ... Các mục khác của Terms ... */}
          </section>

          <hr className="policy-divider" style={{ margin: "40px 0", borderTop: "1px solid #eee" }} />

          {/* --- PHẦN CHÍNH SÁCH BẢO MẬT (Thêm mới) --- */}
          <section id="privacy" className="policy-section">
            <h2>Chính sách bảo mật</h2>
            <p>Chúng tôi coi trọng việc bảo vệ dữ liệu cá nhân của bạn.</p>

            <div className="policy-item">
              <h3>1. Thu thập thông tin</h3>
              <p>Chúng tôi thu thập các thông tin như tên, email, số điện thoại để phục vụ quá trình tuyển dụng.</p>
            </div>

            <div className="policy-item">
              <h3>2. Sử dụng thông tin</h3>
              <p>Thông tin của bạn được sử dụng để kết nối với nhà tuyển dụng và cải thiện trải nghiệm trên website.</p>
            </div>

            <div className="policy-item">
              <h3>3. Bảo mật</h3>
              <p>Chúng tôi áp dụng các biện pháp kỹ thuật để ngăn chặn truy cập trái phép vào dữ liệu của bạn.</p>
            </div>
          </section>
        </main>
      </div>

      <Footer />
    </div>
  );
}