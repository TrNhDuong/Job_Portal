// src/pages/settings/PasswordSettings.jsx

import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import client from '../../api/client';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { AlertCircle, CheckCircle } from 'lucide-react'; 

export default function PasswordSettings() {
  const { user } = useAuth();
  const [passwords, setPasswords] = useState({ current: '', newPass: '', confirm: '' });
  
  const [loading, setLoading] = useState(false);

  // State cho 3 icon mắt (Giống RegisterCandidateForm)
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  // State cho Toast (Giữ nguyên)
  const [showNotification, setShowNotification] = useState(false);
  const [notificationType, setNotificationType] = useState('success');
  const [notificationMessage, setNotificationMessage] = useState('');

  const handleChange = (e) => {
    setPasswords({ ...passwords, [e.target.name]: e.target.value });
  };

  const showToast = (type, text) => {
    setNotificationType(type);
    setNotificationMessage(text);
    setShowNotification(true);
    setTimeout(() => setShowNotification(false), 4000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (passwords.newPass !== passwords.confirm) {
      const text = 'Mật khẩu mới không khớp.';
      showToast('error', text); // Chỉ dùng Toast
      return;
    }

    // Validation (Giữ nguyên)
    const newPassword = passwords.newPass;
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9]).{8,}$/;
    const errorMessage = "Mật khẩu mới phải có ít nhất 8 kí tự, một chữ hoa, một chữ thường, một chữ số và một kí hiệu đặc biệt.";

    if (!passwordRegex.test(newPassword)) {
      showToast("error", errorMessage); 
      return; 
    }

    setLoading(true);
    try {
      await client.post('/api/password/candidate', {
        email: user.email,
        password: passwords.current,
        newpassword: passwords.newPass,
      });

      const text = 'Đổi mật khẩu thành công!';
      setPasswords({ current: '', newPass: '', confirm: '' });
      showToast('success', text); // Chỉ dùng Toast
    } catch (err) {
      const text = err.response?.data?.message || 'Lỗi: Mật khẩu hiện tại sai?';
      showToast('error', text); // Chỉ dùng Toast
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  return (
    <>
      {showNotification && (
        <div className="fixed top-20 right-6 z-50 animate-in fade-in slide-in-from-top-2">
          <div
            className={`flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg ${
              notificationType === 'success'
                ? 'bg-emerald-50 dark:bg-emerald-950 border border-emerald-200 dark:border-emerald-800'
                : 'bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800'
            }`}
          >
            {notificationType === 'success' ? (
              <CheckCircle className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            ) : (
              <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
            )}
            <span
              className={
                notificationType === 'success'
                  ? 'text-emerald-700 dark:text-emerald-300'
                  : 'text-red-700 dark:text-red-300'
              }
            >
              {notificationMessage}
            </span>
          </div>
        </div>
      )}

    	<div className="bg-white dark:bg-slate-950 rounded-lg shadow-sm p-6 md:p-8 border border-slate-200 dark:border-slate-800">
    		<div className="flex items-start justify-between mb-6">
        		<div>
          			<h2 className="text-2xl font-bold text-slate-900 dark:text-white">Thay đổi mật khẩu</h2>
          			<p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            			Giữ tài khoản của bạn an toàn với mật khẩu mạnh.
          			</p>
        		</div>
    		</div>

    		<form onSubmit={handleSubmit} className="space-y-5 max-w-xl">
      			
        {/* Mật khẩu hiện tại (Code "flat" giống Register) */}
        	<div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4">
        	  <label
          	    htmlFor="current"
          	    className="w-full md:w-1/3 block text-sm font-medium text-slate-700 dark:text-slate-300"
        	  >
          	    Mật khẩu hiện tại
        	  </label>
        	  <div className="w-full md:w-2/3 relative">
        	    <input
          	      id="current"
          	      type={showCurrent ? 'text' : 'password'}
          	      name="current"
          	      value={passwords.current}
          	      onChange={handleChange}
          	      className="block w-full px-4 py-2.5 pr-10 rounded-lg border transition-all
          	        bg-white dark:bg-slate-900
          	        text-slate-900 dark:text-white
          	        placeholder-slate-400 dark:placeholder-slate-500
          	        border-slate-300 dark:border-slate-700
          	        focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
          	      placeholder="••••••••"
        	    />
        	    <FontAwesomeIcon
        	      icon={showCurrent ? faEyeSlash : faEye}
        	      className="absolute top-1/2 right-4 -translate-y-1/2 cursor-pointer text-slate-500"
        	      onClick={() => setShowCurrent(!showCurrent)}
        	    />
      	  </div>
    	    </div>

    	    {/* Mật khẩu mới */}
    	    <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4">
    	      <label
      	        htmlFor="newPass"
      		    className="w-full md:w-1/3 block text-sm font-medium text-slate-700 dark:text-slate-300"
    	      >
    	        Mật khẩu mới
    	      </label>
    	      <div className="w-full md:w-2/3 relative">
    		    <input
    		      id="newPass"
    		      type={showNewPass ? 'text' : 'password'}
    		      name="newPass"
    		      value={passwords.newPass}
    		      onChange={handleChange}
    		      className="block w-full px-4 py-2.5 pr-10 rounded-lg border transition-all
    		        bg-white dark:bg-slate-900
    		        text-slate-900 dark:text-white
    		        placeholder-slate-400 dark:placeholder-slate-500
    		        border-slate-300 dark:border-slate-700
    		        focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
    		      placeholder="••••••••"
    		    />
    		    <FontAwesomeIcon
    		      icon={showNewPass ? faEyeSlash : faEye}
    		      className="absolute top-1/2 right-4 -translate-y-1/2 cursor-pointer text-slate-500"
    		      onClick={() => setShowNewPass(!showNewPass)}
    		    />
    	      </div>
    	    </div>

  	    {/* Xác nhận mật khẩu */}
  	    <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4">
  		  <label
  		    htmlFor="confirm"
  		    className="w-full md:w-1/3 block text-sm font-medium text-slate-700 dark:text-slate-300"
  		  >
  		    Nhập lại mật khẩu mới
  		  </label>
  		  <div className="w-full md:w-2/3 relative">
  		    <input
  		      id="confirm"
  		      type={showConfirm ? 'text' : 'password'}
  		      name="confirm"
  		      value={passwords.confirm}
  		      onChange={handleChange}
  		      className="block w-full px-4 py-2.5 pr-10 rounded-lg border transition-all
  		        bg-white dark:bg-slate-900
  		        text-slate-900 dark:text-white
  		        placeholder-slate-400 dark:placeholder-slate-500
  		        border-slate-300 dark:border-slate-700
  		        focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
  		      placeholder="••••••••"
  		    />
  		    <FontAwesomeIcon
  		      icon={showConfirm ? faEyeSlash : faEye}
  		      className="absolute top-1/2 right-4 -translate-y-1/2 cursor-pointer text-slate-500"
  		      onClick={() => setShowConfirm(!showConfirm)}
  		    />
  		  </div>
  	    </div>

  	    <div className="flex items-center gap-4 pt-2 md:pl-[33.33%]">
  	      <button
  		    type="submit"
  		    disabled={loading}
  		    className="px-6 py-2 rounded-lg font-semibold shadow-sm
  			  bg-blue-600 hover:bg-blue-700 disabled:opacity-50
  			  text-white transition-colors"
    	  >
  		    {loading ? 'Đang lưu...' : 'Lưu'}
  	      </button>

  	    </div>
  	  </form>
      </div>
    </>
  );
}