// src/pages/ApplicationPage.jsx
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import client from "../api/client";
import {
  FileText,
  AlertCircle,
  CheckCircle,
  ChevronRight,
} from "lucide-react";

export default function ApplicationPage() {
  const { id: jobId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [candidateCVs, setCandidateCVs] = useState([]);
  const [loadingCVs, setLoadingCVs] = useState(true);

  const [selectedCV, setSelectedCV] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // ---------------------- FETCH CV LIST ---------------------- //

  const normalizeCVArray = (cv) => {
    if (!cv) return [];
    let arr = Array.isArray(cv) ? cv : [cv];

    return arr.sort(
      (a, b) =>
        new Date(b.uploadedAt || 0).getTime() -
        new Date(a.uploadedAt || 0).getTime()
    );
  };

  const fetchCandidateCVs = async (email) => {
    if (!email) {
      setCandidateCVs([]);
      setLoadingCVs(false);
      return;
    }

    setLoadingCVs(true);
    try {
      const res = await client.get(`/api/candidate?email=${email}`);
      const candidate =
        res.data?.success && res.data.data ? res.data.data : res.data;

      const cvArray = normalizeCVArray(candidate?.CV);
      setCandidateCVs(cvArray);

      // tự chọn CV mới nhất
      if (cvArray.length > 0) {
        setSelectedCV(cvArray[0]._id);
      }
    } catch (err) {
      console.error(err);
      setCandidateCVs([]);
    } finally {
      setLoadingCVs(false);
    }
  };

  useEffect(() => {
    if (user?.email) {
      fetchCandidateCVs(user.email);
    } else {
      setLoadingCVs(false);
    }
  }, [user?.email]);

  // ------------------------- HANDLERS ------------------------ //

  const handleSelectCV = (cvId) => {
    setSelectedCV(cvId);
    setError(null);
  };

  const handleSubmit = async () => {
    if (!selectedCV) {
      setError("Please select a resume.");
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    if (!user?.email) {
      setError("You must be logged in to apply.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const body = {
        email: user.email,
        resumeId: selectedCV,
      };

      await client.patch(`/api/post-job/applyJob?jobId=${jobId}`, body);

      setIsSuccess(true);
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.message || "Failed to submit application."
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

          <h2 className="apply-success-title">Application Submitted!</h2>
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
              Choose one of your saved resumes to apply.
            </p>
          </div>

          <div className="apply-card-body">
            {loadingCVs ? (
              <p className="apply-loading-text">Loading your resumes...</p>
            ) : candidateCVs.length > 0 ? (
              <div>
                <h2 className="apply-section-label">Your Resumes</h2>

                <div className="apply-cv-list">
                  {candidateCVs.map((cv) => (
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
                        <p className="apply-cv-name">
                          {cv.name || "Resume"}
                        </p>
                        <p className="apply-cv-meta">
                          Uploaded{" "}
                          {cv.uploadedAt
                            ? new Date(
                                cv.uploadedAt
                              ).toLocaleDateString()
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
            ) : (
              <div className="apply-empty-cv">
                <p>You don't have any saved resumes yet.</p>
                <p>
                  Please upload your CV in the <strong>My CV</strong> page
                  before applying.
                </p>
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
              disabled={loading || candidateCVs.length === 0}
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
