import express from "express";
import { uploadCandidateLogo, uploadEmployerLogo, uploadEmployerWallpaper } from "../controller/logo/upload.js";

const Router = express.Router();

Router.post("/upload/logo/employer", uploadEmployerLogo);
Router.post("/upload/logo/candidate", uploadCandidateLogo);
Router.post("/upload/wallpaper", uploadEmployerWallpaper);

export default Router;