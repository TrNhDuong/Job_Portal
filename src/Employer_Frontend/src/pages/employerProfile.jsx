// frontend/src/pages/employerProfile.jsx
import React, { useState } from 'react';
import '../styles/employerProfile.css';
import { FaEdit, FaLink, FaFacebook, FaInstagram, FaLinkedin, FaTwitter, FaStar, FaPlus } from 'react-icons/fa';
import monoLogo from '../assets/mono-logo.png'; // Giả sử logo nằm ở đây
import { FaMapMarkerAlt } from 'react-icons/fa';
import EmployerProfileEdit from './EmployerProfileEdit';
import { AuthContext } from "../context/AuthContext.jsx"; 
import { useContext } from "react";
import client from '../api/client';

const EmployerProfile = ({}) => {
    const [activeTab, setActiveTab] = useState('Overview');
    const [mode, setMode] = useState('view');
    const { auth, updateEmployerWithData, updateData  } = useContext(AuthContext);
    const [loading, setLoading] = useState(false);
    const logo = auth.employerData?.data.logo?.url || monoLogo;
    const data = auth.employerData?.data || {};
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
                onChangeLogo={ async (logo) => {
                    const formData = new FormData();
                    formData.append('image', logo);

                    try {
                        setLoading(true);  
                        await new Promise(resolve => setTimeout(resolve, 0));
                        const email = localStorage.getItem("email");
                        console.log('Email of employer: ' + email);
                        const response = await client.post(`api/upload/logo/employer?email=${email}`, formData,
                            {
                                headers: {
                                    'Content-Type': 'multipart/form-data'
                                }
                            }
                        )
                        if (response.data.success){
                            console.log('haha');
                            await updateData();                            
                        }
                    } catch ( error ){
                        console.log(error)
                    } finally {
                        setLoading(false); // Tắt loading
                    }
                }}
            />
        );
    }

    return (
        <div className="employer-profile-layout">
            {loading && (
                <div className="loading-overlay">
                    <div className="loading-spinner"></div>
                    <p>Đang xử lý...</p>
                </div>
            )}
            {/* --- Cột Trái: Hồ sơ Công ty --- */}
            <div className="profile-main-column">
                <div className="profile-header-card">
                    <div className="header-background"></div>
                    <div className="profile-content">
                        <div className="logo-section">
                            <img src={logo} alt={`${data.company} Logo`} className="company-logo" />
                        </div>
                        
                        <h2 className="company-name">{data.company}</h2>
                        <span className="verified-badge">
                            {/* Biểu tượng Verified, nếu có */}
                        </span>
                        
                        <button className="edit-info-btn" onClick={() => setMode('edit')}>
                            <FaEdit /> Edit Info
                        </button>

                        <p className="company-tagline">{data.description}</p>

                        <div className="company-links">
                            <a href={`https://${data.website}`} target="_blank" rel="noopener noreferrer">
                                <FaLink /> {data.website}
                            </a>
                        </div>

                        <div className="company-address-link">
                            <FaMapMarkerAlt className="icon-address" style={{ marginRight: '7px' }} /> 
                            <span>{data.address}</span>
                        </div>
                    

                        {/* <div className="profile-tabs">
                            <button className={activeTab === 'Overview' } onClick={() => setActiveTab('Overview')}>Overview</button>
                        </div> */}
                    </div>
                </div>

                
            </div>

            

        </div>
    );
};

export default EmployerProfile;