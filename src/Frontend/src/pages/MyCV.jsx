// src/pages/MyCV.jsx

import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import client from '../api/client';
import { 
  Upload, CheckCircle2, FileText, X, Trash2, 
  CloudUpload, FileCheck, Shield, Clock, Download
} from 'lucide-react';

// --- UI COMPONENTS (Reused for consistency) ---

// 1. Card Container đẳng cấp
const PremiumCard = ({ children, className = "" }) => (
  <div className={`bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 overflow-hidden ${className}`}>
    {children}
  </div>
);

// 2. Nút bấm Gradient
const GradientButton = ({ children, onClick, disabled, className = "", icon: Icon }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className={`
      relative overflow-hidden group flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl font-semibold text-white 
      bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500
      shadow-lg shadow-indigo-200 transition-all duration-300 transform hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-70 disabled:cursor-not-allowed
      ${className}
    `}
  >
    {Icon && <Icon className="w-5 h-5" />}
    <span className="relative z-10">{children}</span>
  </button>
);

// --- Component 1: UploadStep (Premium Drag & Drop) ---
const UploadStep = ({ onFileSelect }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState("");
  const fileInputRef = useRef(null);

  const ALLOWED_TYPES = ["application/pdf", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"];
  const MAX_FILE_SIZE = 5 * 1024 * 1024;

  const validateFile = (file) => {
    if (!ALLOWED_TYPES.includes(file.type)) {
      setError("Chỉ hỗ trợ định dạng PDF hoặc Word (.pdf, .docx)");
      return false;
    }
    if (file.size > MAX_FILE_SIZE) {
      setError("File quá lớn (Tối đa 5MB)");
      return false;
    }
    setError("");
    return true;
  };

  const handleFileChange = (e) => {
    const files = e.target.files;
    if (files && files[0]) validateFile(files[0]) && onFileSelect(files[0]);
  };

  const handleDragOver = (e) => { e.preventDefault(); setIsDragging(true); };
  const handleDragLeave = () => setIsDragging(false);
  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files && files[0]) validateFile(files[0]) && onFileSelect(files[0]);
  };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-slate-800">Tải lên CV mới</h2>
        <p className="text-slate-500">Cập nhật hồ sơ để nhà tuyển dụng tìm thấy bạn dễ dàng hơn</p>
      </div>

      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`
          relative group cursor-pointer rounded-3xl border-2 border-dashed p-10 text-center transition-all duration-500 ease-out
          ${isDragging 
            ? "border-indigo-500 bg-indigo-50/50 scale-[1.02]" 
            : "border-slate-200 bg-slate-50/30 hover:border-indigo-400 hover:bg-indigo-50/30"
          }
        `}
      >
        <input ref={fileInputRef} type="file" accept=".pdf,.docx" onChange={handleFileChange} className="hidden" />
        
        {/* Animated Icon Wrapper */}
        <div className={`
          mx-auto mb-6 w-20 h-20 rounded-full flex items-center justify-center transition-all duration-500
          ${isDragging ? "bg-white shadow-xl scale-110" : "bg-white shadow-md group-hover:scale-110 group-hover:shadow-lg"}
        `}>
          <CloudUpload className={`w-10 h-10 transition-colors ${isDragging ? "text-indigo-600" : "text-slate-400 group-hover:text-indigo-500"}`} strokeWidth={1.5} />
        </div>

        <h3 className="text-lg font-bold text-slate-700 mb-2 group-hover:text-indigo-700 transition-colors">
          Kéo thả CV vào đây
        </h3>
        <p className="text-slate-500 mb-6 font-medium">hoặc nhấn để chọn file từ máy tính</p>
        
        <div className="flex items-center justify-center gap-4 text-xs font-medium text-slate-400 uppercase tracking-wider">
          <span className="flex items-center gap-1"><FileText className="w-3 h-3" /> PDF / DOCX</span>
          <span className="w-1 h-1 rounded-full bg-slate-300"></span>
          <span className="flex items-center gap-1"><Shield className="w-3 h-3" /> Max 5MB</span>
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-3 rounded-xl bg-red-50 p-4 text-red-600 border border-red-100 animate-in fade-in slide-in-from-top-2">
          <X className="w-5 h-5 shrink-0" />
          <span className="font-medium">{error}</span>
        </div>
      )}
    </div>
  );
};

