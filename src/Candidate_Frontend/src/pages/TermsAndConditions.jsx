// src/pages/TermsAndConditions.jsx
import React from "react";
import Footer from "../Home/components/Footer";
import { ShieldCheck, FileText, Lock, AlertCircle } from "lucide-react";
import "../styles/terms.css";

export default function TermsAndConditions() {
  return (
    <div className="terms-page">
      {/* Header đồng bộ với trang Policies */}
      <section className="terms-header">
        <div className="home-shell">
          <h1>Điều khoản và Điều kiện</h1>
          <p>Phiên bản cập nhật ngày 09 tháng 01 năm 2026</p>
        </div>
      </section>

      <div className="home-shell">
        <main className="terms-content">
          <div className="terms-intro">
            <p>
              Chào mừng bạn đến với <strong>CDH Job Portal</strong>. Bằng việc truy cập hoặc sử dụng dịch vụ của chúng tôi, bạn xác nhận rằng bạn đã đọc, hiểu và đồng ý bị ràng buộc bởi các Điều khoản này.
            </p>
          </div>

          <section className="terms-section">
            <div className="terms-section-title">
              <ShieldCheck size={24} />
              <h2>1. Chấp thuận các điều khoản</h2>
            </div>
            <p>
              Việc bạn sử dụng trang web CDH Job Portal đồng nghĩa với việc bạn chấp nhận các điều khoản này. Nếu bạn không đồng ý với bất kỳ phần nào của các điều khoản này, bạn không nên sử dụng dịch vụ của chúng tôi.
            </p>
          </section>

          <section className="terms-section">
            <div className="terms-section-title">
              <Lock size={24} />
              <h2>2. Tài khoản và Bảo mật</h2>
            </div>
            <ul>
              <li>Bạn phải cung cấp thông tin chính xác, đầy đủ và cập nhật cho tài khoản của mình.</li>
              <li>Bạn chịu trách nhiệm duy trì tính bảo mật của thông tin đăng nhập tài khoản.</li>
              <li>Mỗi cá nhân chỉ được phép sở hữu một tài khoản duy nhất trên hệ thống.</li>
            </ul>
          </section>

          <section className="terms-section">
            <div className="terms-section-title">
              <FileText size={24} />
              <h2>3. Đăng tải nội dung và Hồ sơ</h2>
            </div>
            <p>
              Khi đăng tải hồ sơ hoặc tin tuyển dụng, bạn cam kết:
            </p>
            <ul>
              <li>Không đăng tải thông tin sai sự thật hoặc gây hiểu lầm.</li>
              <li>Nội dung không vi phạm bản quyền hoặc quyền sở hữu trí tuệ của bên thứ ba.</li>
              <li>Nội dung không chứa mã độc, virus hoặc các thành phần gây hại cho hệ thống.</li>
            </ul>
          </section>

          <section className="terms-section">
            <div className="terms-section-title">
              <AlertCircle size={24} />
              <h2>4. Quyền hạn của CDH Job Portal</h2>
            </div>
            <p>
              Chúng tôi có quyền tạm ngừng hoặc chấm dứt quyền truy cập của bạn vào dịch vụ nếu có hành vi vi phạm điều khoản mà không cần thông báo trước.
            </p>
          </section>

          <section className="terms-section">
            <div className="terms-section-title">
              <FileText size={24} />
              <h2>5. Thay đổi điều khoản</h2>
            </div>
            <p>
              CDH Job Portal có quyền cập nhật các điều khoản này bất kỳ lúc nào để phù hợp với sự thay đổi của pháp luật và dịch vụ. Phiên bản mới nhất sẽ luôn được hiển thị trên trang này.
            </p>
          </section>

          <div className="terms-contact-note">
            <p>Nếu bạn có bất kỳ câu hỏi nào về các Điều khoản này, vui lòng liên hệ với chúng tôi qua trang <strong>Contact</strong>.</p>
          </div>
        </main>
      </div>

      <Footer />
    </div>
  );
}