import express from "express";
import { sendMailTo } from "../controller/mail/sendMail.js";

const Router = express.Router();

Router.post("/mail/send", sendMailTo);

export default Router;