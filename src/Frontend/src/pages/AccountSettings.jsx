// src/pages/AccountSettings.jsx
// XÓA TOÀN BỘ FILE CŨ VÀ DÁN CODE NÀY VÀO

import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import client from '../api/client';
import { CheckCircle } from 'lucide-react'; // 'lucide' vẫn dùng cho các icon khác

// BƯỚC 1: CHỈ IMPORT FONT AWESOME (GIỐNG REGISTER)
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";

// --- Component 1: Cài đặt thông tin cá nhân (Giữ nguyên) ---
function PersonalInfoForm() {
  const { user, login } = useAuth();
  const [formData, setFormData] = useState({ name: '', phone: '' });
  const [msg, setMsg] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        phone: user.phone || '',
      });
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg(null);
    setLoading(true);
    try {
      // Giả sử API của bạn là '/api/candidate/profile'
      const res = await client.patch('/api/candidate/profile', formData); 
      login(res.data.user); // Cập nhật user toàn cục
      setMsg({ type: 'success', text: 'Cập nhật thông tin thành công!' });
    } catch (err) {
      setMsg({ type: 'error', text: err.response?.data?.message || 'Lỗi cập nhật' });
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h2 className="text-xl font-bold mb-4">Cài đặt thông tin cá nhân</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
            Họ và tên <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>
        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
            Số điện thoại
          </label>
          <input
            type="text"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="Nhập số điện thoại"
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={user.email}
            disabled
            className="block w-full rounded-md border-gray-300 shadow-sm bg-gray-100 cursor-not-allowed"
          />
        </div>
        <div className="flex items-center gap-4">
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 bg-green-600 text-white font-semibold rounded-lg shadow-sm hover:bg-green-700 disabled:opacity-50"
          >
            {loading ? 'Đang lưu...' : 'Lưu'}
          </button>
          {msg && <span className={msg.type === 'error' ? 'text-red-500' : 'text-green-600'}>{msg.text}</span>}
        </div>
      </form>
    </div>
  );
}


// --- Component 2: Thay đổi mật khẩu ---

// BƯỚC 2: XÓA SẠCH "const Eye = ..." VÀ "const EyeOff = ..." TỪ ĐÂY

