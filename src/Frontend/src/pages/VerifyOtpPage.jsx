// src/pages/VerifyOtpPage.jsx

import React, { useState, useEffect, useRef } from 'react';
// SỬA 1: Import thêm 'useLocation'
import { useNavigate, useLocation } from 'react-router-dom';
import client from '../api/client';
import { useAuth } from '../context/AuthContext'; 

// Hàm lấy query param (Giữ nguyên)
function useQuery() {
  return new URLSearchParams(useLocation().search);
}

export default function VerifyOtpPage() {
  const [otp, setOtp] = useState(new Array(6).fill(""));
  const [msg, setMsg] = useState(null);
  const [loading, setLoading] = useState(false);
  const [countdown, setCountdown] = useState(120);
  
  const [data, setData] = useState(null); 
  const [email, setEmail] = useState(""); 
  
  const navigate = useNavigate();
  const query = useQuery(); 
  const { user, login } = useAuth(); 
  const inputRefs = useRef([]);
  
  // SỬA 2: Lấy 'location'
  const location = useLocation();

  // Lấy dữ liệu tạm
  useEffect(() => {
  	const action = query.get('action'); 
  	let storageKey;
  	
  	if (action === 'update-profile') {
  	  storageKey = 'updateProfileData';
  	} else if (action === 'update-password') {
  	  storageKey = 'updatePasswordData';
  	} else { 
  	  storageKey = 'registrationData';
  	}

  	const storedData = sessionStorage.getItem(storageKey);
  	
  	if (!storedData) {
  	  navigate('/register'); 
  	} else {
  	  const parsedData = JSON.parse(storedData);
  	  setData(parsedData);
  	  setEmail(parsedData.email); 
  	}
    
  // SỬA 3: Thay 'query' bằng 'location.search'
  }, [navigate, location.search]); // <-- SỬA Ở ĐÂY

  // ... (Toàn bộ các hàm còn lại: handleResend, handleSubmit, handleChange... giữ nguyên y hệt) ...
  useEffect(() => {
  	if (countdown > 0) {
  	  const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
  	  return () => clearTimeout(timer);
  	}
  }, [countdown]);
  const handleChange = (e, index) => {
  	const { value } = e.target;
  	if (/[^0-9]/.test(value)) return;
  	const newOtp = [...otp];
  	newOtp[index] = value;
  	setOtp(newOtp);
  	if (value && index < 5) {
  	  inputRefs.current[index + 1].focus();
  	}
  };
  const handleKeyDown = (e, index) => {
  	if (e.key === 'Backspace' && !otp[index] && index > 0) {
  	  inputRefs.current[index - 1].focus();
  	}
  };
  
  const handleResend = async () => {
  	if (countdown > 0 || !email) return; 
  	setMsg(null);
  	setLoading(true);
  	try {
  	  await client.post("/api/send-otp", { email: email });
  	  setMsg({ type: 'success', text: 'OTP mới đã được gửi!' });
  	  setCountdown(120); 
  	} catch (err) {
  	  setMsg({ type: 'error', text: 'Lỗi gửi OTP.' });
  	} finally {
  	  setLoading(false);
  	}
  };

  const handleSubmit = async (e) => {
  	e.preventDefault();
  	setMsg(null);
  	const code = otp.join("");

  	if (code.length < 6) {
  	  return setMsg({ type: 'error', text: 'Vui lòng nhập đủ 6 số OTP.' });
  	}

  	setLoading(true);
  	
  	try {
  	  await client.post("/api/verify-otp", {
  		email: email, 
  		otp: code,
  	  });
  	  
  	  const action = query.get('action');

  	  if (action === 'update-profile') {
        if (!data) throw new Error("Không tìm thấy dữ liệu cập nhật profile");

        const { oldEmail, email: newEmail, name, phone } = data;

        console.log(">>> UPDATE PROFILE WITH OTP");
        console.log("oldEmail =", oldEmail);
        console.log("newEmail =", newEmail);
        console.log("name =", name, "phone =", phone);

        // THỬ 1: chỉ update name + phone, KHÔNG động tới email
        await client.patch(
          `/api/candidate?email=${oldEmail}`,
          { name: name, email: newWEmail},
        );

        if (user) {
          // cập nhật lại context, email vẫn là oldEmail
          login({ ...user, name, phone });
        }

        sessionStorage.removeItem("updateProfileData");
        navigate("/dashboard/settings/profile");
      } 
      else if (action === 'update-password') {
  		await client.post('/api/password/candidate', {
  		  email: data.email,
  		  newpassword: data.newPassword,
  		});
  		sessionStorage.removeItem('updatePasswordData');
        setMsg({ type: 'success', text: 'Đổi mật khẩu thành công! Vui lòng đăng nhập lại.' });
  		setTimeout(() => navigate('/login'), 2000);

  	  } else {
  		const registerUrl = data.role === 'candidate' 
  		  ? '/api/candidateRegister' 
  		  : '/api/employerRegister';
  		
  		await client.post(registerUrl, data);
  		sessionStorage.removeItem('registrationData');
  		navigate('/login'); 
  	  }
  	  
  	} catch (err) {
  	  setMsg({ type: 'error', text: err.response?.data?.message || 'Mã OTP không đúng hoặc đã hết hạn' });
  	  setLoading(false); 
  	}
  };

  return (
  	<div className="flex items-center justify-center min-h-[70vh] bg-gray-50">
  	  {/* ... (Toàn bộ code JSX của bạn giữ nguyên) ... */}
  	  <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
  		<h2 className="text-2xl font-bold text-center">Verify Your Identity</h2>
  		<p className="text-center text-gray-600 mt-2 mb-6">
  		  We've sent a 6-digit code to {email}.
  		</p>
  		<form onSubmit={handleSubmit}>
  		  <div className="flex justify-center gap-2 mb-6">
  			{otp.map((data, index) => (
  			  <input
  				key={index}
  				type="text"
  				maxLength="1"
  				value={data}
  				onChange={(e) => handleChange(e, index)}
  				onKeyDown={(e) => handleKeyDown(e, index)}
  				ref={(el) => (inputRefs.current[index] = el)}
  				className="w-12 h-14 text-center text-2xl font-semibold border border-gray-300 rounded-md focus:border-green-700 focus:ring-1 focus:ring-green-700"
  			  />
  			))}
  		  </div>
  		  <button
  			type="submit"
  			disabled={loading}
  			className="w-full py-3 bg-green-700 text-white font-semibold rounded-lg hover:bg-green-800 disabled:opacity-50"
  		  >
  			{loading ? 'Verifying...' : 'Verify Code'}
  		  </button>
  		  {msg && (
  			<div 
  			  className={`mt-4 text-center ${msg.type === 'error' ? 'text-red-500' : 'text-green-600'}`}
  			>
  			  {msg.text}
  			</div>
  		  )}
  		  <div className="text-center mt-6">
  			<button
  			  type="button"
  			  onClick={handleResend}
  			  disabled={countdown > 0}
  			  className="text-sm text-gray-600 hover:underline disabled:text-gray-400 disabled:cursor-not-allowed"
  			>
  			  {countdown > 0 ? `Resend in ${countdown}s` : "Didn't receive the code? Resend"}
  			</button>
  		  </div>
  		</form>
  	  </div>
  	</div>
  );
}