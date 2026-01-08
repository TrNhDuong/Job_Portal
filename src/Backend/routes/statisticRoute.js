import express from "express";
import { getStatisticMonthly, getStatisticMonthlyWithDaily } from "../controller/statistic/getStatisticMonthly.js";
import { getStatisticYearly } from "../controller/statistic/getStatisticYearly.js";
const Router = express.Router();

Router.get('/statistic/year', getStatisticYearly);
Router.get('/statistic/monthly', getStatisticMonthly);
Router.get('/statistic/monthly-with-daily', getStatisticMonthlyWithDaily);

export default Router;