import React, { useState, useEffect, useRef } from "react";
import { useAuth } from "../../context/AuthContext";
import client from "../../api/client";
import { useNavigate } from "react-router-dom";

import {
  Mail, User, Edit3, X, CheckCircle2, AlertCircle,
  Bold, Italic, Underline, List, ListOrdered,
  AlignLeft, AlignCenter, AlignRight, Type,
  FileText, Lightbulb, Sparkles, Target, Star
} from "lucide-react";

import "../../styles/dashboard.css";

// --- RICH TEXT EDITOR ---
const RichTextEditor = ({ value, onChange, disabled }) => {
  const contentRef = useRef(null);

  const execCmd = (cmd, val = null) => {
    document.execCommand(cmd, false, val);
    if (contentRef.current) onChange(contentRef.current.innerHTML);
  };

  // Đồng bộ giá trị từ props vào contentEditable div
  useEffect(() => {
    if (contentRef.current && contentRef.current.innerHTML !== value) {
      // Chỉ cập nhật nếu giá trị thực sự khác biệt để tránh reset con trỏ
      // Nếu value là undefined/null thì set thành ""
      contentRef.current.innerHTML = value || "";
    }
  }, [value]); // Thêm dependency [value] để cập nhật khi props thay đổi từ ngoài (ví dụ lúc mới load)

  return (
    <div className={`modern-editor ${disabled ? "disabled" : ""}`}>
      {!disabled && (
        <div className="editor-toolbar">
          <div className="toolbar-group">
            <button type="button" onClick={() => execCmd("bold")}><Bold size={14}/></button>
            <button type="button" onClick={() => execCmd("italic")}><Italic size={14}/></button>
            <button type="button" onClick={() => execCmd("underline")}><Underline size={14}/></button>
          </div>
          <div className="toolbar-divider" />
          <div className="toolbar-group">
            <button type="button" onClick={() => execCmd("insertUnorderedList")}><List size={14}/></button>
            <button type="button" onClick={() => execCmd("insertOrderedList")}><ListOrdered size={14}/></button>
          </div>
          <div className="toolbar-divider" />
          <div className="toolbar-group">
            <button type="button" onClick={() => execCmd("justifyLeft")}><AlignLeft size={14}/></button>
            <button type="button" onClick={() => execCmd("justifyCenter")}><AlignCenter size={14}/></button>
            <button type="button" onClick={() => execCmd("justifyRight")}><AlignRight size={14}/></button>
          </div>
          <div className="toolbar-divider" />
          <div className="toolbar-group">
             <button type="button" onClick={() => execCmd("formatBlock", "H3")}><Type size={14}/></button>
          </div>
        </div>
      )}
      <div
        ref={contentRef}
        className="editor-content"
        contentEditable={!disabled}
        onInput={(e) => onChange(e.currentTarget.innerHTML)}
        suppressContentEditableWarning={true}
      />
    </div>
  );
};

// --- INPUT COMPONENT ---
const ModernInput = ({ label, icon: Icon, ...props }) => (
  <div className="modern-field">
    <label className="modern-label">{label}</label>
    <div className="modern-input-wrap">
      {Icon && <Icon className="modern-input-icon" size={16} />}
      <input className="modern-input" {...props} />
    </div>
  </div>
);

// --- VIEW ROW COMPONENT ---
const InfoRow = ({ label, value, icon: Icon }) => (
  <div className="info-row">
    <div className="info-label">
      {Icon && <Icon size={14} className="text-gray-400" />}
      <span>{label}</span>
    </div>
    <div className="info-value">{value}</div>
  </div>
);

