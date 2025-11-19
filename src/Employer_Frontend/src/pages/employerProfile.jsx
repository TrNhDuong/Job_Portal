// frontend/src/pages/employerProfile.jsx
import React, { useState } from 'react';
import '../styles/employerProfile.css';
import { FaEdit, FaLink, FaFacebook, FaInstagram, FaLinkedin, FaTwitter, FaStar, FaPlus } from 'react-icons/fa';
import monoLogo from '../assets/mono-logo.png'; // Giả sử logo nằm ở đây

import EmployerProfileEdit from './EmployerProfileEdit';

// Dữ liệu mẫu (Mock data) khớp với hình ảnh
const mockData = {
    companyName: "MONO Studio",
    tagline: "We are a fintech-focused IT company delivering cutting-edge technology solutions and expert teams to help financial instituti...",
    isAvailable: true,
    info: {
        industry: "Hi-tech & Fintech",
        employees: "1932",
        founded: "2008",
        website: "monostudio.com",
    },
};

const EmployerProfile = ({ data = mockData, onProfileUpdate }) => {
    // State để mô phỏng việc mở/đóng các tab
    const [activeTab, setActiveTab] = useState('Overview');
    const [mode, setMode] = useState('view');

    if (mode === 'edit') {
        return (
            <EmployerProfileEdit 
                initialData={data} 
                onCancel={() => setMode('view')} 
                onSave={(updatedData) => {
                    // Xử lý lưu API ở đây hoặc gọi onProfileUpdate
                    // setMode('view');
                }}
            />
        );
    }

    return (
        <div className="employer-profile-layout">
            
            {/* --- Cột Trái: Hồ sơ Công ty --- */}
            <div className="profile-main-column">
                <div className="profile-header-card">
                    <div className="header-background"></div>
                    <div className="profile-content">
                        <div className="logo-section">
                            <img src={monoLogo} alt={`${data.companyName} Logo`} className="company-logo" />
                        </div>
                        
                        <h2 className="company-name">{data.companyName}</h2>
                        <span className="verified-badge">
                            {/* Biểu tượng Verified, nếu có */}
                        </span>
                        
                        <button className="edit-info-btn" onClick={() => setMode('edit')}>
                            <FaEdit /> Edit Info
                        </button>

                        <p className="company-tagline">{data.tagline}</p>

                        <div className="company-links">
                            <a href={`https://${data.info.website}`} target="_blank" rel="noopener noreferrer">
                                <FaLink /> {data.info.website}
                            </a>
                        </div>
                        
                        <div className="company-social-links">
                            <FaFacebook className="social-icon" />
                            <FaInstagram className="social-icon" />
                            <FaLinkedin className="social-icon" />
                            <FaTwitter className="social-icon" />
                        </div>
                        
                        <div className="company-info-blocks">
                            <span>{data.info.industry}</span>
                            <span>Employees {data.info.employees}</span>
                            <span>Founded {data.info.founded}</span>
                        </div>

                        <div className="profile-tabs">
                            <button className={activeTab === 'Overview' ? 'active' : ''} onClick={() => setActiveTab('Overview')}>Overview</button>
                        </div>
                    </div>
                </div>

                
            </div>

        </div>
    );
};

export default EmployerProfile;