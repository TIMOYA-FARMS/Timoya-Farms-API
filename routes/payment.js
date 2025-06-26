import express, { Router } from 'express';
import { initializePayment, paystackWebhook, verifyPayment } from '../controllers/payment.js';

const paymentRouter = Router();

// Initialize payment
paymentRouter.post('/payment/initialize', initializePayment);

// Paystack webhook
paymentRouter.post('/payment/webhook', express.json({ type: '*/*' }), paystackWebhook);

// Manual verification
paymentRouter.get('/payment/verify/:reference', verifyPayment);

export default paymentRouter;