export default function ProfileSettings() {
  const { user, login } = useAuth();
  const navigate = useNavigate();

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", description: "" });
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState(null); 

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        description: user.description || "", // Đảm bảo load description từ user
      });
    }
  }, [user]);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
  
  // Hàm này được gọi mỗi khi RichTextEditor thay đổi nội dung
  const handleDescChange = (val) => {
      setFormData(prev => ({ ...prev, description: val }));
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMsg(null);

    try {
      // 1. Kiểm tra nếu đổi email (Logic cũ giữ nguyên)
      if (formData.email !== user.email) {
        await client.post("/api/send-otp", { email: formData.email });
        sessionStorage.setItem("updateProfileData", JSON.stringify({ 
            ...formData, 
            description: formData.description, // Đảm bảo lưu description vào session
            oldEmail: user.email, 
            role: "candidate" 
        }));
        navigate("/verify-otp?action=update-profile");
        return;
      }

      // 2. Chuẩn bị payload cập nhật
      // Lưu ý: Đảm bảo field 'description' khớp với schema backend (Candidate model)
      const payload = { 
          name: formData.name, 
          description: formData.description 
      };

      console.log("Sending update payload:", payload); // Debug: Kiểm tra dữ liệu gửi đi

      // 3. Gọi API cập nhật
      const res = await client.patch(`/api/candidate?email=${encodeURIComponent(user.email)}`, payload);
      
      // 4. Cập nhật lại Context User (để UI refresh ngay lập tức)
      // Quan trọng: res.data hoặc res.data.data chứa user mới nhất từ backend trả về
      // Nếu backend không trả về full user, ta merge thủ công payload vào user hiện tại
      const updatedUser = { ...user, ...payload };
      login(updatedUser);
      
      setMsg({ type: "success", text: "Cập nhật thông tin thành công!" });
      setIsEditing(false);

    } catch (err) {
      console.error("Update error:", err);
      setMsg({ type: "error", text: err.response?.data?.message || "Có lỗi xảy ra khi cập nhật." });
    } finally {
      setLoading(false);
    }
  };

  const cancelEdit = () => {
    setIsEditing(false);
    setMsg(null);
    // Reset form về dữ liệu gốc của user
    if (user) {
        setFormData({ 
            name: user.name || "", 
            email: user.email || "", 
            description: user.description || "" 
        });
    }
  };

  if (!user) return null;

  return (
    <div className="profile-settings-wrapper">
      
      {/* CỘT CHÍNH: FORM THÔNG TIN */}
      <div className="profile-main-column">
        <div className="modern-card">
          
          <div className="modern-card-header">
            <div>
              <h2 className="card-title">Thông tin cá nhân</h2>
              <p className="card-subtitle">Thông tin này sẽ hiển thị trên hồ sơ ứng tuyển của bạn</p>
            </div>
            {!isEditing && (
              <button onClick={() => setIsEditing(true)} className="btn-edit">
                <Edit3 size={14} /> Cập nhật
              </button>
            )}
          </div>

          <div className="modern-card-body">
            {msg && (
              <div className={`alert-box ${msg.type}`}>
                {msg.type === 'success' ? <CheckCircle2 size={16}/> : <AlertCircle size={16}/>}
                <span>{msg.text}</span>
              </div>
            )}

            {isEditing ? (
              /* --- FORM EDIT MODE --- */
              <form onSubmit={handleUpdate} className="edit-form fade-in">
                <div className="form-grid-2">
                  <ModernInput label="Họ và tên" name="name" value={formData.name} onChange={handleChange} icon={User} required />
                  <ModernInput label="Email đăng nhập" name="email" value={formData.email} onChange={handleChange} icon={Mail} required />
                </div>

                <div className="modern-field">
                  <label className="modern-label flex justify-between">
                    Giới thiệu bản thân
                    <span className="label-hint">Sử dụng công cụ để định dạng văn bản đẹp hơn</span>
                  </label>
                  {/* Truyền đúng value và onChange */}
                  <RichTextEditor value={formData.description} onChange={handleDescChange} />
                </div>

                <div className="form-actions">
                  <button type="button" onClick={cancelEdit} className="btn-secondary" disabled={loading}>Hủy bỏ</button>
                  <button type="submit" className="btn-primary" disabled={loading}>{loading ? "Đang lưu..." : "Lưu thay đổi"}</button>
                </div>
              </form>
            ) : (
              /* --- VIEW MODE --- */
              <div className="view-mode fade-in">
                <div className="view-grid-2">
                  <InfoRow label="Họ và tên" value={formData.name} icon={User} />
                  <InfoRow label="Email" value={formData.email} icon={Mail} />
                </div>

                <div className="view-section">
                  <div className="view-section-header">
                    <FileText size={16} className="text-blue-600"/>
                    <h3>Giới thiệu bản thân</h3>
                  </div>
                  
                  <div 
                    className="html-preview-box"
                    dangerouslySetInnerHTML={{ 
                      __html: formData.description || "<em class='text-gray-400'>Bạn chưa viết giới thiệu bản thân. Hãy cập nhật để hồ sơ ấn tượng hơn.</em>" 
                    }} 
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* CỘT PHỤ: SIDEBAR HƯỚNG DẪN */}
      <aside className="profile-side-column">
        
        {/* Card 1: Hướng dẫn nhanh */}
        <div className="guideline-card">
          <div className="guideline-header">
            <div className="icon-circle bg-yellow-100 text-yellow-600">
               <Lightbulb size={18} />
            </div>
            <h3>Mẹo hồ sơ chuyên nghiệp</h3>
          </div>
          <div className="guideline-body">
            <ul className="guideline-list">
              <li>
                <strong>Ảnh đại diện:</strong> Rõ mặt, lịch sự, phông nền đơn giản.
              </li>
              <li>
                <strong>Tên hiển thị:</strong> Dùng tên thật để tạo sự tin cậy.
              </li>
              <li>
                <strong>Email:</strong> Dùng email thường xuyên kiểm tra.
              </li>
            </ul>
          </div>
        </div>
      </aside>
    </div>
  );
}