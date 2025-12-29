import React, { useState, useEffect, useRef } from "react";
import { X, Send, Bold, Italic, Underline, List, Type, User } from "lucide-react";
import "./EmailComposeModal.css"; // Đảm bảo file CSS được import

// --- COMPONENT CON: TRÌNH SOẠN THẢO TÙY CHỈNH (Lightweight Editor) ---
const SimpleRichTextEditor = ({ value, onChange, placeholder, onInsertVariableRef }) => {
  const editorRef = useRef(null);

  // Cập nhật nội dung ban đầu (chỉ chạy 1 lần khi mount hoặc khi template thay đổi từ bên ngoài)
  useEffect(() => {
    if (editorRef.current && value !== editorRef.current.innerHTML) {
      editorRef.current.innerHTML = value;
    }
  }, [value]);

  // Xử lý các lệnh định dạng (Bold, Italic, v.v.)
  const execCmd = (command) => {
    document.execCommand(command, false, null);
    editorRef.current.focus(); // Giữ focus sau khi click
  };

  // Hàm chèn biến vào vị trí con trỏ
  const insertAtCursor = (text) => {
    const selection = window.getSelection();
    if (!selection.rangeCount) return;

    // Kiểm tra xem con trỏ có đang ở trong editor không
    const range = selection.getRangeAt(0);
    if (!editorRef.current.contains(range.commonAncestorContainer)) {
        editorRef.current.focus(); // Nếu không, focus vào cuối
    }

    // Xóa nội dung đang bôi đen (nếu có) và chèn text
    range.deleteContents();
    const textNode = document.createTextNode(text);
    range.insertNode(textNode);
    
    // Di chuyển con trỏ ra sau text vừa chèn
    range.setStartAfter(textNode);
    range.setEndAfter(textNode);
    selection.removeAllRanges();
    selection.addRange(range);

    // Trigger sự kiện thay đổi
    handleInput(); 
  };

  // Gán hàm insertAtCursor ra bên ngoài thông qua ref
  useEffect(() => {
    if (onInsertVariableRef) {
      onInsertVariableRef.current = insertAtCursor;
    }
  }, [onInsertVariableRef]);

  // Khi người dùng gõ, cập nhật lại state cha
  const handleInput = () => {
    if (editorRef.current && onChange) {
      onChange(editorRef.current.innerHTML);
    }
  };

  return (
    <div className="rich-editor-container">
      {/* Toolbar */}
      <div className="editor-toolbar">
        <button type="button" onClick={() => execCmd('bold')} title="In đậm"><Bold size={16}/></button>
        <button type="button" onClick={() => execCmd('italic')} title="In nghiêng"><Italic size={16}/></button>
        <button type="button" onClick={() => execCmd('underline')} title="Gạch chân"><Underline size={16}/></button>
        <span className="separator">|</span>
        <button type="button" onClick={() => execCmd('insertUnorderedList')} title="Danh sách"><List size={16}/></button>
      </div>

      {/* Vùng soạn thảo */}
      <div
        className="editor-content"
        contentEditable={true}
        ref={editorRef}
        onInput={handleInput}
        suppressContentEditableWarning={true}
        placeholder={placeholder}
      />
    </div>
  );
};

