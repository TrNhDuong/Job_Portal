import Candidate from "../model/candidate.js";
import bcrypt from "bcryptjs";
import { destroyCloudData } from "../service/cloudinary.js";

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
        const candidateAttributes = ["name", "email", "logo", "appliedJobs"];
        let candidate = await this.getCandidate(email);
        if (!candidate.success) {
            return {
                success: false,
                message: "Candidate not found",
                data: null
            };
        }


        if (updatesCandidate["password"]) {
            candidate.data["password"] = bcrypt.hashSync(updatesCandidate["password"], 10);
        }

        if (updatesCandidate["logo"]){
            if (candidate.data?.logo?.public_id){
                const result = await destroyCloudData(candidate.data.logo.public_id);
                if (result){
                    console.log('Deleted image')
                } else {
                    console.log('Failed to deleted image')
                }
            }
        }

        if (updatesCandidate["CV"]){
            if (candidate.data.CV.length > 3){
                return {
                    success: false,
                    message: "Number of CVs get limited"
                }
            }
            candidate.data.CV.push(updatesCandidate["CV"]);
        }

        for (const attribute of candidateAttributes) {
            candidate.data[attribute] = updatesCandidate[attribute] || candidate.data[attribute];
        }

        await Candidate.findOneAndUpdate({ email }, candidate.data, { new: true });
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
        await Candidate.updateOne(
            { email },
            { $addToSet: { listSaveJobs: jobId } }
        );
        return {
            success: true,
            message: "Job saved successfully"
        };
    }
    static async removeSaveJob(email, jobId) {
        const candidate = await this.getCandidate(email);
        if (!candidate.success){
            return {
                success: false,
                message: "Candidate not found",
                data: null
            };
        }
        const savedIds = (candidate.data.listSaveJobs || []).map(id => id.toString());
        if (!savedIds.includes(jobId.toString()))  {
            return {
                success: false,
                message: "Job not found in saved list"
            };
        }
        await Candidate.updateOne(
            { email },
            { $pull: { listSaveJobs: jobId } }
        );
        return {
            success: true,
            message: "Job removed successfully"
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
