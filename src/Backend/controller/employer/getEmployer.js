import { EmployerRepository } from "../../repository/employerRepository.js";

export const getEmployer = async (req, res) => {
    const email = req.query.email;
    try {
        const result = await EmployerRepository.getEmployer(email);
        if (result.success) {
            return res.status(200).json({
                success: true,
                data: result.data
            });
        }
        return res.status(404).json({
            success: false,
            message: "Employer not found" });
    } catch (error) {
        res.status(500).json({ message: "Error fetching employers" });
    }
};

export const getFeatureBranchs = async (req, res) => {
    try {
        const topBranchEmail = await EmployerRepository.getTopFeature()
        if (topBranchEmail.success){
            let topBranchData = []
            for (const branchEmail of topBranchEmail.data){
                const result = await EmployerRepository.getEmployer(branchEmail)
                if (result.success){
                    topBranchData.push(result.data)
                }
            }
            return res.status(200).json(
                {
                    success: true,
                    data: topBranchData
                }
            )
        } else {
            return res.status(200).json(
                {
                    success: false,
                    message: "Failed to fetch data"
                }
            )
        }
    } catch (error){
        res.status(500).json({ message: "Error fetching employers" });
    }
}