// --- Component 2: PreviewStep (Document Look) ---
const PreviewStep = ({ fileData, onBack, onConfirm, loading }) => {
  const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024; const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + ["Bytes", "KB", "MB"][i];
  };

  return (
    <div className="p-2">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-slate-800">Kiểm tra lại file</h2>
        <p className="text-slate-500 mt-1">Đảm bảo đây là phiên bản CV mới nhất của bạn</p>
      </div>

      {/* File Card */}
      <div className="relative bg-slate-900 rounded-2xl p-1 overflow-hidden mb-8 shadow-2xl shadow-indigo-200">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 to-purple-600 opacity-20"></div>
        <div className="bg-white rounded-xl p-6 relative z-10 flex items-center gap-5">
          <div className="w-16 h-16 rounded-lg bg-indigo-50 flex items-center justify-center border border-indigo-100 shadow-sm text-4xl">
            {fileData.type.includes('pdf') ? '📄' : '📝'}
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="text-lg font-bold text-slate-800 truncate">{fileData.name}</h4>
            <div className="flex items-center gap-3 mt-1">
              <span className="text-sm font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded">{formatFileSize(fileData.size)}</span>
              <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded uppercase tracking-wide">Ready to upload</span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex gap-4">
        <button
          onClick={onBack}
          className="flex-1 px-6 py-3.5 rounded-xl font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors"
        >
          Quay lại
        </button>
        <GradientButton 
          onClick={onConfirm} 
          disabled={loading} 
          className="flex-1"
          icon={loading ? null : CloudUpload}
        >
          {loading ? (
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <span>Đang xử lý...</span>
            </div>
          ) : "Xác nhận tải lên"}
        </GradientButton>
      </div>
    </div>
  );
};

// --- Component 3: ConfirmationStep (Success Celebration) ---
const ConfirmationStep = ({ fileName, onUploadAnother }) => (
  <div className="text-center py-8">
    <div className="mx-auto w-24 h-24 bg-green-50 rounded-full flex items-center justify-center mb-6 animate-in zoom-in duration-300">
      <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center shadow-inner">
        <CheckCircle2 className="w-10 h-10 text-green-600" strokeWidth={3} />
      </div>
    </div>
    
    <h3 className="text-3xl font-bold text-slate-800 mb-3">Thành công!</h3>
    <p className="text-slate-600 mb-8 max-w-md mx-auto leading-relaxed">
      CV <span className="font-bold text-indigo-600 px-1">{fileName}</span> đã được lưu trữ an toàn vào hệ thống. Bạn có thể sử dụng nó để ứng tuyển ngay.
    </p>
    
    <button
      onClick={onUploadAnother}
      className="px-8 py-3 rounded-xl font-semibold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 transition-colors border border-indigo-200"
    >
      Tải lên bản khác
    </button>
  </div>
);

