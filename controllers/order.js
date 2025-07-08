import { orderModel } from "../models/order.js";
import { ProductModel } from "../models/products.js";
import cloudinary from "../config/cloudinary.js";
import { emailService } from "../utils/emailServices.js";
import { orderConfirmationEmail } from "../utils/emailTemplates.js";
import { addOrderValidator } from "../validators/order.js";

// Deduct stock for each product in the order
export const deductOrderStock = async (order) => {
    for (const item of order.products) {
        const product = await ProductModel.findById(item.product);
        if (product) {
            product.stock = Math.max(0, (product.stock || 0) - item.quantity);
            await product.save();
            // Low stock alert (console log, can be replaced with notification)
            if (product.stock <= (product.lowStockThreshold || 5)) {
                console.warn(`Low stock for product: ${product.productName} (ID: ${product._id}), Stock: ${product.stock}`);
            }
        }
    }
}


export const addOrder = async (req, res, next) => {
    try {
        const { error, value } = addOrderValidator.validate(req.body);
        if (error) {
            return res.status(422).json({ message: error.details[0].message });
        }

        let totalPrice = 0;
        const productsWithPrices = [];

        for (const item of value.products) {
            const product = await ProductModel.findById(item.product);
            if (!product) {
                return res.status(404).json({
                    message: "Product not found",
                    productId: item.product,
                    details: "Please check the product ID and try again."
                });
            }

            productsWithPrices.push({
                ...item,
                price: product.price,
            });
            totalPrice += product.price * item.quantity;
        }

        const orderData = {
            ...value,
            products: productsWithPrices,
            totalPrice,
        };
        if (req.auth && req.auth.id) {
            orderData.user = req.auth.id;
        }
        const order = await orderModel.create(orderData);

        await order.populate('products.product');
        await order.populate('user', 'firstName lastName email');

        const firstName = order.user?.firstName || req.auth?.firstName || order.shippingAddress?.firstName || "Customer";
        const emailToSend = order.user?.email || req.auth?.email || order.shippingAddress?.email;
        if (emailToSend) {
            const emailSubject = `Order Confirmation - Order #${order._id}`;
            const emailBody = orderConfirmationEmail(firstName, order);
            await emailService.sendEmail(emailToSend, emailSubject, emailBody);
        }

        res.status(201).json({
            message: "Order placed successfully",
            order
        });
    } catch (error) {
        next(error);

    }
}

export const getUserOrders = async (req, res, next) => {
    try {
        const { status, page = 1, limit = 10 } = req.query;
        const query = { user: req.auth.id };
        
        if (status) {
            query.status = status;
        }

        const orders = await orderModel
            .find(query)
            .populate('products.product')
            .populate('user', 'firstName lastName email')
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(limit);

        const total = await orderModel.countDocuments(query);

        res.status(200).json({
            orders,
            pagination: {
                total,
                pages: Math.ceil(total / limit),
                currentPage: page,
                perPage: limit
            }
        });
    } catch (error) {
        next(error);
        
    }
}

export const getAllOrders = async (req, res, next) => {
    try {
        const { status, page = 1, limit = 10 } = req.query;
        const query = {};

        if (status) {
            query.status = status;
        }

        const orders = await orderModel
            .find(query)
            .populate('products.product')
            .populate('user', 'firstName lastName email')
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(limit);

        const total = await orderModel.countDocuments(query);

        res.status(200).json({
            orders,
            pagination: {
                total,
                pages: Math.ceil(total / limit),
                currentPage: page,
                perPage: limit
            }
        });
    } catch (error) {
        next(error);
        
    }
}


export const updateOrderStatus = async (req, res, next) => {
    try {
        const {error, value} = updateOrderValidator.validate(req.body);
        if (error) {
            return res.status(422).json({ message: error.details[0].message });
        }

        const {status, trackingNumber, cancelReason} = value;
        const orderId = req.params.id;

        const order = await orderModel.findById(orderId);
        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }


        order.status = status;
        if (trackingNumber) {
            order.trackingNumber = trackingNumber;
        }
        if (cancelReason) {
            order.cancelReason = cancelReason;
        }
        await order.save();

        await order.populate('products.product');
        await order.populate('user', 'firstName lastName email');

        const emailSubject = `Order Status Update - Order #${order._id}`;
        const emailBody = orderConfirmationEmail(order);
        await emailService.sendEmail(order.user.email, emailSubject, emailBody);
    } catch (error) {
        next(error);
        
    }
}


export const getOrderDetails = async (req, res, next) => {
    try {
        const orderId = req.params.id;
        const order = await orderModel
            .findById(orderId)
            .populate('products.product')
            .populate('user', 'firstName lastName email');

        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }

        if (order.user._id.toString() !== req.auth.id && req.auth.role !== 'admin') {
            return res.status(403).json({ message: "Forbidden: You do not have access to this order" });
        }

        res.status(200).json({
            message: "Order details retrieved successfully",
            order
        });
    } catch (error) {
        next(error);
        
    }
}