import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import userRouter from './routes/user.js';
import productRouter from './routes/products.js';
import batchRouter from './routes/batch.js';
import cartRouter from './routes/cart.js';
import checkoutRouter from './routes/checkout.js';
import orderRouter from './routes/order.js';
import paymentRouter from './routes/payment.js';
import authRouter from './routes/auth.js';
import learningResourceRouter from './routes/learningResource.js';
import galleryRouter from './routes/gallery.js';
import blogRouter from './routes/blog.js';

await mongoose.connect(process.env.MONGODB_URI);

const app = express();
const port = process.env.PORT;

app.use(cors());
app.use(express.json());

app.use(userRouter);
app.use(productRouter);
app.use(batchRouter);
app.use(checkoutRouter);
app.use(cartRouter)
app.use(paymentRouter);
app.use(orderRouter);
app.use(authRouter);
app.use(learningResourceRouter);
app.use(galleryRouter);
app.use(blogRouter);

app.listen(port, () => {
    console.log(`App is running on port ${port}`);
})
