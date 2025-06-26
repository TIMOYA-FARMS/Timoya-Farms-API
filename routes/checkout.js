import { Router } from 'express';
import { checkout } from '../controllers/checkout.js';
import { isAuthenticated } from '../middlewares/auth.js';

const checkoutRouter = Router();

// POST /api/checkout - Create order from cart/checkout
checkoutRouter.post('/checkout', isAuthenticated, checkout);

export default checkoutRouter;
