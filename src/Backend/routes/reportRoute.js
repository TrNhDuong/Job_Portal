import express from 'express';
import { getReport, getAllReports } from '../controller/report/getReport.js';
import { createReport } from '../controller/report/createReport.js';
import { updateReport } from '../controller/report/updateReport.js';
import { deleteReport } from '../controller/report/deleteReport.js';

const Router = express.Router();

Router.get('/report', getReport);
Router.get('/report/all', getAllReports);
Router.post('/report', createReport);
Router.patch('/report', updateReport);
Router.delete('/report', deleteReport);

export default Router;