import { Router } from "express";
import { addToCart, removeCartItem, updateCartItem, viewCart, viewUserCart, guestAddToCart, guestViewCart, guestUpdateCartItem, guestRemoveCartItem } from "../controllers/cart.js";
import { hasPermission, isAuthenticated } from "../middlewares/auth.js";


const cartRouter = Router();

cartRouter.post('/cart/add', isAuthenticated, addToCart);

cartRouter.get('/cart/view', isAuthenticated, viewUserCart);

cartRouter.get('/cart/view-all', isAuthenticated, hasPermission('viewCarts'), viewCart);

cartRouter.patch('/cart/update/:id', isAuthenticated, updateCartItem);

cartRouter.delete('/cart/delete/:id', isAuthenticated, removeCartItem);

cartRouter.post('/cart/guest/add', guestAddToCart);

cartRouter.get('/cart/guest/view', guestViewCart);

cartRouter.patch('/cart/guest/update/:id', guestUpdateCartItem);

cartRouter.delete('/cart/guest/delete/:id', guestRemoveCartItem);

export default cartRouter;