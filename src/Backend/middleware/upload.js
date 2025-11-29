import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../config/cloudinary.js";

export const createStorage = (folderPath) => {
    return new CloudinaryStorage({
        cloudinary,
        params: {
            folder: folderPath,
            allowed_formats: ["jpg", "jpeg", "png", "webp", "pdf", "doc", "docx"],
            transformation: [{ width: 500, height: 500, crop: "limit" }],
        }
    })
}