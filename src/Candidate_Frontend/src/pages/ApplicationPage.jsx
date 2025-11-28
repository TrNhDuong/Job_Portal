// src/pages/ApplicationPage.jsx
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import client from "../api/client";
import {
  UploadCloud,
  FileText,
  AlertCircle,
  CheckCircle,
  ChevronRight,
  X,
} from "lucide-react";

export default function ApplicationPage() {
  const { id: jobId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [selectedCV, setSelectedCV] = useState(null);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    if (user?.CV?.length > 0) {
      setSelectedCV(user.CV[0]._id);
    }
  }, [user]);

  const handleSelectCV = (cvId) => {
    setSelectedCV(cvId);
    setUploadedFile(null);
    setError(null);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const allowed = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];
    if (!allowed.includes(file.type)) {
      setError("Only PDF, DOC, or DOCX files are allowed.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError("File must be under 5MB.");
      return;
    }

    setSelectedCV(null);
    setUploadedFile(file);
    setError(null);
  };

  const handleRemoveUploadedFile = (e) => {
    e.stopPropagation();
    setUploadedFile(null);
  };

  const handleSubmit = async () => {
    if (!selectedCV && !uploadedFile) {
      setError("Please select or upload a resume.");
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    if (!user?.email) {
      setError("You must be logged in to apply.");
      return;
    }

    setLoading(true);
    try {
      // Upload new CV
      if (uploadedFile) {
        const fd = new FormData();
        fd.append("cv", uploadedFile);
        await client.post(
          `/api/upload/candidate/cv?email=${encodeURIComponent(
            user.email
          )}`,
          fd
        );
      }

      // Apply Job
      const body = { email: user.email };
      if (selectedCV) body.resumeId = selectedCV;

      await client.patch(
        `/api/post-job/applyJob?jobId=${jobId}`,
        body
      );

      setIsSuccess(true);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to submit application."
      );
    } finally {
      setLoading(false);
    }
  };

  /* ---------------------- SUCCESS UI ---------------------- */

  if (isSuccess) {
    return (
      <div className="apply-success-wrapper">
        <div className="apply-success-card">
          <div className="apply-success-icon-wrap">
            <CheckCircle className="apply-success-icon" />
          </div>

          <h2 className="apply-success-title">
            Application Submitted!
          </h2>
          <p className="apply-success-desc">
            Your application has been received and is under review.
          </p>

          <div className="apply-success-meta">
            <div>
              <span className="apply-meta-label">Email</span>
              <p className="apply-meta-value">{user.email}</p>
            </div>
            <div>
              <span className="apply-meta-label">Job ID</span>
              <p className="apply-meta-value">
                #{jobId?.slice(-6).toUpperCase()}
              </p>
            </div>
          </div>

          <div className="apply-success-actions">
            <button
              onClick={() => navigate("/my-applications")}
              className="apply-btn-primary"
            >
              View My Applications <ChevronRight size={18} />
            </button>

            <button
              onClick={() => navigate("/")}
              className="apply-btn-ghost"
            >
              Browse More Jobs
            </button>
          </div>
        </div>
      </div>
    );
  }

  /* ------------------------ MAIN FORM UI ------------------------ */

  return (
    <div className="apply-page">
      <div className="apply-container">
        {error && (
          <div className="apply-error">
            <AlertCircle className="apply-error-icon" />
            <div>
              <h3 className="apply-error-title">Error</h3>
              <p className="apply-error-text">{error}</p>
            </div>
          </div>
        )}

        <div className="apply-card">
          <div className="apply-card-header">
            <h1 className="apply-card-title">Select Your Resume</h1>
            <p className="apply-card-sub">
              Choose an existing resume or upload a new one.
            </p>
          </div>

          <div className="apply-card-body">
            {/* EXISTING CV LIST */}
            {user?.CV?.length > 0 && (
              <div>
                <h2 className="apply-section-label">Your Resumes</h2>

                <div className="apply-cv-list">
                  {user.CV.map((cv) => (
                    <label
                      key={cv._id}
                      className={`apply-cv-item ${
                        selectedCV === cv._id ? "active" : ""
                      }`}
                    >
                      <input
                        type="radio"
                        name="resume"
                        checked={selectedCV === cv._id}
                        onChange={() => handleSelectCV(cv._id)}
                        className="hidden"
                      />

                      <div className="apply-cv-icon">
                        <FileText size={20} />
                      </div>

                      <div>
                        <p className="apply-cv-name">{cv.name || "Resume"}</p>
                        <p className="apply-cv-meta">
                          Uploaded{" "}
                          {cv.uploadedAt
                            ? new Date(cv.uploadedAt).toLocaleDateString()
                            : "N/A"}
                        </p>
                      </div>

                      {selectedCV === cv._id && (
                        <CheckCircle className="apply-cv-check" />
                      )}
                    </label>
                  ))}
                </div>
              </div>
            )}

            {/* SEPARATOR */}
            {user?.CV?.length > 0 && (
              <div className="apply-divider">OR UPLOAD NEW</div>
            )}

            {/* UPLOAD BOX */}
            {!uploadedFile ? (
              <div
                onClick={() =>
                  document.getElementById("uploadCV").click()
                }
                className="apply-upload-box"
              >
                <div className="apply-upload-icon-wrap">
                  <UploadCloud className="apply-upload-icon" />
                </div>
                <p className="apply-upload-title">
                  Click to upload resume
                </p>
                <p className="apply-upload-sub">
                  PDF, DOC, DOCX (max 5MB)
                </p>
                <input
                  id="uploadCV"
                  type="file"
                  className="hidden"
                  accept=".pdf,.doc,.docx"
                  onChange={handleFileChange}
                />
              </div>
            ) : (
              <div className="apply-uploaded-file">
                <div className="apply-uploaded-icon">
                  <FileText size={20} />
                </div>
                <div className="apply-uploaded-info">
                  <p>{uploadedFile.name}</p>
                  <span>
                    {(uploadedFile.size / 1024 / 1024).toFixed(2)}MB
                  </span>
                </div>

                <button
                  onClick={handleRemoveUploadedFile}
                  className="apply-upload-remove"
                >
                  <X size={20} />
                </button>
              </div>
            )}
          </div>

          <div className="apply-card-footer">
            <button
              onClick={() => navigate(-1)}
              className="apply-btn-ghost"
            >
              Cancel
            </button>

            <button
              onClick={handleSubmit}
              disabled={loading}
              className="apply-btn-primary"
            >
              {loading ? "Submitting..." : "Submit Application"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
