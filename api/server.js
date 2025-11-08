// api/server.js
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import connectDB from '../utils/db.js';

import userRouter from '../routes/user.js';
import productRouter from '../routes/products.js';
import batchRouter from '../routes/batch.js';
import cartRouter from '../routes/cart.js';
import checkoutRouter from '../routes/checkout.js';
import orderRouter from '../routes/order.js';
import paymentRouter from '../routes/payment.js';
import authRouter from '../routes/auth.js';
import learningResourceRouter from '../routes/learningResource.js';
import galleryRouter from '../routes/gallery.js';
import blogRouter from '../routes/blog.js';
import categoryRouter from '../routes/category.js';

const app = express();

// --- MIDDLEWARE ---
app.use(cors());
app.use(express.json());

// --- ROUTES ---
app.use(userRouter);
app.use(productRouter);
app.use(batchRouter);
app.use(cartRouter);
app.use(checkoutRouter);
app.use(orderRouter);
app.use(paymentRouter);
app.use(authRouter);
app.use(learningResourceRouter);
app.use(galleryRouter);
app.use(blogRouter);
app.use(categoryRouter);

// --- DATABASE CONNECTION ---
await connectDB();
console.log('✅ MongoDB connected successfully.');

// --- EXPORT APP FOR VERCEL ---
export default app;