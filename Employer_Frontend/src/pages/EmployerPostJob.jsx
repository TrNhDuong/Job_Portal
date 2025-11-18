import React, { useState, useRef, useEffect } from "react"; // Thêm useEffect
import "./employerpost.css";

const initialFormState = {
  id: null, // --- TÔI ĐÃ THÊM: trường ID để biết đang Sửa hay Thêm mới ---
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
};

const errorStyle = { 
  color: '#d93025',
  fontSize: '13px', 
  marginTop: '4px' 
};

// --- TÔI ĐÃ SỬA: Component giờ nhận props ---
const EmployerPostJob = ({ onSubmit, initialData }) => {
  // ------------------------------------------

  const [form, setForm] = useState(initialFormState);
  const [errors, setErrors] = useState({});
  
  // --- TÔI ĐÃ THÊM: useEffect để điền dữ liệu khi "Chỉnh sửa" ---
  useEffect(() => {
    if (initialData) {
      // Nếu có initialData (đang Sửa), điền dữ liệu vào form
      setForm(initialData);
    } else {
      // Nếu không (đang Thêm mới), reset form về rỗng
      setForm(initialFormState);
    }
    setErrors({}); // Luôn xóa lỗi khi chuyển đổi
  }, [initialData]); // Sẽ chạy lại mỗi khi initialData thay đổi
  // ---------------------------------------------------------

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
  };

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

  // (Hàm validateForm ... không đổi)
  const validateForm = () => {
    const newErrors = {};
    const requiredFields = [
      "title", "position", "location", "detailedAddress",
      "minSalary", "maxSalary", "degree", "major", "experience", "description",
    ];

    requiredFields.forEach((field) => {
      if (!form[field].trim()) newErrors[field] = "Trường này là bắt buộc";
    });

    if (form.major === "Other" && !form.customMajor.trim()) {
      newErrors.customMajor = "Vui lòng nhập chuyên ngành khác";
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

  // --- TÔI ĐÃ SỬA: Hàm handleSubmit ---
  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      // Thay vì alert, gọi hàm onSubmit từ props và truyền dữ liệu form lên
      onSubmit(form);
    }
  };
  // -----------------------------------

  const handleReset = () => {
    setForm(initialFormState);
    setErrors({});
  };

  return (
    <div className="postjob-container">
      <div className="postjob-card">
        {/* --- TÔI ĐÃ SỬA: Tiêu đề động --- */}
        <h1 className="postjob-title">
          {form.id ? "Chỉnh sửa tin tuyển dụng" : "Đăng tin tuyển dụng mới"}
        </h1>
        {/* ----------------------------- */}

        <form onSubmit={handleSubmit} className="postjob-form">
          {/* (Toàn bộ JSX của form: input, select, v.v... không thay đổi) */}
          {/* ... (Tiêu đề) ... */}
          <div className="form-row">
            <div className="form-group">
              <label>Tiêu đề <span>*</span></label>
              <input
                ref={fieldRefs.title}
                name="title"
                value={form.title}
                onChange={handleChange}
                className={errors.title ? "error" : ""}
                placeholder="VD: Frontend Developer"
              />
              {errors.title && <div style={errorStyle}>{errors.title}</div>}
            </div>
          </div>
          {/* ... (Vị trí, Loại hình) ... */}
          <div className="form-row">
            <div className="form-group">
              <label>Vị trí tuyển <span>*</span></label>
              <input
                ref={fieldRefs.position}
                name="position"
                value={form.position}
                onChange={handleChange}
                className={errors.position ? "error" : ""}
                placeholder="VD: Senior Developer"
              />
              {errors.position && <div style={errorStyle}>{errors.position}</div>}
            </div>
            <div className="form-group">
              <label>Loại hình công việc <span>*</span></label>
              <select name="jobType" value={form.jobType} onChange={handleChange}>
                {jobTypes.map((t) => <option key={t}>{t}</option>)}
              </select>
            </div>
          </div>
          {/* ... (Địa điểm, Địa chỉ) ... */}
          <div className="form-row">
            <div className="form-group">
              <label>Địa điểm <span>*</span></label>
              <select
                ref={fieldRefs.location}
                name="location"
                value={form.location}
                onChange={handleChange}
                className={errors.location ? "error" : ""}
              >
                <option value="">-- Chọn tỉnh/thành --</option>
                {provinces.map((p) => <option key={p}>{p}</option>)}
              </select>
              {errors.location && <div style={errorStyle}>{errors.location}</div>}
            </div>
            <div className="form-group">
              <label>Địa chỉ chi tiết <span>*</span></label>
              <input
                ref={fieldRefs.detailedAddress}
                name="detailedAddress"
                value={form.detailedAddress}
                onChange={handleChange}
                className={errors.detailedAddress ? "error" : ""}
                placeholder="VD: 123 Nguyễn Huệ, Phường Bến Thành"
              />
              {errors.detailedAddress && <div style={errorStyle}>{errors.detailedAddress}</div>}
            </div>
          </div>
          {/* ... (Lương Min, Max, Tiền tệ) ... */}
          <div className="form-row">
            <div className="form-group small">
              <label>Mức lương tối thiểu <span>*</span></label>
              <input
                ref={fieldRefs.minSalary}
                type="text"
                inputMode="numeric"
                name="minSalary"
                value={form.minSalary}
                onChange={handleChange}
                className={errors.minSalary ? "error" : ""}
                placeholder="VD: 8000000"
              />
              {errors.minSalary && <div style={errorStyle}>{errors.minSalary}</div>}
            </div>
            <div className="form-group small">
              <label>Mức lương tối đa <span>*</span></label>
              <input
                ref={fieldRefs.maxSalary}
                type="text"
                inputMode="numeric"
                name="maxSalary"
                value={form.maxSalary}
                onChange={handleChange}
                className={errors.maxSalary ? "error" : ""}
                placeholder="VD: 20000000"
              />
              {errors.maxSalary && <div style={errorStyle}>{errors.maxSalary}</div>}
            </div>
            <div className="form-group small">
              <label>Đơn vị tiền tệ</label>
              <select name="currency" value={form.currency} onChange={handleChange}>
                {currencies.map((c) => <option key={c}>{c}</option>)}
              </select>
            </div>
          </div>
          {/* ... (Trình độ, Chuyên ngành) ... */}
          <div className="form-row">
            <div className="form-group">
              <label>Trình độ <span>*</span></label>
              <select
                ref={fieldRefs.degree}
                name="degree"
                value={form.degree}
                onChange={handleChange}
                className={errors.degree ? "error" : ""}
              >
                {degrees.map((d) => <option key={d}>{d}</option>)}
              </select>
              {errors.degree && <div style={errorStyle}>{errors.degree}</div>}
            </div>
            <div className="form-group">
              <label>Chuyên ngành <span>*</span></label>
              <select
                ref={fieldRefs.major}
                name="major"
                value={form.major}
                onChange={handleChange}
                className={errors.major ? "error" : ""}
              >
                {majors.map((m) => <option key={m}>{m}</option>)}
              </select>
              {errors.major && <div style={errorStyle}>{errors.major}</div>}
            </div>
          </div>
          {/* ... (Chuyên ngành khác) ... */}
          {form.major === "Other" && (
            <div className="form-group">
              <label>Chuyên ngành khác <span>*</span></label>
              <input
                ref={fieldRefs.customMajor}
                name="customMajor"
                value={form.customMajor}
                onChange={handleChange}
                className={errors.customMajor ? "error" : ""}
                placeholder="VD: Thiết kế nội thất, Âm nhạc, Ngôn ngữ học..."
              />
              {errors.customMajor && <div style={errorStyle}>{errors.customMajor}</div>}
            </div>
          )}
          {/* ... (Kinh nghiệm) ... */}
           <div className="form-row">
            <div className="form-group small">
              <label>Kinh nghiệm (năm) <span>*</span></label>
              <input
                ref={fieldRefs.experience}
                type="text"
                inputMode="numeric"
                name="experience"
                value={form.experience}
                onChange={handleChange}
                className={errors.experience ? "error" : ""}
                placeholder="VD: 2 (0-60 năm)"
              />
              {errors.experience && <div style={errorStyle}>{errors.experience}</div>}
            </div>
          </div>
          {/* ... (Mô tả) ... */}
          <div className="form-group">
            <label>Mô tả công việc <span>*</span></label>
            <textarea
              ref={fieldRefs.description}
              name="description"
              value={form.description}
              onChange={handleChange}
              className={errors.description ? "error" : ""}
              placeholder="Mô tả chi tiết công việc, yêu cầu ứng viên..."
              rows={6}
            />
            {errors.description && <div style={errorStyle}>{errors.description}</div>}
          </div>
          {/* ... (Nút bấm) ... */}
          <div className="form-actions">
            <button type="button" className="btn-reset" onClick={handleReset}>Reset</button>
            {/* --- TÔI ĐÃ SỬA: Nút submit động --- */}
            <button type="submit" className="btn-submit">
              {form.id ? "Cập nhật" : "Đăng tin"}
            </button>
            {/* ------------------------------- */}
          </div>
        </form>
      </div>
    </div>
  );
};

export default EmployerPostJob;