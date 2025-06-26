import { LearningResource } from "../models/learningResource.js";

// Create a new resource (admin only)
export const createResource = async (req, res, next) => {
    try {
        let fileData = {};
        if (req.file && req.file.cloudinaryUrl) {
            fileData = {
                url: req.file.cloudinaryUrl,
                file: req.file.cloudinaryPublicId,
            };
        }
        const resource = await LearningResource.create({
            ...req.body,
            ...fileData,
            createdBy: req.auth ? req.auth.id : undefined
        });
        res.status(201).json({ message: "Resource created", resource });
    } catch (err) { next(err); }
};

// List all published resources (public)
export const listResources = async (req, res, next) => {
    try {
        const { topic, type, language } = req.query;
        const query = { isPublished: true };
        if (topic) query.topics = topic;
        if (type) query.type = type;
        if (language) query.language = language;
        const resources = await LearningResource.find(query).sort({ createdAt: -1 });
        res.json({ resources });
    } catch (err) { next(err); }
};

// Get a single resource (public)
export const getResource = async (req, res, next) => {
    try {
        const resource = await LearningResource.findById(req.params.id);
        if (!resource || !resource.isPublished) return res.status(404).json({ message: "Resource not found" });
        res.json({ resource });
    } catch (err) { next(err); }
};

// Update resource (admin only)
export const updateResource = async (req, res, next) => {
    try {
        const resource = await LearningResource.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json({ message: "Resource updated", resource });
    } catch (err) { next(err); }
};

// Delete resource (admin only)
import cloudinary from "../config/cloudinary.js";
export const deleteResource = async (req, res, next) => {
    try {
        const resource = await LearningResource.findByIdAndDelete(req.params.id);
        if (resource && resource.file) {
            try {
                await cloudinary.uploader.destroy(resource.file);
            } catch (cloudErr) {
                // Log but do not fail deletion
                console.error('Cloudinary deletion error:', cloudErr);
            }
        }
        res.json({ message: "Resource deleted" });
    } catch (err) { next(err); }
};
