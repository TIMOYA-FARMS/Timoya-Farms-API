import { Gallery } from "../models/gallery.js";
import cloudinary from "../config/cloudinary.js";
import { getCachedGallery, cacheGallery, invalidateGalleryCache } from "../utils/cache.js";

// Add image to gallery (admin only)
export const addImage = async (req, res, next) => {
  try {
    if (!req.file || !req.file.path) {
      return res.status(400).json({ message: "Image file is required" });
    }
    const { title, category } = req.body;
    const imageUrl = req.file.path;
    const publicId = req.file.filename;
    const uploadedBy = req.auth?.id;
    const image = await Gallery.create({ 
      url: imageUrl, 
      publicId, 
      title, 
      category: category || null,
      uploadedBy 
    });
    
    // Invalidate gallery cache when new image is added
    invalidateGalleryCache();
    
    res.status(201).json({ message: "Image added to gallery", image });
  } catch (err) { next(err); }
};

// Delete image from gallery (admin only)
export const deleteImage = async (req, res, next) => {
  try {
    const image = await Gallery.findByIdAndDelete(req.params.id);
    if (!image) return res.status(404).json({ message: "Image not found" });
    try {
      await cloudinary.uploader.destroy(image.publicId);
    } catch (cloudErr) {
      // Log but do not fail deletion
      console.error('Cloudinary deletion error:', cloudErr);
    }
    
    // Invalidate gallery cache when image is deleted
    invalidateGalleryCache();
    
    res.json({ message: "Image deleted from gallery" });
  } catch (err) { next(err); }
};

// Get all gallery images (public)
export const getGallery = async (req, res, next) => {
  try {
    const { category } = req.query;
    
    // Check cache first
    const cachedImages = getCachedGallery();
    if (cachedImages && !category) {
      return res.json({ images: cachedImages });
    }

    let query = {};
    if (category) {
      query.category = category;
    }

    const images = await Gallery.find(query)
      .populate('category', 'name description')
      .populate('uploadedBy', 'firstName lastName')
      .sort({ createdAt: -1 });
    
    // Cache the results (only for all images, not filtered)
    if (!category) {
      await cacheGallery(images);
    }
    
    res.json({ images });
  } catch (err) { next(err); }
}; 