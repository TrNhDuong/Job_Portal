// src/pages/MyCV.jsx

import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import client from '../api/client';
import { Upload, CheckCircle, FileText, X } from 'lucide-react';

// --- Component 1: UploadStep (Dịch từ upload-step.tsx) ---
const UploadStep = ({ onFileSelect }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState("");
  const fileInputRef = useRef(null); // Sửa: Dùng useRef cho JSX

  const ALLOWED_TYPES = ["application/pdf", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"];
  const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

  const validateFile = (file) => {
    if (!ALLOWED_TYPES.includes(file.type)) {
      setError("Chỉ hỗ trợ file PDF hoặc Word (.pdf, .docx)");
      return false;
    }
    if (file.size > MAX_FILE_SIZE) {
      setError("Kích thước file phải nhỏ hơn 5MB");
      return false;
    }
    setError("");
    return true;
  };

  const handleFileChange = (e) => {
    const files = e.target.files;
    if (files && files[0]) {
      if (validateFile(files[0])) {
        onFileSelect(files[0]);
      }
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files && files[0]) {
      if (validateFile(files[0])) {
        onFileSelect(files[0]);
      }
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold mb-1">Tải lên CV mới</h2>
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`relative rounded-lg border-2 border-dashed p-12 text-center transition-all ${
          isDragging ? "border-blue-600 bg-blue-50" : "border-gray-300 bg-white hover:border-blue-500"
        }`}
      >
        <input ref={fileInputRef} type="file" accept=".pdf,.docx" onChange={handleFileChange} className="hidden" />
        <Upload className="mx-auto mb-4 h-12 w-12 text-blue-600" />
        <p className="mb-2 text-xl font-semibold text-gray-800">Kéo và thả CV của bạn vào đây</p>
        <p className="mb-6 text-gray-500">hoặc nhấn để chọn file</p>
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow-sm hover:bg-blue-700"
        >
          Chọn File
        </button>
        <p className="mt-4 text-sm text-gray-500">Hỗ trợ: PDF, Word (.docx) • Tối đa: 5MB</p>
      </div>
      {error && <div className="rounded-lg bg-red-100 p-4 text-red-700">{error}</div>}
    </div>
  );
};

// --- Component 2: PreviewStep (Dịch từ preview-step.tsx) ---
const PreviewStep = ({ fileData, onBack, onConfirm, loading }) => {
  const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
  };
  const getFileIcon = (type) => (type === "application/pdf" ? "📄" : "📃");

  return (
  	<div className="bg-white rounded-lg shadow-sm p-6 md:p-8">
		<h2 className="text-2xl font-bold mb-6">Xác nhận CV của bạn</h2>
    <div className="space-y-6">
      <div className="rounded-lg border border-gray-200 bg-white p-6">
        <h3 className="mb-4 text-lg font-semibold text-gray-800">Xem lại file tải lên</h3>
        <div className="mb-6 flex items-center gap-4 rounded-lg bg-gray-50 p-4">
          <span className="text-3xl">{getFileIcon(fileData.type)}</span>
          <div className="flex-1">
            <p className="font-medium text-gray-800">{fileData.name}</p>
            <p className="text-sm text-gray-500">{formatFileSize(fileData.size)}</p>
          </div>
        </div>
      </div>
      <div className="flex gap-3">
        <button
          onClick={onBack}
          className="flex-1 px-6 py-2 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 bg-white"
        >
          Quay lại
        </button>
        <button 
          onClick={onConfirm} 
          disabled={loading}
          className="flex-1 px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? "Đang tải lên..." : "Xác nhận & Tải lên"}
        </button>
      </div>
    </div>
	</div>
  );
};

// --- Component 3: ConfirmationStep (Dịch từ confirmation-step.tsx) ---
const ConfirmationStep = ({ fileName, onUploadAnother }) => {
  return (
  	<div className="bg-white rounded-lg shadow-sm p-6 md:p-8">
    <div className="space-y-6 text-center">
      <div className="mx-auto rounded-full bg-green-100 p-6 w-fit">
        <CheckCircle className="h-16 w-16 text-green-600" />
      </div>
      <div>
        <h3 className="mb-2 text-2xl font-bold text-gray-800">Tải CV thành công!</h3>
        <p className="text-gray-600">
          File <span className="font-medium">{fileName}</span> của bạn đã được lưu lại.
        </p>
      </div>
      <div className="flex gap-3 pt-4">
        <button
          onClick={onUploadAnother}
          className="flex-1 px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700"
        >
          Tải lên CV khác
        </button>
      </div>
    </div>
	</div>
  );
};

