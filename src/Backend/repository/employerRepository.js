import Employer from "../model/employer.js";

export class EmployerRepository {
    static async getEmployer(email) {
        try {
            const employer = await Employer.findOne({ email }).lean();
            if (!employer) {
                return {
                    success: false,
                    message: "Employer not found",
                    data: null
                };
            }
            return {
                success: true,
                data: employer
            };
        } catch (error) {
            console.error(`Error fetching employer by email:`, error);
            return { success: false, message: "Error fetching employer" };
        }
    }
    static async createEmployer(employerData) {
            const newEmployer = new Employer(employerData);
            await newEmployer.save();
            return {
                success: true,
                data: newEmployer,
                message: "Employer created successfully"
            };
    }
    static async updateEmployer(email, updatesEmployer) {
        const employerAttributes = ["company", "email", "password", "phone", "address", "description", "website", "jobPosted", "point"];
        let employer = await this.getEmployer(email);
        if (!employer.success) {
            return {
                success: false,
                message: "Employer not found",
                data: null
            };
        }

        for (const attribute of employerAttributes) {
            employer.data[attribute] = updatesEmployer[attribute] || employer.data[attribute];
        }

        if (employer.data["password"]) {
            employer.data["password"] = bcrypt.hashSync(updatesEmployer["password"], 10);
        }

        const updatedEmployer = await Employer.findOneAndUpdate({ email }, employer.data, { new: true });
        return {
            success: true,
            data: updatedEmployer
        };
    }
    static async getHashedPassword(email) {
        const employer = await this.getEmployer(email);
        if (!employer.success) {
            return {
                success: false,
                message: "Employer not found",
                data: null
            };
        }
        return {
            success: true,
            data: employer.data.password
        };
    }
};

export default EmployerRepository;
