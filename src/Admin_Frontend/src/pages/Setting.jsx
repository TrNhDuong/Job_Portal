import React, { useState, useEffect } from 'react';
import '../styles/Setting.css';
import { HiMoon, HiSun, HiCheck } from "react-icons/hi";

export default function Setting() {
    const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');

    useEffect(() => {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
    }, [theme]);

    return (
        <div className="settings-container fade-in">
            <div className="settings-header-block">
                <h2 className="settings-title">Cài đặt giao diện</h2>
                <p className="settings-subtitle">Tùy chỉnh trải nghiệm hình ảnh của bạn</p>
            </div>

            <div className="theme-grid">
                {/* --- Card Chế độ Sáng --- */}
                <div 
                    className={`theme-card ${theme === 'light' ? 'active' : ''}`}
                    onClick={() => setTheme('light')}
                >
                    <div className="check-badge"><HiCheck /></div>
                    
                    <div className="card-preview-box preview-light">
                        <div className="mock-sidebar"></div>
                        <div className="mock-content">
                            <div className="mock-line" style={{width: '80%', marginTop: '30px'}}></div>
                            <div className="mock-line" style={{width: '60%'}}></div>
                            <div className="mock-line" style={{width: '60%'}}></div>
                        </div>
                    </div>

                    <div className="card-info">
                        <h3><HiSun className="icon-sun" /> Chế độ Sáng</h3>
                        <p>Giao diện mặc định, tối ưu cho môi trường nhiều ánh sáng.</p>
                    </div>
                </div>

                {/* --- Card Chế độ Tối --- */}
                <div 
                    className={`theme-card ${theme === 'dark' ? 'active' : ''}`}
                    onClick={() => setTheme('dark')}
                >
                    <div className="check-badge"><HiCheck /></div>

                    <div className="card-preview-box preview-dark">
                        <div className="mock-sidebar"></div>
                        <div className="mock-content">
                            <div className="mock-line" style={{width: '80%', marginTop: '30px'}}></div>
                            <div className="mock-line" style={{width: '60%'}}></div>
                            <div className="mock-line" style={{width: '60%'}}></div>
                        </div>
                    </div>

                    <div className="card-info">
                        <h3><HiMoon className="icon-moon" style={{color: '#6366f1'}} /> Chế độ Tối</h3>
                        <p>Giảm mỏi mắt, tiết kiệm pin và tăng sự tập trung.</p>
                    </div>
                </div>
            </div>
        </div>
    );
}