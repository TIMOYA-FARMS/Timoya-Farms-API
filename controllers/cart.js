import { cartModel } from "../models/cart.js";
import { ProductModel } from "../models/products.js";


export const addToCart = async (req, res, next) => {
    try {
        const {product, quantity} = req.body;

        if (!product) {
            return res.status(400).json({ message: "Product ID is required" });
        }

        const productData = await ProductModel.findById(product);
        if (!productData) {
            return res.status(404).json({ 
                message: "Product not found",
                productId: product,
                details: "Please check the product ID and try again."
             });
        }

        const existingCartItem = await cartModel.findOne({
            user: req.auth.id,
            product: productData._id,
        });

        if (existingCartItem) {
            existingCartItem.quantity += quantity || 1;
            await existingCartItem.save();
            return res.status(200).json({
                message: "Product quantity updated in cart",
                cartItem: existingCartItem
            });
        }

        const newCartItem = await cartModel.create({
            product: productData._id,
            quantity: quantity || 1,
            user: req.auth.id,
        });

        res.status(201).json({
            message: "Product added to cart successfully",
            cartItem: newCartItem,
            product: productData,
        });
    } catch (error) {
        next(error);        
    }
};

export const viewUserCart = async (req, res, next) => {
    try {
        const cart = await cartModel
            .find({ user: req.auth.id })
            .populate('product');

        let totalPrice = 0;
        cart.forEach(item => {
            totalPrice += item.product.price * item.quantity;
        });

        res.status(200).json({
            message: "User cart retrieved successfully",
            cart,
            totalPrice,
            itemCount: cart.length
        });
    } catch (error) {
        next(error);
    }
}

export const viewCart = async (req, res, next) => {
    try {
        const cart = await cartModel
        .find({user: req.auth.id})
        .populate('product');

        let totalPrice = 0;
        cart.forEach(item => {
            totalPrice += item.product.price * item.quantity;
        });

        res.status(200).json({
            message: "Cart retrieved successfully",
            cart,
            totalPrice,
            itemCount: cart.length
        });
    } catch (error) {
        next(error);
    }
}


export const updateCartItem = async (req, res, next) => {
    try {
        const {quantity} = req.body;

        if (quantity < 1) {
            return res.status(400).json({ message: "Quantity must be at least 1" });
        }

        const cartItem = await cartModel.findOneAndUpdate(
            { user: req.auth.id, _id: req.params.id },
            { quantity },
            { new: true }
        );
        if (!cartItem) {
            return res.status(404).json({ message: "Cart item not found" });
        }

        if (cartItem.user.toString() !== req.auth.id) {
            return res.status(403).json({ message: "Forbidden: You cannot update this cart item" });
        }

        cartItem.quantity = quantity;
        await cartItem.save();

        await cartItem.populate('product');

        res.status(200).json({
            message: "Cart item updated successfully",
            cartItem,
            itemPrice: cartItem.product.price * cartItem.quantity
        });
    } catch (error) {
        next(error);        
    }
}


export const removeCartItem = async (req, res, next) => {
    try {
        const cartItem = await cartModel.findByIdAndDelete(req.params.id);
        if (!cartItem) {
            return res.status(404).json({ message: "Cart item not found" });
        }

        res.status(200).json({
            message: "Cart item removed successfully",
            cartItemId: cartItem._id,
            productId: cartItem.product
        });
    } catch (error) {
        next(error);        
    }
}

// Guest: Add to cart
export const guestAddToCart = async (req, res, next) => {
    try {
        const { product, quantity, guestId } = req.body;
        if (!guestId) {
            return res.status(400).json({ message: "guestId is required for guest cart." });
        }
        if (!product) {
            return res.status(400).json({ message: "Product ID is required" });
        }
        // const productData = await ProductModel.findById(product);
        // if (!productData) {
        //     return res.status(404).json({ message: "Product not found", productId: product });
        // }
        const productData = await ProductModel.findById(product);
        if (!productData) {
            return res.status(404).json({ 
                message: "Product not found",
                productId: product,
                details: "Please check the product ID and try again."
             });
        }
        const existingCartItem = await cartModel.findOne({ guestId, product: productData._id });
        if (existingCartItem) {
            existingCartItem.quantity += quantity || 1;
            await existingCartItem.save();
            return res.status(200).json({ message: "Product quantity updated in cart", cartItem: existingCartItem });
        }
        const newCartItem = await cartModel.create({ product: productData._id, quantity: quantity || 1, guestId });
        res.status(201).json({ message: "Product added to cart successfully", cartItem: newCartItem, product: productData });
    } catch (error) { next(error); }
};

// Guest: View cart
export const guestViewCart = async (req, res, next) => {
    try {
        const guestId = req.query.guestId || req.body.guestId;
        if (!guestId) {
            return res.status(400).json({ message: "guestId is required for guest cart." });
        }
        const cart = await cartModel.find({ guestId }).populate('product');
        let totalPrice = 0;
        cart.forEach(item => { totalPrice += item.product.price * item.quantity; });
        res.status(200).json({ message: "Guest cart retrieved successfully", cart, totalPrice, itemCount: cart.length });
    } catch (error) { next(error); }
};

// Guest: Update cart item
export const guestUpdateCartItem = async (req, res, next) => {
    try {
        const { quantity, guestId } = req.body;
        if (!guestId) {
            return res.status(400).json({ message: "guestId is required for guest cart." });
        }
        if (quantity < 1) {
            return res.status(400).json({ message: "Quantity must be at least 1" });
        }
        const cartItem = await cartModel.findOneAndUpdate(
            { guestId, _id: req.params.id },
            { quantity },
            { new: true }
        );
        if (!cartItem) {
            return res.status(404).json({ message: "Cart item not found" });
        }
        await cartItem.populate('product');
        res.status(200).json({ message: "Guest cart item updated successfully", cartItem, itemPrice: cartItem.product.price * cartItem.quantity });
    } catch (error) { next(error); }
};

// Guest: Remove cart item
export const guestRemoveCartItem = async (req, res, next) => {
    try {
        const guestId = req.body.guestId || req.query.guestId;
        if (!guestId) {
            return res.status(400).json({ message: "guestId is required for guest cart." });
        }
        const cartItem = await cartModel.findOneAndDelete({ _id: req.params.id, guestId });
        if (!cartItem) {
            return res.status(404).json({ message: "Cart item not found" });
        }
        res.status(200).json({ message: "Guest cart item removed successfully", cartItemId: cartItem._id, productId: cartItem.product });
    } catch (error) { next(error); }
};


