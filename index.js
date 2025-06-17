import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';


await mongoose.connect(process.env.MONGODB_URI);

const app = express();
const port = process.env.PORT;

app.use(cors());
app.use(express.json());

app.listen(port, () => {
    console.log(`App is running on port ${port}`);
})