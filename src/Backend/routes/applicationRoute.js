import express from "express";
import { ApplicationRepository } from "../repository/applicationRepository.js";

const Router = express.Router();

Router.post("/application", async (req, res) => {
    const applicationId = req.query.id;
    const label = req.body;
    try {
        const result = await ApplicationRepository.updateApplication(applicationId, label);
        if (result.success) {
            res.status(200).json({
                success: true
            })
        } else {
            res.status(400).json({
                success: false
            })
        }
    } catch (error){
        res.status(500).json({
            success: false,
            message: 'Error internal server'
        })
    }
})

export default Router;