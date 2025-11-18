// import { EmployerRepository } from "../../repository/employerRepository.js";
// export const createEmployer = async (req, res) => {
//     const { email, password, company, phone, address } = req.body;
//     try {
//         const result = await EmployerRepository.getEmployer(email);
//         if (result.success) {
//             return res.status(400).json({ message: "Employer already exists" });
//         }
//         const savedEmployer = await EmployerRepository.createEmployer({
//             email: email,
//             password: password,
//             company: company,
//             address: address,
//             phone: phone,
//             jobPosted: [],
//         });
//         res.status(201).json(savedEmployer);
//     } catch (error) {
//         res.status(500).json({ message: "Error creating employer" });
//     }
// };
