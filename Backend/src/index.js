import express from 'express';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.route.js';
import products from './routes/product.routes.js';
import cartRoutes from "./routes/cart.routes.js";
import { connectDB } from './lib/db.js';
import cookieParser from 'cookie-parser';
import cors from 'cors';

dotenv.config();

const app = express();

const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cookieParser());

app.use(cors({
  origin: 'http://localhost:5173', // Adjust this to your frontend URL
  credentials: true, // Allow cookies to be sent with requests
}));

app.use('/api/auth', authRoutes);
app.use('/api/products', products);
app.use("/api/cart", cartRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  connectDB();
});
