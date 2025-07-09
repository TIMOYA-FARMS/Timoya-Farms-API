import { toJSON } from "@reis/mongoose-to-json";
import { model, Schema, Types } from "mongoose";


export const cartSchema = Schema({
    user: {
        type: Types.ObjectId,
        ref: 'User',
        required: false
    },
    guestId: {
        type: String,
        required: false
    },

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

}, {
    timestamps: true
})

// Add performance indexes
cartSchema.index({ user: 1, product: 1 }); // For user cart queries
cartSchema.index({ guestId: 1, product: 1 }); // For guest cart queries
cartSchema.index({ user: 1 }); // For user cart retrieval
cartSchema.index({ guestId: 1 }); // For guest cart retrieval

cartSchema.plugin(toJSON);

export const cartModel = model('Cart', cartSchema);