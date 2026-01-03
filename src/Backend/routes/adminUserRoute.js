import express from "express";
import { getAllAdminUsers } from "../controller/adminUser/getUser.js";

const router = express.Router();

router.get("/admin/users", getAllAdminUsers);

export default router;