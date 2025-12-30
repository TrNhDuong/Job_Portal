import { uploadCandidateCV, removeCandidateCV } from "../controller/cv/upload.js";
import express from "express";

const Router = express.Router();

Router.post("/upload/candidate/cv", uploadCandidateCV);
Router.patch("/upload/candidate/cv", removeCandidateCV);

export default Router;