// --- MAIN PAGE: MyCV ---
export default function MyCV() {
  const { user } = useAuth();
  const [step, setStep] = useState(1);
  const [file, setFile] = useState(null);
  const [fileData, setFileData] = useState({ name: "", size: 0, type: "" });
  
  const [myResumes, setMyResumes] = useState([]); 
  const [loadingResumes, setLoadingResumes] = useState(true);
  const [loadingUpload, setLoadingUpload] = useState(false);
  const [error, setError] = useState(null);

  // Logic giữ nguyên
  const fetchResumes = async () => {
    if (!user?.email) return;
    setLoadingResumes(true);
    try {
      const res = await client.get(`/api/candidate?email=${user.email}`);
      if (res.data.success && res.data.data) setMyResumes(res.data.data.CV || []);
    } catch (err) { console.error(err); } 
    finally { setLoadingResumes(false); }
  };

  useEffect(() => { fetchResumes(); }, [user]);

  const handleFileSelect = (selectedFile) => {
    setFile(selectedFile);
    setFileData({ name: selectedFile.name, size: selectedFile.size, type: selectedFile.type });
    setStep(2);
  };

  const handleConfirm = async () => {
    if (!user?.email) return;
    setLoadingUpload(true); setError(null);
    const formData = new FormData();
    formData.append('cv', file);
    try {
        await client.post(`/api/upload/candidate/cv?email=${user.email}`, formData, {headers: {"Content-Type": "multipart/form-data"}});
        setStep(3);
        fetchResumes(); // Refresh list immediately
    } catch (err) {
        setError(err.response?.data?.message || "Lỗi hệ thống");
        setStep(1);
    } finally { setLoadingUpload(false); }
  };

  const handleDeleteCV = async (cv) => {
    if (!window.confirm(`Xóa vĩnh viễn CV "${cv.name}"?`)) return;
    try {
      await client.patch(`/api/upload/candidate/cv?email=${user.email}`, { public_id: cv.public_id, cv_id: cv._id });
      fetchResumes();
    } catch (err) { alert("Lỗi khi xóa"); }
  };

  // --- RENDER ---
  return (
    <div className="max-w-6xl mx-auto py-10 px-6 space-y-10">
      
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-2">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Quản lý hồ sơ</h1>
          <p className="text-slate-500 mt-1 text-lg">Lưu trữ và quản lý các phiên bản CV của bạn</p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-full border border-slate-200 shadow-sm text-sm font-medium text-slate-600">
          <div className={`w-2.5 h-2.5 rounded-full ${myResumes.length > 0 ? 'bg-emerald-500 animate-pulse' : 'bg-slate-300'}`}></div>
          {myResumes.length} CV đang lưu trữ
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* LEFT COLUMN: LIST CV (Chiếm 7 phần) */}
        <div className="lg:col-span-7 space-y-6">
          <PremiumCard className="min-h-[500px]">
            <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
              <h3 className="font-bold text-slate-800 text-lg">Danh sách CV</h3>
              {loadingResumes && <span className="text-xs font-medium text-indigo-600 bg-indigo-50 px-2 py-1 rounded-full">Đang đồng bộ...</span>}
            </div>
            
            <div className="p-6">
              {loadingResumes ? (
                <div className="space-y-4">
                  {[1,2].map(i => <div key={i} className="h-24 bg-slate-50 rounded-2xl animate-pulse" />)}
                </div>
              ) : myResumes.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-80 text-center border-2 border-dashed border-slate-100 rounded-2xl bg-slate-50/30">
                  <FileText className="w-16 h-16 text-slate-300 mb-4" strokeWidth={1} />
                  <p className="text-slate-500 font-medium">Chưa có CV nào trong kho lưu trữ</p>
                  <p className="text-slate-400 text-sm mt-1">Hãy tải lên CV đầu tiên của bạn ở cột bên phải</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {myResumes.map((cv, index) => (
                    <div key={cv._id || index} className="group relative bg-white border border-slate-200 rounded-2xl p-5 hover:shadow-xl hover:shadow-indigo-100/50 hover:border-indigo-200 transition-all duration-300">
                      <div className="flex items-start gap-5">
                        {/* Icon Box */}
                        <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0 group-hover:bg-indigo-600 group-hover:text-white transition-colors duration-300">
                          <FileCheck className="w-6 h-6" />
                        </div>
                        
                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-start">
                            <h4 className="font-bold text-slate-800 text-lg truncate pr-8 group-hover:text-indigo-700 transition-colors">
                              {cv.name || "CV Chưa đặt tên"}
                            </h4>
                          </div>
                          
                          <div className="flex items-center gap-4 mt-2 text-sm text-slate-500">
                            <span className="flex items-center gap-1.5">
                              <Clock className="w-3.5 h-3.5" />
                              {cv.uploadedAt ? new Date(cv.uploadedAt).toLocaleDateString('vi-VN') : "Vừa xong"}
                            </span>
                            {index === 0 && (
                              <span className="px-2 py-0.5 bg-orange-50 text-orange-600 text-xs font-bold uppercase tracking-wide rounded-full border border-orange-100">
                                Mới nhất
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Actions Overlay (Hiệu ứng hover) */}
                      <div className="absolute top-5 right-5 flex gap-2 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity duration-200">
                        {cv.url && (
                          <a 
                            href={cv.url} target="_blank" rel="noreferrer"
                            className="p-2 rounded-lg bg-slate-100 text-slate-600 hover:bg-indigo-50 hover:text-indigo-600 transition-colors"
                            title="Xem/Tải xuống"
                          >
                            <Download className="w-5 h-5" />
                          </a>
                        )}
                        <button 
                          onClick={() => handleDeleteCV(cv)}
                          className="p-2 rounded-lg bg-slate-100 text-slate-600 hover:bg-red-50 hover:text-red-600 transition-colors"
                          title="Xóa file"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </PremiumCard>
        </div>

        {/* RIGHT COLUMN: UPLOAD FORM (Chiếm 5 phần) */}
        <div className="lg:col-span-5 sticky top-8">
          <PremiumCard className="border-t-4 border-t-indigo-500">
             <div className="p-8">
                {step === 1 && <UploadStep onFileSelect={handleFileSelect} />}
                {step === 2 && (
                  <PreviewStep 
                    fileData={fileData} 
                    onBack={() => { setStep(1); setFile(null); }} 
                    onConfirm={handleConfirm} 
                    loading={loadingUpload} 
                  />
                )}
                {step === 3 && (
                  <ConfirmationStep 
                    fileName={fileData.name} 
                    onUploadAnother={() => { setStep(1); setFile(null); setError(null); }} 
                  />
                )}
                
                {/* Error Global Display if needed */}
                {step === 1 && error && (
                  <div className="mt-6 p-4 rounded-xl bg-red-50 border border-red-100 text-red-600 text-sm flex gap-3 items-start">
                    <X className="w-5 h-5 shrink-0 mt-0.5" />
                    {error}
                  </div>
                )}
             </div>
          </PremiumCard>

          {/* Decorative Background Element */}
          <div className="absolute -z-10 top-10 -right-10 w-64 h-64 bg-indigo-400/10 rounded-full blur-3xl"></div>
          <div className="absolute -z-10 bottom-10 -left-10 w-64 h-64 bg-violet-400/10 rounded-full blur-3xl"></div>
        </div>

      </div>
    </div>
  );
}