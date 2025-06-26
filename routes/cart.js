import { Router } from "express";
import { addToCart, removeCartItem, updateCartItem, viewCart, viewUserCart } from "../controllers/cart.js";
import { hasPermission, isAuthenticated } from "../middlewares/auth.js";


const cartRouter = Router();

cartRouter.post('/cart/add', isAuthenticated, addToCart);

cartRouter.get('/cart/view', isAuthenticated, viewUserCart);

cartRouter.get('/cart/view-all', isAuthenticated, hasPermission('viewCarts'), viewCart);

cartRouter.patch('/cart/update/:id', isAuthenticated, updateCartItem);

cartRouter.delete('/cart/delete/:id', isAuthenticated, removeCartItem);

export default cartRouter;