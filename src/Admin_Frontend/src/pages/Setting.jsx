import React, { useState, useEffect } from 'react';
import '../styles/Setting.css'; // Import file CSS mới
import { HiTemplate, HiShieldCheck, HiBell, HiSave, HiServer } from "react-icons/hi";

export default function Setting() {
    const [activeTab, setActiveTab] = useState('general');

    const [systemConfig, setSystemConfig] = useState({
        maintenanceMode: false,
        rowsPerPage: 10,
        enableRegistration: true
    });

    const [passForm, setPassForm] = useState({ oldPass: '', newPass: '', confirmPass: '' });

    useEffect(() => {
        const savedConfig = localStorage.getItem('adminSystemConfig');
        if (savedConfig) setSystemConfig(JSON.parse(savedConfig));
    }, []);

    const handleSaveSystem = () => {
        localStorage.setItem('adminSystemConfig', JSON.stringify(systemConfig));
        alert("Đã lưu cấu hình hệ thống thành công!");
    };

    const handleChangePassword = (e) => {
        e.preventDefault();
        if (passForm.newPass !== passForm.confirmPass) {
            alert("Mật khẩu xác nhận không khớp!");
            return;
        }
        alert("Đổi mật khẩu thành công! (Mock)");
        setPassForm({ oldPass: '', newPass: '', confirmPass: '' });
    };

    return (
        <div className="settings-container">
            <h2 className="settings-title">Cài đặt hệ thống</h2>

            <div className="settings-card">
                {/* SIDEBAR */}
                <div className="settings-sidebar">
                    <div 
                        className={`sidebar-item ${activeTab === 'general' ? 'active' : ''}`}
                        onClick={() => setActiveTab('general')}
                    >
                        <HiTemplate size={20} /> Cấu hình chung
                    </div>
                    <div 
                        className={`sidebar-item ${activeTab === 'security' ? 'active' : ''}`}
                        onClick={() => setActiveTab('security')}
                    >
                        <HiShieldCheck size={20} /> Bảo mật & Admin
                    </div>
                    <div 
                        className={`sidebar-item ${activeTab === 'notification' ? 'active' : ''}`}
                        onClick={() => setActiveTab('notification')}
                    >
                        <HiBell size={20} /> Thông báo
                    </div>
                </div>

                {/* CONTENT */}
                <div className="settings-content">
                    
                    {/* TAB 1: CẤU HÌNH CHUNG */}
                    {activeTab === 'general' && (
                        <div className="fade-in">
                            <h3 className="section-title"><HiServer /> Cấu hình vận hành</h3>
                            <p className="section-desc">Quản lý các thông số vận hành cốt lõi của website.</p>

                            <div className="setting-group">
                                <label className="setting-label">Chế độ Bảo trì (Maintenance Mode)</label>
                                <div className={`toggle-wrapper ${systemConfig.maintenanceMode ? 'danger' : 'active'}`}>
                                    <input 
                                        type="checkbox" 
                                        checked={systemConfig.maintenanceMode}
                                        onChange={(e) => setSystemConfig({...systemConfig, maintenanceMode: e.target.checked})}
                                        style={{ width: '20px', height: '20px', cursor: 'pointer' }}
                                    />
                                    <span className={`status-text ${systemConfig.maintenanceMode ? 'off' : 'on'}`}>
                                        {systemConfig.maintenanceMode ? 'Đang BẬT (Người dùng không thể truy cập)' : 'Hệ thống hoạt động bình thường'}
                                    </span>
                                </div>
                            </div>

                            <div className="setting-group">
                                <label className="setting-label">Cho phép Đăng ký mới</label>
                                <div className="toggle-wrapper">
                                    <input 
                                        type="checkbox" 
                                        checked={systemConfig.enableRegistration}
                                        onChange={(e) => setSystemConfig({...systemConfig, enableRegistration: e.target.checked})}
                                        style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                                    />
                                    <span>Cho phép Ứng viên/NTD tạo tài khoản mới</span>
                                </div>
                            </div>

                            <div className="setting-group">
                                <label className="setting-label">Số dòng hiển thị bảng (User/Job)</label>
                                <select 
                                    className="setting-select"
                                    value={systemConfig.rowsPerPage}
                                    onChange={(e) => setSystemConfig({...systemConfig, rowsPerPage: Number(e.target.value)})}
                                >
                                    <option value="10">10 dòng / trang</option>
                                    <option value="20">20 dòng / trang</option>
                                    <option value="50">50 dòng / trang</option>
                                </select>
                            </div>

                            <button onClick={handleSaveSystem} className="btn-save">
                                <HiSave /> Lưu cấu hình
                            </button>
                        </div>
                    )}

                    {/* TAB 2: BẢO MẬT */}
                    {activeTab === 'security' && (
                        <div className="fade-in">
                            <h3 className="section-title">Đổi mật khẩu Admin</h3>
                            <p className="section-desc">Cập nhật mật khẩu định kỳ để bảo vệ hệ thống.</p>
                            
                            <form onSubmit={handleChangePassword} style={{ maxWidth: '400px' }}>
                                <div className="setting-group">
                                    <label className="setting-label">Mật khẩu hiện tại</label>
                                    <input 
                                        type="password" className="setting-input"
                                        value={passForm.oldPass}
                                        onChange={e => setPassForm({...passForm, oldPass: e.target.value})}
                                    />
                                </div>
                                <div className="setting-group">
                                    <label className="setting-label">Mật khẩu mới</label>
                                    <input 
                                        type="password" className="setting-input"
                                        value={passForm.newPass}
                                        onChange={e => setPassForm({...passForm, newPass: e.target.value})}
                                    />
                                </div>
                                <div className="setting-group">
                                    <label className="setting-label">Xác nhận mật khẩu</label>
                                    <input 
                                        type="password" className="setting-input"
                                        value={passForm.confirmPass}
                                        onChange={e => setPassForm({...passForm, confirmPass: e.target.value})}
                                    />
                                </div>
                                <button type="submit" className="btn-save">Cập nhật mật khẩu</button>
                            </form>

                            <hr style={{margin: '40px 0', border: '0', borderTop: '1px solid #e5e7eb'}}/>

                            <h3 className="section-title">Nhật ký hoạt động (Logs)</h3>
                            <div className="logs-box">
                                <p>&gt; [2024-03-10 09:15:22] Admin logged in from IP 113.161.x.x</p>
                                <p>&gt; [2024-03-09 14:20:05] Action: Approved Job #Job123</p>
                                <p>&gt; [2024-03-08 10:00:11] System: Configuration updated</p>
                                <p>&gt; [2024-03-08 09:55:00] Warning: CPU usage high (85%)</p>
                            </div>
                        </div>
                    )}

                    {/* TAB 3: THÔNG BÁO */}
                    {activeTab === 'notification' && (
                        <div className="fade-in">
                            <h3 className="section-title">Cài đặt nhận tin</h3>
                            <p className="section-desc">Quản lý các email thông báo gửi về admin@inspireleader.com</p>

                            <div className="toggle-wrapper" style={{marginBottom: '15px'}}>
                                <input type="checkbox" defaultChecked style={{width: '18px', height: '18px'}} />
                                <span style={{marginLeft: '10px'}}>Gửi email khi có <b>Báo cáo vi phạm</b> mới</span>
                            </div>
                            <div className="toggle-wrapper" style={{marginBottom: '15px'}}>
                                <input type="checkbox" defaultChecked style={{width: '18px', height: '18px'}} />
                                <span style={{marginLeft: '10px'}}>Cảnh báo khẩn cấp (Server Down, DDOS)</span>
                            </div>
                            <div className="toggle-wrapper">
                                <input type="checkbox" style={{width: '18px', height: '18px'}} />
                                <span style={{marginLeft: '10px'}}>Thông báo khi có <b>Nhà tuyển dụng</b> mới đăng ký</span>
                            </div>

                            <button className="btn-save">
                                <HiSave /> Lưu cài đặt
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}