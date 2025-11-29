// src/pages/MyCV.jsx

import React, { useState, useEffect, useRef } from "react";
import { useAuth } from "../context/AuthContext";
import client from "../api/client";
import {
  CheckCircle2,
  FileText,
  X,
  Trash2,
  CloudUpload,
  FileCheck,
  Shield,
  Clock,
  Download,
} from "lucide-react";

// ----------------- COMMON UI -----------------

const PremiumCard = ({ children, className = "" }) => (
  <div className={`cv-card ${className}`}>{children}</div>
);

const GradientButton = ({
  children,
  onClick,
  disabled,
  className = "",
  icon: Icon,
}) => (
  <button
    type="button"
    onClick={onClick}
    disabled={disabled}
    className={`cv-primary-btn ${className}`}
  >
    {Icon && !disabled && <Icon className="cv-primary-btn-icon" />}
    <span className="cv-primary-btn-label">
      {disabled ? (
        <span className="cv-btn-loading">
          <span className="cv-btn-spinner" />
          <span>Đang xử lý...</span>
        </span>
      ) : (
        children
      )}
    </span>
  </button>
);

// ----------------- STEP 1: UPLOAD -----------------

const UploadStep = ({ onFileSelect }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState("");
  const fileInputRef = useRef(null);

  const ALLOWED_TYPES = [
    "application/pdf",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ];
  const MAX_FILE_SIZE = 5 * 1024 * 1024;

  const validateFile = (file) => {
    if (!ALLOWED_TYPES.includes(file.type)) {
      setError("Chỉ hỗ trợ định dạng PDF hoặc Word (.pdf, .docx)");
      return false;
    }
    if (file.size > MAX_FILE_SIZE) {
      setError("File quá lớn (tối đa 5MB)");
      return false;
    }
    setError("");
    return true;
  };

  const handleFileChange = (e) => {
    const files = e.target.files;
    if (files && files[0]) validateFile(files[0]) && onFileSelect(files[0]);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => setIsDragging(false);

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files && files[0]) validateFile(files[0]) && onFileSelect(files[0]);
  };

  return (
    <div className="cv-upload-step">
      <div className="cv-upload-header">
        <h2>Tải lên CV mới</h2>
        <p>Cập nhật hồ sơ để nhà tuyển dụng tìm thấy bạn dễ dàng hơn</p>
      </div>

      <div
        className={`cv-dropzone ${isDragging ? "cv-dropzone-dragging" : ""}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,.docx"
          onChange={handleFileChange}
          className="cv-file-input-hidden"
        />

        <div
          className={`cv-dropzone-icon-wrapper ${
            isDragging ? "cv-dropzone-icon-dragging" : ""
          }`}
        >
          <CloudUpload className="cv-dropzone-icon" />
        </div>

        <h3 className="cv-dropzone-title">Kéo thả CV vào đây</h3>
        <p className="cv-dropzone-subtitle">
          hoặc nhấn để chọn file từ máy tính
        </p>

        <div className="cv-dropzone-meta">
          <span className="cv-dropzone-meta-item">
            <FileText className="cv-dropzone-meta-icon" />
            PDF / DOCX
          </span>
          <span className="cv-dropzone-meta-dot" />
          <span className="cv-dropzone-meta-item">
            <Shield className="cv-dropzone-meta-icon" />
            Max 5MB
          </span>
        </div>
      </div>

      {error && (
        <div className="cv-error-alert">
          <X className="cv-error-icon" />
          <span className="cv-error-text">{error}</span>
        </div>
      )}
    </div>
  );
};

// ----------------- STEP 2: PREVIEW -----------------

const PreviewStep = ({ fileData, onBack, onConfirm, loading }) => {
  const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return (
      parseFloat((bytes / Math.pow(k, i)).toFixed(2)) +
      " " +
      ["Bytes", "KB", "MB"][i]
    );
  };

  return (
    <div className="cv-preview-step">
      <div className="cv-preview-header">
        <h2>Kiểm tra lại file</h2>
        <p>Đảm bảo đây là phiên bản CV mới nhất của bạn</p>
      </div>

      <div className="cv-preview-card">
        <div className="cv-preview-card-overlay" />
        <div className="cv-preview-card-inner">
          <div className="cv-preview-icon-box">
            {fileData.type.includes("pdf") ? "📄" : "📝"}
          </div>
          <div className="cv-preview-info">
            <h4>{fileData.name}</h4>
            <div className="cv-preview-tags">
              <span className="cv-tag cv-tag-muted">
                {formatFileSize(fileData.size)}
              </span>
              <span className="cv-tag cv-tag-success">Ready to upload</span>
            </div>
          </div>
        </div>
      </div>

      <div className="cv-preview-actions">
        <button
          type="button"
          onClick={onBack}
          className="cv-secondary-btn cv-preview-back-btn"
        >
          Quay lại
        </button>
        <GradientButton
          onClick={onConfirm}
          disabled={loading}
          className="cv-preview-confirm-btn"
          icon={CloudUpload}
        >
          Xác nhận tải lên
        </GradientButton>
      </div>
    </div>
  );
};

// ----------------- STEP 3: DONE -----------------

const ConfirmationStep = ({ fileName, onUploadAnother }) => (
  <div className="cv-confirmation-step">
    <div className="cv-confirmation-icon-wrap">
      <div className="cv-confirmation-icon-inner">
        <CheckCircle2 className="cv-confirmation-icon" />
      </div>
    </div>

    <h3 className="cv-confirmation-title">Thành công!</h3>
    <p className="cv-confirmation-text">
      CV{" "}
      <span className="cv-confirmation-highlight">
        {fileName || "của bạn"}
      </span>{" "}
      đã được lưu trữ an toàn vào hệ thống. Bạn có thể sử dụng nó để ứng tuyển
      ngay.
    </p>

    <button
      type="button"
      onClick={onUploadAnother}
      className="cv-secondary-btn cv-confirmation-btn"
    >
      Tải lên bản khác
    </button>
  </div>
);

// ----------------- MAIN PAGE -----------------

export default function MyCV() {
  const { user } = useAuth();

  const [step, setStep] = useState(1);
  const [file, setFile] = useState(null);
  const [fileData, setFileData] = useState({ name: "", size: 0, type: "" });

  const [myResumes, setMyResumes] = useState([]);
  const [loadingResumes, setLoadingResumes] = useState(true);
  const [loadingUpload, setLoadingUpload] = useState(false);
  const [error, setError] = useState(null);

  const normalizeCVArray = (cv) => {
    let cvArray = [];
    if (Array.isArray(cv)) cvArray = cv;
    else if (cv) cvArray = [cv];

    cvArray.sort(
      (a, b) =>
        new Date(b.uploadedAt || 0).getTime() -
        new Date(a.uploadedAt || 0).getTime()
    );
    return cvArray;
  };

  const fetchResumes = async () => {
    if (!user?.email) return;
    setLoadingResumes(true);
    try {
      const res = await client.get(
        `/api/candidate?email=${user.email}`
      );

      const candidate =
        res.data?.success && res.data.data ? res.data.data : res.data;

      const cvArray = normalizeCVArray(candidate?.CV);
      setMyResumes(cvArray);
    } catch (err) {
      console.error(err);
      setMyResumes([]);
    } finally {
      setLoadingResumes(false);
    }
  };

  useEffect(() => {
    if (user?.CV) {
      const cvArray = normalizeCVArray(user.CV);
      setMyResumes(cvArray);
      setLoadingResumes(false);
    } else if (user?.email) {
      fetchResumes();
    } else {
      setLoadingResumes(false);
    }
  }, [user]);

  const handleFileSelect = (selectedFile) => {
    setFile(selectedFile);
    setFileData({
      name: selectedFile.name,
      size: selectedFile.size,
      type: selectedFile.type,
    });
    setStep(2);
  };

  const handleConfirm = async () => {
    if (!user?.email || !file) return;
    setLoadingUpload(true);
    setError(null);

    const formData = new FormData();
    formData.append("cv", file);

    try {
      await client.post(
        `/api/upload/candidate/cv?email=${encodeURIComponent(user.email)}`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      setStep(3);
      fetchResumes();
    } catch (err) {
      console.error(err);
      setError(err?.response?.data?.message || "Lỗi hệ thống");
      setStep(1);
    } finally {
      setLoadingUpload(false);
    }
  };

  const handleDeleteCV = async (cv) => {
    if (!window.confirm(`Xóa vĩnh viễn CV "${cv.name}"?`)) return;
    try {
      await client.patch(
        `/api/upload/candidate/cv?email=${encodeURIComponent(
          user.email
        )}&public_id=${encodeURIComponent(cv.public_id)}`
      );  
      fetchResumes();
    } catch (err) {
      console.error(err);
      alert("Lỗi khi xóa");
    }
  };

  return (
    <div className="cv-page">
      {/* HEADER */}
      <header className="cv-header">
        <div className="cv-header-text">
          <h1>Quản lý hồ sơ</h1>
          <p>Lưu trữ và quản lý các phiên bản CV của bạn</p>
        </div>
        <div className="cv-header-chip">
          <span
            className={`cv-header-chip-dot ${
              myResumes.length > 0 ? "cv-header-chip-dot-active" : ""
            }`}
          />
          <span>{myResumes.length} CV đang lưu trữ</span>
        </div>
      </header>

      {/* MAIN CONTENT: 2 CARD XẾP DỌC */}
      <div className="cv-main-column">
        {/* CARD 1: DANH SÁCH CV */}
        <section className="cv-section cv-section-list">
          <PremiumCard className="cv-list-card">
            <div className="cv-list-header">
              <h3>Danh sách CV</h3>
              {loadingResumes && (
                <span className="cv-sync-badge">Đang đồng bộ...</span>
              )}
            </div>

            <div className="cv-list-body cv-list-scroll">
              {loadingResumes ? (
                <div className="cv-skeleton-list">
                  <div className="cv-skeleton-item" />
                  <div className="cv-skeleton-item" />
                </div>
              ) : myResumes.length === 0 ? (
                <div className="cv-empty-state">
                  <FileText className="cv-empty-icon" />
                  <p className="cv-empty-title">
                    Chưa có CV nào trong kho lưu trữ
                  </p>
                  <p className="cv-empty-subtitle">
                    Hãy tải lên CV đầu tiên của bạn ở card phía dưới
                  </p>
                </div>
              ) : (
                <div className="cv-list">
                  {myResumes.map((cv, index) => (
                    <article key={cv._id || index} className="cv-item group">
                      <div className="cv-item-main">
                        <div className="cv-item-icon-box">
                          <FileCheck className="cv-item-icon" />
                        </div>

                        <div className="cv-item-content">
                          <div className="cv-item-title-row">
                            <h4>{cv.name || "CV chưa đặt tên"}</h4>
                          </div>

                          <div className="cv-item-meta">
                            <span className="cv-item-meta-date">
                              <Clock className="cv-item-meta-icon" />
                              {cv.uploadedAt
                                ? new Date(
                                    cv.uploadedAt
                                  ).toLocaleDateString("vi-VN")
                                : "Vừa xong"}
                            </span>
                            {index === 0 && (
                              <span className="cv-tag cv-tag-warning">
                                Mới nhất
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="cv-item-actions">
                        {cv.url && (
                          <a
                            href={cv.url}
                            target="_blank"
                            rel="noreferrer"
                            className="cv-item-action-btn"
                            title="Xem / Tải xuống"
                          >
                            <Download className="cv-item-action-icon" />
                          </a>
                        )}
                        <button
                          type="button"
                          onClick={() => handleDeleteCV(cv)}
                          className="cv-item-action-btn cv-item-action-danger"
                          title="Xóa file"
                        >
                          <Trash2 className="cv-item-action-icon" />
                        </button>
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </div>
          </PremiumCard>
        </section>

        {/* CARD 2: TẢI CV MỚI LÊN */}
        <section className="cv-section cv-section-upload">
          <PremiumCard className="cv-upload-card cv-upload-card-full">
            <div className="cv-upload-card-inner">
              {step === 1 && <UploadStep onFileSelect={handleFileSelect} />}
              {step === 2 && (
                <PreviewStep
                  fileData={fileData}
                  onBack={() => {
                    setStep(1);
                    setFile(null);
                  }}
                  onConfirm={handleConfirm}
                  loading={loadingUpload}
                />
              )}
              {step === 3 && (
                <ConfirmationStep
                  fileName={fileData.name}
                  onUploadAnother={() => {
                    setStep(1);
                    setFile(null);
                    setError(null);
                  }}
                />
              )}

              {step === 1 && error && (
                <div className="cv-error-global">
                  <X className="cv-error-global-icon" />
                  <span>{error}</span>
                </div>
              )}
            </div>
          </PremiumCard>
        </section>

        {/* Decor (nếu còn dùng) */}
        <div className="cv-decor-circle cv-decor-circle-1" />
        <div className="cv-decor-circle cv-decor-circle-2" />
      </div>
    </div>
  );
}
