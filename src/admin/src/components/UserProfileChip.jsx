// frontend/src/components/UserProfileChip.jsx

import React from 'react';
import './UserProfileChip.css'; // Chúng ta sẽ tạo file này ở Bước 3

// Hàm lấy chữ cái đầu (giống hệt trang Profile)
const getInitials = (name) => {
    if (!name) return ""; 
    const words = name.split(' ');
    
    if (words.length > 1) {
        return words[0][0] + words[words.length - 1][0];
    } else if (words.length === 1 && words[0] !== "") {
        return words[0][0];
    }
    return "";
};

export default function UserProfileChip({ name, onClick }) {
  return (
    <div className="profile-chip" onClick={onClick} title="Xem tài khoản">
      <div className="profile-chip-avatar">
        <span>{getInitials(name)}</span>
      </div>
      <span className="profile-chip-name">{name}</span>
    </div>
  );
}