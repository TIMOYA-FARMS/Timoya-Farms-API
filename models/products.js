import { toJSON } from "@reis/mongoose-to-json";
import { model, Schema } from "mongoose";


const productSchema = new Schema({
    productName: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true,
        trim: true
    },
    price: {
        type: Number,
        required: true,
        min: 0
    },
    category: {
        type: String,
        required: false,
        trim: true
    },
    stockStatus: {
        type: String,
        required: true,
        enum: ['In Stock', 'Out of Stock', 'Pre-order'],
        default: 'In Stock'
    },
    image: {
        type: String,
        required: false,
        trim: true
    },

    imagePublicId: {
        type: String,
        required: true,
        trim: true
    },
    
    quantity: {
        type: Number,
        required: true,
        min: 0
    },
}, {
    timestamps: true
})

productSchema.plugin(toJSON);

export const ProductModel = model('Product', productSchema);