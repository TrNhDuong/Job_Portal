import React from 'react';
import '../styles/AboutPage.css'; // Chúng ta sẽ tạo file này ở Bước 2
import { HiSparkles, HiUserGroup, HiAcademicCap, HiOutlineChatAlt2 } from 'react-icons/hi';

// Component tĩnh, chỉ hiển thị thông tin
export default function AboutPage() {
  return (
    <div className="about-container">
      
      {/* Thẻ 1: Thêm className="hero" và Icon */}
      <div className="about-card hero">
        <h2><HiSparkles /> Chào mừng đến với InspireLeader</h2>
        <p>
          <strong>InspireLeader</strong> được xây dựng để trở thành cầu nối hiệu quả, minh bạch và thông minh nhất giữa Doanh nghiệp và các Ứng viên tài năng.
        </p>
        <p>
          Chúng tôi tin rằng việc tìm kiếm nhân sự (hoặc cơ hội) phù hợp không nên là một quy trình phức tạp, mà là một trải nghiệm truyền cảm hứng.
        </p>
      </div>

      {/* Thẻ 2: Thêm Icon và Sửa danh sách <ul> */}
      <div className="about-card">
        <h2><HiUserGroup /> Đội ngũ Phát triển (Nhóm CDH)</h2>
        <p>InspireLeader được xây dựng và phát triển bởi Nhóm CDH, gồm các thành viên tâm huyết:</p>
        
        {/* Sửa từ <ul> thành <div> */}
        <div className="team-list">
          <div className="team-list-item">
            <strong>Trần Nhật Dương</strong> - <span>23120243</span>
          </div>
          <div className="team-list-item">
            <strong>Nguyễn Huỳnh Trọng Đức</strong> - <span>23120239</span>
          </div>
          <div className="team-list-item">
            <strong>Văn Phú Hiệu</strong> - <span>23120261</span>
          </div>
          <div className="team-list-item">
            <strong>Nguyễn Đình Chuẩn</strong> - <span>23120221</span>
          </div>
          <div className="team-list-item">
            <strong>Đào Duy Hảo</strong> - <span>23120251</span>
          </div>
        </div>
      </div>

      {/* Thẻ 3: Thêm Icon */}
      <div className="about-card">
        <h2><HiAcademicCap /> Thông tin Đồ án</h2>
        <p>
          Sản phẩm này là <strong>Đồ án Nhập môn Công nghệ phần mềm - Lớp CQ2023/1</strong> tại Trường Đại học Khoa học Tự nhiên, ĐHQG-HCM.
        </p>
        <p>
          Đây là nỗ lực của nhóm nhằm áp dụng các quy trình phát triển phần mềm hiện đại để xây dựng một ứng dụng web hoàn chỉnh và có ý nghĩa thực tiễn.
        </p>
      </div>

      {/* Thẻ 4: Thêm Icon */}
      <div className="about-card">
        <h2><HiOutlineChatAlt2 /> Gửi phản hồi</h2>
        <p>
          Chúng tôi luôn mong muốn lắng nghe ý kiến của bạn để cải thiện 
          <strong> InspireLeader</strong>
          . Mọi góp ý xin vui lòng liên hệ qua email của nhóm trưởng:
          <a href="mailto:23120243@student.hcmus.edu.vn"> 23120243@student.hcmus.edu.vn</a>.
        </p>
      </div>
    </div>
  );
}