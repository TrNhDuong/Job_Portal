import mongoose from "mongoose";

const employerSchema = new mongoose.Schema({
    company: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phone: { type: String, required: true },
    address: { type: String, required: true },
    jobPosted: [String],
    logoUrl: { type: String, default: "" },
    description: { type: String, default: "" }
}, 
{ 
    timestamps: true 
});

const Employer = mongoose.model("Employer", employerSchema);
export default Employer;