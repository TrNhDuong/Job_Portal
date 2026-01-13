import { PaymentRepository } from "../../repository/paymentRepository.js";

export const getPayment = async (req, res) => {
    const paymentData = await PaymentRepository.get();
    if (!paymentData.success){
        return res.status(403).json({
            success: false,
            message: 'Failed'
        })
    }
    res.status(200).json({
        success: true,
        data: paymentData.data
    })
}