// src/pages/NotificationSettings.jsx

import React, { useState } from 'react';

// Component ToggleSwitch (để dùng nội bộ trong file này)
const ToggleSwitch = ({ label, enabled, setEnabled }) => {
  return (
    <div className="flex items-center justify-between py-3 border-b">
      <span className="text-gray-700">{label}</span>
      <button
        onClick={() => setEnabled(!enabled)}
        className={`relative inline-flex items-center h-6 w-11 rounded-full transition-colors
          ${enabled ? 'bg-blue-600' : 'bg-gray-200'}
        `}
      >
        <span
          className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform
            ${enabled ? 'translate-x-6' : 'translate-x-1'}
          `}
        />
      </button>
    </div>
  );
};


export default function NotificationSettings() {
  // Tạo state (trạng thái) để quản lý các công tắc
  const [jobAlerts, setJobAlerts] = useState(true);
  const [messages, setMessages] = useState(true);
  const [newsletter, setNewsletter] = useState(false);

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h2 className="text-2xl font-bold mb-4">Cài đặt Email & Thông báo</h2>
      
      <div className="flex flex-col">
        <ToggleSwitch
          label="Thông báo việc làm phù hợp hàng ngày"
          enabled={jobAlerts}
          setEnabled={setJobAlerts}
        />
        <ToggleSwitch
          label="Thông báo khi có tin nhắn từ Nhà tuyển dụng"
          enabled={messages}
          setEnabled={setMessages}
        />
        <ToggleSwitch
          label="Nhận bản tin (Newsletter) và mẹo tìm việc"
          enabled={newsletter}
          setEnabled={setNewsletter}
        />
      </div>

    </div>
  );
}