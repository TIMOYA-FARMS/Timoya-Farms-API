import { Blog } from "../models/blog.js";
import cloudinary from "../config/cloudinary.js";

// Create blog (admin only)
export const createBlog = async (req, res, next) => {
  try {
    const { title, content } = req.body;
    if (!title || !content) return res.status(400).json({ message: "Title and content are required" });
    let imageUrl, imagePublicId;
    if (req.file) {
      imageUrl = req.file.path;
      imagePublicId = req.file.filename;
    }
    const author = req.auth.id;
    const blog = await Blog.create({ title, content, imageUrl, imagePublicId, author });
    res.status(201).json({ message: "Blog created", blog });
  } catch (err) { next(err); }
};

// Update blog (admin only)
export const updateBlog = async (req, res, next) => {
  try {
    const { title, content } = req.body;
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ message: "Blog not found" });
    if (req.file) {
      if (blog.imagePublicId) await cloudinary.uploader.destroy(blog.imagePublicId);
      blog.imageUrl = req.file.path;
      blog.imagePublicId = req.file.filename;
    }
    if (title) blog.title = title;
    if (content) blog.content = content;
    blog.updatedAt = Date.now();
    await blog.save();
    res.json({ message: "Blog updated", blog });
  } catch (err) { next(err); }
};

// Delete blog (admin only)
export const deleteBlog = async (req, res, next) => {
  try {
    const blog = await Blog.findByIdAndDelete(req.params.id);
    if (!blog) return res.status(404).json({ message: "Blog not found" });
    if (blog.imagePublicId) {
      try { await cloudinary.uploader.destroy(blog.imagePublicId); } catch (e) { console.error(e); }
    }
    res.json({ message: "Blog deleted" });
  } catch (err) { next(err); }
};

// Get all blogs (public)
export const getBlogs = async (req, res, next) => {
  try {
    const blogs = await Blog.find().sort({ createdAt: -1 }).populate('author', 'firstName lastName');
    res.json({ blogs });
  } catch (err) { next(err); }
};

// Get single blog (public)
export const getBlog = async (req, res, next) => {
  try {
    const blog = await Blog.findById(req.params.id).populate('author', 'firstName lastName');
    if (!blog) return res.status(404).json({ message: "Blog not found" });
    res.json({ blog });
  } catch (err) { next(err); }
}; 