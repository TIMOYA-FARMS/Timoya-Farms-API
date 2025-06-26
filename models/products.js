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
        required: false,
        trim: true
    },

    stock: {
        type: Number,
        required: true,
        min: 0,
        default: 0
    },
    lowStockThreshold: {
        type: Number,
        required: false,
        default: 5
    },
    outOfStock: {
        type: Boolean,
        required: false,
        default: false
    },
}, {
    timestamps: true
})

productSchema.pre('save', function(next) {
    // Keep outOfStock updated automatically
    if (typeof this.stock === 'number') {
        this.outOfStock = this.stock <= 0;
    }
    next();
});

// Middleware: On create, if req.body.quantity is present, add to stock
productSchema.pre('save', function(next) {
    if (this.isNew && typeof this.quantity === 'number') {
        this.stock += this.quantity;
        this.quantity = undefined;
    }
    next();
});

// Middleware: On update, if quantity is present, add to stock
productSchema.pre('findOneAndUpdate', function(next) {
    const update = this.getUpdate();
    if (update && typeof update.quantity === 'number') {
        if (typeof update.stock === 'number') {
            update.stock += update.quantity;
        } else {
            update.stock = update.quantity;
        }
        update.quantity = undefined;
        this.setUpdate(update);
    }
    next();
});

productSchema.plugin(toJSON);

export const ProductModel = model("Product", productSchema);