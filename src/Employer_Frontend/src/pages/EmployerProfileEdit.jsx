// frontend/src/pages/EmployerProfileEdit.jsx
import React, { useState, useRef, useEffect } from 'react';
import '../styles/employerProfileEdit.css';
import { FaSave, FaTimes, FaCamera, FaGlobe, FaMapMarkerAlt, FaImage } from 'react-icons/fa';
import toast from 'react-hot-toast';

// Import Editor
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';

// Ảnh bìa mặc định (Khớp với trang Profile)
const MOCK_BANNER = "https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?q=80&w=1920&auto=format&fit=crop";

const EmployerProfileEdit = ({ initialData, onSave, onCancel, onChangeLogo, onChangeWallpaper }) => {
    
    // Hàm lấy chữ cái đầu (VD: "Bát Quái" -> "BQ") - Copy logic từ Homepage/Profile qua
    const getInitials = (name) => {
        if (!name) return "CP";
        const parts = name.trim().split(" ");
        if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
        return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
    };

    // Khởi tạo state
    const [form, setForm] = useState({
        company: initialData.company || '',
        website: initialData.website || '',
        address: initialData.address || '',
        scale: initialData.scale || '10-24 nhân viên',
        description: initialData.description || '',
        
        // Logic mới: Nếu không có URL logo thì để rỗng để render placeholder
        logoUrl: initialData.logo?.url || "", 
        
        // Logic mới: Dùng ảnh MOCK đẹp nếu chưa có wallpaper
        wallpaperUrl: initialData.wallpaper?.url || MOCK_BANNER
    });

    const [errors, setErrors] = useState({});
    const logoInputRef = useRef(null);
    const wallpaperInputRef = useRef(null);

    // Cấu hình Editor
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
            const previewUrl = URL.createObjectURL(file);
            setForm(prev => ({ ...prev, logoUrl: previewUrl }));
            onChangeLogo(file);
        }
    };

    const handleWallpaperClick = () => wallpaperInputRef.current.click();

    const handleWallpaperSelect = (e) => {
        const file = e.target.files[0];
        if (file) {
            const previewUrl = URL.createObjectURL(file);
            setForm(prev => ({ ...prev, wallpaperUrl: previewUrl }));
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
            const dataToSubmit = {
                company: form.company,
                description: form.description, 
                website: form.website,
                address: form.address,
                scale: form.scale 
            };
            onSave(dataToSubmit);
        }
    };

    useEffect(() => {
        if (initialData.logo?.url) {
             setForm(prev => ({ ...prev, logoUrl: initialData.logo.url }));
        }
    }, [initialData.logo]);

    const scaleOptions = [
        "Dưới 10 nhân viên", "10-24 nhân viên", "25-99 nhân viên",
        "100-499 nhân viên", "500-1000 nhân viên", "1000+ nhân viên"
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
                
                {/* --- KHU VỰC ẢNH BÌA & LOGO --- */}
                <div className="edit-visual-section">
                    {/* Ảnh bìa */}
                    <div className="edit-banner" style={{ backgroundImage: `url(${form.wallpaperUrl})` }}>
                        <div className="banner-overlay">
                            <button type="button" className="btn-change-banner" onClick={handleWallpaperClick}>
                                <FaImage /> Thay ảnh bìa
                            </button>
                            <input type="file" ref={wallpaperInputRef} accept="image/*" hidden onChange={handleWallpaperSelect} />
                        </div>
                    </div>

                    {/* Logo (Đè lên banner) */}
                    <div className="edit-logo-wrapper">
                        <div className="edit-logo-circle" onClick={handleLogoClick}>
                            {/* LOGIC MỚI: Nếu có ảnh thì hiện ảnh, không thì hiện chữ cái */}
                            {form.logoUrl ? (
                                <img src={form.logoUrl} alt="Logo" />
                            ) : (
                                <div 
                                    className="avatar-placeholder-init" 
                                    style={{ 
                                        width: '100%', height: '100%', 
                                        fontSize: '3.5rem', borderRadius: '50%' 
                                    }}
                                >
                                    {getInitials(form.company)}
                                </div>
                            )}
                            
                            {/* Overlay icon Camera khi hover */}
                            <div className="logo-overlay">
                                <FaCamera />
                            </div>
                        </div>
                        <input type="file" ref={logoInputRef} accept="image/*" hidden onChange={handleLogoSelect} />
                    </div>
                </div>

                {/* --- KHU VỰC FORM --- */}
                <form className="edit-form-grid">
                    
                    {/* Cột trái */}
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

                    {/* Cột phải */}
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