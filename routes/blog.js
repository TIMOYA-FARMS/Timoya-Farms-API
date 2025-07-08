import { Router } from "express";
import upload from "../middlewares/multer.js";
import { createBlog, updateBlog, deleteBlog, getBlogs, getBlog } from "../controllers/blog.js";
import { isAuthenticated, hasPermission } from "../middlewares/auth.js";

const blogRouter = Router();

blogRouter.post(
  "/blog",
  isAuthenticated,
  hasPermission("createBlog"),
  upload.single("image"),
  createBlog
);

blogRouter.patch(
  "/blog/:id",
  isAuthenticated,
  hasPermission("updateBlog"),
  upload.single("image"),
  updateBlog
);

blogRouter.delete(
  "/blog/:id",
  isAuthenticated,
  hasPermission("deleteBlog"),
  deleteBlog
);

blogRouter.get("/blog", getBlogs);
blogRouter.get("/blog/:id", getBlog);

export default blogRouter; 