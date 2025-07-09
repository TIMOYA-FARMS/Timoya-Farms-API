import { toJSON } from "@reis/mongoose-to-json";
import { model, Schema, Types } from "mongoose";

export const orderSchema = new Schema({
    user: {
        type: Types.ObjectId,
        ref: 'User',
        required: false
    },
    products: [{
        product: {
            type: Types.ObjectId,
            ref: 'Product',
            required: true
        },
        quantity: {
            type: Number,
            required: true,
            min: 1
        },
        price: {
            type: Number,
            required: true
        }
    }],
    totalPrice: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        enum: ['Pending', 'Processing', 'Paid', 'Shipped', 'Delivered', 'Cancelled', 'Refunded'],
        default: 'Pending'
    },
    paymentRef: { type: String },
    shippingAddress: {
        street: String,
        city: String,
        state: String,
        phone: String,
        email: String
    },
    trackingNumber: String,
    notes: String,
    cancelReason: String
}, {
    timestamps: true
});

// Add index for faster queries
orderSchema.index({ user: 1, status: 1 });
orderSchema.index({ paymentRef: 1 });
orderSchema.index({ createdAt: -1 }); // For recent orders
orderSchema.index({ status: 1, createdAt: -1 }); // For status-based queries
orderSchema.index({ 'shippingAddress.email': 1 }); // For guest order lookups
orderSchema.index({ user: 1, createdAt: -1 }); // For user order history

orderSchema.plugin(toJSON);

export const orderModel = model('Order', orderSchema);