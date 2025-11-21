import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; 
import client from '../api/client';
import { 
  UploadCloud, 
  FileText, 
  AlertCircle, 
  CheckCircle, 
  ChevronRight, 
  X 
} from 'lucide-react';

export default function ApplicationPage() {
  const { id: jobId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth(); 

  const [selectedCV, setSelectedCV] = useState(null);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [error, setError] = useState(null); 
  const [loading, setLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false); 

  // Tự động chọn CV đầu tiên
  useEffect(() => {
    if (user && user.CV && user.CV.length > 0) {
      setSelectedCV(user.CV[0]._id);
    }
  }, [user]);

  // --- HANDLERS ---

  const handleSelectCV = (cvId) => {
    setSelectedCV(cvId);
    setUploadedFile(null); 
    setError(null); 
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const allowedTypes = [
      'application/pdf', 
      'application/msword', 
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];
    if (!allowedTypes.includes(file.type)) {
      setError('Only PDF, DOC, or DOCX files are allowed.');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError('File size exceeds 5MB limit.');
      return;
    }

    setUploadedFile(file);
    setSelectedCV(null);
    setError(null);
    e.target.value = null; 
  };

  const handleRemoveUploadedFile = (e) => {
    e.stopPropagation(); 
    setUploadedFile(null);
  };

  // --- PHẦN SỬA ĐỔI QUAN TRỌNG ---
  const handleSubmit = async () => {
    if (!selectedCV && !uploadedFile) {
      setError('Please select a resume or upload a new one before submitting.');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    if (!user?.email) {
        setError('You must be logged in with a valid email to apply.');
        return;
    }

    setLoading(true);

    try {
      // If user uploaded a new file, first upload it to candidate CV endpoint
      if (uploadedFile) {
        const uploadFD = new FormData();
        uploadFD.append('cv', uploadedFile);
        // Do NOT set Content-Type header; let the browser/axios set the multipart boundary
        await client.post(`/api/upload/candidate/cv?email=${encodeURIComponent(user.email)}`, uploadFD);
        // After successful upload, backend updated candidate.CV — we don't strictly need the id here
      }

      // Now call applyJob with a JSON body containing email (and optionally resumeId)
      const body = { email: user.email };
      if (selectedCV) body.resumeId = selectedCV;

      await client.patch(`/api/post-job/applyJob?jobId=${jobId}`, body);

      setIsSuccess(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });

    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Failed to submit application. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  // --------------------------------

  // --- RENDER (Giữ nguyên UI) ---

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full bg-white p-8 rounded-xl shadow-sm text-center border border-gray-100">
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-blue-100 mb-6">
            <CheckCircle className="h-10 w-10 text-blue-600" />
          </div>
          
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Application Submitted Successfully!
          </h2>
          <p className="text-gray-500 mb-6">
            Your application has been received.
          </p>

          <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left border border-gray-100">
            <div className="text-sm text-gray-500 mb-1">Confirmation email sent to</div>
            <div className="font-medium text-gray-900">{user?.email || 'your email'}</div>
            
            <div className="mt-3 pt-3 border-t border-gray-200">
              <div className="text-sm text-gray-500 mb-1">Job Reference</div>
              <div className="font-mono text-sm font-medium text-gray-900">#JOB-{jobId ? jobId.slice(-6).toUpperCase() : 'ID'}</div>
            </div>
          </div>

          <div className="bg-blue-50 rounded-lg p-5 mb-8 text-left border border-blue-100">
            <h3 className="font-semibold text-blue-900 mb-3">What's Next?</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3 text-sm text-blue-800">
                <div className="min-w-[20px] h-5 flex items-center justify-center rounded-full bg-blue-200 text-blue-700 text-xs font-bold">1</div>
                <span>Our team will review your application within 3-5 business days.</span>
              </li>
              <li className="flex items-start gap-3 text-sm text-blue-800">
                <div className="min-w-[20px] h-5 flex items-center justify-center rounded-full bg-blue-200 text-blue-700 text-xs font-bold">2</div>
                <span>Check your dashboard to view application status.</span>
              </li>
            </ul>
          </div>

          <div className="flex flex-col gap-3">
            <button 
              onClick={() => navigate('/my-applications')} 
              className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              View My Applications <ChevronRight size={18} />
            </button>
            <button 
              onClick={() => navigate('/')}
              className="w-full py-3 px-4 bg-white border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors"
            >
              Browse More Jobs
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen py-12 px-4">
      <div className="max-w-3xl mx-auto">
        
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3 animate-fade-in">
            <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 shrink-0" />
            <div>
              <h3 className="text-sm font-bold text-red-800">Missing Information</h3>
              <p className="text-sm text-red-700 mt-1">{error}</p>
            </div>
          </div>
        )}

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-6 border-b border-gray-100">
            <h1 className="text-2xl font-bold text-gray-900">Select Your Resume</h1>
            <p className="text-gray-500 mt-1">Select a resume from your profile or upload a new one.</p>
          </div>

          <div className="p-6 space-y-8">
            {user?.CV && user.CV.length > 0 && (
              <div>
                <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4">Your Resumes</h2>
                <div className="space-y-3">
                  {user.CV.map((cv) => (
                    <label 
                      key={cv._id}
                      className={`relative flex items-center gap-4 p-4 border rounded-xl cursor-pointer transition-all
                        ${selectedCV === cv._id 
                          ? 'border-blue-600 bg-blue-50 ring-1 ring-blue-600' 
                          : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'}
                      `}
                    >
                      <input
                        type="radio"
                        name="resume"
                        className="sr-only" 
                        checked={selectedCV === cv._id}
                        onChange={() => handleSelectCV(cv._id)}
                      />
                      <div className={`p-2 rounded-lg ${selectedCV === cv._id ? 'bg-white text-blue-600' : 'bg-gray-100 text-gray-500'}`}>
                        <FileText className="w-6 h-6" />
                      </div>
                      <div className="flex-1">
                        <div className={`font-semibold ${selectedCV === cv._id ? 'text-blue-900' : 'text-gray-900'}`}>
                          {cv.name || "Untitled Resume"}
                        </div>
                        <div className="text-xs text-gray-500 mt-0.5">
                          Uploaded {cv.uploadedAt ? new Date(cv.uploadedAt).toLocaleDateString() : 'N/A'}
                        </div>
                      </div>
                      {selectedCV === cv._id && (
                        <CheckCircle className="w-6 h-6 text-blue-600" />
                      )}
                    </label>
                  ))}
                </div>
              </div>
            )}

            {user?.CV?.length > 0 && (
               <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">OR UPLOAD NEW RESUME</span>
                </div>
              </div>
            )}

            <div>
               {!uploadedFile ? (
                <div 
                  onClick={() => document.getElementById('fileUpload').click()}
                  className="border-2 border-dashed border-gray-300 rounded-xl p-8 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 hover:border-blue-400 transition-colors group"
                >
                  <div className="p-3 bg-gray-100 rounded-full mb-3 group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
                    <UploadCloud className="w-8 h-8 text-gray-400 group-hover:text-blue-600" />
                  </div>
                  <p className="font-semibold text-gray-900">Click to upload your resume</p>
                  <p className="text-sm text-gray-500 mt-1">PDF, DOC, DOCX (Max 5MB)</p>
                  <input 
                    type="file" 
                    id="fileUpload"
                    className="hidden" 
                    accept=".pdf,.doc,.docx"
                    onChange={handleFileChange}
                  />
                </div>
               ) : (
                 <div className="relative flex items-center gap-4 p-4 border border-blue-600 bg-blue-50 rounded-xl ring-1 ring-blue-600">
                    <div className="p-2 bg-white rounded-lg text-blue-600">
                      <FileText className="w-6 h-6" />
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold text-blue-900">{uploadedFile.name}</div>
                      <div className="text-xs text-blue-700 mt-0.5">
                        {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB • Ready to submit
                      </div>
                    </div>
                    <button 
                      onClick={handleRemoveUploadedFile}
                      className="p-2 hover:bg-blue-100 rounded-full text-blue-600 transition-colors"
                    >
                      <X size={20} />
                    </button>
                 </div>
               )}
            </div>
          </div>

          <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex items-center justify-end gap-3">
            <button 
              type="button" 
              onClick={() => navigate(`/jobs/${jobId}`)} 
              className="px-5 py-2.5 font-semibold text-gray-700 hover:bg-gray-200 rounded-lg transition-colors"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={loading}
              className={`px-6 py-2.5 font-semibold text-white rounded-lg transition-all shadow-sm flex items-center gap-2
                ${loading ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 hover:shadow-md'}
              `}
            >
              {loading ? 'Submitting...' : 'Submit Application'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}