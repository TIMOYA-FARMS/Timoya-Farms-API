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