function PasswordChangeForm() {
  const [passwords, setPasswords] = useState({ current: '', newPass: '', confirm: '' });
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  
  const [msg, setMsg] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setPasswords({ ...passwords, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg(null);
    if (passwords.newPass !== passwords.confirm) {
      return setMsg({ type: 'error', text: 'Mật khẩu mới không khớp.' });
    }
    setLoading(true);
    try {
      // Giả sử API của bạn là '/api/auth/change-password'
      await client.patch('/api/auth/change-password', {
        current: passwords.current,
        newPass: passwords.newPass,
      });
      setMsg({ type: 'success', text: 'Đổi mật khẩu thành công!' });
      setPasswords({ current: '', newPass: '', confirm: '' });
    } catch (err) {
      setMsg({ type: 'error', text: err.response?.data?.message || 'Lỗi: Mật khẩu hiện tại sai?' });
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h2 className="text-xl font-bold mb-4">Thay đổi mật khẩu đăng nhập</h2>
      <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email đăng nhập
          </label>
          <input
            type="email"
            value={useAuth().user?.email || ''}
            disabled
            className="block w-full rounded-md border-gray-300 shadow-sm bg-gray-100 cursor-not-allowed"
          />
        </div>
        
        {/* BƯỚC 3: DÙNG FONT AWESOME + TAILWIND */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Mật khẩu hiện tại
          </label>
          <div className="relative"> {/* Thêm 'relative' */}
            <input
              type={showCurrent ? "text" : "password"}
              name="current"
              value={passwords.current}
              onChange={handleChange}
              className="block w-full rounded-md border-gray-300 shadow-sm bg-blue-50 border-blue-200"
            />
            {/* Dùng Tailwind 'absolute' để định vị icon */}
            <FontAwesomeIcon
              icon={showCurrent ? faEyeSlash : faEye}
              className="absolute top-1/2 right-3 -translate-y-1/2 cursor-pointer text-gray-500"
              onClick={() => setShowCurrent(!showCurrent)}
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Mật khẩu mới
          </label>
          <div className="relative">
            <input
              type={showNewPass ? "text" : "password"}
              name="newPass"
              value={passwords.newPass}
              onChange={handleChange}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
            <FontAwesomeIcon
              icon={showNewPass ? faEyeSlash : faEye}
              className="absolute top-1/2 right-3 -translate-y-1/2 cursor-pointer text-gray-500"
              onClick={() => setShowNewPass(!showNewPass)}
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Nhập lại mật khẩu mới
          </label>
          <div className="relative">
            <input
              type={showConfirm ? "text" : "password"}
              name="confirm"
              value={passwords.confirm}
              onChange={handleChange}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
            <FontAwesomeIcon
              icon={showConfirm ? faEyeSlash : faEye}
              className="absolute top-1/2 right-3 -translate-y-1/2 cursor-pointer text-gray-500"
              onClick={() => setShowConfirm(!showConfirm)}
            />
          </div>
        </div>
        
        {/* ... (Nút Lưu và msg giữ nguyên) ... */}
        <div className="flex items-center gap-4 pt-2">
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 bg-green-600 text-white font-semibold rounded-lg shadow-sm hover:bg-green-700 disabled:opacity-50"
          >
            {loading ? 'Đang lưu...' : 'Lưu'}
          </button>
          {msg && <span className={msg.type === 'error' ? 'text-red-500' : 'text-green-600'}>{msg.text}</span>}
        </div>
      </form>
    </div>
  );
}


// --- Component 3: Cài đặt bảo mật (Giữ nguyên) ---
// ... (Toàn bộ code của SecuritySettingsForm giữ nguyên y hệt) ...
const SecurityToggle = ({ label, description, checked, onChange }) => {
  return (
    <div className="relative flex items-start p-4 border rounded-lg">
      <div className="flex-shrink-0">
        <input
          id={label}
          type="checkbox"
          checked={checked}
          onChange={onChange}
          className="hidden"
        />
        <label
          htmlFor={label}
          className={`w-6 h-6 rounded cursor-pointer flex items-center justify-center
            ${checked ? 'bg-green-600 border-green-600' : 'bg-white border-gray-400 border-2'}
          `}
        >
          {checked && <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>}
        </label>
      </div>
      <div className="ml-3 min-w-0 flex-1 text-sm">
        <label htmlFor={label} className="font-semibold text-gray-800 cursor-pointer">
          {label}
        </label>
        <p className="text-gray-600">{description}</p>
      </div>
    </div>
  );
};

function SecuritySettingsForm() {
  const [allowJobOffers, setAllowJobOffers] = useState(true);
  const [allowCVReview, setAllowCVReview] = useState(true);
  const [msg, setMsg] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg(null);
    setLoading(true);
    try {
      await client.patch('/api/candidate/settings', {
        allowJobOffers,
        allowCVReview,
      });
      setMsg({ type: 'success', text: 'Lưu cài đặt thành công!' });
    } catch (err) {
      setMsg({ type: 'error', text: err.response?.data?.message || 'Lỗi lưu cài đặt' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h2 className="text-xl font-bold mb-4">Thay đổi cài đặt bảo mật</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <SecurityToggle
          label="Nhận cơ hội việc làm tốt hơn từ TopCV"
          description="Nhận cơ hội việc làm với mức lương cao hơn... TopCV sẽ gửi thông báo..."
          checked={allowJobOffers}
          onChange={() => setAllowJobOffers(!allowJobOffers)}
        />
        <SecurityToggle
          label="Cho phép TopCV hỗ trợ sửa và đánh giá CV"
          description="TopCV giúp bạn cải thiện chất lượng CV."
          checked={allowCVReview}
          onChange={() => setAllowCVReview(!allowCVReview)}
        />
        <div className="flex items-center gap-4 pt-2">
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 bg-green-600 text-white font-semibold rounded-lg shadow-sm hover:bg-green-700 disabled:opacity-50"
          >
            {loading ? 'Đang lưu...' : 'Lưu'}
          </button>
          {msg && <span className={msg.type === 'error' ? 'text-red-500' : 'text-green-600'}>{msg.text}</span>}
        </div>
      </form>
    </div>
  );
}


// --- COMPONENT CHA (Gom 3 mục lại) ---
export default function AccountSettings() {
  return (
    <div className="flex flex-col gap-8">
      <PersonalInfoForm />
      <PasswordChangeForm />
      <SecuritySettingsForm />
    </div>
  );
}