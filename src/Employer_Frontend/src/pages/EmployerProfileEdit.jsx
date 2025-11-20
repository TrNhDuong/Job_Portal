// frontend/src/pages/EmployerProfileEdit.jsx
import React, { useState } from 'react';
import '../styles/employerProfileEdit.css';
import { FaSave, FaTimes, FaLink, FaUpload } from 'react-icons/fa';

const EmployerProfileEdit = ({ initialData, onSave, onCancel }) => {
    // Khởi tạo state form từ initialData
    const [form, setForm] = useState({
        company: initialData.companyName || '',
        description: initialData.description || '', // Dùng tagline làm description tạm thời
        website: initialData.website || '',
        address: initialData.address || '',
        // Wallpaper và Logo
        wallpaperUrl: initialData.wallpaper || '',
        logoUrl: initialData.logo || '',
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
                address: form.address
            };
            onSave(dataToSubmit);
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
                            <label>Mô tả (Description)</label>
                            <textarea name="description" value={form.description} onChange={handleChange} rows="4" />
                        </div>
                        
                        {/* Website và Info Blocks */}
                        <div className="form-group">
                            <label>Website Công ty</label>
                            <input name="website" value={form.website} onChange={handleChange} placeholder="https://" />
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