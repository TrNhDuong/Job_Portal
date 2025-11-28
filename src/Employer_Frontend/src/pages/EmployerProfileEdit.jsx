// frontend/src/pages/EmployerProfileEdit.jsx
import React, { useState, useRef, useEffect } from 'react';
import '../styles/employerProfileEdit.css';
import { FaSave, FaTimes, FaUpload } from 'react-icons/fa';
import monoLogo from "../assets/mono-logo.png";

const EmployerProfileEdit = ({ initialData, onSave, onCancel, onChangeLogo }) => {
    // Khởi tạo state form từ initialData
    const [form, setForm] = useState({
        company: initialData.company || '',
        description: initialData.description || '', // Dùng tagline làm description tạm thời
        website: initialData.website || '',
        address: initialData.address || '',
        wallpaperUrl: initialData.wallpaper || '',
        logoUrl: initialData.logo?.url || monoLogo,
    });

    const [errors, setErrors] = useState({});
    const inputFile = useRef(null);
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

    useEffect(() => {
        setForm(prev => ({
            ...prev,
            logoUrl: initialData.logo?.url || monoLogo
        }));
    }, [initialData.logo]);

    const handleChangePhoto = () => {
        inputFile.current.click();
    }

    const handleFileSelect = (e) => {
        const file = e.target.files[0];
        if (file) {
            onChangeLogo(file);
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

                        <div className="form-group upload-group">
                            <label>Logo Công ty</label>
                            <div className="profile-card-container">
                                <div className="profile-card">
                                    <div className="profile-info-group">
                                        {/* <div class="profile-photo-area"> */}
                                            {/* <img src={form.logoUrl} alt="User Avatar" className="user-avatar" /> */}
                                        {/* </div> */}
                                        <img src={form.logoUrl} alt="User Avatar" className="user-avatar" />
                                        
                                        <div className="profile-text">
                                            <div className="username">{form.company}</div>
                                            {/* <div class="full-name">Trần Nhật Dương</div> */}
                                        </div>
                                    </div>
                                    
                                    <button type="button" className="btn-change-photo" onClick={handleChangePhoto}>Change photo</button>
                                    <input
                                        type="file"
                                        ref={inputFile}
                                        accept="image/*"
                                        style={{ display: 'none' }}
                                        onChange={handleFileSelect}
                                    />
                                </div>
                            </div>
                        </div>
                        
                        {/* Tên Công ty */}
                        <div className="form-group">
                            <label>Tên công ty</label>
                            <input name="company" value={form.company} onChange={handleChange} placeholder={form.company} />
                        </div>

                        {/* Website và Info Blocks */}
                        <div className="form-group">
                            <label>Website Công ty</label>
                            <input name="website" value={form.website} onChange={handleChange} placeholder={form.website} />
                        </div>

                        {/* Website và Info Blocks */}
                        <div className="form-group">
                            <label>Dia chi</label>
                            <input name="address" value={form.address} onChange={handleChange} placeholder={form.address} />
                        </div>

                        <div className="form-group">
                            <label>Mô tả (Description)</label>
                            <textarea name="description" value={form.description} onChange={handleChange} rows="4" />
                        </div>
                        
                        
                        
                    </div>

                </div>


                <div className="form-actions-sticky">
                    <button type="button" className="btn-cancel" onClick={onCancel}><FaTimes /> Hủy bỏ</button>
                    <button type="submit" className="btn-save"><FaSave /> Lưu thay đổi</button>
                </div>

            </form>
        </div>
    );
};

export default EmployerProfileEdit;