// src/pages/settings/SecuritySettings.jsx

import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import client from '../../api/client';
import { AlertCircle, CheckCircle, CheckCircle2 } from 'lucide-react';

// Component con
const SecurityToggle = ({ label, description, checked, onChange }) => {
  const id = label.replace(/\s+/g, '-').toLowerCase();

  return (
    <div className="flex items-start p-4 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/40">
      <div className="flex-shrink-0 mt-1">
        <input
          id={id}
          type="checkbox"
          checked={checked}
          onChange={onChange}
          className="w-4 h-4 rounded border-slate-300 dark:border-slate-600"
        />
      </div>
      <div className="ml-3 min-w-0 flex-1">
        <label htmlFor={id} className="text-sm font-medium text-slate-900 dark:text-slate-100 cursor-pointer">
          {label}
        </label>
        <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">{description}</p>
      </div>
    </div>
  );
};

export default function SecuritySettings() {
  const { user } = useAuth();
  const [allowJobOffers, setAllowJobOffers] = useState(true);
  const [allowCVReview, setAllowCVReview] = useState(true);
  const [msg, setMsg] = useState(null);
  const [loading, setLoading] = useState(false);

  const [isCompleted, setIsCompleted] = useState(false);

  const [showNotification, setShowNotification] = useState(false);
  const [notificationType, setNotificationType] = useState('success');
  const [notificationMessage, setNotificationMessage] = useState('');

  const showToast = (type, text) => {
    setNotificationType(type);
    setNotificationMessage(text);
    setShowNotification(true);
    setTimeout(() => setShowNotification(false), 4000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg(null);
    setLoading(true);

    try {
      await client.patch(`/api/candidate?email=${encodeURIComponent(user.email)}`, {
        allowJobOffers,
        allowCVReview,
      });

      const text = 'Lưu cài đặt bảo mật thành công!';
      setMsg({ type: 'success', text });
      setIsCompleted(true);
      showToast('success', text);
    } catch (err) {
      const text = err.response?.data?.message || 'Lỗi lưu cài đặt.';
      setMsg({ type: 'error', text });
      showToast('error', text);
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  return (
    <>
      {/* Toast */}
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
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Thay đổi cài đặt bảo mật</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              Kiểm soát cách nhà tuyển dụng và hệ thống hỗ trợ tương tác với bạn.
            </p>
          </div>
          {isCompleted && (
            <CheckCircle2 className="w-6 h-6 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
          )}
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 max-w-2xl">
          <SecurityToggle
            label="Nhận cơ hội việc làm tốt hơn"
            description="Nhận cơ hội việc làm với mức lương cao hơn 20 - 50% lương hiện tại từ các nhà tuyển dụng phù hợp."
            checked={allowJobOffers}
            onChange={() => setAllowJobOffers(!allowJobOffers)}
          />
          <SecurityToggle
            label="Cho phép hỗ trợ sửa và đánh giá CV"
            description="Cho phép hệ thống và chuyên gia cải thiện, tối ưu CV để tăng tỉ lệ được phỏng vấn."
            checked={allowCVReview}
            onChange={() => setAllowCVReview(!allowCVReview)}
          />

          <div className="flex items-center gap-4 pt-2">
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 rounded-lg font-semibold shadow-sm
                bg-blue-600 hover:bg-blue-700 disabled:opacity-50
                text-white transition-colors"
            >
              {loading ? 'Đang lưu...' : 'Lưu'}
            </button>

            {msg && (
              <div
                className={`flex items-center gap-2 text-sm ${
                  msg.type === 'error' ? 'text-red-600' : 'text-emerald-600'
                }`}
              >
                <AlertCircle className="w-4 h-4" />
                <span>{msg.text}</span>
              </div>
            )}
          </div>
        </form>
      </div>
    </>
  );
}
