import React, { useState, useRef, useEffect, useContext } from "react"; // Thêm useEffect
import "../styles/employerpost.css";
import { AuthContext } from "../context/AuthContext.jsx"; 
import { HiPencilAlt, HiBriefcase, HiCurrencyDollar, HiOfficeBuilding, HiSave, HiTrash } from "react-icons/hi";

import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';

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
  logo: ""
};

const errorStyle = { 
  color: '#d93025',
  fontSize: '13px', 
  marginTop: '4px',
  fontWeight: '500'
};

// Component nhận props
const EmployerPostJob = ({ onSubmit, initialData }) => {
  const auth = useContext(AuthContext);
  const [form, setForm] = useState(initialFormState);
  const [errors, setErrors] = useState({});
  
  const [charCount, setCharCount] = useState(0);
  const calculateTextLength = (htmlContent) => {
    if (!htmlContent) return 0;
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlContent, 'text/html');
    // textContent lấy chữ, trim() để xóa khoảng trắng thừa đầu đuôi
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
      detailedAddress: initialData.detailedAddress || "", // Giả sử API trả về cái này

      minSalary: String(initialData.salary.minSalary || ""), 
      maxSalary: String(initialData.salary.maxSalary || ""),
      currency: initialData.salary.currency || "VND",

      jobType: initialData.jobType || "Full-time",
      major: initialData.major || "IT",
      customMajor: initialData.customMajor || "",
      degree: initialData.degree || "Bachelor",
      experience: String(initialData.experience || "0"), 
      description: initialData.description || "",
      logo: initialData.logo || "",
    };
    setForm(flattenedData);
    setCharCount(calculateTextLength(initialData.description));
  } else {
    // Nếu không có initialData (bấm "Đăng tin"), reset form
    setForm(initialFormState);
    setCharCount(0);
  }
  // Luôn xóa lỗi khi chuyển form
  setErrors({});
  }, [initialData]); // Chạy lại khi initialData thay đổi

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
    logo: useRef(null)
  };

  const quillModules = {
    toolbar: [
      [{ 'header': [2, 3, false] }],
      [{ 'color': ['#000000', '#0061ff', '#e74c3c'] }],
      ['bold', 'italic', 'underline'], 
      [{'list': 'ordered'}, {'list': 'bullet'}], 
      [{ 'indent': '-1'}, { 'indent': '+1' }], // (Tùy chọn) Thêm nút bấm trên thanh công cụ nếu thích
      ['clean'] 
    ],
    // THÊM ĐOẠN NÀY: Cấu hình phím tắt (Keyboard Bindings)
    keyboard: {
      bindings: {
        tab: {
          key: 9, // Mã phím Tab
          handler: function(range, context) {
            this.quill.format('indent', '+1'); // Thụt vào
          }
        },
        'shift+tab': {
            key: 9,
            shiftKey: true,
            handler: function(range, context) {
                this.quill.format('indent', '-1'); // Thụt ra (khi nhấn Shift + Tab)
            }
        }
      }
    }
  };

  const quillFormats = [
    'header',
    'color',
    'bold', 'italic', 'underline',
    'list',
    'indent' 
  ];

  // (Các mảng dữ liệu ... không đổi)
  const jobTypes = ["Full-time", "Part-time", "Internship", "Freelance", "Contract"];
  const majors = [
    "IT", "Business", "Finance", "Marketing", "Sales", "Human Resources", 
    "Education", "Healthcare", "Engineering", "Other",
  ];
  const degrees = ["Bachelor", "Master", "Doctorate", "Associate", "Diploma", "High School", "No Degree"];
  const currencies = ["VND", "USD", "EUR", "JPY", "GBP"];
  const provinces = [
    "An Giang", "Bắc Ninh", "Cà Mau", "Cao Bằng", "Đắk Lắk", "Điện Biên", "Đồng Nai", "Đồng Tháp",
    "Gia Lai", "Hà Tĩnh", "Hưng Yên", "Khánh Hoà", "Lai Châu", "Lâm Đồng", "Lạng Sơn", "Lào Cai",
    "Nghệ An", "Ninh Bình", "Phú Thọ", "Quảng Ngãi", "Quảng Ninh", "Quảng Trị", "Sơn La", "Tây Ninh",
    "Thái Nguyên", "Thanh Hóa", "TP. Cần Thơ", "TP. Đà Nẵng", "TP. Hà Nội", "TP. Hải Phòng",
    "TP. Hồ Chí Minh", "TP. Huế", "Tuyên Quang", "Vĩnh Long"
  ];

  // (Hàm handleChange ... không đổi)
  const handleChange = (e) => {
    let { name, value } = e.target;

    // Ràng buộc độ dài tối đa
    if (name === 'title') value = value.slice(0, 30);
    if (name === 'detailedAddress') value = value.slice(0, 200);
    if (name === 'description') value = value.slice(0, 2000);

    // Xử lý các ô số (Lương & Kinh nghiệm)
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
    
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
    if (name === 'minSalary' && errors.maxSalary) {
      setErrors((prev) => ({ ...prev, maxSalary: "" }));
    }
  };

  // 👇 3. Hàm xử lý riêng cho Editor
  const handleDescriptionChange = (content, delta, source, editor) => {
    const plainText = editor.getText();
    const currentLength = plainText.length > 1 ? plainText.trim().length : 0;
    // Giới hạn ký tự 
    if (currentLength > 5000) return;
    
    setForm(prev => ({ ...prev, description: content }));
    setCharCount(currentLength);
    
    // Xóa lỗi nếu đã nhập
    if (errors.description && currentLength > 0) {
        setErrors(prev => ({ ...prev, description: "" }));
    }
  };

  // (Hàm validateForm ... không đổi)
  const validateForm = () => {
    const newErrors = {};
    const requiredFields = [
      "title", "position", "location", "detailedAddress",
      "minSalary", "maxSalary", "degree", "major", "experience", "description",
    ];

    requiredFields.forEach((field) => {
      if (!form[field].trim()) newErrors[field] = "Vui lòng nhập thông tin";
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
      fieldRefs[firstErrorKey].current?.scrollIntoView({ behavior: "smooth", block: "center" });
      fieldRefs[firstErrorKey].current?.focus();
      return false;
    }
    return true;
  };

  // Hàm handleSubmit
  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      const formattedData = {
        ...form, // Lấy tất cả các trường cũ (title, position, v.v.)  
        // Sửa 'experience' từ String thành Number
        experience: Number(form.experience),
        minSalary: Number(form.minSalary),
        maxSalary: Number(form.maxSalary),
        logo: auth.auth.employerData.data.logo
      };

      onSubmit(formattedData);
    }
  };

  const handleReset = () => {
    if(window.confirm("Bạn có chắc muốn xóa hết thông tin đã nhập?")) {
        setForm(initialFormState);
        setErrors({});
    }
  };

  return (
    <form onSubmit={handleSubmit} className="postjob-layout">
      
      {/* --- HEADER --- */}
      <div className="postjob-header">
        <div>
            <h1 className="page-title">{form.id ? "Chỉnh sửa tin tuyển dụng" : "Tạo tin tuyển dụng mới"}</h1>
            <p className="page-subtitle">Điền thông tin chi tiết để thu hút ứng viên tốt nhất</p>
        </div>
        {/* Nút Action Bar trên cùng (cho tiện) */}
        <div className="header-actions">
            <button type="button" className="btn-secondary" onClick={handleReset}>
                <HiTrash /> Làm mới
            </button>
            <button 
              type="submit" className="btn-primary">
                <HiSave /> {form.id ? "Cập nhật tin" : "Đăng tin ngay"}
            </button>
        </div>
      </div>

      <div className="postjob-grid">
        
        {/* --- CỘT TRÁI (MAIN CONTENT - 70%) --- */}
        <div className="left-section">
            
            {/* Card 1: Thông tin cơ bản */}
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

            {/* Card 2: Mô tả chi tiết */}
            <div className="card-box">
                <div className="card-header">
                    <div className="icon-wrapper green"><HiBriefcase /></div>
                    <h3>Chi tiết công việc</h3>
                </div>
                <div className="card-body">
                    <div className="form-group">
                        <label>Mô tả & Yêu cầu <span className="req">*</span></label>
                        <div className={`editor-wrapper ${errors.description ? "error-border" : ""}`}>
                            <ReactQuill 
                                theme="snow"
                                value={form.description}
                                onChange={handleDescriptionChange}
                                modules={quillModules}
                                formats={quillFormats}
                                placeholder="- Mô tả công việc...&#10;- Yêu cầu ứng viên..."
                            />
                        </div>
                        {errors.description && <span className="err-msg">{errors.description}</span>}
                        <div className="char-count">{charCount}/5000</div>
                    </div>
                </div>
            </div>

             {/* Card 3: Địa điểm làm việc */}
             <div className="card-box">
                <div className="card-header">
                    <div className="icon-wrapper purple"><HiOfficeBuilding /></div>
                    <h3>Địa điểm làm việc</h3>
                </div>
                <div className="card-body">
                    <div className="form-row">
                        <div className="form-group half">
                            <label>Tỉnh/Thành phố <span className="req">*</span></label>
                            <select ref={fieldRefs.location} name="location" value={form.location} onChange={handleChange} className={errors.location ? "error" : ""}>
                                <option value="">-- Chọn --</option>
                                {provinces.map((p) => <option key={p}>{p}</option>)}
                            </select>
                            {errors.location && <span className="err-msg">{errors.location}</span>}
                        </div>
                        <div className="form-group half">
                            <label>Địa chỉ chi tiết <span className="req">*</span></label>
                            <input ref={fieldRefs.detailedAddress} name="detailedAddress" value={form.detailedAddress} onChange={handleChange}
                                className={errors.detailedAddress ? "error" : ""} placeholder="VD: Tầng 5, Tòa nhà ABC..." />
                            {errors.detailedAddress && <span className="err-msg">{errors.detailedAddress}</span>}
                        </div>
                    </div>
                </div>
            </div>
        </div>

        {/* --- CỘT PHẢI (SIDEBAR STICKY - 30%) --- */}
        <div className="right-section">
            
            {/* Card 4: Mức lương & Tiền tệ */}
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

            {/* Card 5: Phân loại & Yêu cầu */}
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

        </div> {/* End Right Section */}

      </div>
    </form>
  );
};

export default EmployerPostJob;