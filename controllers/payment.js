import axios from 'axios';
import crypto from 'crypto';
import { orderModel } from '../models/order.js';
import { deductOrderStock } from './order.js';

// Initialize Paystack payment
export const initializePayment = async (req, res, next) => {
    try {
        const { orderId } = req.body;
        if (!orderId) {
            return res.status(400).json({ message: 'orderId is required' });
        }
        // Fetch order from DB and populate user
        const order = await orderModel.findById(orderId).populate('user');
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }
        const email = order.user?.email || req.auth?.email;
        const amount = order.totalPrice;
        if (!email || !amount) {
            return res.status(400).json({ message: 'Order must have a valid user email and amount.' });
        }
        const paystackRes = await axios.post(
            'https://api.paystack.co/transaction/initialize',
            { email, amount: amount * 100, metadata: { orderId } },
            { headers: { Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}` } }
        );
        res.status(200).json({ authorization_url: paystackRes.data.data.authorization_url });
    } catch (error) {
        next(error);
    }
};

// Paystack webhook endpoint
export const paystackWebhook = async (req, res, next) => {
    try {
        // Validate signature
        const hash = crypto.createHmac('sha512', process.env.PAYSTACK_SECRET_KEY)
            .update(JSON.stringify(req.body))
            .digest('hex');
        if (hash !== req.headers['x-paystack-signature']) {
            return res.status(401).send('Invalid signature');
        }
        const event = req.body;
        if (event.event === 'charge.success') {
            const reference = event.data.reference;
            const orderId = event.data.metadata.orderId;
            const order = await orderModel.findById(orderId);
            if (order && order.status !== 'Paid') {
                order.status = 'Paid';
                order.paymentRef = reference;
                await order.save();
                // Optionally: deduct stock here if not already done
            }
        }
        res.sendStatus(200);
    } catch (error) {
        next(error);
    }
};

// Manual verification endpoint
export const verifyPayment = async (req, res, next) => {
    try {
        const { reference } = req.params;
        const paystackRes = await axios.get(
            `https://api.paystack.co/transaction/verify/${reference}`,
            { headers: { Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}` } }
        );
        const data = paystackRes.data.data;
        if (data.status === 'success') {
            // Find order by metadata.orderId or paymentRef
            let order = await orderModel.findOne({ paymentRef: reference });
            if (!order && data.metadata && data.metadata.orderId) {
                order = await orderModel.findById(data.metadata.orderId);
            }
            if (order && order.status !== 'Paid') {
                order.status = 'Paid';
                order.paymentRef = reference;
                await order.save();
                await deductOrderStock(order);
            }
            return res.status(200).json({ message: 'Payment verified and order updated', order });
        } else {
            return res.status(400).json({ message: 'Payment not successful' });
        }
    } catch (error) {
        next(error);
    }
};
