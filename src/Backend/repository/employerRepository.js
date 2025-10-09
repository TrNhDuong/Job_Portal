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