// --- COMPONENT CHÍNH: MODAL SOẠN EMAIL ---
const EmailComposeModal = ({ recipients, statusType, onClose, onSend }) => {
  const [subject, setSubject] = useState("");
  const [content, setContent] = useState("");
  const [showRecipients, setShowRecipients] = useState(false);
  
  // Ref để gọi hàm chèn biến từ component con
  const insertVariableRef = useRef(null);

  // Template Logic (HTML formatting cho xuống dòng)
  useEffect(() => {
    // Lấy tên vị trí đầu tiên để làm mẫu
    const position = recipients.length > 0 ? recipients[0].position : 'Vị Trí';

    if (statusType === 'pass') {
        setSubject(`THÔNG BÁO TRÚNG TUYỂN & MỜI NHẬN VIỆC - ${position}`);
        setContent(`Chào <b>{{TÊN_ỨNG_VIÊN}}</b>,<br/><br/>Chúng tôi rất vui mừng thông báo bạn đã <b>trúng tuyển</b>...<br/><br/>Trân trọng,<br/>[Tên Người Tuyển Dụng]`);
    } else if (statusType === 'rejected') {
        setSubject(`THƯ CẢM ƠN VÀ THÔNG BÁO KẾT QUẢ - ${position}`);
        setContent(`Chào <b>{{TÊN_ỨNG_VIÊN}}</b>,<br/><br/>Cảm ơn bạn đã dành thời gian tham gia phỏng vấn. Tuy nhiên...<br/><br/>Trân trọng,<br/>[Tên Người Tuyển Dụng]`);
    } else if (statusType === 'viewed') {
        setSubject(`THƯ MỜI PHỎNG VẤN - ${position}`);
        setContent(`Chào <b>{{TÊN_ỨNG_VIÊN}}</b>,<br/><br/>Chúng tôi rất ấn tượng với hồ sơ của bạn...<br/><br/>Trân trọng,<br/>[Tên Người Tuyển Dụng]`);
    } else {
        setContent(""); // Reset nếu không có type
    }
  }, [statusType, recipients]);

  // Xử lý chèn biến
  const handleInsertVariable = (variable) => {
    if (insertVariableRef.current) {
        insertVariableRef.current(variable);
    }
  };

  const commonVariables = ['{{TÊN_ỨNG_VIÊN}}', '{{VỊ_TRÍ}}', '{{NGÀY_PV}}', '{{THỜI_GIAN}}'];

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()} style={{maxWidth: '700px'}}>
        
        {/* Header */}
        <div className="modal-header">
            <h3 className="modal-title" style={{display:'flex', alignItems:'center', gap:'10px'}}>
               <Send size={20} className="text-primary"/> Soạn Email Gửi Hàng Loạt
            </h3>
            <button className="close-btn" onClick={onClose}><X size={20}/></button>
        </div>

        <div className="modal-body">
            {/* Người nhận */}
            <div className="recipients-box">
                <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
                    <strong>Gửi đến ({recipients.length} người): </strong>
                    <button className="btn-link" onClick={() => setShowRecipients(!showRecipients)}>
                        {showRecipients ? 'Ẩn danh sách' : 'Xem chi tiết'}
                    </button>
                </div>
                <div className="recipients-preview">
                    {showRecipients 
                        ? recipients.map(r => r.name).join(", ") 
                        : (recipients.length > 3 
                            ? `${recipients.slice(0, 3).map(r => r.name).join(", ")} và ${recipients.length - 3} người khác` 
                            : recipients.map(r => r.name).join(", "))
                    }
                </div>
            </div>

            {/* Tiêu đề */}
            <div style={{marginBottom: '15px'}}>
                <label className="form-label">Tiêu đề:</label>
                <input 
                    type="text" 
                    className="filter-input" 
                    style={{width:'100%', fontWeight: '600'}} 
                    value={subject} 
                    onChange={e => setSubject(e.target.value)} 
                />
            </div>

            {/* Thanh biến số (Variables) */}
            <div className="variables-bar">
                <span style={{fontSize: '12px', color: '#666', marginRight: '10px'}}>Chèn nhanh:</span>
                {commonVariables.map(v => (
                    <button key={v} className="btn-variable" onClick={() => handleInsertVariable(v)}>
                        <User size={12} style={{marginRight: '4px'}}/> {v}
                    </button>
                ))}
            </div>

            {/* Nội dung (Rich Editor) */}
            <div>
                <label className="form-label">Nội dung:</label>
                <SimpleRichTextEditor 
                    value={content} 
                    onChange={setContent}
                    onInsertVariableRef={insertVariableRef}
                    placeholder="Nhập nội dung email..."
                />
            </div>
        </div>

        {/* Footer */}
        <div className="modal-actions" style={{justifyContent: 'space-between', alignItems: 'center'}}>
           <div style={{fontSize: '12px', color: '#888', fontStyle: 'italic'}}>
             *Kiểm tra kỹ nội dung trước khi gửi.
           </div>
           <div style={{display:'flex', gap: '10px'}}>
               <button className="btn btn-secondary" onClick={onClose}>Hủy</button>
               <button className="btn btn-primary" onClick={() => onSend(subject, content)}>
                   <Send size={16} style={{marginRight: '5px'}}/> Gửi ngay
               </button>
           </div>
        </div>
      </div>
    </div>
  );
};

export default EmailComposeModal; // Export riêng lẻ nếu cần hoặc paste vào file chung