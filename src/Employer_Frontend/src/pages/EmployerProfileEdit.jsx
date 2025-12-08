// frontend/src/pages/EmployerProfileEdit.jsx
import React, { useState, useRef, useEffect } from 'react';
import '../styles/employerProfileEdit.css';
import { FaSave, FaTimes, FaCamera, FaGlobe, FaMapMarkerAlt, FaImage } from 'react-icons/fa';
import monoLogo from "../assets/mono-logo.png";

// Import Editor
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';

const EmployerProfileEdit = ({ initialData, onSave, onCancel, onChangeLogo, onChangeWallpaper }) => {
    // Khởi tạo state
    const [form, setForm] = useState({
        company: initialData.company || '',
        website: initialData.website || '',
        address: initialData.address || '',
        scale: initialData.scale || '10-24 nhân viên', // Default value
        description: initialData.description || '',
        logoUrl: initialData.logo?.url || monoLogo,
        wallpaperUrl: initialData.wallpaper?.url || 'https://via.placeholder.com/1200x300'
    });

    const [errors, setErrors] = useState({});
    const logoInputRef = useRef(null);
    const wallpaperInputRef = useRef(null);


    // Cấu hình Editor (Giống bên PostJob nhưng đơn giản hơn xíu)
    const quillModules = {
        toolbar: [
            [{ 'header': [3, 4, false] }],
            ['bold', 'italic', 'underline'],
            [{'list': 'ordered'}, {'list': 'bullet'}],
            ['clean']
        ]
    };

    // Handle Input thường
    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
        // Xóa lỗi khi gõ
        if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
    };

    // Handle Editor riêng
    const handleDescriptionChange = (content) => {
        setForm(prev => ({ ...prev, description: content }));
    };

    // Xử lý chọn ảnh
    const handleLogoClick = () => logoInputRef.current.click();
    
    const handleLogoSelect = (e) => {
        const file = e.target.files[0];
        if (file) {
            // Tạo URL tạm để preview ngay lập tức
            const previewUrl = URL.createObjectURL(file);
            setForm(prev => ({ ...prev, logoUrl: previewUrl }));
            onChangeLogo(file);
        }
    };

    const handleWallpaperClick = () => wallpaperInputRef.current.click();

    const handleWallpaperSelect = (e) => {
        const file = e.target.files[0];
        if (file) {
            // Tạo preview
            const previewUrl = URL.createObjectURL(file);
            setForm(prev => ({ ...prev, wallpaperUrl: previewUrl }));
            // Gọi hàm callback truyền lên cha để upload (nếu cần upload ngay)
            if (onChangeWallpaper) {
                onChangeWallpaper(file);
            }
        }
    };

    const validate = () => {
        const newErrors = {};
        if (!form.company.trim()) newErrors.company = "Tên công ty không được để trống.";
        if (!form.address.trim()) newErrors.address = "Địa chỉ không được để trống.";
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (validate()) {
            // Chuẩn bị data gửi đi (Giữ nguyên logic API cũ)
            const dataToSubmit = {
                company: form.company,
                description: form.description, 
                website: form.website,
                address: form.address,
                scale: form.scale // Thêm trường quy mô
            };
            onSave(dataToSubmit);
        }
    };

    // Đồng bộ lại logo nếu API trả về url mới (sau khi upload xong)
    useEffect(() => {
        if (initialData.logo?.url) {
             setForm(prev => ({ ...prev, logoUrl: initialData.logo.url }));
        }
    }, [initialData.logo]);

    // Các tùy chọn quy mô
    const scaleOptions = [
        "Dưới 10 nhân viên",
        "10-24 nhân viên",
        "25-99 nhân viên",
        "100-499 nhân viên",
        "500-1000 nhân viên",
        "1000+ nhân viên"
    ];

    return (
        <div className="profile-edit-container">
            
            {/* Header Actions */}
            <div className="edit-header-actions">
                <h2 className="page-heading">Chỉnh sửa hồ sơ</h2>
                <div className="action-buttons">
                    <button type="button" className="btn-cancel" onClick={onCancel}>Hủy bỏ</button>
                    <button type="button" className="btn-save" onClick={handleSubmit}><FaSave /> Lưu thay đổi</button>
                </div>
            </div>

            <div className="edit-content-wrapper">
                
                {/* --- KHU VỰC ẢNH BÌA & LOGO (THIẾT KẾ MỚI) --- */}
                <div className="edit-visual-section">
                    {/* Ảnh bìa */}
                    <div className="edit-banner" style={{ backgroundImage: `url(${form.wallpaperUrl})` }}>
                        <div className="banner-overlay">
                            {/* Nút thay ảnh bìa */}
                            <button type="button" className="btn-change-banner" onClick={handleWallpaperClick}>
                                <FaImage /> Thay ảnh bìa
                            </button>
                            {/* Input ẩn cho wallpaper */}
                            <input type="file" ref={wallpaperInputRef} accept="image/*" hidden onChange={handleWallpaperSelect} />
                        </div>
                    </div>

                    {/* Logo (Đè lên banner) */}
                    <div className="edit-logo-wrapper">
                        <div className="edit-logo-circle" onClick={handleLogoClick}>
                            <img src={form.logoUrl} alt="Logo" />
                            <div className="logo-overlay">
                                <FaCamera />
                            </div>
                        </div>
                        {/* Input ẩn cho logo */}
                        <input type="file" ref={logoInputRef} accept="image/*" hidden onChange={handleLogoSelect} />
                    </div>
                </div>

                {/* --- KHU VỰC FORM NHẬP LIỆU --- */}
                <form className="edit-form-grid">
                    
                    {/* Cột trái: Thông tin cơ bản */}
                    <div className="edit-col-left">
                        <div className="edit-card">
                            <h3>Thông tin chung</h3>
                            
                            <div className="form-group">
                                <label>Tên công ty <span className="req">*</span></label>
                                <input 
                                    name="company" value={form.company} onChange={handleChange} 
                                    className={errors.company ? 'error' : ''} placeholder="Nhập tên công ty"
                                />
                                {errors.company && <span className="err-text">{errors.company}</span>}
                            </div>

                            <div className="form-group">
                                <label>Quy mô nhân sự</label>
                                <div className="select-wrapper">
                                    <select name="scale" value={form.scale} onChange={handleChange}>
                                        {scaleOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                                    </select>
                                </div>
                            </div>

                            <div className="form-group">
                                <label><FaMapMarkerAlt className="icon-label"/> Địa chỉ <span className="req">*</span></label>
                                <input name="address" value={form.address} onChange={handleChange} className={errors.address ? 'error' : ''}/>
                                {errors.address && <span className="err-text">{errors.address}</span>}
                            </div>

                            <div className="form-group">
                                <label><FaGlobe className="icon-label"/> Website</label>
                                <input name="website" value={form.website} onChange={handleChange} placeholder="https://..." />
                            </div>
                        </div>
                    </div>

                    {/* Cột phải: Editor */}
                    <div className="edit-col-right">
                        <div className="edit-card full-h">
                            <h3>Giới thiệu công ty</h3>
                            <div className="editor-box">
                                <ReactQuill 
                                    theme="snow"
                                    value={form.description}
                                    onChange={handleDescriptionChange}
                                    modules={quillModules}
                                    placeholder="Viết mô tả hấp dẫn về công ty..."
                                />
                            </div>
                        </div>
                    </div>

                </form>
            </div>
        </div>
    );
};

export default EmployerProfileEdit;