import { ProductModel } from "../models/products.js";
import { createProductValidator, updateProductValidator } from "../validators/products.js";
import cloudinary from "../config/cloudinary.js";


export const createProduct = async (req, res) => {
    try {
        const image = req.file?.path;
        const publicId = req.file?.filename;

        const { error, value } = createProductValidator.validate({
            ...req.body
            , image
        });
        if (error) {
            return res.status(422).json({ message: error.details[0].message });
        }

        if (!image) {
            return res.status(400).json({
                message: "Image is required",
                field: "image"
            });
        }

        const product = await ProductModel.create({
            ...value,
            image,
            imagePublicId: publicId,
            user: req.auth.id
        });

        res.status(201).json({
            message: "Product created successfully",
            product
        })
    } catch (error) {
        next(error);
    }
}

export const getAllProducts = async (req, res) => {
    try {
        const { filter = '{}', sort = '{}', skip = 0, limit = 25 } = req.query;

        const products = await ProductModel
            .find(JSON.parse(filter))
            .sort(JSON.parse(sort))
            .skip(parseInt(skip))
            .limit(parseInt(limit));

        res.status(200).json(products);

    } catch (error) {
        next(error);
    }
}

export const getOneProduct = async (req, res, next) => {
try {
    const product = await ProductModel.findById(req.params.id);

    if (!product) {
        return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json({
        message: "Product retrieved successfully",
        product
    });

} catch (error) {
    next(error);
    
}
}


export const updateProduct = async (req, res, next) => {
    // let uploadedFilePath = null;
    try {
        const image = req.file?.path;

        const {error, value} = updateProductValidator.validate({
            ...req.body,
            image: image || req.body.image
        });

        if (error) {
            return res.status(422).json({ message: error.details[0].message });
        }

        const existingProduct = await ProductModel.findById(req.params.id);
        if (!existingProduct) {
            return res.status(404).json({ message: "Product not found" });
        }
        if (image && existingProduct.imagePublicId) {
            await cloudinary.uploader.destroy(existingProduct.imagePublicId);
        }

        const updatedProduct = await ProductModel.findByIdAndUpdate(
            req.params.id,
            {
                ...value,
                image: image || existingProduct.image,
                imagePublicId: req.file?.filename || existingProduct.imagePublicId
            }, {new: true}
        );

        if (!updatedProduct) {
            return res.status(404).json({ message: "Failed to update product" });
        }

        res.status(200).json({
            message: "Product updated successfully",
            product: updatedProduct
        });

    } catch (error) {
        next(error);
        
    }
}

export const deleteProduct = async (req, res, next) => {
    try {
        const product = await ProductModel.findByIdAndDelete({ _id: req.params.id });
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        if (product.imagePublicId) {
            await cloudinary.uploader.destroy(product.imagePublicId);
        }
    

        res.status(200).json({
            message: `${product.productName}, deleted successfully`,
            product
        });
    } catch (error) {
        next(error);
        
    }
}

export const countProducts = async (req, res, next) => {
    try {
        const {filter = '{}'} = req.query;

        const count = await ProductModel.countDocuments(JSON.parse(filter));

        res.status(200).json({
            message: "Product count retrieved successfully",
            count
        });
    } catch (error) {
        next(error);
        
    }
}

