import express from "express";

const router = express.Router();
import { getEmployer, getFeatureBranchs } from "../controller/employer/getEmployer.js";
import { updateEmployer } from "../controller/employer/updateEmployer.js";


router.get("/employer/feature", getFeatureBranchs);
router.get("/employer", getEmployer);
router.patch("/employer", updateEmployer);



export default router;