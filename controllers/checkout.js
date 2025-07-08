import { addOrder } from "./order.js";
import { cartModel } from "../models/cart.js";

export const checkout = async (req, res, next) => {
  try {
    // 1. Fetch user's cart
    const cart = await cartModel.find({ user: req.auth.id });
    if (!cart || cart.length === 0) {
      return res.status(400).json({ message: "Cart is empty. Add products to cart before checkout." });
    }

    // 2. Build products array for order
    const products = cart.map(item => ({
      product: item.product.toString(),
      quantity: item.quantity
    }));

    // 3. Compose order payload
    const orderPayload = {
      products,
      shippingAddress: req.body.shippingAddress
    };

    // 4. Create a mock req object for addOrder with new body
    req.body = orderPayload;
    await addOrder(req, res, async (err) => {
      if (err) return next(err);
      // 5. On success, clear user's cart
      await cartModel.deleteMany({ user: req.auth.id });
    });
  } catch (error) {
    next(error);
  }
};

export const guestCheckout = async (req, res, next) => {
  try {
    // 1. Validate input (products, shippingAddress)
    const { products, shippingAddress } = req.body;
    if (!products || !Array.isArray(products) || products.length === 0) {
      return res.status(400).json({ message: "Products are required for guest checkout." });
    }
    if (!shippingAddress || !shippingAddress.email) {
      return res.status(400).json({ message: "Shipping address with email is required for guest checkout." });
    }
    // 2. Compose order payload
    const orderPayload = {
      products,
      shippingAddress
    };
    // 3. Create a mock req object for addOrder with new body (no user)
    req.body = orderPayload;
    await addOrder(req, res, next);
  } catch (error) {
    next(error);
  }
};

