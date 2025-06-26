import cloudinary from "../config/cloudinary.js";
import multer from "multer";
import streamifier from "streamifier";

export const uploadToCloudinary = (folder = "learning-resources") => async (req, res, next) => {
  if (!req.file) return next();
  try {
    const streamUpload = () => {
      return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder },
          (error, result) => {
            if (result) resolve(result);
            else reject(error);
          }
        );
        streamifier.createReadStream(req.file.buffer).pipe(stream);
      });
    };
    const result = await streamUpload();
    req.file.cloudinaryUrl = result.secure_url;
    req.file.cloudinaryPublicId = result.public_id;
    next();
  } catch (err) {
    next(err);
  }
};

export const multerUpload = multer({ storage: multer.memoryStorage() });
