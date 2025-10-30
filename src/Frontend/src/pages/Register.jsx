import { useState } from "react";
import RegisterCandidateForm from "../components/RegisterCandidateForm";
import RegisterEmployerForm from "../components/RegisterEmployerForm";
import { Link } from "react-router-dom";
export default function Register() {
  const [role, setRole] = useState("candidate");

  return (
    <div className="page-wrap">
      {/* LEFT: form */}
      <div className="left-col">
        <div className="form-card">
          <h1 className="title">Chào mừng bạn đến với Job Portal</h1>
          <p className="subtitle">
            Cùng xây dựng một hồ sơ nổi bật và nhận được các cơ hội sự nghiệp lý tưởng
          </p>

          <div className="role-tabs">
            <button
              className={role === "candidate" ? "active" : ""}
              onClick={() => setRole("candidate")}
            >
              Ứng viên
            </button>
            <button
              className={role === "employer" ? "active" : ""}
              onClick={() => setRole("employer")}
            >
              Nhà tuyển dụng
            </button>
          </div>

          {role === "candidate" ? <RegisterCandidateForm /> : <RegisterEmployerForm />}

          <div className="divider">Hoặc đăng nhập bằng</div>
          
          <p className="helper">
            Bạn đã có tài khoản? 
            <Link to="/login" className="text-blue-600 hover:underline">
              Đăng nhập ngay
            </Link>
          </p>
        </div>
      </div>

      {/* RIGHT: brand panel */}
      <div className="right-panel">
        <div className="right-inner">
          <div className="brand">CDH<br/>Dẫn đầu xu thế CV</div>
          <p className="tagline">
            Bước chân khởi đầu đến thành công
          </p>
        </div>
      </div>
    </div>
  );
}
