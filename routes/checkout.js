import { Router } from 'express';
import { checkout, guestCheckout } from '../controllers/checkout.js';
import { isAuthenticated } from '../middlewares/auth.js';

const checkoutRouter = Router();

// POST /api/checkout - Create order from cart/checkout
checkoutRouter.post('/checkout', isAuthenticated, checkout);

// POST /checkout/guest - Guest checkout
checkoutRouter.post('/checkout/guest', guestCheckout);

export default checkoutRouter;
