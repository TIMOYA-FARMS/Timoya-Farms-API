import { Router } from "express";
import upload from "../middlewares/multer.js";
import { addImage, deleteImage, getGallery } from "../controllers/gallery.js";
import { isAuthenticated, hasPermission } from "../middlewares/auth.js";
import { staticCache, apiCache } from "../middlewares/cache.js";

const galleryRouter = Router();

galleryRouter.post(
  "/gallery",
  isAuthenticated,
  hasPermission("addGalleryImage"),
  upload.single("image"),
  addImage
);

galleryRouter.delete(
  "/gallery/:id",
  isAuthenticated,
  hasPermission("deleteGalleryImage"),
  deleteImage
);

galleryRouter.get("/gallery", staticCache, getGallery);

export default galleryRouter; 