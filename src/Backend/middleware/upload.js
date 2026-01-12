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

export const createImageStorage = (folderPath) => {
    return new CloudinaryStorage({
        cloudinary,
        params: {
            folder: folderPath,
            resource_type: "image",
            allowed_formats: ["jpg", "jpeg", "png", "webp"],
            transformation: [{ width: 500, height: 500, crop: "limit" }],
        }
    });
};

export const createCVStorage = (folderPath) => {
  return new CloudinaryStorage({
    cloudinary,
    params: async (req, file) => ({
      folder: folderPath,
      resource_type: "raw",
      public_id: file.originalname.replace(/\s+/g, "_"), //có .pdf
      content_type: file.mimetype,
    }),
  });
};


