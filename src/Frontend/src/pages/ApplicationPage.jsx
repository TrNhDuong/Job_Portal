// src/pages/ApplicationPage.jsx

import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import client from '../api/client';
import { UploadCloud, FileText } from 'lucide-react';

// Giả lập CV đã lưu (Bạn sẽ thay bằng API thật)
const FAKE_RESUMES = [
  { _id: "cv1", name: "John_Doe_Resume_2024.pdf", updated: "2 days ago" },
  { _id: "cv2", name: "John_Doe_Resume_Standard.pdf", updated: "1 month ago" },
];

export default function ApplicationPage() {
  const { id: jobId } = useParams();
  const navigate = useNavigate();
  
  const [selectedCV, setSelectedCV] = useState(FAKE_RESUMES[0]._id);
  const [coverLetter, setCoverLetter] = useState("");
  const [uploadedFile, setUploadedFile] = useState(null);
  
  const [msg, setMsg] = useState(null);
  const [loading, setLoading] = useState(false);

  // Logic Validation (Kiểm tra file)
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // 1. Kiểm tra loại file
    const allowedTypes = [
      'application/pdf', 
      'application/msword', 
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];
    if (!allowedTypes.includes(file.type)) {
      setMsg({ type: 'error', text: 'Lỗi: Chỉ chấp nhận file PDF, DOC, hoặc DOCX.' });
      setUploadedFile(null);
      return;
    }

    // 2. Kiểm tra kích thước (Max 5MB)
    const MAX_SIZE = 5 * 1024 * 1024; // 5MB
    if (file.size > MAX_SIZE) {
      setMsg({ type: 'error', text: 'Lỗi: File quá lớn. Kích thước tối đa là 5MB.' });
      setUploadedFile(null);
      return;
    }
    
    setMsg(null);
    setUploadedFile(file);
    setSelectedCV(null); 
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg(null);

    // 3. Kiểm tra (Validation) khi Submit
    if (!selectedCV && !uploadedFile) {
      return setMsg({ type: 'error', text: 'Vui lòng chọn hoặc tải lên một CV.' });
    }

    setLoading(true);

    const formData = new FormData();
    formData.append('jobId', jobId);
    formData.append('coverLetter', coverLetter);
    
    if (uploadedFile) {
      formData.append('resumeFile', uploadedFile); 
    } else {
      formData.append('resumeId', selectedCV); 
    }

    try {
      // 4. SỬA LỖI URL Ở ĐÂY: Thêm "/post-job"
      await client.patch(`/api/jobPost/post-job/applyJob/${jobId}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      // Nếu thành công -> Chuyển đến trang Status
      navigate(`/jobs/${jobId}/status`);

    } catch (err) {
      setMsg({ type: 'error', text: err.response?.data?.message || 'Nộp đơn thất bại.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen py-12">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">Complete Your Application</h1>
        <div className="text-gray-500 mb-6">Step 1 of 2</div>

        <form onSubmit={handleSubmit}>
          {/* Box 1: Chọn Resume */}
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-xl font-semibold mb-4">Step 1: Select Your Resume</h2>
            <div className="space-y-3 mb-4">
              {FAKE_RESUMES.map(cv => (
                <label 
                  key={cv._id} 
                  className={`flex items-center gap-3 p-4 border rounded-lg cursor-pointer
                    ${selectedCV === cv._id ? 'border-blue-600 bg-blue-50' : 'border-gray-300'}
                  `}
                >
                  <input
                    type="radio"
                    name="resume"
                    checked={selectedCV === cv._id}
                    onChange={() => {
                      setSelectedCV(cv._id);
                      setUploadedFile(null); 
                      setMsg(null);
                    }}
                  />
                  <FileText className="w-5 h-5 text-gray-500" />
                  <div>
                    <div className="font-semibold">{cv.name}</div>
                    <div className="text-sm text-gray-500">Updated {cv.updated}</div>
                  </div>
                </label>
              ))}
            </div>

            <div className="text-center my-4 text-gray-500">OR UPLOAD NEW RESUME</div>

            {/* Vùng Upload */}
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <UploadCloud className="w-10 h-10 text-gray-400 mx-auto" />
              <p className="mt-2 font-semibold text-gray-700">
                {uploadedFile ? uploadedFile.name : 'Upload your resume'}
              </p>
              <p className="text-sm text-gray-500">PDF or DOCX (Max 5 MB)</p>
              <input 
                type="file" 
                className="hidden" 
                id="fileUpload"
                accept=".pdf,.doc,.docx"
                onChange={handleFileChange}
              />
              {!uploadedFile && (
                <button
                  type="button"
                  onClick={() => document.getElementById('fileUpload').click()}
                  className="mt-3 px-4 py-2 text-sm font-semibold text-blue-600 rounded-lg border border-gray-300 hover:bg-gray-50"
                >
                  Browse
                </button>
              )}
            </div>
          </div>

          {/* Box 2: Cover Letter */}
          <div className="bg-white p-6 rounded-lg shadow-sm mt-6">
            <h2 className="text-xl font-semibold mb-4">Step 2: Cover Letter</h2>
            <label className="text-sm font-medium text-gray-700">
              Why are you interested in this position?
            </label>
            <textarea
              value={coverLetter}
              onChange={(e) => setCoverLetter(e.target.value)}
              rows="6"
              className="w-full mt-2 p-3 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-blue-500"
              placeholder="Tell us about your interest in this role..."
            ></textarea>
          </div>
          
          {/* Nút Submit */}
          <div className="flex items-center justify-end gap-4 mt-6">
            {msg && <span className={msg.type === 'error' ? 'text-red-500' : 'text-green-600'}>{msg.text}</span>}
            <button 
              type="button" 
              onClick={() => navigate(`/jobs/${jobId}`)}
              className="px-6 py-3 font-semibold text-gray-700 rounded-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 font-semibold bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? 'Submitting...' : 'Submit Application'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}