import multer from "multer";
import {CloudinaryStorage} from "multer-storage-cloudinary";
import cloudinary from "../config/cloudinary.js";

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: "uploads",
        allowed_formats: ["jpg", "png", "jpeg", "webp", "svg+xml"],
        transformation: [{ width: 500, height: 500, crop: "limit" }],
    },
});

const upload = multer({storage: storage});

export default upload;