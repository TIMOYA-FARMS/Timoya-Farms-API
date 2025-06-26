import { BatchModel } from "../models/batch.js";
import { ProductModel } from "../models/products.js";

// Admin: Log a new production/parboiling batch and update product stock
export const addBatch = async (req, res, next) => {
    try {
        const { product, quantity, productionDate, parboilingCycle, warehouse, notes } = req.body;
        if (!product || !quantity) {
            return res.status(400).json({ message: "Product and quantity are required." });
        }
        const prod = await ProductModel.findById(product);
        if (!prod) {
            return res.status(404).json({ message: "Product not found." });
        }
        // Create the batch record
        const batch = await BatchModel.create({
            product,
            quantity,
            productionDate,
            parboilingCycle,
            warehouse,
            notes
        });
        // Update product stock
        prod.stock = (prod.stock || 0) + quantity;
        await prod.save();
        res.status(201).json({ message: "Batch logged and stock updated.", batch });
    } catch (error) {
        next(error);
    }
};

// List all batches, with optional filtering by warehouse or product
export const listBatches = async (req, res, next) => {
    try {
        const { warehouse, product } = req.query;
        const filter = {};
        if (warehouse) filter.warehouse = warehouse;
        if (product) filter.product = product;
        const batches = await BatchModel.find(filter).populate('product').sort({ productionDate: -1 });
        res.status(200).json({ batches });
    } catch (error) {
        next(error);
    }
};

// Get a single batch by ID
export const getBatch = async (req, res, next) => {
    try {
        const { id } = req.params;
        const batch = await BatchModel.findById(id).populate('product');
        if (!batch) return res.status(404).json({ message: "Batch not found." });
        res.status(200).json({ batch });
    } catch (error) {
        next(error);
    }
};

// Update a batch (PATCH), adjusting product stock if quantity changes
export const updateBatch = async (req, res, next) => {
    try {
        const { id } = req.params;
        const update = req.body;
        const batch = await BatchModel.findById(id);
        if (!batch) return res.status(404).json({ message: "Batch not found." });
        let stockAdjustment = 0;
        if (update.quantity && update.quantity !== batch.quantity) {
            stockAdjustment = update.quantity - batch.quantity;
        }
        Object.assign(batch, update);
        await batch.save();
        if (stockAdjustment !== 0) {
            const prod = await ProductModel.findById(batch.product);
            if (prod) {
                prod.stock = (prod.stock || 0) + stockAdjustment;
                await prod.save();
            }
        }
        res.status(200).json({ message: "Batch updated.", batch });
    } catch (error) {
        next(error);
    }
};

// Delete a batch, adjusting product stock
export const deleteBatch = async (req, res, next) => {
    try {
        const { id } = req.params;
        const batch = await BatchModel.findById(id);
        if (!batch) return res.status(404).json({ message: "Batch not found." });
        const prod = await ProductModel.findById(batch.product);
        if (prod) {
            prod.stock = Math.max(0, (prod.stock || 0) - batch.quantity);
            await prod.save();
        }
        await batch.deleteOne();
        res.status(200).json({ message: "Batch deleted." });
    } catch (error) {
        next(error);
    }
};
