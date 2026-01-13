import express from "express";
import { payment } from "../controller/payment/payment.js";
import { getPayment } from "../controller/payment/getPayment.js";
import { createPayment } from "../controller/payment/createPayment.js";
const Router = express.Router();

Router.post('/payment', payment);
Router.post('/payment/admin', createPayment);
Router.get('/payment', getPayment);

export default Router;

