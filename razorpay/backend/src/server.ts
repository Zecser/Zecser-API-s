import dotenv from 'dotenv';

dotenv.config();

import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import connectDB from './utils/database';
import paymentRoutes from './routes/paymentRoutes';

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Routes
app.use('/api/payment', paymentRoutes);

// Health check
app.get('/', (req, res) => {
  res.json({ message: 'Razorpay Backend Server is running!' });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
