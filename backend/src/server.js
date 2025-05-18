import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import { fileURLToPath } from 'url';
import path, { dirname } from 'path';

import productRouter from './routers/product.router.js';
import userRouter from './routers/user.router.js';
import orderRouter from './routers/order.router.js';
import voucherRouter from './routers/voucher.router.js';
import uploadRouter from './routers/upload.router.js';
import { dbconnect } from './config/database.config.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

// Middleware
app.use(express.json());
app.use(cors({
  credentials: true,
  origin: [
    'http://localhost:3000',
    'https://bucolic-tiramisu-96b6cd.netlify.app',
  ]
}));

// API Routes
app.use('/api/products', productRouter);
app.use('/api/users', userRouter);
app.use('/api/vouchers', voucherRouter);
app.use('/api/orders', orderRouter);
app.use('/api/upload', uploadRouter);

// Static Files
const publicFolder = path.join(__dirname, 'public');
app.use(express.static(publicFolder));

// React App Fallback
app.get('*', (req, res) => {
  const indexFilePath = path.join(publicFolder, 'index.html');
  res.sendFile(indexFilePath);
});

dbconnect();

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log('Server listening on port ' + PORT);
});