// --- Component 4: Trang Cha (MyCV.jsx) ---
// (Kết hợp logic và UI)
export default function MyCV() {
  const { user } = useAuth();
  const [step, setStep] = useState(1); // 1: Upload, 2: Preview, 3: Confirm
  const [file, setFile] = useState(null);
  const [fileData, setFileData] = useState({ name: "", size: 0, type: "" });
  
  const [myResumes, setMyResumes] = useState([]); // CV đã lưu
  const [loadingResumes, setLoadingResumes] = useState(true);
  const [loadingUpload, setLoadingUpload] = useState(false);
  const [error, setError] = useState(null);

  // 1. LẤY DANH SÁCH CV ĐÃ CÓ
  const fetchResumes = async () => {
    if (!user) return;
    setLoadingResumes(true);
    try {
      // API này Backend cần tạo (GET /api/candidate/my-resumes)
      const res = await client.get('/api/candidate/my-resumes');
      setMyResumes(res.data.data || []);
    } catch (err) {
      console.error("Lỗi lấy CV:", err);
      setError("Không thể tải danh sách CV của bạn.");
    } finally {
      setLoadingResumes(false);
    }
  };

  // Chạy hàm lấy CV khi component được tải
  useEffect(() => {
    fetchResumes();
  }, [user]);

  // 2. XỬ LÝ CÁC BƯỚC UPLOAD
  const handleFileSelect = (selectedFile) => {
    setFile(selectedFile);
    setFileData({
      name: selectedFile.name,
      size: selectedFile.size,
      type: selectedFile.type,
    });
    setStep(2); // Chuyển sang bước Preview
  };

  const handleBack = () => {
    setStep(1); // Quay lại bước Upload
    setFile(null);
    setFileData(null);
  };

  // 3. XỬ LÝ LOGIC UPLOAD LÊN SERVER
  const handleConfirm = async () => {
    setLoadingUpload(true);
    setError(null);
    
    const formData = new FormData();
    formData.append('resumeFile', file); // Tên file phải khớp với Backend
    
    try {
      // API này Backend cần tạo (POST /api/candidate/upload-resume)
      // Nó phải xử lý file (ví dụ: upload lên S3) và cập nhật CSDL
      await client.post('/api/candidate/upload-resume', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      setStep(3); // Chuyển sang bước Thành công
      fetchResumes(); // Tải lại danh sách CV

    } catch (err) {
      setError(err.response?.data?.message || "Tải lên thất bại. Vui lòng thử lại.");
      setStep(1); // Quay lại bước Upload nếu lỗi
    } finally {
      setLoadingUpload(false);
    }
  };

  const handleUploadAnother = () => {
    setStep(1);
    setFile(null);
    setFileData(null);
    setError(null);
  };

  // 4. RENDER GIAO DIỆN
  return (
    <div className="flex flex-col gap-8">
      
      {/* KHỐI 1: DANH SÁCH CV ĐÃ LƯU */}
      <div className="bg-white rounded-lg shadow-sm p-6 md:p-8">
        <h2 className="text-2xl font-bold mb-6">CV của tôi</h2>
        {loadingResumes && <p>Đang tải CV...</p>}
        {!loadingResumes && error && <p className="text-red-500">{error}</p>}
        {!loadingResumes && myResumes.length > 0 && (
          <div className="space-y-3">
            {myResumes.map(cv => (
              <div key={cv._id} className="flex items-center gap-3 p-4 border rounded-lg">
                <FileText className="w-5 h-5 text-gray-500 flex-shrink-0" />
                <div className="flex-1">
                  <div className="font-semibold">{cv.name}</div>
                  <div className="text-sm text-gray-500">Cập nhật: {new Date(cv.updatedAt).toLocaleDateString()}</div>
                </div>
                <button className="p-2 hover:bg-gray-100 rounded-full">
                  <X className="w-4 h-4 text-gray-500" />
                </button>
              </div>
            ))}
          </div>
        )}
         {!loadingResumes && myResumes.length === 0 && (
          <p className="text-gray-500">Bạn chưa tải lên CV nào.</p>
         )}
      </div>

      {/* KHỐI 2: LOGIC TẢI CV (3 BƯỚC) */}
      {/* (Khối này sẽ thay đổi nội dung dựa trên 'step') */}
      <div className="bg-white rounded-lg shadow-sm p-6 md:p-8">
      	{/* Step Content */}
      	{step === 1 && <UploadStep onFileSelect={handleFileSelect} />}
      	{step === 2 && <PreviewStep fileData={fileData} onBack={handleBack} onConfirm={handleConfirm} loading={loadingUpload} />}
      	{step === 3 && <ConfirmationStep fileName={fileData.name} onUploadAnother={handleUploadAnother} />}
      </div>

    </div>
  );
}