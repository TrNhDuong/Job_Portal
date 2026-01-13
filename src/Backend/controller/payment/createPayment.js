import { PaymentRepository } from "../../repository/paymentRepository.js";
import { EmployerRepository } from "../../repository/employerRepository.js";

export const createPayment = async (req, res) => {
    const email = req.query.email;
    const {point, note} = req.body;
    try {
        const employerData = await EmployerRepository.getEmployer(email);
        console.log(employerData);
        const state = employerData.success ? 'Success' : 'Fail';
        console.log(state);
        const paymentData = {
            email: email,
            point: point,
            createdAt: Date.now(),
            note: note,
            state: state
        }
        await PaymentRepository.create(paymentData);
        if (state === 'Success'){
            const resultIncPoint = await EmployerRepository.increasePoint(email, point);
            if (!resultIncPoint.success){
                return res.status(403).json({
                    success: false,
                    message: 'Failed to inc point'
                })
            }
        }
        const message = state === 'Success' ? 'Create payment successfully' : 'User not found';
        res.status(200).json({
            success: true,
            message: message
        })
    } catch (error){
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        })
    }
}