import EmployerRepository from "../../repository/employerRepository.js";

export const updateEmployer = async (req, res) => {
    const email = req.query.email;
    const updates = req.body;

    try {
        console.log(email, updates)

        const result = await EmployerRepository.updateEmployer(email, updates);
        if (result.success){
            res.status(200).json({
                success: true,
                message: 'Update successfully'
            })
        } else {
            res.status(400).json({
                success: false
            })
        }
    } catch (error) {
        res.status(500).json({ message: "Error updating employer" });
    }
};
