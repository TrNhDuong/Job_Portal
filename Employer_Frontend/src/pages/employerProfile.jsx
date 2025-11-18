import React, { useState, useEffect, useContext } from "react";
import "./employerProfile.css";
import { AuthContext } from "../context/AuthContext.jsx"; 
import client from "../api/client.js";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"; 
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";

const EmployerProfile = ({ onProfileUpdate }) => {
  const [activeTab, setActiveTab] = useState("account");

  // ===== Profile info =====
  const [profileInfo, setProfileInfo] = useState({
  profilePic: null,
  ceoName: "", // <-- SỬA Ở ĐÂY
  companyName: "", // <-- SỬA Ở ĐÂY
  foundationYear: "", // <-- SỬA Ở ĐÂY
  companyEmail: "", // <-- SỬA Ở ĐÂY
  });

  // ===== Forms =====
  const [personalProfile, setPersonalProfile] = useState({
    fullName: "",
    email: "",
    phone: "",
  });

  const [companyProfile, setCompanyProfile] = useState({
    companyName: "",
    address: "",
    website: "",
  });

  const [securityForm, setSecurityForm] = useState({
    twoFactorAuth: false,
    loginAlerts: true,
  });

  const [subscriptionForm, setSubscriptionForm] = useState({
    plan: "Pro",
    renewalDate: "2025-12-01",
  });

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  
  // Lấy thông tin user đã đăng nhập
  const { auth } = useContext(AuthContext); 

  const getInitials = (name) => {
      if (!name) return ""; // Trả về rỗng nếu chưa tải xong
      
      const words = name.split(' ');
      
      // Lấy chữ cái đầu của 2 từ (hoặc chỉ 1 nếu tên 1 từ)
      if (words.length > 1) {
          return words[0][0] + words[words.length - 1][0]; // Ví dụ: Văn Phú Hiệu -> VH
      } else if (words.length === 1 && words[0] !== "") {
          return words[0][0]; // Ví dụ: "UKLA" -> U
      }
      return "";
  };

// --- DÁN KHỐI NÀY VÀO ---
useEffect(() => {
    if (!auth.user?.email) {
        console.error("Không tìm thấy email user");
        return;
    }

    const fetchProfile = async () => {
        try {
            // 1. Gọi API để lấy thông tin
            const res = await client.get(`/api/employer/${auth.user.email}`);
            const data = res.data; // Lấy từ { success, message, data: {...} }

            // 2. Điền thông tin vào các state (form)
            setProfileInfo({
                // (Giả sử API chưa trả về các trường này)
                profilePic: data.profilePic || "", // Giả sử
                ceoName: data.ceoName || data.name || "", // Giả sử
                companyName: data.company || "",
                foundationYear: data.foundationYear || 2024, // Giả sử
                companyEmail: data.email || "",
            });

            setPersonalProfile({
                fullName: data.name || "", // Giả sử tên CEO lưu ở 'name'
                email: data.email || "",
                phone: data.phone || "",
            });

            setCompanyProfile({
                companyName: data.company || "",
                address: data.address || "",
                website: data.website || "",
            });

        } catch (error) {
            console.error("Lỗi khi tải thông tin profile:", error);
            alert("Không thể tải thông tin tài khoản.");
        }
    };

    fetchProfile();

}, [auth.user]);

  // ===== Handlers =====
  const handleChange = (e, type) => {
    const { name, value, type: inputType, checked } = e.target;
    let val = inputType === "checkbox" ? checked : value;

    // 🔒 Only allow numbers in phone input
    if (type === "personal" && name === "phone") {
      val = val.replace(/\D/g, ""); // remove any non-digit chars
    }

    if (type === "personal") setPersonalProfile({ ...personalProfile, [name]: val });
    else if (type === "company") setCompanyProfile({ ...companyProfile, [name]: val });
    else if (type === "security") setSecurityForm({ ...securityForm, [name]: val });
    else if (type === "subscription") setSubscriptionForm({ ...subscriptionForm, [name]: val });
    else if (type === "password") setPasswordForm({ ...passwordForm, [name]: val });
  };
  // ===== Helpers =====
  const validatePassword = (current, newPass, confirm) => {
    const errors = [];

    if (!current || !newPass || !confirm) {
      errors.push("Yêu cầu điền đầy đủ các trường");
    }
    if (newPass === current) {
      errors.push("Mật khẩu mới không được trùng mật khẩu cũ");
    }
    if (newPass !== confirm) {
      errors.push("Mật khẩu mới và xác nhận không khớp nhau");
    }
    if (newPass.length < 8) {
      errors.push("Mật khẩu phải có độ dài ít nhất 8 ký tự");
    }
    if (!/[A-Z]/.test(newPass) || !/[a-z]/.test(newPass) || !/[0-9]/.test(newPass)) {
      errors.push("Mật khẩu phải bao gồm chữ hoa, chữ thường và số");
    }

    return errors;
  };

    // ===== Updated handleSubmit =====
  const handleSubmit = async (e, type) => {
    e.preventDefault();

    // Lấy email từ Context (đã có sẵn)
    const email = auth.user?.email;
    if (!email) return alert("Lỗi: Không tìm thấy email người dùng.");

    // ===== XỬ LÝ ĐỔI MẬT KHẨU (Như cũ) =====
    if (type === "password") {
        const { currentPassword, newPassword, confirmPassword } = passwordForm;
        const errors = validatePassword(currentPassword, newPassword, confirmPassword);

        if (errors.length > 0) {
            alert(errors.join("\n"));
            return; // Dừng lại nếu lỗi validation
        }

        // --- Bắt đầu gọi API ---
        try {
            const payload = {
                email: auth.user.email,
                password: currentPassword,
                newpassword: newPassword
            };

            // 1. Gọi API
            const res = await client.post("/api/password/employer", payload);

            // 2. Xử lý kết quả
            if (res.data.success) {
                alert(res.data.message || "Đổi mật khẩu thành công!");
                // Reset form
                setPasswordForm({
                    currentPassword: "",
                    newPassword: "",
                    confirmPassword: "",
                });
            } else {
                // Hiển thị lỗi từ server (VD: Mật khẩu cũ không đúng)
                alert(res.data.message || "Đổi mật khẩu thất bại.");
            }
            
        } catch (error) {
            console.error("Lỗi khi đổi mật khẩu:", error);
            alert(error.response?.data?.message || "Lỗi máy chủ khi đổi mật khẩu.");
        }
        return; // Kết thúc hàm
    }

    // ===== XỬ LÝ LƯU THÔNG TIN CÁ NHÂN =====
    if (type === "personal") {
        const { fullName, email: formEmail, phone } = personalProfile;

        // Validate (như cũ)
        if (!fullName || !formEmail || !phone) {
            alert("Hãy điền đầy đủ thông tin cá nhân");
            return;
        }
        const phoneRegex = /^0\d{9}$/;
        if (!phoneRegex.test(phone)) {
            alert("Số điện thoại phải có 10 số và bắt đầu bằng 0");
            return;
        }

        // --- Bắt đầu gọi API ---
        try {
            // Gửi state 'personalProfile' (ví dụ: { fullName, email, phone })
            const res = await client.patch(`/api/employer/${email}`, personalProfile);
            
            // Cập nhật lại header (sau khi API thành công)
            setProfileInfo((prev) => ({
                ...prev,
                ceoName: res.data.data.name || prev.ceoName, // Lấy tên đã cập nhật
                companyEmail: res.data.data.email // Lấy email đã cập nhật
            }));
            
            alert(res.data.message || "Lưu thông tin cá nhân thành công!");
            onProfileUpdate(res.data.data.name);
        } catch (error) {
            console.error("Lỗi lưu thông tin cá nhân:", error);
            alert(error.response?.data?.message || "Lưu thông tin thất bại.");
        }
        return;
    }

    // ===== XỬ LÝ LƯU THÔNG TIN CÔNG TY =====
    if (type === "company") {
        
        // --- Bắt đầu gọi API ---
        try {
            // Gửi state 'companyProfile' (ví dụ: { companyName, address, website })
            const res = await client.patch(`/api/employer/${email}`, companyProfile);

            // Cập nhật header (sau khi API thành công)
            setProfileInfo((prev) => ({
                ...prev,
                companyName: res.data.data.company, // Lấy tên công ty đã cập nhật
            }));

            alert(res.data.message || "Lưu thông tin công ty thành công!");
            onProfileUpdate(res.data.data.company);
        } catch (error) {
            console.error("Lỗi lưu thông tin công ty:", error);
            alert(error.response?.data?.message || "Lưu thông tin thất bại.");
        }
        return;
    }

    if (type === "security") {
        console.log("Đã lưu thông tin", securityForm);
        alert("Lưu thay đổi bảo mật thành công! (Chưa kết nối API)");
    } else if (type === "subscription") {
        console.log("Đã lưu thông tin", subscriptionForm);
        alert("Cập nhật gói thành công! (Chưa kết nối API)");
    }
};


  return (
    <div className="employer-profile-container">
      {/* ===== Profile Header ===== */}
      <div className="profile-header">
        {profileInfo.profilePic ? (
          <img 
            src={profileInfo.profilePic} 
            alt="Profile" 
            className="profile-picture" 
          />
        ) : (
          /* Nếu không, hiển thị Avatar chữ cái */
          <div className="avatar-placeholder">
            <span>{getInitials(profileInfo.ceoName)}</span>
          </div>
        )}
        <div className="profile-details">
          <h2>{profileInfo.companyName}</h2>
          <p><strong>CEO:</strong> {profileInfo.ceoName}</p>
          <p><strong>Năm thành lập:</strong> {profileInfo.foundationYear}</p>
          <p><strong>Email:</strong> {profileInfo.companyEmail}</p>
        </div>
      </div>

      {/* ===== Tabs ===== */}
      <div className="profile-tabs">
        <div className={`profile-tab ${activeTab === "account" ? "active" : ""}`} onClick={() => setActiveTab("account")}>
          Tài khoản
        </div>
        <div className={`profile-tab ${activeTab === "security" ? "active" : ""}`} onClick={() => setActiveTab("security")}>
          Bảo mật
        </div>
        <div className={`profile-tab ${activeTab === "subscription" ? "active" : ""}`} onClick={() => setActiveTab("subscription")}>
          Gia hạn & Trả phí
        </div>
        <div className={`profile-tab ${activeTab === "password" ? "active" : ""}`} onClick={() => setActiveTab("password")}>
          Đổi mật khẩu
        </div>
      </div>

      {/* ===== Tab Contents ===== */}

      {/* Account Tab */}
      <div className={`tab-content ${activeTab === "account" ? "active" : ""}`}>
        <h3>Thay đổi hồ sơ cá nhân</h3>
        <form className="profile-form" onSubmit={(e) => handleSubmit(e, "personal")}>
          <div className="form-group">
            <label>Họ tên</label>
            <input
              name="fullName"
              value={personalProfile.fullName}
              onChange={(e) => handleChange(e, "personal")}
              placeholder="Nhập họ tên đi bạn ơi"
            />
          </div>
          <div className="form-group">
            <label>Email</label>
            <input
              name="email"
              type="email"
              value={personalProfile.email}
              onChange={(e) => handleChange(e, "personal")}
              placeholder="banlaai@example.com"
            />
          </div>
          <div className="form-group">
            <label>Số điện thoại</label>
            <input
              name="phone"
              type="tel"
              value={personalProfile.phone}
              onChange={(e) => handleChange(e, "personal")}
              placeholder="0123456789"
            />
          </div>
          <div className="form-actions">
            <button className="btn-submit" type="submit">Lưu thông tin cá nhân</button>
          </div>
        </form>

        <h3>Thay đổi hồ sơ công ty</h3>
        <form className="profile-form" onSubmit={(e) => handleSubmit(e, "company")}>
          <div className="form-group">
            <label>Tên công ty</label>
            <input
              name="companyName"
              value={companyProfile.companyName}
              onChange={(e) => handleChange(e, "company")}
              placeholder="Nhập tên công ty"
            />
          </div>
          <div className="form-group">
            <label>Địa chỉ</label>
            <input
              name="address"
              value={companyProfile.address}
              onChange={(e) => handleChange(e, "company")}
              placeholder="Nhập địa chỉ công ty"
            />
          </div>
          <div className="form-group">
            <label>Website</label>
            <input
              name="website"
              value={companyProfile.website}
              onChange={(e) => handleChange(e, "company")}
              placeholder="https://cdh.com"
            />
          </div>
          <div className="form-actions">
            <button className="btn-submit" type="submit">Lưu thông tin công ty</button>
          </div>
        </form>
      </div>

      {/* Security Tab */}
      <div className={`tab-content ${activeTab === "security" ? "active" : ""}`}>
        <form onSubmit={(e) => handleSubmit(e, "security")} className="profile-form">
          <label>
            <input
              type="checkbox"
              name="twoFactorAuth"
              checked={securityForm.twoFactorAuth}
              onChange={(e) => handleChange(e, "security")}
            /> Bật bảo mật 2 lớp (Bảo mật làm sao thì chưa code)
          </label>
          <label>
            <input
              type="checkbox"
              name="loginAlerts"
              checked={securityForm.loginAlerts}
              onChange={(e) => handleChange(e, "security")}
            /> Nhận thông báo đăng nhập từ thiết bị lạ (làm sao thì chưa code)
          </label>
          <div className="form-actions">
            <button className="btn-submit" type="submit">Lưu thay đổi</button>
          </div>
        </form>
      </div>

        {/* Subscription Tab */}
        <div className={`tab-content ${activeTab === "subscription" ? "active" : ""}`}>
        <form onSubmit={(e) => handleSubmit(e, "subscription")} className="profile-form">
            <div className="form-group">
            <label>Plan</label>
            <select
                name="plan"
                value={subscriptionForm.plan}
                onChange={(e) => handleChange(e, "subscription")}
            >
                <option value="Basic">Gói thường</option>
                <option value="Pro">Gói pro</option>
                <option value="Enterprise">Gói doanh nghiệp</option>
            </select>
            </div>
            <div className="form-group">
            <label>Ngày làm mới</label>
            <input
                type="date"
                name="renewalDate"
                value={subscriptionForm.renewalDate}
                onChange={(e) => handleChange(e, "subscription")}
            />
            </div>
            <div className="form-actions">
            <button className="btn-submit" type="submit">Cập nhật gói</button>
            </div>
        </form>
        </div>

      {/* Password Tab */}
      <div className={`tab-content ${activeTab === "password" ? "active" : ""}`}>
        <form className="profile-form" onSubmit={(e) => handleSubmit(e, "password")}>
          
          {/* 1. Mật khẩu cũ */}
          <div className="form-group">
            <label>Mật khẩu cũ</label>
            <div className="input-wrap"> {/* <-- Bọc bằng div */}
              <input
                type={showCurrent ? "text" : "password"}
                name="currentPassword"
                value={passwordForm.currentPassword}
                onChange={(e) => handleChange(e, "password")}
                placeholder="Nhập mật khẩu cũ"
              />
              <FontAwesomeIcon   /* <-- Thêm Icon */
                icon={showCurrent ? faEyeSlash : faEye}
                className="icon-right"
                onClick={() => setShowCurrent(s => !s)}
              />
            </div>
          </div>
          
          {/* 2. Mật khẩu mới */}
          <div className="form-group">
            <label>Mật khẩu mới</label>
            <div className="input-wrap"> {/* <-- Bọc bằng div */}
              <input
                type={showNew ? "text" : "password"}
                name="newPassword"
                value={passwordForm.newPassword}
                onChange={(e) => handleChange(e, "password")}
                placeholder="Nhập mật khẩu mới"
              />
              <FontAwesomeIcon   /* <-- Thêm Icon */
                icon={showNew ? faEyeSlash : faEye}
                className="icon-right"
                onClick={() => setShowNew(s => !s)}
              />
            </div>
          </div>
          
          {/* 3. Xác nhận mật khẩu */}
          <div className="form-group">
            <label>Xác nhận mật khẩu</label>
            <div className="input-wrap"> {/* <-- Bọc bằng div */}
              <input
                type={showConfirm ? "text" : "password"}
                name="confirmPassword"
                value={passwordForm.confirmPassword}
                onChange={(e) => handleChange(e, "password")}
                placeholder="Confirm mật khẩu mới"
              />
              <FontAwesomeIcon   /* <-- Thêm Icon */
                icon={showConfirm ? faEyeSlash : faEye}
                className="icon-right"
                onClick={() => setShowConfirm(s => !s)}
              />
            </div>
          </div>
          
          <div className="form-actions">
            <button type="submit" className="btn-submit">Đổi mật khẩu</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EmployerProfile;
