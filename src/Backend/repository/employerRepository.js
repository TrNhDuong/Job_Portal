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
    // Return top 10 branch hot
    static async getTopFeature() {
        try {
            const topEmployerEmails = await Employer.aggregate([
                {
                    $addFields: {
                        jobCount: { $size: "$jobPosted" } 
                    }
                },
                {
                    $sort: {
                        jobCount: -1
                    }
                },
                {
                    $limit: 10
                },
                {
                    $project: {
                        _id: 0,         // Loại bỏ trường _id
                        email: 1        // CHỈ giữ lại trường email
                    }
                }
            ]);
            const emailList = topEmployerEmails.map(employer => employer.email);

            return {
                success: true,
                data: emailList // Trả về mảng chỉ chứa các chuỗi email
            };
        } catch (error) {
            console.error(`Error fetching top feature employer emails:`, error);
            return {
                success: false,
                message: "Error fetching top feature employer emails",
                data: null
            };
        }
    }
};

export default EmployerRepository;
