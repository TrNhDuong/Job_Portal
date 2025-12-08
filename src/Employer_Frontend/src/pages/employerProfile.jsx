import React, { useState, useContext, useRef } from 'react';
import '../styles/employerProfile.css';
import { FaEdit, FaMapMarkerAlt, FaUsers, FaGlobe, FaPhone, FaEnvelope } from 'react-icons/fa';
import monoLogo from '../assets/mono-logo.png';
import EmployerProfileEdit from './EmployerProfileEdit';
import { AuthContext } from "../context/AuthContext.jsx";
import client from '../api/client';

// Cập nhật ảnh Mock đẹp hơn (ảnh văn phòng hiện đại)
const MOCK_BANNER = "https://images.unsplash.com/photo-1497215728101-856f4ea42174?q=80&w=1920&auto=format&fit=crop";

const EmployerProfile = () => {
    const [mode, setMode] = useState('view');
    const { auth, updateEmployerWithData, updateData } = useContext(AuthContext);
    const [loading, setLoading] = useState(false);

    const logo = auth.employerData?.data.logo?.url || monoLogo;
    const data = auth.employerData?.data || {};

    // Logic hiển thị ảnh bìa: Nếu chưa có trong DB thì dùng MOCK_BANNER mới
    const currentBanner = data.wallpaper.url || MOCK_BANNER;
    const companyScale = data.scale || "100-499 nhân viên";

    // --- MODE: EDIT ---
    if (mode === 'edit') {
        return (
            <EmployerProfileEdit 
                initialData={data} 
                onCancel={() => setMode('view')} 
                onSave={async (updatedData) => {
                    const result = await client.patch(`api/employer?email=${data.email}`, updatedData);
                    if (result.data.success) {
                        alert("Cập nhật hồ sơ thành công!");
                        await updateEmployerWithData(updatedData);
                        setMode('view');
                    } else {
                        alert("Cập nhật hồ sơ thất bại. Vui lòng thử lại.");
                    }
                }}
                onChangeLogo={async (logo) => {
                    const formData = new FormData();
                    formData.append('image', logo);
                    try {
                        setLoading(true);  
                        const email = localStorage.getItem("email");
                        const response = await client.post(`api/upload/logo/employer?email=${email}`, formData,
                            { headers: { 'Content-Type': 'multipart/form-data' } }
                        )
                        if (response.data.success){
                            await updateData();                            
                        }
                    } catch ( error ){
                        console.log(error)
                    } finally {
                        setLoading(false); 
                    }
                }}
                onChangeWallpaper={async (wallpaper) => {
                    const formData = new FormData();
                    formData.append('image', wallpaper);
                    try {
                        setLoading(true);  
                        const email = localStorage.getItem("email");
                        const response = await client.post(`api/upload/wallpaper?email=${email}`, formData,
                            { headers: { 'Content-Type': 'multipart/form-data' } }
                        )
                        if (response.data.success){
                            await updateData();                            
                        }
                    } catch ( error ){
                        console.log(error)
                    } finally {
                        setLoading(false); 
                    }
                }}
            />
        );
    }

    // --- MODE: VIEW ---
    return (
        <div className="profile-page-wrapper">
            {loading && (
                <div className="loading-overlay">
                    <div className="loading-spinner"></div>
                    <p>Đang xử lý...</p>
                </div>
            )}
            
            {/* --- SECTION 1: HEADER & BANNER --- */}
            <div className="profile-header-section">
                {/* Wallpaper mới được áp dụng tại đây */}
                <div className="banner-cover" style={{ backgroundImage: `url(${currentBanner})` }}>
                    <button className="btn-edit-cover" onClick={() => setMode('edit')}>
                        <FaEdit /> Chỉnh sửa hồ sơ
                    </button>
                </div>
                
                <div className="header-info-bar">
                    {/* Logo hình tròn */}
                    <div className="logo-container">
                        <img src={logo} alt="Company Logo" className="logo-img" />
                    </div>
                    
                    <div className="text-info">
                        <h1 className="company-title">{data.company || "Tên công ty chưa cập nhật"}</h1>
                    </div>
                </div>
            </div>

            {/* --- SECTION 2: CONTENT GRID --- */}
            <div className="profile-body-grid">
                
                {/* CỘT TRÁI: NỘI DUNG CHÍNH (GIỚI THIỆU) */}
                <div className="left-column">
                    <div className="content-card">
                        <h3 className="card-title">Giới thiệu</h3>
                        <div className="about-text">
                            {data.description && data.description !== '<p><br></p>' ? (
                                <div 
                                    className="ql-editor"
                                    style={{ padding: 0 }}
                                    dangerouslySetInnerHTML={{ __html: data.description }} 
                                />
                            ) : (
                                <div style={{ color: '#666', fontStyle: 'italic', lineHeight: '1.6' }}>
                                    <p>Chưa có thông tin giới thiệu.</p>
                                    <p>Hãy cập nhật hồ sơ để ứng viên hiểu rõ hơn về công ty bạn.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* CỘT PHẢI: SIDEBAR (THÔNG TIN CHUNG) */}
                <div className="right-column">
                    
                    {/* Card: Thông tin chung */}
                    <div className="content-card sidebar-card">
                        <h3 className="card-title">Thông tin chung</h3>
                        <ul className="info-list">
                            <li>
                                <FaUsers className="icon" />
                                <div>
                                    <strong>Quy mô</strong>
                                    <span>{companyScale}</span>
                                </div>
                            </li>
                            
                            <li>
                                <FaMapMarkerAlt className="icon" />
                                <div>
                                    <strong>Địa điểm</strong>
                                    <span>{data.address || "Chưa cập nhật"}</span>
                                </div>
                            </li>

                            <li>
                                <FaGlobe className="icon" />
                                <div>
                                    <strong>Website</strong>
                                    <a href={`https://${data.website}`} target="_blank" rel="noreferrer" className="link">
                                        {data.website || "Chưa cập nhật"}
                                    </a>
                                </div>
                            </li>
                        </ul>
                    </div>

                    {/* Card: Liên hệ */}
                    <div className="content-card sidebar-card">
                        <h3 className="card-title">Liên hệ</h3>
                        <ul className="info-list compact">
                            <li>
                                <FaPhone className="icon" /> 
                                <span>{data.phone || "0123.456.789"}</span>
                            </li>
                            <li>
                                <FaEnvelope className="icon" /> 
                                <span>{data.email || `contact@${data.company ? "company" : "domain"}.com`}</span>
                            </li>
                        </ul>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default EmployerProfile;