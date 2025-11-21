import React, { useState, useContext } from 'react';
import '../styles/Setting.css';
import { FaUser, FaBell, FaSave, FaTimes } from 'react-icons/fa';
import { AuthContext } from '../context/AuthContext'; // Giả định AuthContext đã được import

const accountInitialState = {
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: '',
};

const Setting = ({ isVisible, onClose }) => {
    // 💡 GIẢ ĐỊNH: Lấy thông tin user (email) từ AuthContext
    const { auth, logout } = useContext(AuthContext);
    const userEmail = auth.user?.email || 'employer@example.com'; 

    const [activeSection, setActiveSection] = useState('account');
    const [accountForm, setAccountForm] = useState(accountInitialState);
    const [errors, setErrors] = useState({});

    if (!isVisible) return null;

    const handleChange = (e) => {
        const { name, value } = e.target;
        setAccountForm(prev => ({ ...prev, [name]: value }));
        setErrors(prev => ({ ...prev, [name]: '' }));
    };

    const handlePasswordChange = (e) => {
        e.preventDefault();
        const newErrors = {};

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

        // 💡 LOGIC GỌI API ĐỔI MẬT KHẨU SẼ Ở ĐÂY
        console.log("Đổi mật khẩu thành công (Mô phỏng):", accountForm.newPassword);
        alert('Đổi mật khẩu thành công (Mô phỏng)!');
        setAccountForm(accountInitialState);
        onClose();
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
                    
                    <div className="form-group">
                        <label>Mật khẩu Hiện tại</label>
                        <input 
                            type="password" 
                            name="currentPassword" 
                            value={accountForm.currentPassword}
                            onChange={handleChange}
                            className={errors.currentPassword ? 'error' : ''}
                        />
                        {errors.currentPassword && <p className="error-text">{errors.currentPassword}</p>}
                    </div>

                    <div className="form-group">
                        <label>Mật khẩu Mới</label>
                        <input 
                            type="password" 
                            name="newPassword" 
                            value={accountForm.newPassword}
                            onChange={handleChange}
                            className={errors.newPassword ? 'error' : ''}
                        />
                        {errors.newPassword && <p className="error-text">{errors.newPassword}</p>}
                    </div>

                    <div className="form-group">
                        <label>Nhập lại Mật khẩu Mới</label>
                        <input 
                            type="password" 
                            name="confirmNewPassword" 
                            value={accountForm.confirmNewPassword}
                            onChange={handleChange}
                            className={errors.confirmNewPassword ? 'error' : ''}
                        />
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
                            <FaUser /> Tài khoản
                        </div>
                        <div 
                            className={`sidebar-item ${activeSection === 'notification' ? 'active' : ''}`}
                            onClick={() => setActiveSection('notification')}
                        >
                            <FaBell /> Thông báo
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