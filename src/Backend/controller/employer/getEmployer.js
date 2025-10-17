import { EmployerRepository } from "../../repository/employerRepository.js";

export const getEmployer = async (req, res) => {
    const { email } = req.params;
    try {
        const result = await EmployerRepository.getEmployer(email);
        if (result.success) {
            return res.status(200).json(result.data);
        }
        return res.status(404).json({ message: "Employer not found" });
    } catch (error) {
        res.status(500).json({ message: "Error fetching employers" });
    }
};

