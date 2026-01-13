import React, { useState, useRef, useEffect, useContext } from "react";
import "../styles/employerpost.css";
import { AuthContext } from "../context/AuthContext.jsx"; 
import { HiPencilAlt, HiOfficeBuilding, HiSave, HiTrash, HiCurrencyDollar, HiExclamationCircle } from "react-icons/hi";
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import toast from 'react-hot-toast';

const initialFormState = {
  id: null,
  title: "",
  position: "",
  location: "",
  detailedAddress: "",
  minSalary: "",
  maxSalary: "",
  currency: "VND",
  jobType: "Full-time",
  major: "IT",
  customMajor: "",
  degree: "Bachelor",
  experience: "",
  description: "",
  requirement: "", 
  welfare: "",
  logo: ""
};

const EmployerPostJob = ({ onSubmit, initialData }) => {
  const auth = useContext(AuthContext);
  const [form, setForm] = useState(initialFormState);
  const [errors, setErrors] = useState({});
  const [activeTab, setActiveTab] = useState('description');
  const [charCounts, setCharCounts] = useState({ description: 0, requirement: 0, welfare: 0 });

  const calculateTextLength = (htmlContent) => {
    if (!htmlContent) return 0;
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlContent, 'text/html');
    return doc.body.textContent.trim().length;
  };

  useEffect(() => {
    if (initialData) {
      const flattenedData = {
        id: initialData._id, 
        title: initialData.title || "",
        companyEmail: initialData.companyEmail || "",
        position: initialData.position || "",
        location: initialData.location || "",
        detailedAddress: initialData.detailedAddress || "", 

        minSalary: String(initialData.salary.minSalary || ""), 
        maxSalary: String(initialData.salary.maxSalary || ""),
        currency: initialData.salary.currency || "VND",

        jobType: initialData.jobType || "Full-time",
        major: initialData.major || "IT",
        customMajor: initialData.customMajor || "",
        degree: initialData.degree || "Bachelor",
        experience: String(initialData.experience || "0"), 
        description: initialData.description || "",
        requirement: initialData.requirement || "", 
        welfare: initialData.welfare || "",
        logo: initialData.logo || "",
      };
      setForm(flattenedData);
      setCharCounts({
        description: calculateTextLength(initialData.description),
        requirement: calculateTextLength(initialData.requirement),
        welfare: calculateTextLength(initialData.welfare),
      });
    } else {
      setForm(initialFormState);
      setCharCounts({ description: 0, requirement: 0, welfare: 0 });
    }
    setErrors({});
  }, [initialData]);

  const fieldRefs = {
    title: useRef(null),
    position: useRef(null),
    location: useRef(null),
    detailedAddress: useRef(null),
    minSalary: useRef(null),
    maxSalary: useRef(null),
    degree: useRef(null),
    major: useRef(null),
    customMajor: useRef(null),
    experience: useRef(null),
    description: useRef(null),
    requirement: useRef(null), 
    welfare: useRef(null),
    logo: useRef(null)
  };

  const quillModules = {
    toolbar: [
      [{ 'header': [3, 4, false] }],
      [{ 'color': ['#000000', '#0061ff', '#e74c3c'] }],
      ['bold', 'italic', 'underline'], 
      [{'list': 'ordered'}, {'list': 'bullet'}], 
      [{ 'indent': '-1'}, { 'indent': '+1' }], 
      ['clean'] 
    ],
    keyboard: {
      bindings: {
        tab: {
          key: 9,
          handler: function(range, context) {
            this.quill.format('indent', '+1');
          }
        },
        'shift+tab': {
            key: 9,
            shiftKey: true,
            handler: function(range, context) {
                this.quill.format('indent', '-1');
            }
        }
      }
    }
  };

  const quillFormats = [
    'header', 'color', 'bold', 'italic', 'underline', 'list', 'indent' 
  ];

  const quillRef = useRef(null);

  // Hàm gắn tooltip
  const attachToolbarTooltips = () => {
    if (!quillRef.current) return;
    try {
        const toolbar = quillRef.current.editor.root.parentNode.querySelector('.ql-toolbar');
        if (!toolbar) return;

        const tooltips = {
            bold: "Bold", italic: "Italic", underline: "Underline",
            'list-ordered': "Ordered List", 'list-bullet': "Bullet List",
            'indent-increase': "Indent Increase", 'indent-decrease': "Indent Decrease",
            'clean': "Remove Formatting", header: "Header", color: "Text Color",
        };

        const buttons = toolbar.querySelectorAll('button, .ql-picker-label');
        buttons.forEach(btn => {
            const classMatch = btn.className.match(/ql-([a-z-]+)/);
            if (!classMatch) return;
            let format = classMatch[1];

            if (format === 'list') {
                if (btn.classList.contains('ql-ordered')) format = 'list-ordered';
                if (btn.classList.contains('ql-bullet')) format = 'list-bullet';
            }
            if (format === 'indent') {
                if (btn.classList.contains('ql-increase')) format = 'indent-increase';
                if (btn.classList.contains('ql-decrease')) format = 'indent-decrease';
            }

            if (tooltips[format]) btn.setAttribute('title', tooltips[format]);
        });
    } catch (e) {
        console.warn("Tooltips error:", e);
    }
  };

  useEffect(() => {
    const timeout = setTimeout(() => {
      attachToolbarTooltips();
    }, 0);
    return () => clearTimeout(timeout);
  }, []);

  const jobTypes = ["Full-time", "Part-time", "Internship", "Freelance", "Contract"];
  const majors = [
    "IT", "Business", "Finance", "Marketing", "Sales", "Human Resources", 
    "Education", "Healthcare", "Engineering", "Other",
  ];
  const degrees = ["Bachelor", "Master", "Doctorate", "Associate", "Diploma", "High School", "No Degree"];
  const provinces = [
    "An Giang", "Bắc Ninh", "Cà Mau", "Cao Bằng", "Đắk Lắk", "Điện Biên", "Đồng Nai", "Đồng Tháp",
    "Gia Lai", "Hà Tĩnh", "Hưng Yên", "Khánh Hoà", "Lai Châu", "Lâm Đồng", "Lạng Sơn", "Lào Cai",
    "Nghệ An", "Ninh Bình", "Phú Thọ", "Quảng Ngãi", "Quảng Ninh", "Quảng Trị", "Sơn La", "Tây Ninh",
    "Thái Nguyên", "Thanh Hóa", "TP. Cần Thơ", "TP. Đà Nẵng", "TP. Hà Nội", "TP. Hải Phòng",
    "TP. Hồ Chí Minh", "TP. Huế", "Tuyên Quang", "Vĩnh Long"
  ];

  const handleChange = (e) => {
    let { name, value } = e.target;

    if (name === 'title') value = value.slice(0, 30);
    if (name === 'detailedAddress') value = value.slice(0, 200);
    if (name === 'description') value = value.slice(0, 2000);

    const numberFields = ['minSalary', 'maxSalary', 'experience'];
    if (numberFields.includes(name)) {
      let numValue = value.replace(/[^0-9]/g, '');
      if (numValue.length > 1) {
         numValue = numValue.replace(/^0+(?=\d)/, '');
      }
      if (name === 'experience' && numValue && Number(numValue) > 60) {
        numValue = '60';
      }
      value = numValue;
    }
    
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
    if (name === 'minSalary' && errors.maxSalary) {
      setErrors((prev) => ({ ...prev, maxSalary: "" }));
    }
  };

  // 👇 [QUAN TRỌNG] HÀM ĐÃ SỬA: Thêm tham số delta, source và kiểm tra 'user'
  const handleEditorChange = (name, content, delta, source, editor) => {
    // Chặn vòng lặp vô tận: Chỉ cập nhật nếu người dùng gõ
    if (source !== 'user') return;

    const plainText = Array.from(editor.getText().trim()).join('');
    const currentLength = plainText.length;

    if(currentLength > 5000) return; 

    setForm(prev => ({ ...prev, [name]: content }));
    setCharCounts(prev => ({ ...prev, [name]: currentLength }));

    if(errors[name] && currentLength > 0) setErrors(prev => ({ ...prev, [name]: "" }));
  };

  const validateForm = () => {
    const newErrors = {};
    const requiredFields = [
      "title", "position", "location", "detailedAddress",
      "minSalary", "maxSalary", "degree", "major", "experience", "description", "requirement", "welfare"
    ];

    requiredFields.forEach((field) => {
      if (!form[field] || !form[field].trim()) newErrors[field] = "Vui lòng nhập thông tin";
    });

    if (form.major === "Other" && !form.customMajor.trim()) {
      newErrors.customMajor = "Vui lòng nhập chuyên ngành";
    }

    if (form.minSalary && form.maxSalary && Number(form.maxSalary) <= Number(form.minSalary)) {
      newErrors.maxSalary = "Mức lương tối đa phải lớn hơn mức tối thiểu";
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      const firstErrorKey = Object.keys(newErrors)[0];
      
      if (['description', 'requirement', 'welfare'].includes(firstErrorKey)) {
          setActiveTab(firstErrorKey);
      }

      const targetRef = fieldRefs[firstErrorKey];
      targetRef?.current?.scrollIntoView({ behavior: "smooth", block: "center" });
      if(!['description', 'requirement', 'welfare'].includes(firstErrorKey)){
         fieldRefs[firstErrorKey].current?.focus();
      }
      return false;
    }
    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      const formattedData = {
        ...form,
        experience: Number(form.experience),
        minSalary: Number(form.minSalary),
        maxSalary: Number(form.maxSalary),
        logo: auth.auth.employerData?.data?.logo || ""
      };

      onSubmit(formattedData);
      } else {
        toast.error("Vui lòng kiểm tra lại các thông tin còn thiếu!");
    }
  };

  const handleReset = () => {
    toast((t) => (
      <div style={{ position: 'relative', minWidth: '100px', padding: '2px' }}>
         <div className="toast-backdrop-hack" onClick={() => toast.dismiss(t.id)}></div>
         <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px', pointerEvents: 'none' }}>
             <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#fee2e2', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <HiExclamationCircle size={24} color="#ef4444" />
             </div>
             <div>
                <p style={{ fontWeight: '600', margin: '0 0 4px 0', fontSize: '15px', color: '#1f2937' }}>Làm mới form?</p>
                <p style={{ margin: 0, fontSize: '13px', color: '#6b7280' }}>Toàn bộ dữ liệu đã nhập sẽ bị xóa.</p>
             </div>
         </div>
         <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
            <button onClick={() => toast.dismiss(t.id)} className="toast-btn-base toast-btn-cancel">Hủy</button>
            <button className="toast-btn-base toast-btn-delete" 
                onClick={() => {
                    setForm(initialFormState);
                    setErrors({});
                    toast.dismiss(t.id);
                    toast.success("Đã xóa toàn bộ dữ liệu nhập vào.");
                }}
            >Xóa</button>
         </div>
      </div>
    ), { duration: 4000, position: 'top-center' });
  };

  const renderTabButton = (tabName, label, errorKey) => {
    const hasError = errors[errorKey];
    const isActive = activeTab === tabName;
    return (
        <button type="button" onClick={() => setActiveTab(tabName)}
            className={`tab-btn ${isActive ? 'active' : ''} ${hasError ? 'error-tab' : ''}`}
        >
            {label}
            {hasError && <span className="error-dot" title="Mục này chưa nhập"></span>}
        </button>
    );
  };

  return (
    <form onSubmit={handleSubmit} className="postjob-layout">
      {/* --- HEADER --- */}
      <div className="postjob-header">
        <div>
            <h1 className="page-title">{form.id ? "Chỉnh sửa tin tuyển dụng" : "Tạo tin tuyển dụng mới"}</h1>
            <p className="page-subtitle">Điền thông tin chi tiết để thu hút ứng viên tốt nhất</p>
        </div>
        <div className="header-actions">
            <button type="button" className="btn-secondary" onClick={handleReset}>
                <HiTrash /> Làm mới
            </button>
            <button type="submit" className="btn-primary">
                <HiSave /> {form.id ? "Cập nhật tin" : "Đăng tin ngay"}
            </button>
        </div>
      </div>

      <div className="postjob-grid">
        {/* --- CỘT TRÁI --- */}
        <div className="left-section">
            <div className="card-box">
                <div className="card-header">
                    <div className="icon-wrapper blue"><HiPencilAlt /></div>
                    <h3>Thông tin chung</h3>
                </div>
                <div className="card-body">
                    <div className="form-group">
                        <label>Tiêu đề công việc <span className="req">*</span></label>
                        <input ref={fieldRefs.title} name="title" value={form.title} onChange={handleChange} 
                            className={`input-lg ${errors.title ? "error" : ""}`} placeholder="VD: Senior React Developer" />
                        {errors.title && <span className="err-msg">{errors.title}</span>}
                    </div>
                    
                    <div className="form-row">
                         <div className="form-group half">
                            <label>Vị trí tuyển dụng <span className="req">*</span></label>
                            <input ref={fieldRefs.position} name="position" value={form.position} onChange={handleChange}
                                className={errors.position ? "error" : ""} placeholder="VD: Developer" />
                             {errors.position && <span className="err-msg">{errors.position}</span>}
                        </div>
                        <div className="form-group half">
                            <label>Chuyên ngành <span className="req">*</span></label>
                            <select ref={fieldRefs.major} name="major" value={form.major} onChange={handleChange} className={errors.major ? "error" : ""}>
                                {majors.map((m) => <option key={m}>{m}</option>)}
                            </select>
                        </div>
                    </div>
                    
                    {form.major === "Other" && (
                        <div className="form-group">
                            <input ref={fieldRefs.customMajor} name="customMajor" value={form.customMajor} onChange={handleChange}
                                className={errors.customMajor ? "error" : ""} placeholder="Nhập tên chuyên ngành cụ thể..." />
                            {errors.customMajor && <span className="err-msg">{errors.customMajor}</span>}
                        </div>
                    )}
                </div>
            </div>

            {/* --- Card 2: Editors --- */}
            <div className="card-box">
                <div className="card-header-tabs">
                    <div className="tabs-wrapper">
                        {renderTabButton('description', 'Mô tả công việc', 'description')}
                        {renderTabButton('requirement', 'Yêu cầu ứng viên', 'requirement')}
                        {renderTabButton('welfare', 'Quyền lợi & Phúc lợi', 'welfare')}
                    </div>
                </div>
                
                <div className="card-body">
                    {/* Tab Content: Description */}
                    <div style={{ display: activeTab === 'description' ? 'block' : 'none' }}>
                        <div className="form-group">
                            <label>Mô tả công việc <span className="req">*</span></label>
                            <div className={`editor-wrapper ${errors.description ? "error-border" : ""}`} ref={fieldRefs.description}>
                                <ReactQuill 
                                    ref={quillRef}
                                    theme="snow"
                                    key={`desc-${form.id}`} // Unique key
                                    value={form.description}
                                    // SỬA: Truyền đủ tham số (content, delta, source, editor)
                                    onChange={(content, delta, source, editor) => handleEditorChange('description', content, delta, source, editor)}
                                    modules={quillModules} formats={quillFormats}
                                    placeholder="- Mô tả trách nhiệm..."
                                />
                            </div>
                            {errors.description && <span className="err-msg">{errors.description}</span>}
                            <div className="char-count">{charCounts.description}/5000</div>
                        </div>
                    </div>

                    {/* Tab Content: Requirement */}
                    <div style={{ display: activeTab === 'requirement' ? 'block' : 'none' }}>
                        <div className="form-group">
                            <label>Yêu cầu ứng viên <span className="req">*</span></label>
                            <div className={`editor-wrapper ${errors.requirement ? "error-border" : ""}`} ref={fieldRefs.requirement}>
                                <ReactQuill 
                                    ref={quillRef}
                                    theme="snow"
                                    key={`req-${form.id}`} // Unique key
                                    value={form.requirement} // SỬA: Đã trỏ đúng vào requirement
                                    // SỬA: Update requirement và truyền đủ tham số
                                    onChange={(content, delta, source, editor) => handleEditorChange('requirement', content, delta, source, editor)}
                                    modules={quillModules} formats={quillFormats}
                                    placeholder="- Kỹ năng chuyên môn..."
                                />
                            </div>
                            {errors.requirement && <span className="err-msg">{errors.requirement}</span>}
                            <div className="char-count">{charCounts.requirement}/5000</div>
                        </div>
                    </div>

                    {/* Tab Content: Welfare */}
                    <div style={{ display: activeTab === 'welfare' ? 'block' : 'none' }}>
                        <div className="form-group">
                            <label>Quyền lợi & Phúc lợi <span className="req">*</span></label>
                            <div className={`editor-wrapper ${errors.welfare ? "error-border" : ""}`} ref={fieldRefs.welfare}>
                               <ReactQuill 
                                    ref={quillRef}
                                    theme="snow"
                                    key={`wel-${form.id}`} // Unique key
                                    value={form.welfare} // SỬA: Đã trỏ đúng vào welfare
                                    // SỬA: Update welfare và truyền đủ tham số
                                    onChange={(content, delta, source, editor) => handleEditorChange('welfare', content, delta, source, editor)}
                                    modules={quillModules} formats={quillFormats}
                                    placeholder="- Chế độ bảo hiểm, thưởng..."
                                />
                            </div>
                            {errors.welfare && <span className="err-msg">{errors.welfare}</span>}
                            <div className="char-count">{charCounts.welfare}/5000</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        {/* --- CỘT PHẢI --- */}
        <div className="right-section">
            <div className="card-box"> 
                <div className="card-header small-header">
                    <div className="icon-wrapper purple"><HiOfficeBuilding /></div>
                    <h3>Địa điểm</h3>
                </div>
                <div className="card-body">
                    <div className="form-group">
                        <label>Tỉnh/Thành phố <span className="req">*</span></label>
                        <select ref={fieldRefs.location} name="location" value={form.location} onChange={handleChange} className={errors.location ? "error" : ""}>
                            <option value="">-- Chọn --</option>
                            {provinces.map((p) => <option key={p}>{p}</option>)}
                        </select>
                        {errors.location && <span className="err-msg">{errors.location}</span>}
                    </div>
                    <div className="form-group">
                        <label>Địa chỉ chi tiết <span className="req">*</span></label>
                        <textarea
                            rows="3"
                            ref={fieldRefs.detailedAddress} name="detailedAddress" 
                            value={form.detailedAddress} onChange={handleChange}
                            className={errors.detailedAddress ? "error" : ""} 
                            placeholder="Số nhà, đường..." 
                            style={{resize: 'none'}}
                        />
                        {errors.detailedAddress && <span className="err-msg">{errors.detailedAddress}</span>}
                    </div>
                </div>
            </div>
            
            <div className="card-box sticky-card">
                <div className="card-header small-header">
                    <div className="icon-wrapper orange"><HiCurrencyDollar /></div>
                    <h3>Chế độ lương</h3>
                </div>
                <div className="card-body">
                    <div className="form-group">
                        <label>Tối thiểu <span className="req">*</span></label>
                        <div className="input-group">
                            <input ref={fieldRefs.minSalary} type="text" inputMode="numeric" name="minSalary" 
                                value={form.minSalary} onChange={handleChange} className={errors.minSalary ? "error" : ""} placeholder="0" />
                            <span className="suffix">{form.currency}</span>
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Tối đa <span className="req">*</span></label>
                        <div className="input-group">
                            <input ref={fieldRefs.maxSalary} type="text" inputMode="numeric" name="maxSalary" 
                                value={form.maxSalary} onChange={handleChange} className={errors.maxSalary ? "error" : ""} placeholder="0" />
                            <span className="suffix">{form.currency}</span>
                        </div>
                        {errors.maxSalary && <span className="err-msg">{errors.maxSalary}</span>}
                    </div>
                </div>
            </div>

            <div className="card-box">
                <div className="card-header small-header">
                    <h3>Yêu cầu khác</h3>
                </div>
                <div className="card-body">
                    <div className="form-group">
                        <label>Loại hình<span className="req">*</span></label>
                        <select name="jobType" value={form.jobType} onChange={handleChange}>
                            {jobTypes.map((t) => <option key={t}>{t}</option>)}
                        </select>
                    </div>

                    <div className="form-group">
                        <label>Bằng cấp tối thiểu<span className="req">*</span></label>
                        <select ref={fieldRefs.degree} name="degree" value={form.degree} onChange={handleChange}>
                            {degrees.map((d) => <option key={d}>{d}</option>)}
                        </select>
                    </div>

                    <div className="form-group">
                        <label>Kinh nghiệm (Năm)<span className="req">*</span></label>
                        <input ref={fieldRefs.experience} type="text" inputMode="numeric" name="experience" 
                            value={form.experience} onChange={handleChange} className={errors.experience ? "error" : ""} placeholder="VD: 2" />
                         {errors.experience && <span className="err-msg">{errors.experience}</span>}
                    </div>
                </div>
            </div>

        </div> 
      </div>
    </form>
  );
};

export default EmployerPostJob;