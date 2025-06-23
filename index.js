import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import userRouter from './routes/user.js';
import productRouter from './routes/products.js';


await mongoose.connect(process.env.MONGODB_URI);

const app = express();
const port = process.env.PORT;

app.use(cors());
app.use(express.json());

app.use(userRouter);
app.use(productRouter);

app.listen(port, () => {
    console.log(`App is running on port ${port}`);
})
