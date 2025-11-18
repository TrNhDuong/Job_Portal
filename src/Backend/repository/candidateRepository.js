import Candidate from "../model/candidate.js";
import bcrypt from "bcryptjs";

export class CandidateRepository {
    static async getCandidate(email) {
        if (!email) throw new Error("Email is required");
        const candidate = await Candidate.findOne({ email }).lean();
        if (!candidate) 
            return {
                success: false,
                message: "Candidate not found",
                data: null
            };
        return {
            success: true,
            data: candidate
        };
    }
    static async getCandidateByID(id) {
        if (!id) throw new Error("ID is required");
        const candidate = await Candidate.findById(id).lean();
        if (!candidate) 
            return {
                success: false,
                message: "Candidate not found",
                data: null
            };
        return {
            success: true,
            data: candidate
        };
    }
    static async createCandidate(candidateData) {
        const newCandidate = new Candidate(candidateData);
        await newCandidate.save();
        return {
            success: true,
            data: newCandidate,
            message: "Candidate created successfully"
        };
    }
    static async updateCandidate(email, updatesCandidate) {
        const candidateAttributes = ["name", "password", "listSaveJob", "appliedJobs", "CV", "email"];
        let candidate = await this.getCandidate(email);
        if (!candidate.success) {
            return {
                success: false,
                message: "Candidate not found",
                data: null
            };
        }
        console.log("haha")
        for (const attribute of candidateAttributes) {
            candidate.data[attribute] = updatesCandidate[attribute] || candidate.data[attribute];
        }

        if (candidate.data["password"]) {
            candidate.data["password"] = bcrypt.hashSync(updatesCandidate["password"], 10);
        }

        const updatedCandidate = await Candidate.findOneAndUpdate({ email }, candidate.data, { new: true });
        return {
            success: true,
            message: "Candidate updated successfully"
        };
    }
    static async getHashedPassword(email) {
        const candidate = await this.getCandidate(email);
        if (!candidate.success) {
            return {
                success: false,
                message: "Candidate not found",
                data: null
            };
        }
        return {
            success: true,
            data: candidate.data.password
        };
    }
    static async saveJob(email, jobId) {
        const candidate = await this.getCandidate(email);
        if (!candidate.success) {
            return {
                success: false,
                message: "Candidate not found",
                data: null
            };
        }
        candidate.data.listSaveJobs.push(jobId);
        await Candidate.findOneAndUpdate({ email }, candidate.data, { new: true });
        return {
            success: true,
            message: "Job saved successfully"
        };
    }
    static async uploadCV(email, cvData) {
        const candidate = await this.getCandidate(email);
        if (!candidate.success) {
            return {
                success: false,
                message: "Candidate not found",
                data: null
            };
        }
        candidate.data.CV = cvData;
        await Candidate.findOneAndUpdate({ email }, candidate.data, { new: true });
        return {
            success: true,
            message: "CV uploaded successfully"
        };
    }
}
