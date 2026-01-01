// import { getAllCandidates } from "./candidateRepository.js";
// import { EmployerRepository } from "../../repository/employerRepository.js";
// export const getAllAdminUsers = async (limit = 100) => {
//     try {
//         const [candidatesResult, employersResult] = await Promise.all([
//             getAllCandidates(limit),
//             EmployerRepo.getAllEmployers(limit), // gọi function từ object
//         ]);

//         if (!candidatesResult.success || !employersResult.success) {
//             return { success: false, message: "Failed to fetch users" };
//         }

//         const users = [
//             ...candidatesResult.data.map(c => ({ ...c, role: "candidate" })),
//             ...employersResult.data.map(e => ({ ...e, role: "employer" })),
//         ];

//         return { success: true, data: users };
//     } catch (error) {
//         return { success: false, message: error.message };
//     }
// };
