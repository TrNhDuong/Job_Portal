import React, { useState } from "react";
import "./employerProfile.css";

const EmployerProfile = () => {
  const [activeTab, setActiveTab] = useState("account");

  // ===== Profile info =====
  const [profileInfo, setProfileInfo] = useState({
    profilePic: "",
    ceoName: "Văn Phú Hiệu",
    companyName: "Xê Đi Hát",
    foundationYear: 2025,
    companyEmail: "vphieu@fit.hcmus.edu.vn",
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
  const handleSubmit = (e, type) => {
    e.preventDefault();

    if (type === "password") {
      const { currentPassword, newPassword, confirmPassword } = passwordForm;
      const errors = validatePassword(currentPassword, newPassword, confirmPassword);

      if (errors.length > 0) {
        alert(errors.join("\n"));
        return;
      }

      console.log("✅ Password changed successfully:", passwordForm);
      alert("Đổi mật khẩu thành công!");
      setPasswordForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      return;
    }

    if (type === "personal") {
      const { fullName, email, phone } = personalProfile;

      if (!fullName || !email || !phone) {
        alert("Hãy điền đầy đủ thông tin cá nhân");
        return;
      }

      const phoneRegex = /^0\d{9}$/;
      if (!phoneRegex.test(phone)) {
        alert("Số điện thoại phải có 10 số và bắt đầu bằng 0");
        return;
      }

      // Update profile info header name too
      setProfileInfo((prev) => ({
        ...prev,
        ceoName: fullName || prev.ceoName,
      }));

      console.log("Lưu thông tin cá nhân:", personalProfile);
      alert("Lưu thông tin cá nhân thành công!");
      return;
    }

    if (type === "company") {
      const { companyName } = companyProfile;

      // ✅ Update displayed company name on header too
      if (companyName) {
        setProfileInfo((prev) => ({
          ...prev,
          companyName: companyName,
        }));
      }

      console.log("Đã lưu thông tin công ty:", companyProfile);
      alert("Lưu thông tin công ty thành công!");
      return;
    }

    if (type === "security") {
      console.log("Đã lưu thông tin", securityForm);
    } else if (type === "subscription") {
      console.log("Đã lưu thông tin", subscriptionForm);
    }
  };


  return (
    <div className="employer-profile-container">
      {/* ===== Profile Header ===== */}
      <div className="profile-header">
        <img src={profileInfo.profilePic} alt="Profile" className="profile-picture" />
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
            <button className="btn-submit" type="submit">Save Security</button>
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
            <button className="btn-submit" type="submit">Update Subscription</button>
            </div>
        </form>
        </div>

      {/* Password Tab */}
      <div className={`tab-content ${activeTab === "password" ? "active" : ""}`}>
        <form className="profile-form" onSubmit={(e) => handleSubmit(e, "password")}>
          <div className="form-group">
            <label>Mật khẩu cũ</label>
            <input
              type="password"
              name="currentPassword"
              value={passwordForm.currentPassword}
              onChange={(e) => handleChange(e, "password")}
              placeholder="Nhập mật khẩu cũ"
            />
          </div>
          <div className="form-group">
            <label>Mật khẩu mới</label>
            <input
              type="password"
              name="newPassword"
              value={passwordForm.newPassword}
              onChange={(e) => handleChange(e, "password")}
              placeholder="Nhập mật khẩu mới"
            />
          </div>
          <div className="form-group">
            <label>Confirm mật khẩu mới</label>
            <input
              type="password"
              name="confirmPassword"
              value={passwordForm.confirmPassword}
              onChange={(e) => handleChange(e, "password")}
              placeholder="Confirm mật khẩu mới"
            />
          </div>
          <div className="form-actions">
            <button type="submit" className="btn-submit">Change Password</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EmployerProfile;
