// src/components/PolicyModal.jsx
export default function PolicyModal({ open, title, children, onClose }) {
  if (!open) return null;

  return (
    <div className="policy-overlay">
      <div className="policy-modal">
        <div className="policy-header">
          <h1>{title}</h1>
        </div>

        <div className="policy-body">{children}</div>

        <div className="policy-footer">
          <button onClick={onClose} className="policy-close-btn">
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
}
