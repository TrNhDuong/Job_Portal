import { getEmployerByEmail, employerCreate } from "../../repository/employerRepository.js";

export const createEmployer = async (req, res) => {
    const { email, password, company, phoneNumber, address } = req.body;
    try {
        const existingEmployer = await getEmployerByEmail(email);
        if (existingEmployer.success) {
            return res.status(400).json({ message: "Employer already exists" });
        }
        const savedEmployer = await employerCreate({
            email,
            password,
            company,
            address,
            phoneNumber,
            jobPosted: [],
        });
        res.status(201).json(savedEmployer);
    } catch (error) {
        res.status(500).json({ message: "Error creating employer" });
    }
};
