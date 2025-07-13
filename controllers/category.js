import { Category } from "../models/category.js";

// Create category (admin only)
export const createCategory = async (req, res, next) => {
    try {
        const { name, description } = req.body;
        
        if (!name) {
            return res.status(400).json({ message: "Category name is required" });
        }

        // Check if category already exists
        const existingCategory = await Category.findOne({ name: name.trim() });
        if (existingCategory) {
            return res.status(409).json({ message: "Category with this name already exists" });
        }

        const category = await Category.create({
            name: name.trim(),
            description: description?.trim(),
            createdBy: req.auth.id
        });

        res.status(201).json({
            message: "Category created successfully",
            category
        });
    } catch (error) {
        next(error);
    }
};

// Get all categories (public)
export const getAllCategories = async (req, res, next) => {
    try {
        const categories = await Category.find({ isActive: true })
            .populate('createdBy', 'firstName lastName')
            .sort({ name: 1 });

        res.status(200).json({
            message: "Categories retrieved successfully",
            categories
        });
    } catch (error) {
        next(error);
    }
};

// Get single category (public)
export const getCategory = async (req, res, next) => {
    try {
        const category = await Category.findById(req.params.id)
            .populate('createdBy', 'firstName lastName');

        if (!category) {
            return res.status(404).json({ message: "Category not found" });
        }

        res.status(200).json({
            message: "Category retrieved successfully",
            category
        });
    } catch (error) {
        next(error);
    }
};

// Update category (admin only)
export const updateCategory = async (req, res, next) => {
    try {
        const { name, description, isActive } = req.body;
        const categoryId = req.params.id;

        const category = await Category.findById(categoryId);
        if (!category) {
            return res.status(404).json({ message: "Category not found" });
        }

        // Check if new name conflicts with existing category
        if (name && name.trim() !== category.name) {
            const existingCategory = await Category.findOne({ 
                name: name.trim(),
                _id: { $ne: categoryId }
            });
            if (existingCategory) {
                return res.status(409).json({ message: "Category with this name already exists" });
            }
        }

        // Update fields
        if (name) category.name = name.trim();
        if (description !== undefined) category.description = description?.trim();
        if (isActive !== undefined) category.isActive = isActive;

        await category.save();

        res.status(200).json({
            message: "Category updated successfully",
            category
        });
    } catch (error) {
        next(error);
    }
};

// Delete category (admin only)
export const deleteCategory = async (req, res, next) => {
    try {
        const category = await Category.findByIdAndDelete(req.params.id);
        
        if (!category) {
            return res.status(404).json({ message: "Category not found" });
        }

        res.status(200).json({
            message: "Category deleted successfully",
            category
        });
    } catch (error) {
        next(error);
    }
}; 