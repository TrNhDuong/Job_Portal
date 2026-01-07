import express from "express";
import { payment } from "../controller/payment/payment.js";

const Router = express.Router();

Router.post('/payment', payment);

export default Router;

