// src/pages/NotificationSettings.jsx
import React, { useId, useState } from "react";
import { Bell, Briefcase, MessageSquare, Mail } from "lucide-react";

const ToggleRow = ({ icon: Icon, title, desc, enabled, setEnabled }) => {
  const id = useId();

  return (
    <div className="ns-row">
      <div className="ns-row-left">
        <div className="ns-icon">
          <Icon className="ns-icon-svg" />
        </div>

        <div className="ns-text">
          <label className="ns-title" htmlFor={id}>
            {title}
          </label>
          <p className="ns-desc">{desc}</p>
        </div>
      </div>

      <button
        id={id}
        type="button"
        className={`ns-switch ${enabled ? "is-on" : ""}`}
        onClick={() => setEnabled(!enabled)}
        aria-pressed={enabled}
        aria-label={title}
      >
        <span className="ns-switch-thumb" />
      </button>
    </div>
  );
};

export default function NotificationSettings() {
  const [jobAlerts, setJobAlerts] = useState(true);
  const [messages, setMessages] = useState(true);
  const [newsletter, setNewsletter] = useState(false);

  return (
    <div className="ns-card">
      <div className="ns-header">
        <div className="ns-header-icon">
          <Bell className="ns-header-icon-svg" />
        </div>

        <div className="ns-header-text">
          <h2 className="ns-h2">Cài đặt Email & Thông báo</h2>
          <p className="ns-subtitle">
            Bật/tắt các loại thông báo bạn muốn nhận. Có thể thay đổi bất cứ lúc nào.
          </p>
        </div>
      </div>

      <div className="ns-list">
        <ToggleRow
          icon={Briefcase}
          title="Thông báo việc làm phù hợp hàng ngày"
          desc="Gợi ý công việc theo ngành, vị trí và mức lương bạn quan tâm."
          enabled={jobAlerts}
          setEnabled={setJobAlerts}
        />

        <ToggleRow
          icon={MessageSquare}
          title="Thông báo khi có tin nhắn từ Nhà tuyển dụng"
          desc="Nhận thông báo ngay khi có phản hồi hoặc lời mời phỏng vấn."
          enabled={messages}
          setEnabled={setMessages}
        />

        <ToggleRow
          icon={Mail}
          title="Nhận bản tin (Newsletter) và mẹo tìm việc"
          desc="Cập nhật xu hướng tuyển dụng, CV tips và kỹ năng phỏng vấn."
          enabled={newsletter}
          setEnabled={setNewsletter}
        />
      </div>

      <div className="ns-footer">
        <div className="ns-badge">
          <span className="ns-dot" />
          Đã lưu tự động trong phiên này
        </div>

        <button
          type="button"
          className="ns-primary"
          onClick={() => alert("Demo UI: Khi bạn có API, mình sẽ nối vào endpoint để lưu!")}
        >
          Lưu thay đổi
        </button>
      </div>
    </div>
  );
}
