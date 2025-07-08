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

cartSchema.plugin(toJSON);

export const cartModel = model('Cart', cartSchema);