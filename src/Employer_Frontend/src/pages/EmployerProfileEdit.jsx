// frontend/src/pages/EmployerProfileEdit.jsx
import React, { useState } from 'react';
import '../styles/employerProfileEdit.css';
import { FaSave, FaTimes, FaLink, FaUpload } from 'react-icons/fa';

const EmployerProfileEdit = ({ initialData, onSave, onCancel }) => {
    // Khởi tạo state form từ initialData
    const [form, setForm] = useState({
        company: initialData.companyName || '',
        tagline: initialData.tagline || '',
        description: initialData.tagline || '', // Dùng tagline làm description tạm thời
        website: initialData.info?.website || '',
        // Account Info
        email: initialData.email || '',
        currentPassword: '',
        newPassword: '',
        confirmNewPassword: '',
        // Wallpaper và Logo
        wallpaperUrl: initialData.wallpaper?.url || '',
        logoUrl: initialData.logo?.url || '',
        // Các trường info blocks: industry, employees, founded...
        industry: initialData.info?.industry || '',
        employees: initialData.info?.employees || '',
        founded: initialData.info?.founded || '',
    });

    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
        setErrors(prev => ({ ...prev, [name]: '' }));
    };

    const validate = () => {
        const newErrors = {};
        // Logic validation đơn giản: kiểm tra tên công ty
        if (!form.company.trim()) newErrors.company = "Tên công ty không được để trống.";
        if (form.newPassword && form.newPassword !== form.confirmNewPassword) {
            newErrors.confirmNewPassword = "Mật khẩu mới không khớp.";
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (validate()) {
            // Chuẩn bị dữ liệu gửi đi (chỉ gửi các trường đã thay đổi)
            const dataToSubmit = {
                company: form.company,
                description: form.description, // Gửi description (tagline)
                website: form.website,
                // Gửi thông tin để cập nhật mật khẩu nếu có
                currentPassword: form.currentPassword,
                newPassword: form.newPassword,
                // ... (Thêm các trường khác)
            };
            
            // Xử lý API ở đây hoặc gọi prop onSave
            // onSave(dataToSubmit); 
            onCancel(); // Tạm thời đóng form sau khi lưu
            alert("Đã gửi dữ liệu cập nhật. Vui lòng kiểm tra Console.");
        }
    };

    return (
        <div className="profile-edit-container">
            <h1 className="edit-title">Chỉnh sửa Hồ sơ Công ty & Tài khoản</h1>
            <form onSubmit={handleSubmit} className="edit-form">
                
                <div className="form-main-content">
                    {/* --- Cột Trái: Hồ sơ Công ty (Profile Details) --- */}
                    <div className="form-column">
                        <h2>Thông tin Hồ sơ</h2>
                        
                        {/* Tên Công ty */}
                        <div className="form-group">
                            <label>Tên Công ty (*)</label>
                            <input name="company" value={form.company} onChange={handleChange} className={errors.company ? 'error' : ''} />
                            {errors.company && <p className="error-text">{errors.company}</p>}
                        </div>

                        {/* Logo và Wallpaper (Chỉ hiển thị URL/Placeholder) */}
                        <div className="form-group upload-group">
                            <label>Logo Công ty</label>
                            <button type="button" className="btn-upload"><FaUpload /> Tải lên Logo</button>
                            {form.logoUrl && <img src={form.logoUrl} alt="Logo Preview" className="logo-preview" />}
                        </div>
                        
                        <div className="form-group upload-group">
                            <label>Ảnh nền (Wallpaper)</label>
                            <button type="button" className="btn-upload"><FaUpload /> Tải lên Wallpaper</button>
                            {form.wallpaperUrl && <div className="wallpaper-preview" style={{ backgroundImage: `url(${form.wallpaperUrl})` }}></div>}
                        </div>

                        {/* Mô tả/Overview */}
                        <div className="form-group">
                            <label>Giới thiệu ngắn (Tagline/Mô tả)</label>
                            <textarea name="description" value={form.description} onChange={handleChange} rows="4" />
                        </div>
                        
                        {/* Website và Info Blocks */}
                        <div className="form-group">
                            <label>Website Công ty</label>
                            <input name="website" value={form.website} onChange={handleChange} placeholder="https://" />
                        </div>
                        
                        <div className="form-group-inline">
                            <div className="form-group">
                                <label>Ngành nghề</label>
                                <input name="industry" value={form.industry} onChange={handleChange} />
                            </div>
                            <div className="form-group">
                                <label>Quy mô (Employees)</label>
                                <input name="employees" value={form.employees} onChange={handleChange} />
                            </div>
                        </div>
                    </div>

                    {/* --- Cột Phải: Thông tin Tài khoản (Account Security) --- */}
                    <div className="form-column">
                        <h2>Cài đặt Tài khoản</h2>
                        
                        {/* Email (Thường là không đổi hoặc phải qua quy trình riêng) */}
                        <div className="form-group">
                            <label>Email (Không thể thay đổi)</label>
                            <input name="email" value={form.email} readOnly disabled />
                        </div>

                        <div className="form-group-password-section">
                            <h3>Đổi Mật khẩu</h3>
                            
                            <div className="form-group">
                                <label>Mật khẩu Hiện tại (*)</label>
                                <input type="password" name="currentPassword" value={form.currentPassword} onChange={handleChange} className={errors.currentPassword ? 'error' : ''} />
                                {errors.currentPassword && <p className="error-text">{errors.currentPassword}</p>}
                            </div>
                            
                            <div className="form-group">
                                <label>Mật khẩu Mới</label>
                                <input type="password" name="newPassword" value={form.newPassword} onChange={handleChange} />
                            </div>
                            
                            <div className="form-group">
                                <label>Xác nhận Mật khẩu Mới</label>
                                <input type="password" name="confirmNewPassword" value={form.confirmNewPassword} onChange={handleChange} className={errors.confirmNewPassword ? 'error' : ''} />
                                {errors.confirmNewPassword && <p className="error-text">{errors.confirmNewPassword}</p>}
                            </div>
                        </div>
                    </div>
                </div>

                {/* --- Action Buttons --- */}
                <div className="form-actions-sticky">
                    <button type="button" className="btn-cancel" onClick={onCancel}><FaTimes /> Hủy bỏ</button>
                    <button type="submit" className="btn-save"><FaSave /> Lưu thay đổi</button>
                </div>

            </form>
        </div>
    );
};

export default EmployerProfileEdit;