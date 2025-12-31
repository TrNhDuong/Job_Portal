import React, { useState, useContext } from 'react';
import '../styles/Setting.css';
import { FaUser, FaBell, FaSave, FaTimes } from 'react-icons/fa';
import profileIcon from '../assets/icon/profile.png'; // Giữ lại nếu cần, mặc dù đang dùng securityIcon
import { HiEye, HiEyeOff } from "react-icons/hi";
import securityIcon from '../assets/icon/security.png';
import bellIcon from '../assets/icon/bell.png';
import client from '../api/client';
import { AuthContext } from "../context/AuthContext.jsx"; 
import toast, { Toaster } from 'react-hot-toast';

// Khởi tạo state: ĐÃ THÊM currentPassword
const accountInitialState = {
    currentPassword: '', // <--- ĐÃ THÊM TRƯỜNG NÀY
    newPassword: '',
    confirmNewPassword: '',
};

const Setting = ({ isVisible, onClose }) => {
    // 💡 Lấy thông tin user từ AuthContext
    const auth = useContext(AuthContext);
    // SỬ DỤNG EMAIL THỰC TẾ
    const userEmail = auth.auth.employerData?.data?.email || 'employer@example.com'; 

    const [activeSection, setActiveSection] = useState('account');
    const [accountForm, setAccountForm] = useState(accountInitialState);
    const [errors, setErrors] = useState({});

    const [showPassword, setShowPassword] = useState({
        current: false,
        new: false,
        confirm: false
    });

    if (!isVisible) return null;

    const handleChange = (e) => {
        const { name, value } = e.target;
        setAccountForm(prev => ({ ...prev, [name]: value }));
        setErrors(prev => ({ ...prev, [name]: '' }));
    };

    const toggleShow = (field) => {
        setShowPassword(prev => ({ ...prev, [field]: !prev[field] }));
    };

    const handlePasswordChange = async (e) => {
        e.preventDefault();
        const newErrors = {};

        // 1. Validation cơ bản
        if (!accountForm.currentPassword) {
            newErrors.currentPassword = 'Vui lòng nhập mật khẩu hiện tại.';
        }
        if (accountForm.newPassword.length < 6) {
            newErrors.newPassword = 'Mật khẩu mới phải có ít nhất 6 ký tự.';
        }
        if (accountForm.newPassword !== accountForm.confirmNewPassword) {
            newErrors.confirmNewPassword = 'Xác nhận mật khẩu không khớp.';
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        try {
            // 2. Đảm bảo sử dụng email và currentPassword/newPassword từ state
            const data = {
                email: userEmail, // <-- SỬ DỤNG BIẾN EMAIL THỰC TẾ
                password: accountForm.currentPassword, // <-- SỬ DỤNG currentPassword
                newpassword: accountForm.newPassword
            }
            console.log("Dữ liệu gửi lên API:", data); // Kiểm tra lại dữ liệu
            
            // 3. Gửi request
            const response = await client.post(`/api/password/employer`, data);

            if (response.data.success){
                toast.success('Cập nhật mật khẩu thành công');
            } else {
                // Xử lý lỗi từ server (ví dụ: mật khẩu cũ không đúng)
                toast.error(response.data.message || 'Đã có lỗi xảy ra khi cập nhật mật khẩu');
            }
            setAccountForm(accountInitialState);
            onClose();
        } catch (err) {
            toast.error('Lỗi kết nối hoặc server. Vui lòng thử lại.');
            console.error("Lỗi đổi mật khẩu:", err);
            return;
        }
    };
    
    // --- Render Sections ---

    const renderAccountSettings = () => (
        <div className="settings-content-main">
            <h3>Thông tin Tài khoản</h3>
            <div className="form-group-static">
                <label>Email</label>
                <input type="text" value={userEmail} readOnly disabled />
            </div>

            <div className="password-change-box">
                <h4>Đổi Mật khẩu</h4>
                <form onSubmit={handlePasswordChange}>
                    
                    {/* Input Mật khẩu Hiện tại: Đảm bảo name="currentPassword" và value={accountForm.currentPassword} */}
                    <div className="form-group">
                        <label>Mật khẩu Hiện tại</label>
                        <div className="input-with-icon"> {/* Wrapper mới để chứa icon */}
                            <input 
                                type={showPassword.current ? "text" : "password"} // Toggle type
                                name="currentPassword" 
                                value={accountForm.currentPassword} 
                                onChange={handleChange}
                                className={errors.currentPassword ? 'error' : ''}
                                placeholder="Nhập mật khẩu cũ"
                            />
                            <div className="eye-icon-setting" onClick={() => toggleShow('current')}>
                                {showPassword.current ? <HiEyeOff /> : <HiEye />}
                            </div>
                        </div>
                        {errors.currentPassword && <p className="error-text">{errors.currentPassword}</p>}
                    </div>

                    {/* Input Mật khẩu Mới */}
                    <div className="form-group">
                        <label>Mật khẩu Mới</label>
                        <div className="input-with-icon">
                            <input 
                                type={showPassword.new ? "text" : "password"} 
                                name="newPassword" 
                                value={accountForm.newPassword}
                                onChange={handleChange}
                                className={errors.newPassword ? 'error' : ''}
                                placeholder="Nhập mật khẩu mới"
                            />
                            <div className="eye-icon-setting" onClick={() => toggleShow('new')}>
                                {showPassword.new ? <HiEyeOff /> : <HiEye />}
                            </div>
                        </div>
                        {errors.newPassword && <p className="error-text">{errors.newPassword}</p>}
                    </div>

                    {/* Input Nhập lại Mật khẩu Mới */}
                    <div className="form-group">
                        <label>Nhập lại Mật khẩu Mới</label>
                        <div className="input-with-icon">
                            <input 
                                type={showPassword.confirm ? "text" : "password"} 
                                name="confirmNewPassword" 
                                value={accountForm.confirmNewPassword}
                                onChange={handleChange}
                                className={errors.confirmNewPassword ? 'error' : ''}
                                placeholder="Xác nhận mật khẩu mới"
                            />
                            <div className="eye-icon-setting" onClick={() => toggleShow('confirm')}>
                                {showPassword.confirm ? <HiEyeOff /> : <HiEye />}
                            </div>
                        </div>
                        {errors.confirmNewPassword && <p className="error-text">{errors.confirmNewPassword}</p>}
                    </div>
                    
                    <button type="submit" className="btn-save-password">
                        <FaSave /> Xác nhận Đổi mật khẩu
                    </button>
                </form>
            </div>
            

        </div>
    );

    const renderNotificationSettings = () => (
        <div className="settings-content-main">
            <h3>Cài đặt Thông báo</h3>
            <div className="setting-toggle-item">
                <label>Nhận thông báo về CV mới</label>
                <input type="checkbox" defaultChecked />
            </div>
            <div className="setting-toggle-item">
                <label>Email thông báo hàng tuần</label>
                <input type="checkbox" />
            </div>
            <button className="btn-save-changes">
                <FaSave /> Lưu thay đổi
            </button>
        </div>
    );

    return (
        <div className="settings-modal-overlay">
            <div className="settings-modal-card">
                <div className="settings-header">
                    <h2>Settings</h2>
                    <button className="close-btn" onClick={onClose}><FaTimes size={24} /></button>
                </div>

                <div className="settings-body">
                    {/* Sidebar */}
                    <div className="settings-sidebar">
                        <div 
                            className={`sidebar-item ${activeSection === 'account' ? 'active' : ''}`}
                            onClick={() => setActiveSection('account')}
                        >
                            <img src={securityIcon} alt="Bảo mật" className="icon-img" /> Bảo mật
                        </div>
                        <div 
                            className={`sidebar-item ${activeSection === 'notification' ? 'active' : ''}`}
                            onClick={() => setActiveSection('notification')}
                        >
                            <img src={bellIcon} alt="Thông báo" className="icon-img" /> Thông báo
                        </div>
                    </div>

                    {/* Nội dung chính */}
                    <div className="settings-content">
                        {activeSection === 'account' && renderAccountSettings()}
                        {activeSection === 'notification' && renderNotificationSettings()}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Setting;