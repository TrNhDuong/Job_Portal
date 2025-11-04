import Employer from "../model/employer.js";

export const getEmployerByEmail = async (email) => {
    try {
        const employer = await Employer.findOne({ email });
        if (!employer) {
            return { success: false, message: "Employer not found" };
        }
        return { 
            success: true, 
            data: employer,
            message: "Employer fetched successfully"
         };
    } catch (error) {
        console.error(`Error fetching employer by email:`, error);
        return { success: false, message: "Error fetching employer" };
    }
};

export const employerCreate = async (employerData) => {
    try {
        const newEmployer = new Employer(employerData);
        await newEmployer.save();
        return { 
            success: true, 
            data: newEmployer,
            message: "Employer created successfully"
         };
    } catch (error) {
        console.error(`Error creating employer:`, error);
        return { success: false, message: "Error creating employer" };
    }
};

export const updateEmployer = async (email, updatesEmployer) => {
    try {
        const updatedEmployer = await Employer.findOneAndUpdate({ email }, updatesEmployer, { new: true }); 
        return {
            success: true, 
            message: "Employer updated successfully"
         };
    } catch (error) {
        console.error(`Error updating employer:`, error);
        return { success: false, message: "Error updating employer" };
    }
};

export const getEmployerPassword = async (email) => {
    try {
        const employer = await Employer.findOne({ email });
        return employer ? employer.password : null;
    } catch (error) {
        console.error(`Error fetching employer password:`, error);
        return null;
    }
};

export const getFeaturedBrands = async () => {
  try {
    // Lấy 8 nhà tuyển dụng (thương hiệu) mới nhất
    const employers = await Employer.find()
      .sort({ createdAt: -1 }) // Sắp xếp theo ngày tạo mới nhất
      .limit(8)
      .select("company address logoUrl jobPosted description"); 

    if (!employers || employers.length === 0) {
      return { success: false, message: "Không tìm thấy nhà tuyển dụng nào" };
    }

    // Chuyển đổi dữ liệu Backend để khớp với Frontend
    const brands = employers.map(emp => ({
      _id: emp._id,
      name: emp.company, 
      location: emp.address, 
      logoUrl: emp.logoUrl,
      description: emp.description,
      jobs: Array.isArray(emp.jobPosted) ? emp.jobPosted.length : 0 
    }));
    
    return { success: true, data: brands, message: "Lấy thương hiệu nổi bật thành công" };
  } catch (error) {
    console.error(`Error fetching featured brands:`, error);
    return { success: false, message: "Lỗi khi lấy thương hiệu nổi bật" };
  }
};

