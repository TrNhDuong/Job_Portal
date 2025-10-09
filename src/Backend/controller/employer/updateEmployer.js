import Employer from "../../model/employer.js";

export const updateEmployer = async (req, res) => {
    const { email, company, phoneNumber, address } = req.params;
    const updates = req.body;

    try {
        const employer = await Employer.findOneAndUpdate(
            { email, company, phoneNumber, address },
            updates,
            { new: true }
        );
        if (!employer) {
            return res.status(404).json({ message: "Employer not found" });
        }
        res.status(200).json(employer);
    } catch (error) {
        res.status(500).json({ message: "Error updating employer" });
    }
};
